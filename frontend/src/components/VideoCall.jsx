import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function VideoCall() {
    const { roomId } = useParams();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const hasSentOffer = useRef(false);
    const pendingCandidates = useRef([]);

    useEffect(() => {
        const servers = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        const constraints = { video: true, audio: true };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            localVideoRef.current.srcObject = stream;

            peerConnectionRef.current = new RTCPeerConnection(servers);

            stream.getTracks().forEach((track) => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("ice-candidate", {
                        room: roomId,
                        candidate: event.candidate,
                    });
                }
            };

            peerConnectionRef.current.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            // Join room
            socket.emit("join-room", roomId);

            socket.on("user-joined", async () => {
                console.log("User joined");
                if (!hasSentOffer.current) {
                    const offer = await peerConnectionRef.current.createOffer();
                    await peerConnectionRef.current.setLocalDescription(offer);
                    socket.emit("offer", { room: roomId, sdp: offer });
                    hasSentOffer.current = true;
                    console.log("Offer sent");
                }
            });

            socket.on("offer", async (data) => {
                if (!peerConnectionRef.current.currentRemoteDescription) {
                    console.log("Offer received");
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    socket.emit("answer", { room: roomId, sdp: answer });

                    for (const candidate of pendingCandidates.current) {
                        await peerConnectionRef.current.addIceCandidate(candidate);
                    }
                    pendingCandidates.current = [];
                }
            });

            socket.on("answer", async (data) => {
                console.log("Answer received");
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

                for (const candidate of pendingCandidates.current) {
                    await peerConnectionRef.current.addIceCandidate(candidate);
                }
                pendingCandidates.current = [];
            });

            socket.on("ice-candidate", async (data) => {
                const candidate = new RTCIceCandidate(data.candidate);
                if (peerConnectionRef.current.remoteDescription) {
                    await peerConnectionRef.current.addIceCandidate(candidate);
                } else {
                    pendingCandidates.current.push(candidate);
                }
            });
        });

        return () => {
            socket.disconnect();
            peerConnectionRef.current?.close();
            localVideoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
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
            </div><br/>
        </div>
    );
}

export default VideoCall;
