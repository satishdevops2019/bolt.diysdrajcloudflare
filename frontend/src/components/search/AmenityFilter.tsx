// frontend/src/components/search/AmenityFilter.tsx
'use client';
interface AmenityFilterProps {
  amenities: string; // Comma-separated string
  setAmenities: (amenities: string) => void;
}
const AmenityFilter: React.FC<AmenityFilterProps> = ({ amenities, setAmenities }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <label htmlFor="amenities" className="block text-sm font-medium text-gray-700 font-semibold">Amenities</label>
    <input
      type="text"
      id="amenities"
      value={amenities}
      onChange={e => setAmenities(e.target.value)}
      className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
      placeholder="e.g. wifi,pool,parking"
    />
    <p className="text-xs text-gray-500 mt-1">Enter amenities separated by commas.</p>
  </div>
);
export default AmenityFilter;
