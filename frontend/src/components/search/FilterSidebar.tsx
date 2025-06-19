// frontend/src/components/search/FilterSidebar.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LocationFilter from './LocationFilter';
import DateRangeFilter from './DateRangeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import GuestFilter from './GuestFilter';
import AmenityFilter from './AmenityFilter';
import PropertyTypeFilter from './PropertyTypeFilter';

const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL search params or defaults
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in_date') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out_date') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [numGuests, setNumGuests] = useState(searchParams.get('max_guests') || ''); // Corresponds to max_guests on backend
  const [amenities, setAmenities] = useState(searchParams.get('amenities') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (country) params.set('country', country);
    if (checkIn) params.set('check_in_date', checkIn);
    if (checkOut) params.set('check_out_date', checkOut);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (numGuests) params.set('max_guests', numGuests); // Ensure this matches backend query param for guests
    if (amenities) params.set('amenities', amenities);
    if (propertyType) params.set('property_type', propertyType);

    // Reset page to 1 for new searches/filters
    params.set('page', '1');

    router.push(`/properties?${params.toString()}`);
  }, [city, country, checkIn, checkOut, minPrice, maxPrice, numGuests, amenities, propertyType, router]);

  // Effect to update local state if URL params change (e.g. browser back/forward)
  useEffect(() => {
    setCity(searchParams.get('city') || '');
    setCountry(searchParams.get('country') || '');
    setCheckIn(searchParams.get('check_in_date') || '');
    setCheckOut(searchParams.get('check_out_date') || '');
    setMinPrice(searchParams.get('min_price') || '');
    setMaxPrice(searchParams.get('max_price') || '');
    setNumGuests(searchParams.get('max_guests') || '');
    setAmenities(searchParams.get('amenities') || '');
    setPropertyType(searchParams.get('property_type') || '');
  }, [searchParams]);

  return (
    <div className="p-4 space-y-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">Filter Properties</h3>
      <LocationFilter city={city} setCity={setCity} country={country} setCountry={setCountry} />
      <DateRangeFilter checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} />
      <PriceRangeFilter minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
      <GuestFilter numGuests={numGuests} setNumGuests={setNumGuests} />
      <AmenityFilter amenities={amenities} setAmenities={setAmenities} />
      <PropertyTypeFilter propertyType={propertyType} setPropertyType={setPropertyType} />
      <button
        onClick={handleSearch}
        className="w-full bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Apply Filters
      </button>
    </div>
  );
};
export default FilterSidebar;
