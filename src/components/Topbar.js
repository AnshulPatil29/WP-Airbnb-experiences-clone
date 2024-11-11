import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../assets/airbnb_logo.svg';
import logoWithName from '../assets/airbnb_logo_with_name.png';
import { FaSearch } from 'react-icons/fa';
import './Topbar.css';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('Search destinations, experiences, etc.');
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { 
        setPlaceholder('Explore');
      } else {
        setPlaceholder('Search destinations, experiences, etc');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <div className="topbar-container">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="airbnb-logo" className="logo-only" />
          <img src={logoWithName} alt="airbnb-logo-with-name" className="logo-with-name" />
        </Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder={placeholder}
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch} disabled={!searchQuery.trim()}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
}
