// frontend/src/app/(main)/properties/page.tsx
'use client'; // Make this a client component

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyGrid from '@/components/property/PropertyGrid';
import { propertyService } from '@/services/propertyService';
import { PaginatedProperties } from '@/types/property'; // Property type already imported via PaginatedProperties
import Link from 'next/link';
import FilterSidebar from '@/components/search/FilterSidebar'; // Import FilterSidebar

// Define a loading component for Suspense fallback
const PropertiesLoading = () => (
  <div className="text-center py-10">
    <p className="text-lg text-gray-500">Loading properties...</p>
    {/* You can add a spinner here */}
  </div>
);

const PropertiesContent = () => {
  const searchParams = useSearchParams();
  const [propertiesData, setPropertiesData] = useState<PaginatedProperties | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Create a new URLSearchParams instance from the current searchParams
        const query = new URLSearchParams(searchParams.toString());
        const data = await propertyService.getAllProperties(query);
        setPropertiesData(data);
      } catch (err: any) {
        console.error("Failed to fetch properties:", err);
        setError(err.message || "Could not load properties.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [searchParams]); // Re-fetch when searchParams change

  if (isLoading) return <PropertiesLoading />;
  if (error) return <p className="text-red-500 text-center py-10">Error: {error}</p>;

  // Ensure propertiesData and propertiesData.data are not null before accessing
  if (!propertiesData || !propertiesData.data) {
    // This case could be handled by isLoading or error state, but as a fallback:
    return <p className="text-center text-gray-500 py-10">No properties data available.</p>;
  }

  const { data: properties, totalItems, totalPages } = propertiesData;

  if (properties.length === 0 && !isLoading) {
     return <p className="text-center text-gray-500 py-10">No properties found matching your criteria.</p>;
  }

  // Function to generate pagination links with existing search params
  const getPageLink = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(pageNumber));
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4 lg:w-1/5"> {/* Sidebar width */}
        <FilterSidebar />
      </div>
      <div className="w-full md:w-3/4 lg:w-4/5"> {/* Content width */}
        {properties.length > 0 ? (
            <PropertyGrid properties={properties} />
        ) : (
            // This part might be redundant due to the check above, but kept for explicitness
            <p className="text-center text-gray-500 py-10">No properties found for the selected filters.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center space-x-1 sm:space-x-2">
            {currentPage > 1 && (
              <Link href={getPageLink(currentPage - 1)} className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Previous
              </Link>
            )}
            {/* Simplified pagination display */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pNum => pNum === 1 || pNum === totalPages || (pNum >= currentPage - 1 && pNum <= currentPage + 1))
              .map((pNum, index, arr) => (
                <>
                  {index > 0 && arr[index-1] + 1 < pNum && <span className="px-2 py-2">...</span>}
                  <Link
                    key={pNum}
                    href={getPageLink(pNum)}
                    className={`px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md ${pNum === currentPage ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-gray-100'} transition-colors text-sm sm:text-base`}
                  >
                    {pNum}
                  </Link>
                </>
            ))}
            {currentPage < totalPages && (
              <Link href={getPageLink(currentPage + 1)} className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Next
              </Link>
            )}
          </div>
        )}
        {totalItems > 0 && <p className="text-center mt-4 text-sm text-gray-500">Showing {properties.length} of {totalItems} properties.</p>}
      </div>
    </div>
  );
};

// Main page component that uses Suspense for searchParams
export default function PropertiesPage() {
    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Explore Properties</h1>
            <Suspense fallback={<PropertiesLoading />}> {/* Suspense wrapper for useSearchParams */}
                <PropertiesContent />
            </Suspense>
        </div>
    );
}
