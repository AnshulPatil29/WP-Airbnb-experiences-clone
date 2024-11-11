import React, { useRef, useEffect, useState } from 'react';
import Card from './Card';
import './CardList.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CardList() {
    const cardListRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch('http://192.168.1.60:5000/api/cards')
            .then(response => response.json())
            .then(data => setCards(data))
            .catch(error => console.error('Error fetching card data:', error));
    }, []);

    useEffect(() => {
        if (cardListRef.current) {
            const firstCard = cardListRef.current.querySelector('.card-container');
            if (firstCard) {
                setCardWidth(firstCard.offsetWidth + 16); 
            }
        }
    }, [cards]);

    const scrollLeft = () => {
        const currentScrollLeft = cardListRef.current.scrollLeft;
        if (currentScrollLeft <= cardWidth) {
            cardListRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        } else {
            const newScrollLeft = Math.floor((currentScrollLeft - cardWidth) / cardWidth) * cardWidth;
            cardListRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const currentScrollLeft = cardListRef.current.scrollLeft;
        const maxScrollLeft = cardListRef.current.scrollWidth - cardListRef.current.clientWidth;
        if (currentScrollLeft + cardWidth >= maxScrollLeft) {
            cardListRef.current.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            const newScrollLeft = Math.ceil((currentScrollLeft + cardWidth) / cardWidth) * cardWidth;
            cardListRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        }
    };

    return (
        <div className="card-list-container">
            <div className="scroll-buttons">
                <button className="scroll-button" onClick={scrollLeft}>
                    <FaChevronLeft />
                </button>
                <button className="scroll-button" onClick={scrollRight}>
                    <FaChevronRight />
                </button>
            </div>
            <div className="card-list" ref={cardListRef}>
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
