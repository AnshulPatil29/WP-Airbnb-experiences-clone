import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import './SearchResult.css';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    fetch(`http://192.168.1.60:5000/api/search?query=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => setResults(data))
      .catch(error => console.error('Error fetching search results:', error));
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      <h2>Search Results for "{searchQuery}"</h2>
      <div className="results-list">
        {results.map(result => (
          <Card
            key={result.id}
            id={result.id}
            imageUrl={result.image_url1}
            rating={result.rating}
            reviews={result.review_count}
            time={result.time}
            title={result.title}
            price={result.price}
          />
        ))}
      </div>
    </div>
  );
}
