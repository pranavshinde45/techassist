import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/authContext';

function ShowReview({ shopId, reviews, setReviews }) {
  const { currUser } = useContext(AuthContext)
  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:8000/techShops/${shopId}/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews((prev) => {
        const newReviews = prev.filter((review) => review?._id !== reviewId);
        console.log('Reviews after deletion:', newReviews);
        return newReviews;
      });
    } catch (err) {
      console.error('Error deleting review:', err.response ? err.response.data : err.message);
    }
  };

  if (!Array.isArray(reviews)) {
    console.warn('Reviews is not an array:', reviews);
    return <div>No reviews available.</div>;
  }

  const validReviews = reviews.filter((review) => {
    const isValid = review && typeof review === 'object' && review._id && review.rating !== undefined;
    if (!isValid) {
      console.warn('Invalid review detected:', review);
    }
    return isValid;
  });

  if (validReviews.length === 0) {
    console.log('No valid reviews to display:', reviews);
    return <div></div>;
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#f5f7ff' }}>
      <div className="d-flex flex-wrap" style={{ gap: '40px' }}>
        {validReviews.map((review) => (
          <div
            key={review._id}
            className="review-card"
            style={{
              width: '290px',
              background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <p style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#333' }}>{review.author.username}</p>
            <p
              className="starability-result"
              data-rating={review.rating ?? 0}
              style={{ marginBottom: '10px' }}
            ></p>
            <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', wordWrap: 'break-word', maxHeight: '80px', overflowY: 'auto', }}>
              "{review.comment || 'No comment provided'}"
            </p>
            {
              review.author && review.author._id === currUser && (
                <button className="btn btn-danger" onClick={() => handleDelete(review._id)}>
                  Delete
                </button>
              )
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowReview;