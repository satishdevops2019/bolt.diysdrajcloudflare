// frontend/src/components/search/LocationFilter.tsx
'use client';
interface LocationFilterProps {
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
}
const LocationFilter: React.FC<LocationFilterProps> = ({ city, setCity, country, setCountry }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <h4 className="font-semibold mb-2 text-gray-700">Location</h4>
    <div>
      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
      <input
        type="text"
        id="city"
        value={city}
        onChange={e => setCity(e.target.value)}
        className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        placeholder="e.g. Paris"
      />
    </div>
    <div className="mt-2">
      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
      <input
        type="text"
        id="country"
        value={country}
        onChange={e => setCountry(e.target.value)}
        className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        placeholder="e.g. France"
      />
    </div>
  </div>
);
export default LocationFilter;
