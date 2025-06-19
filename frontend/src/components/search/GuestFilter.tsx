// frontend/src/components/search/GuestFilter.tsx
'use client';
interface GuestFilterProps {
  numGuests: string;
  setNumGuests: (num: string) => void;
}
const GuestFilter: React.FC<GuestFilterProps> = ({ numGuests, setNumGuests }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <label htmlFor="numGuests" className="block text-sm font-medium text-gray-700 font-semibold">Guests</label>
    <input
      type="number"
      id="numGuests"
      value={numGuests}
      onChange={e => setNumGuests(e.target.value)}
      min="1"
      className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
      placeholder="Any"
    />
  </div>
);
export default GuestFilter;
