import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function NewShop() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "", email: "", description: '', contact: "", image: null, latitude: "", longitude: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === "image") {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const form = evt.currentTarget;

        if (!form.checkValidity()) {
            evt.stopPropagation();
            setValidated(true);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("description", formData.description);
        data.append("contact", formData.contact);
        data.append("image", formData.image);
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude); 

        setIsLoading(true);
        const token=localStorage.getItem("token")
        try {
            const res = await axios.post("http://localhost:8000/techShops/createShop", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization":`Bearer ${token}`
                }
            });
            console.log(res.data);
            setFormData({ name: "", email: "", description: "", contact: "", image: null });
            setValidated(false);
            setIsLoading(false);
            navigate("/");
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div style={{ height: '100px', width: '100px', position: 'fixed', top: '70px', left: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <Link to="/" style={{ color: 'black' }}>
                    <i className="fa-solid fa-backward-step"></i>
                </Link>
            </div>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h3 className="text-center mb-3"><i>Create a Tech Shop</i></h3>
                        <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Shop Name</label>
                                <input type="text" name="name" required className="form-control" value={formData.name} onChange={handleChange} />
                                <div className="invalid-feedback">Please enter a name.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" name="email" required className="form-control" value={formData.email} onChange={handleChange} />
                                <div className="invalid-feedback">Please enter a valid email.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contact</label>
                                <input type="number" name="contact" required className="form-control" value={formData.contact} onChange={handleChange} />
                                <div className="invalid-feedback">Please enter a contact number.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image File-jpg,png,jpeg</label>
                                <input type="file" name="image" required className="form-control" onChange={handleChange} />
                                <div className="invalid-feedback">Please upload an image file.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea name="description" rows="2" required className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                <div className="invalid-feedback">Please enter a description.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Latitude</label>
                                <input  type="text" name="latitude" required className="form-control" value={formData.latitude} onChange={handleChange} />
                                <div className="invalid-feedback">Please enter latitude.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Longitude</label>
                                <input type="text" name="longitude" required className="form-control" value={formData.longitude} onChange={handleChange}
                                />
                                <div className="invalid-feedback">Please enter longitude.</div>
                            </div>
                            <button type="submit" className="btn btn-primary w-10">{isLoading ? "Creating..." : "Create Shop"}</button>
                        </form><br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewShop;
