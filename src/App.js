import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Topbar from './components/Topbar';
import CardList from './components/CardList';
import GridCardList from './components/GridCardList';
import LoadingScreen from './components/LoadingScreen';
import CardDetail from './components/CardDetail';
import SearchResults from './components/SearchResult';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 500;
    const start = Date.now();

    const handlePageLoad = () => {
      const timeElapsed = Date.now() - start;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - timeElapsed);
      setTimeout(() => setLoading(false), remainingTime);
    };

    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }

    return () => window.removeEventListener('load', handlePageLoad);
  }, []);

  return (
    <Router>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <Topbar />
          <Routes>
            <Route path="/" element={
              <>
                <h1 style={{ marginLeft: '5%', marginTop: '1.5rem', fontSize: '1.65rem', fontWeight: '600', color: '#222222' }}>Happening Today</h1>
                <CardList />
                <h1 style={{ marginLeft: '5%', marginTop: '1.5rem', fontSize: '1.65rem', fontWeight: '600', color: '#222222' }}>Explore all Experiences</h1>
                <GridCardList />
              </>
            } />
            <Route path="/detail/:id" element={<CardDetail />} />
            <Route path="/search" element={<SearchResults />} /> 
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
