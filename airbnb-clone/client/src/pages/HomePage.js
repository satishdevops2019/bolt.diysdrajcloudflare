import React, { useState, useEffect } from 'react';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import SearchFilters from '../components/SearchFilters';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const handleApplyFilters = (newFilters) => {
    console.log("HomePage: Applying new filters", newFilters);
    setActiveFilters(newFilters);
  };

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("HomePage: Fetching listings with filters:", activeFilters);
        const data = await fetchListings(activeFilters);
        setListings(data || []); // Ensure listings is an array, even if data is null/undefined
      } catch (err) {
        const errorMessage = err.message || (typeof err === 'string' ? err : 'Failed to fetch listings.');
        setError(errorMessage);
        setListings([]); // Clear listings on error
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [activeFilters]); // Re-run effect when activeFilters change

  if (loading) {
    return (
      <div>
        <SearchFilters onApplyFilters={handleApplyFilters} />
        <p>Loading listings...</p>
      </div>
    );
  }

  // Error display should also be within the layout that includes SearchFilters
  if (error) {
     return (
      <div>
        <SearchFilters onApplyFilters={handleApplyFilters} />
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <SearchFilters onApplyFilters={handleApplyFilters} />
      <h1>Explore Listings</h1>
      {listings.length === 0 ? (
        <p>No listings found. Try adjusting your filters or check back later!</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
