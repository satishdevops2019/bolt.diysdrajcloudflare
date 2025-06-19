// frontend/src/app/(main)/properties/page.tsx
import PropertyGrid from '@/components/property/PropertyGrid';
import { propertyService } from '@/services/propertyService';
import { PaginatedProperties } from '@/types/property';
import Link from 'next/link';

// Revalidate every 60 seconds or as needed
export const revalidate = 60;

async function getAllProperties(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedProperties> {
  const queryParams = new URLSearchParams();

  // Standard pagination params
  if (searchParams.page) queryParams.set('page', String(searchParams.page));
  if (searchParams.limit) queryParams.set('limit', String(searchParams.limit));

  // Add other potential search filter params from URL
  // These should match the backend's expected query parameters
  if (searchParams.city) queryParams.set('city', String(searchParams.city));
  if (searchParams.country) queryParams.set('country', String(searchParams.country));
  if (searchParams.min_price) queryParams.set('min_price', String(searchParams.min_price));
  if (searchParams.max_price) queryParams.set('max_price', String(searchParams.max_price));
  if (searchParams.min_bedrooms) queryParams.set('min_bedrooms', String(searchParams.min_bedrooms));
  if (searchParams.max_guests) queryParams.set('max_guests', String(searchParams.max_guests));
  if (searchParams.property_type) queryParams.set('property_type', String(searchParams.property_type));
  if (searchParams.amenities) queryParams.set('amenities', String(searchParams.amenities)); // e.g. "wifi,pool"
  if (searchParams.check_in_date) queryParams.set('check_in_date', String(search_params.check_in_date));
  if (searchParams.check_out_date) queryParams.set('check_out_date', String(search_params.check_out_date));
  if (searchParams.sort_by) queryParams.set('sort_by', String(searchParams.sort_by));

  try {
    const propertiesData = await propertyService.getAllProperties(queryParams);
    return propertiesData;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    // Return a default structure in case of error to prevent build/render failure
    return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
}

export default async function PropertiesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }}) {
  const { data: properties, totalItems, totalPages, currentPage } = await getAllProperties(searchParams);
  const page = Number(searchParams.page) || 1;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Explore Properties</h1>

      {/* Placeholder for Search Filters - to be implemented later */}
      {/* <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow">
        <p className="text-center text-gray-600">Search and filter controls will go here.</p>
      </div> */}

      {properties.length > 0 ? (
        <PropertyGrid properties={properties} />
      ) : (
        <p className="text-center text-gray-500 py-10">No properties match your current criteria. Try adjusting your search.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center space-x-2">
          {page > 1 && (
            <Link href={`/properties?${new URLSearchParams({...searchParams, page: String(page - 1)})}`} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              Previous
            </Link>
          )}
          {/* Simplified pagination: showing a few page numbers around current page */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 2 && pageNum <= page + 2)) {
              return (
                <Link
                  key={pageNum}
                  href={`/properties?${new URLSearchParams({...searchParams, page: String(pageNum)})}`}
                  className={`px-4 py-2 border border-gray-300 rounded-md ${pageNum === page ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-gray-100'} transition-colors`}
                >
                  {pageNum}
                </Link>
              );
            } else if (pageNum === page - 3 || pageNum === page + 3) {
              return <span key={pageNum} className="px-4 py-2">...</span>;
            }
            return null;
          })}
          {page < totalPages && (
            <Link href={`/properties?${new URLSearchParams({...searchParams, page: String(page + 1)})}`} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
              Next
            </Link>
          )}
        </div>
      )}
      {totalItems > 0 && <p className="text-center mt-4 text-sm text-gray-500">Showing {properties.length} of {totalItems} properties.</p>}
    </div>
  );
}
