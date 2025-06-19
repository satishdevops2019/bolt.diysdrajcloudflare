import React, { useState } from 'react';

const SearchFilters = ({ onApplyFilters }) => { // onApplyFilters prop is for future use
  const initialFilterState = {
    minPrice: '',
    maxPrice: '',
    propertyType: '', // Empty string means 'Any' or not specified
    numBedrooms: '',
    numBathrooms: '',
    numBeds: '',
    amenities: {
      wifi: false,
      kitchen: false,
      pool: false,
      airConditioning: false,
      parking: false,
    },
  };

  const [filters, setFilters] = useState(initialFilterState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      // Handle amenities checkboxes
      setFilters(prevFilters => ({
        ...prevFilters,
        amenities: {
          ...prevFilters.amenities,
          [name]: checked,
        },
      }));
    } else {
      // Handle other input types
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const handleApplyClick = () => {
    // Prepare filters for logging or sending to API
    // Convert amenities object to a comma-separated string for easier logging/API consumption
    const activeAmenities = Object.keys(filters.amenities)
      .filter(key => filters.amenities[key])
      .join(',');

    // Create a clone of filters to avoid modifying state directly if we were to delete amenities object
    const filtersToApply = {
      ...filters,
      amenities: activeAmenities, // Replace amenities object with string
    };

    // Remove empty string properties to not send them as empty query params
    // (except for amenities, which might be an empty string if none selected)
    for (const key in filtersToApply) {
        if (filtersToApply[key] === '' && key !== 'amenities') {
            delete filtersToApply[key];
        }
    }


    console.log('Applying Filters (prepared for API):', filtersToApply);
    if (onApplyFilters) {
      onApplyFilters(filtersToApply); // This will be used in the next step
    }
  };

  const handleClearClick = () => {
    setFilters(initialFilterState);
    console.log('Filters Cleared. State reset to initial.');
    if (onApplyFilters) {
      onApplyFilters({}); // Notify parent to clear filters (fetch all)
    }
  };

  const inputStyle = { marginRight: '10px', marginBottom: '10px' };
  const labelStyle = { marginRight: '15px', display: 'inline-block' };
  const sectionStyle = { marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px'};

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', margin: '10px 0', borderRadius: '8px' }}>
      <h4 style={{ marginTop: '0', marginBottom: '15px' }}>Filter Listings</h4>

      <div style={sectionStyle}>
        <label style={labelStyle}>Min Price: <input style={inputStyle} type="number" name="minPrice" placeholder="e.g., 50" value={filters.minPrice} onChange={handleChange} /></label>
        <label style={labelStyle}>Max Price: <input style={inputStyle} type="number" name="maxPrice" placeholder="e.g., 500" value={filters.maxPrice} onChange={handleChange} /></label>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Property Type:
          <select style={inputStyle} name="propertyType" value={filters.propertyType} onChange={handleChange}>
            <option value="">Any</option>
            <option value="Entire Home">Entire Home</option>
            <option value="Private Room">Private Room</option>
            <option value="Shared Room">Shared Room</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
          </select>
        </label>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Min Bedrooms: <input style={inputStyle} type="number" name="numBedrooms" placeholder="Any" value={filters.numBedrooms} onChange={handleChange} /></label>
        <label style={labelStyle}>Min Bathrooms: <input style={inputStyle} type="number" name="numBathrooms" placeholder="Any" value={filters.numBathrooms} onChange={handleChange} /></label>
        <label style={labelStyle}>Min Beds: <input style={inputStyle} type="number" name="numBeds" placeholder="Any" value={filters.numBeds} onChange={handleChange} /></label>
      </div>

      <div style={sectionStyle}>
        <h5 style={{marginBottom: '5px'}}>Amenities</h5>
        {Object.keys(filters.amenities).map(amenityKey => (
          <label key={amenityKey} style={{ marginRight: '15px', display: 'inline-block' }}>
            <input
              type="checkbox"
              name={amenityKey}
              checked={filters.amenities[amenityKey]}
              onChange={handleChange}
              style={{marginRight: '5px'}}
            />
            {/* Simple capitalization for display */}
            {amenityKey.charAt(0).toUpperCase() + amenityKey.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
      </div>

      <button onClick={handleApplyClick} style={{ padding: '8px 15px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply Filters</button>
      <button onClick={handleClearClick} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Clear Filters</button>
    </div>
  );
};

export default SearchFilters;
