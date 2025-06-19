// frontend/src/app/page.tsx
import PropertyGrid from '@/components/property/PropertyGrid';
import { propertyService } from '@/services/propertyService';
import { PaginatedProperties } from '@/types/property';
import Link from 'next/link';

export const revalidate = 60; // Revalidate data every 60 seconds

async function getFeaturedProperties(): Promise<PaginatedProperties> {
  const params = new URLSearchParams();
  params.set('limit', '8'); // Fetch 8 properties for the homepage
  // Add any other criteria for "featured" properties, e.g., sort by rating later
  // params.set('sort_by', 'rating_desc'); // Example if backend supports
  try {
    return await propertyService.getAllProperties(params);
  } catch (error) {
    console.error("Failed to fetch featured properties:", error);
    return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
}

export default async function HomePage() {
  const { data: featuredProperties } = await getFeaturedProperties();

  return (
    <div className="container mx-auto p-4">
      {/* Hero Search Section */}
      <section className="text-center py-10 sm:py-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg mb-12 shadow-lg">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Find Your Next Perfect Stay</h1>
        <p className="text-lg sm:text-xl text-red-100 mb-8">
          Discover amazing deals on hotels, homes, and unique places to stay.
        </p>
        {/* SearchBar component will go here later */}
        <div className="mt-4 max-w-2xl mx-auto px-4">
          <div className="h-14 bg-white rounded-full shadow-2xl flex items-center p-2 animate-pulse">
            <span className="pl-4 text-gray-400">Search destinations... (Coming Soon!)</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">Featured Properties</h2>
        {featuredProperties.length > 0 ? (
          <PropertyGrid properties={featuredProperties} />
        ) : (
          <p className="text-center text-gray-500 py-8">
            Could not load featured properties at the moment. Please try again later.
          </p>
        )}
        {featuredProperties.length > 0 && (
             <div className="text-center mt-10">
                <Link href="/properties" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg">
                    Explore All Properties
                </Link>
            </div>
        )}
      </section>
    </div>
  );
}
