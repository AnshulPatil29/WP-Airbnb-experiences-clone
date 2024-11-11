import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({ id, imageUrl, rating, reviews, time, title, price }) {
    return (
        <Link to={`/detail/${id}`} className="card-link">
            <div className="card-container">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="card-image" 
                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                />
                <div className="card-content">
                    <div className="card-rating">
                        <span>⭐ {rating} ({reviews} reviews)</span>
                        <span>• {time}</span>
                    </div>
                    <h2 className="card-title">{title}</h2>
                    <p className="card-price">From ₹{price}</p>
                </div>
            </div>
        </Link>
    );
}
