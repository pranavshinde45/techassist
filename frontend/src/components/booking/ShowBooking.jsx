import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

function ShowBooking() {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [shop, setShop] = useState("");
    const { currUser } = useContext(AuthContext);
    const { id } = useParams();

    const role = localStorage.getItem("role");
    const token=localStorage.getItem("token")

    useEffect(() => {
        async function getDetails() {
            try {
                let res;
                if (role === 'owner') {
                    res = await axios.get(`http://localhost:8000/techShops/${id}/booking`, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    console.log(res)
                    setShop(res.data.message?.name || "");
                    setBookingDetails(res.data.message?.booking || []);
                } else {
                    res = await axios.get(`http://localhost:8000/techShops/${id}/booking/user/${currUser}`,{
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setShop(res.data.shopName || "");
                    setBookingDetails(res.data.booking || []);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setBookingDetails([]);
            }
        }

        if (currUser) {
            getDetails();
        }
    }, [id, currUser, role]);

    const handleDelete = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:8000/techShops/${id}/booking/${bookingId}`,{
                headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${token}`
                        }
            });
            setBookingDetails(prev => prev.filter(booking => booking._id !== bookingId));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div style={{ height: '100px', width: '100px', position: 'fixed', top: '70px', left: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <Link to={`/shop/${id}`} style={{ color: 'black' }}>
                    <i className="fa-solid fa-backward-step"></i>
                </Link>
            </div>

            <div style={{ border: "none", borderRadius: "10px" }}>
                <div className="overflow-auto p-4" style={{ marginRight: '200px' }}>
                    {Array.isArray(bookingDetails) && bookingDetails.length > 0 ? (
                        bookingDetails.map((booking) => (
                            <div key={booking._id} className="card mb-4 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{shop}</h5>
                                    <p className="card-text mb-1"><strong>Issue:</strong> {booking.issue}</p>
                                    <p className="card-text mb-1"><strong>Service Type:</strong> {booking.serviceType}</p>

                                    {booking.sessionTime && (
                                        <p className="card-text mb-1">
                                            <strong>Session Time:</strong>{' '}
                                            {new Date(booking.sessionTime).toLocaleString('en-IN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    )}

                                    {booking.sessionLink && (
                                        <p className="card-text mb-1">
                                            <strong>Session Link:</strong>{' '}
                                            <a href={booking.sessionLink} target="_blank" rel="noreferrer" className="text-decoration-underline text-info">
                                                Join Session
                                            </a>
                                        </p>
                                    )}

                                    <p className="card-text mb-0"><strong>Contact:</strong> {booking.contact}</p>

                                    {role === 'owner' && (
                                        <button className='btn btn-danger mt-2' onClick={() => handleDelete(booking._id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted fs-5">No bookings found.</p>
                    )}
                </div>
            </div>
            <div style={{ height: '300px' }}></div><br /><br /><br /><br /><br /><br /><br />
        </div>
    );
}

export default ShowBooking;
