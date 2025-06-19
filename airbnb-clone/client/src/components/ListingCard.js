import React from 'react';

const ListingCard = ({ listing }) => {
  if (!listing) {
    // This case should ideally not be hit if HomePage filters out undefined listings
    return <p>Listing data is not available.</p>;
  }

  return (
    <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '10px',
        padding: '15px',
        width: '300px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* In a real app, you'd have an image here, e.g., listing.image_url */}
      {/* <img src={listing.thumbnail_url || 'default-image.jpg'} alt={listing.title} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px'}} /> */}

      <h3 style={{ fontSize: '1.2em', marginBottom: '5px' }}>{listing.title || 'Untitled Listing'}</h3>

      <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '3px' }}>
        <strong>Price:</strong> ${listing.price_per_night !== undefined ? Number(listing.price_per_night).toFixed(2) : 'N/A'} / night
      </p>

      <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '3px' }}>
        <strong>Location:</strong> {listing.city || 'N/A City'}, {listing.country || 'N/A Country'}
      </p>

      <p style={{ fontSize: '0.9em', color: '#555', marginBottom: '3px' }}>
        <strong>Type:</strong> {listing.property_type || 'N/A'}
      </p>

      {/* Add more details as needed, e.g., rating, number of guests */}
      {/* <p>Max Guests: {listing.max_guests}</p> */}
      {/* <p>Bedrooms: {listing.num_bedrooms}</p> */}
    </div>
  );
};

export default ListingCard;
