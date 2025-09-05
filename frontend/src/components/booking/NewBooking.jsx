import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function NewBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    contact: '',
    issue: '',
    serviceType: '',
    sessionTime: ''
  });

  const [validated, setValidated] = useState(false);
  const [slotAvailable, setSlotAvailable] = useState(true);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'sessionTime') {
      try {
        const res = await axios.get(`https://techassist-delta.vercel.app/techShops/${id}/checkSlot`, {
          params: { sessionTime: value }
        });
        setSlotAvailable(res.data.available);
      } catch (err) {
        setSlotAvailable(true); // fallback
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.currentTarget.checkValidity()) {
      setValidated(true);
      e.stopPropagation();
      return;
    }

    if (!slotAvailable) {
      alert('This time slot is already booked. Please choose another.');
      return;
    }

    const data = { ...formData, shopId: id };

    try {
      const res = await axios.post(`https://techassist-9iyg.onrender.com/techShops/${id}/booking`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/shop/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const minTime = `${today}T09:00`;
  const maxTime = `${today}T22:00`;

  return (
    <div>
      <div
        style={{
          height: '100px',
          width: '100px',
          position: 'fixed',
          top: '70px',
          left: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px'
        }}
      >
        <Link to={`/shop/${id}`} style={{ color: 'black' }}>
          <i className="fa-solid fa-backward-step"></i>
        </Link>
      </div>

      <div className="container mt-5 ms-5 ps-5">
        <h3>Book your appointment</h3>
        <form
          noValidate
          className={`needs-validation ${validated ? 'was-validated' : ''}`}
          onSubmit={handleSubmit}
        >
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="form-control"
                required
                pattern="[0-9]{10}"
              />
              <div className="invalid-feedback">Please enter a valid 10-digit contact number.</div>
            </div>

            <div className="col-md-8">
              <label className="form-label">Issue</label>
              <input
                type="text"
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                className="form-control"
                required
              />
              <div className="invalid-feedback">Please describe the issue.</div>
            </div>

            <div className="col-md-8">
              <label className="form-label">Service Type</label>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="serviceType"
                    id="remote"
                    value="remote"
                    onChange={handleChange}
                    checked={formData.serviceType === 'remote'}
                    required
                  />
                  <label className="form-check-label" htmlFor="remote">
                    Remote
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="serviceType"
                    id="inPerson"
                    value="inPerson"
                    onChange={handleChange}
                    checked={formData.serviceType === 'inPerson'}
                    required
                  />
                  <label className="form-check-label" htmlFor="inPerson">
                    In-Person
                  </label>
                </div>
              </div>
              <div className="invalid-feedback d-block">Please choose a service type.</div>
            </div>

            <div className="col-md-8">
              <label className="form-label">Session Time (9:00 - 10:00)</label>
              <input
                type="datetime-local"
                name="sessionTime"
                value={formData.sessionTime}
                onChange={handleChange}
                className="form-control"
                required
                min={minTime}
                max={maxTime}
              />
              <div className="invalid-feedback">
                Select a time between 9:00 AM and 10:00 PM today.
              </div>
              {!slotAvailable && (
                <div className="text-danger mt-1">
                  Selected time is already booked. Please choose another.
                </div>
              )}
            </div>

            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Book
              </button>
            </div>
          </div>
        </form>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default NewBooking;
