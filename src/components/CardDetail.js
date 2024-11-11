import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import './CardDetail.css';

export default function CardDetail() {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [error, setError] = useState('');

    // Fetch card and review data
    useEffect(() => {
        fetch(`http://192.168.1.60:5000/api/cards/${id}`)
            .then(response => response.json())
            .then(data => {
                setCard(data.card);
                setReviews(data.reviews);
            })
            .catch(error => console.error('Error fetching card details:', error));
    }, [id]);

    // Cookie helper functions
    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };

    // Check if a review has already been submitted
    const hasReviewed = getCookie(`reviewed_card_${id}`);

    const handleReviewSubmit = () => {
        if (!reviewText || !rating || !reviewerName) {
            setError('All fields are required.');
            return;
        }

        // Post review only if no previous review exists
        if (!hasReviewed) {
            fetch('http://192.168.1.60:5000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId: id, reviewerName, reviewText, rating }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setReviews(prevReviews => [...prevReviews, data.review]);
                        setCookie(`reviewed_card_${id}`, true, 365);
                        setShowPopup(false);
                    }
                })
                .catch(error => console.error('Error submitting review:', error));
        } else {
            setError('You have already reviewed this card.');
        }
    };

    if (!card) return <p>Loading...</p>;

    const images = [card.image_url1, card.image_url2, card.image_url3, card.image_url4];
    const nextImage = () => setCurrentImageIndex((currentImageIndex + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);

    return (
        <div className="card-detail-container">
            <div className="card-detail-main">
                <div className="card-detail-image-container">
                    <button className="carousel-button" onClick={prevImage}>&lt;</button>
                    <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} className="carousel-image" />
                    <button className="carousel-button" onClick={nextImage}>&gt;</button>
                    <h2 className="hosted-by">{card.hosted_by}</h2>
                    <p className="price">₹{card.price}</p>
                </div>

                <div className="card-detail-content">
                    <div className="details-box">
                        <h2>{card.title}</h2>
                        <p><strong>Duration:</strong> {card.time}</p>
                        <p><strong>Experience Date:</strong> {new Date(card.experience_date).toLocaleDateString()}</p>
                        <p><strong>Average Rating:</strong> {card.rating || 0.0} ({card.review_count || 0} reviews)</p>
                    </div>

                    <div className="description-box">
                        <h3>Description</h3>
                        <p>{card.description}</p>
                    </div>

                    <div className="contact-host-container">
                        <h3>Contact Host</h3>
                        <div className="contact-info">
                            <a href={`tel:${card.telephone}`} className="contact-button">
                                <FaPhone className="contact-icon" /> {card.telephone}
                            </a>
                            <a href={`mailto:${card.email}`} className="contact-button">
                                <FaEnvelope className="contact-icon" /> {card.email}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-container">
                <div className="reviews-header">
                    <h3>Reviews:</h3>
                    {!hasReviewed && (
                        <button className="add-review-button" onClick={() => setShowPopup(true)}>Add Review</button>
                    )}
                </div>

                {reviews.map((review, index) => (
                    <div key={index} className="review">
                        <p><strong>Reviewer:</strong> {review.reviewer_name || "Anonymous"}</p>
                        <p><strong>Rating:</strong> {review.rating} ⭐</p>
                        <p>{review.review_text}</p>
                        <p><em>Reviewed on: {new Date(review.created_at).toLocaleDateString()}</em></p>
                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="popup">
                    <h3>Add a Review</h3>
                    <input type="text" placeholder="Your Name" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
                    <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(e.target.value)} />
                    <textarea placeholder="Write your review..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                    {error && <p className="error">{error}</p>}
                    <button onClick={handleReviewSubmit}>Submit Review</button>
                </div>
            )}
        </div>
    );
}
