// frontend/src/app/(main)/properties/[id]/page.tsx
import { propertyService } from '@/services/propertyService';
import { Property } from '@/types/property';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookingForm from '@/components/booking/BookingForm'; // Import BookingForm

export const revalidate = 60;

interface SinglePropertyPageProps {
  params: { id: string };
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const property = await propertyService.getPropertyById(id);
    return property;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.error(`Failed to fetch property ${id}:`, error);
    throw error;
  }
}

export default async function SinglePropertyPage({ params }: SinglePropertyPageProps) {
  const property = await getProperty(params.id);

  if (!property) {
    notFound();
  }

  const placeholderImage = '/placeholder-image.png';

  return (
    <div className="container mx-auto p-4 mt-4">
      <div className="mb-4">
        <Link href="/properties" className="text-red-500 hover:text-red-700">
          &larr; Back to all properties
        </Link>
      </div>
      {/* Main content wrapper */}
      <div className="lg:flex lg:flex-row lg:space-x-8">
        {/* Left column for property details */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Image Gallery Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-[500px] overflow-hidden">
              {property.image_urls && property.image_urls.length > 0 ? (
                property.image_urls.slice(0, 5).map((url, index) => (
                  <div
                    key={index}
                    className={`relative w-full
                      ${index === 0 ? 'md:col-span-2 h-80 md:h-[400px]' : 'h-40 md:h-[198px]'}
                      ${index > 0 && index < 3 ? 'md:block hidden' : ''}
                      ${index >=3 && index <5 ? 'md:block hidden lg:block' : ''}
                      `}
                  >
                    <Image
                      src={url || placeholderImage}
                      alt={`${property.title} image ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority={index === 0}
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 50vw, 20vw"}
                    />
                  </div>
                ))
              ) : (
                <div className="relative w-full h-80 md:h-[400px] md:col-span-2">
                  <Image src={placeholderImage} alt="Placeholder" fill style={{ objectFit: 'cover' }} priority />
                </div>
              )}
            </div>

            {/* Text Details Section */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl lg:text-4xl font-bold mb-1">{property.title}</h1>
              <p className="text-lg text-gray-700 mb-3">{property.city}, {property.country}</p>
              <p className="text-md text-gray-600 mb-4">
                {property.property_type} hosted by{' '}
                <span className="font-semibold">{property.host?.username || 'N/A'}</span>
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mb-4 text-sm text-gray-600 border-t border-b py-3">
                <span>{property.max_guests} guests</span>
                <span className="hidden sm:inline">&middot;</span>
                <span>{property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
                <span className="hidden sm:inline">&middot;</span>
                <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
                <span className="hidden sm:inline">&middot;</span>
                <span>{property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>

              <h2 className="text-2xl font-semibold mt-6 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{property.description}</p>

              {property.amenities && property.amenities.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mt-6 mb-3">What this place offers</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                    {property.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column for BookingForm */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="sticky top-24"> {/* Adjust top-X based on actual header height + desired gap */}
            <BookingForm property={property} />
          </div>
        </div>
      </div>
    </div>
  );
}
