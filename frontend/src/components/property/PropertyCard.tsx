// frontend/src/components/property/PropertyCard.tsx
import { Property } from '@/types/property';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const placeholderImage = '/placeholder-image.png'; // Add a placeholder in /public

  return (
    <Link href={`/properties/${property.id}`} className="block border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <div className="relative w-full h-48 sm:h-60">
        <Image
          src={property.image_urls?.[0] || placeholderImage}
          alt={property.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false} // Set to true for above-the-fold images if applicable
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-gray-800" title={property.title}>{property.title}</h3>
        <p className="text-sm text-gray-600 truncate">{property.city}, {property.country}</p>
        <p className="text-sm text-gray-500 truncate">{property.property_type}</p>
        <p className="mt-2 font-bold text-red-600">
          ${parseFloat(property.price_per_night).toFixed(2)} <span className="text-sm font-normal text-gray-500">/ night</span>
        </p>
        {/* Add more details like rating, beds if available/needed */}
      </div>
    </Link>
  );
};

export default PropertyCard;
