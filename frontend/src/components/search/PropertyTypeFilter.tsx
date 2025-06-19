// frontend/src/components/search/PropertyTypeFilter.tsx
'use client';
interface PropertyTypeFilterProps {
  propertyType: string;
  setPropertyType: (type: string) => void;
}
const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({ propertyType, setPropertyType }) => (
  <div className="mb-4 p-4 border border-gray-200 rounded-lg">
    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 font-semibold">Property Type</label>
    <input
      type="text"
      id="propertyType"
      value={propertyType}
      onChange={e => setPropertyType(e.target.value)}
      className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
      placeholder="e.g. Apartment, House"
    />
  </div>
);
export default PropertyTypeFilter;
