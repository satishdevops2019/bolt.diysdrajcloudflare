// frontend/src/components/search/DateRangeFilter.tsx
'use client';
interface DateRangeFilterProps {
  checkIn: string;
  setCheckIn: (date: string) => void;
  checkOut: string;
  setCheckOut: (date: string) => void;
}
const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ checkIn, setCheckIn, checkOut, setCheckOut }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <h4 className="font-semibold mb-2 text-gray-700">Dates</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
        <input
          type="date"
          id="checkin"
          value={checkIn}
          onChange={e => setCheckIn(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
        <input
          type="date"
          id="checkout"
          value={checkOut}
          onChange={e => setCheckOut(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
    </div>
  </div>
);
export default DateRangeFilter;
