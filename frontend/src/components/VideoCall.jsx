import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://techassist-9iyg.onrender.com");

function VideoCall() {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const hasSentOffer = useRef(false);
  const pendingCandidates = useRef([]);

  useEffect(() => {
    let localStream;

    const startCall = async () => {
      try {
        const servers = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        // get camera + mic
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // create peer connection
        peerConnectionRef.current = new RTCPeerConnection(servers);

        // add tracks
        localStream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, localStream);
        });

        // handle ICE
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              room: roomId,
              candidate: event.candidate,
            });
          }
        };

        // handle remote stream
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // join room
        socket.emit("join-room", roomId);

        // socket events
        socket.on("user-joined", async () => {
          console.log("User joined");
          if (!hasSentOffer.current && peerConnectionRef.current) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            socket.emit("offer", { room: roomId, sdp: offer });
            hasSentOffer.current = true;
            console.log("Offer sent");
          }
        });

        socket.on("offer", async (data) => {
          if (
            peerConnectionRef.current &&
            !peerConnectionRef.current.remoteDescription
          ) {
            console.log("Offer received");
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.sdp)
            );
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            socket.emit("answer", { room: roomId, sdp: answer });

            // apply pending ICE
            for (const candidate of pendingCandidates.current) {
              await peerConnectionRef.current.addIceCandidate(candidate);
            }
            pendingCandidates.current = [];
          }
        });

        socket.on("answer", async (data) => {
          console.log("Answer received");
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data.sdp)
            );

            for (const candidate of pendingCandidates.current) {
              await peerConnectionRef.current.addIceCandidate(candidate);
            }
            pendingCandidates.current = [];
          }
        });

        socket.on("ice-candidate", async (data) => {
          const candidate = new RTCIceCandidate(data.candidate);
          if (peerConnectionRef.current) {
            if (peerConnectionRef.current.remoteDescription) {
              await peerConnectionRef.current.addIceCandidate(candidate);
            } else {
              pendingCandidates.current.push(candidate);
            }
          }
        });
      } catch (err) {
        console.error("Error starting video call:", err);
      }
    };

    startCall();

    // cleanup
    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.disconnect();

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId]);

  return (
    <div className="d-flex flex-column align-items-center gap-4 mt-4">
      <h2>WebRTC Video Call - Room: {roomId}</h2>
      <div className="d-flex gap-5">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          style={{ width: "600px", border: "2px solid green" }}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{ width: "600px", border: "2px solid blue" }}
        />
      </div>
    </div>
  );
}

export default VideoCall;
