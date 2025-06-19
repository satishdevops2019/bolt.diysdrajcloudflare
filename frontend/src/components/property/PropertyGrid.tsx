// frontend/src/components/property/PropertyGrid.tsx
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return <p className="text-center text-gray-500 py-8">No properties found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
