import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Review from '../review/Review';
import '../rating.css';
import { ShopShimmer } from '../Shrimmer';
import { Link, useNavigate } from 'react-router-dom';
import ShowReview from '../review/showReview';
import ShopMap from './ShopMap';
import { AuthContext } from '../contexts/authContext';

function Shop() {
  let { id } = useParams();
  const navigate = useNavigate()
  const [shopDetails, setShopDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [technician, setTechnician] = useState([])
  const { currUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setReviewsLoading(true);
        const shopRes = await axios.get(`https://techassist-9iyg.onrender.com/techShops/getShop/${id}`);
        setShopDetails(shopRes.data.shop);

        const reviewsRes = await axios.get(`https://techassist-9iyg.onrender.com/techShops/${id}/review`);
        console.log('Shop fetched reviews:', reviewsRes.data);
        const reviews = Array.isArray(reviewsRes.data.shopReviews)
          ? reviewsRes.data.shopReviews
          : Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : [];
        const validReviews = reviews.filter((r) => r && r._id && r.rating !== undefined);
        setReviews(validReviews);
      } catch (err) {
        console.error('Error fetching data:', err.response ? err.response.data : err.message);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    async function get() {
      try {
        const technician = await axios.get(`https://techassist-9iyg.onrender.com/techShops/${id}/technicians`)
        console.log(technician.data.message)
        setTechnician(technician?.data?.message)
      } catch (err) {
        setTechnician([])
      }
    }
    get()
  }, [])
  if (!shopDetails || reviewsLoading) {
    return <ShopShimmer />;
  }

  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    try {
      const deleteShop = await axios.delete(`https://techassist-9iyg.onrender.com/techShops/deleteShop/${shopDetails._id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(deleteShop)
      navigate("/")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <div style={{ height: '100px', width: '100px', position: 'fixed', top: '70px', left: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
        <Link to="/" style={{ color: 'black' }}>
          <i className="fa-solid fa-backward-step"></i>
        </Link>
      </div>
      <div className="container1">
        <div className="p-4 d-flex" style={{ gap: '20px' }}>
          <div style={{ width: '900px' }}>
            <h2 className="ps-3">{shopDetails.name}</h2>
            <br />
            <img src={shopDetails.image} alt="shop Image" className="img-fluid" style={{ width: '850px', borderRadius: '20px', height: '400px' }} />
            <div className='d-flex justify-content-between align-items-start flex-wrap'>
              <p className='ps-3 pt-3 pb-1 mb-0 flex-grow-1'>
                <i>{shopDetails.description}</i>
              </p>
              {
                currUser === shopDetails.owner.toString() &&
                <div className='d-flex flex-wrap gap-2 pt-3 pb-2 pe-5 me-3' style={{ width: '100%', maxWidth: '360px' }}>
                  <Link to={`/update/${shopDetails._id}`} className="flex-grow-1" style={{ textDecoration: 'none' }}>
                    <button className='btn btn-custom w-100' style={{ color: 'black' }}>Edit</button>
                  </Link>
                  <button className='btn btn-custom flex-grow-1' style={{ color: 'red' }} onClick={handleDelete}>
                    Delete
                  </button>
                  <Link to={`/create/${id}`} className="flex-grow-1" style={{ textDecoration: 'none' }}>
                    <button className='btn btn-custom w-100' style={{ color: 'black' }}>Add Technician</button>
                  </Link>
                </div>
              }
            </div>
            <div className='d-flex'>
              <div><big>Our tech experts :</big></div>
              <div className="container mt-3">
                <ul className="list-group">
                  {technician.map((technician) => (
                    <li
                      key={technician._id}
                      className="list-group-item d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <strong>{technician.name}</strong>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">Contact</span>&nbsp;&nbsp;-
                        <small className="text-muted">{technician.contact}</small><br />
                        <p className='pt-1'>{technician.qualification}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="shop-card2">
            <div className="shop-header">
              <h5>Contact Us</h5>
              <p>{shopDetails.contact}</p>
            </div>

            <div className="shop-timings">
              <div>Open: 9 AM</div>
              <div>Close: 10 PM</div>
            </div>

            <hr />

            <div className="shop-actions">
              <Link to={`/bookings/${id}/createBooking`}>
                <button className="btn-primary">Book an appointment</button>
              </Link>

              <Link to={`/booking/${id}`}>
                <button className="btn-primary">See details</button>
              </Link>
            </div>

            <img
              src="/techAccessories.jpg"
              alt="Accessories"
              className="shop-image"
            />
          </div>
        </div>
        <hr />
        <div>
          <Review shopId={shopDetails._id} setReviews={setReviews} setReviewsLoading={setReviewsLoading} />
          <ShowReview shopId={shopDetails._id} reviews={reviews} setReviews={setReviews} />
        </div>
        <div style={{ height: "500px" }}>
          {shopDetails?.location?.coordinates && (
            <div>
              <h4>Shop Location</h4>
              <ShopMap
                latitude={shopDetails.location.coordinates[1]}
                longitude={shopDetails.location.coordinates[0]}
              />
            </div>
          )}
        </div><br />
      </div>
    </div>
  );
}

export default Shop;