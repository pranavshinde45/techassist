import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateShop() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "", email: "", description: '', contact: "", image: "", latitude: "", longitude: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        async function fetch() {
            try {
                const res = await axios.get(`https://techassist-9iyg.onrender.com/techShops/getShop/${id}`);
                const shop = res.data.shop;
                setFormData({
                    name: shop.name,
                    email: shop.email,
                    description: shop.description,
                    contact: shop.contact,
                    image: shop.image?.url || "",
                    latitude: shop.location?.coordinates[1] || "",
                    longitude: shop.location?.coordinates[0] || ""
                });
            } catch (err) {
                console.log(err);
            }
        }
        fetch();
    }, [id]);

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
        data.append("latitude", formData.latitude);
        data.append("longitude", formData.longitude);
        if (formData.image instanceof File) {
            data.append("image", formData.image);
        }

        const token = localStorage.getItem("token");
        setIsLoading(true);

        try {
            const res = await axios.put(
                `https://techassist-9iyg.onrender.com/techShops/updateShop/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log(res);
            navigate("/");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h3 className="text-center mb-3"><i>Edit your tech Shop</i></h3>
                    <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Shop Name</label>
                            <input type="text" name="name" required className="form-control" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" name="email" required className="form-control" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contact</label>
                            <input type="text" name="contact" required className="form-control" value={formData.contact} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Latitude</label>
                            <input type="number" step="any" name="latitude" className="form-control" value={formData.latitude} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Longitude</label>
                            <input type="number" step="any" name="longitude" className="form-control" value={formData.longitude} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input type="file" name="image" className="form-control" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="description" rows="2" required className="form-control" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {isLoading ? "Updating..." : "Update Shop"}
                        </button>
                    </form><br/>
                </div>
            </div>
        </div>
    );
}

export default UpdateShop;
