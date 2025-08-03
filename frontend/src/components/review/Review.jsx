import React, { useState } from 'react';
import axios from 'axios';
import '../rating.css';

function Review({ shopId, setReviews, setReviewsLoading }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReviews = async (evt) => {
    evt.preventDefault();
    if (rating === 0) {
      console.error('Rating is required');
      alert('Please select a rating (1-5) before submitting.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      setSubmitting(true);
      setReviewsLoading(true);
      const res = await axios.post(
        `http://localhost:8000/techShops/${shopId}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('POST review API response:', res.data);

      // Re-fetch reviews to ensure state is synchronized with the database
      const reviewsRes = await axios.get(`http://localhost:8000/techShops/${shopId}/review`);
      console.log('Fetched reviews after POST:', reviewsRes.data);
      const reviews = Array.isArray(reviewsRes.data.shopReviews)
        ? reviewsRes.data.shopReviews
        : Array.isArray(reviewsRes.data)
        ? reviewsRes.data
        : [];
      const validReviews = reviews.filter((r) => r && r._id && r.rating !== undefined);
      console.log('Filtered reviews after POST:', validReviews);
      setReviews(validReviews);

      setRating(0);
      setComment('');
      evt.target.reset();
    } catch (err) {
      console.error('Failed to submit review:', err.response ? err.response.data : err.message);
      alert('Failed to submit review. Please check your connection or try again.');
    } finally {
      setSubmitting(false);
      setReviewsLoading(false);
    }
  };

  return (
    <div className="mb-3 p-2 pt-0" style={{ backgroundColor: '#f5f7ff' }}>
      <h4>Leave a Review</h4>
      <form noValidate className="needs-validation" onSubmit={handleReviews}>
        <label htmlFor="rating" className="form-label">
          Rating
        </label>
        <fieldset className="starability-slot">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`rate${value}`}
                name="rating"
                value={value}
                checked={rating === value}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={submitting}
              />
              <label htmlFor={`rate${value}`} title={`${value} star`}>
                {value} star
              </label>
            </React.Fragment>
          ))}
        </fieldset>
        <div>
          <label htmlFor="comment" className="form-label">
            Comment
          </label>
          <textarea
            style={{ width: '900px' }}
            name="comment"
            cols="10"
            rows="3"
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            disabled={submitting}
          />
          <div className="invalid-feedback">Please add a comment for your review.</div>
        </div>
        <br />
        <button className="btn btn-dark" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default Review;