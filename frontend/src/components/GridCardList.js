import React, { useEffect, useState } from 'react';
import Card from './Card';
import './GridCardList.css';

export default function GridCardList() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/cards')
            .then(response => response.json())
            .then(data => setCards(data))
            .catch(error => console.error('Error fetching card data:', error));
    }, []);

    return (
        <div className="grid-card-list-container">
            <div className="grid-card-list">
                {cards.map((item) => (
                    <Card 
                        key={item.id}
                        id={item.id}               
                        imageUrl={item.image_url1}
                        rating={item.rating}
                        reviews={item.review_count}
                        time={item.time}
                        title={item.title}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
}
