import React, { useState } from 'react';
import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function NewTechnician() {
    let { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [qualification, setQualification] = useState("")
    const formRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;
        form.classList.add("was-validated");

        if (form.checkValidity()) {
            setName("");
            setContact("");
            setQualification("");
            form.classList.remove("was-validated")
        }

        const create = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.post(`http://localhost:8000/techShops/${id}/technicians`, {
                    name, contact, qualification
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log(res)
                navigate(`/shop/${id}`)
            } catch (err) {
                console.log(err)
            }
        }
        create()
    }
    return (
        <div className='container d-flex justify-content-center align-items-center p-5 m-4'>
            <div className='card p-4 shadow-lg w-100' style={{ maxWidth: '600px' }}>
                <h3 className='text-center mb-4 text-primary'><i>Create a Technician</i></h3>
                <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="validationCustom01" className="form-label">Name</label>
                        <input type="text" className="form-control" id="validationCustom01" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">Please enter name</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="validationCustom02" className="form-label">Contact</label>
                        <input type="Number" className="form-control" id="validationCustom02" name="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
                        <div className="valid-feedback">Looks good!</div>
                        <div className="invalid-feedback">Please enter contact details</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="validationCustomUsername" className="form-label">Qualification</label>
                        <input type="text" className="form-control" id="validationCustomUsername" name="qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} required />
                        <div className="invalid-feedback">Please provide qualifications</div>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary w-50" type="submit">Add</button>
                    </div>
                </form><br />
            </div>
        </div>
    );
}

export default NewTechnician;