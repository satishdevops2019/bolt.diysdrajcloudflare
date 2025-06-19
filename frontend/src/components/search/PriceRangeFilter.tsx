// frontend/src/components/search/PriceRangeFilter.tsx
'use client';
interface PriceRangeFilterProps {
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
}
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ minPrice, setMinPrice, maxPrice, setMaxPrice }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <h4 className="font-semibold mb-2 text-gray-700">Price Range</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          placeholder="Any"
        />
      </div>
      <div>
        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          placeholder="Any"
        />
      </div>
    </div>
  </div>
);
export default PriceRangeFilter;
