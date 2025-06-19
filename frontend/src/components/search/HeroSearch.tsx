// frontend/src/components/search/HeroSearch.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationType, setLocationType] = useState('city'); // or 'country'
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const queryParams = new URLSearchParams();
            if (locationType === 'city') {
                queryParams.set('city', searchTerm.trim());
            } else if (locationType === 'country') {
                queryParams.set('country', searchTerm.trim());
            }
            // You could add more default params here if needed
            router.push(`/properties?${queryParams.toString()}`);
        } else {
            router.push('/properties');
        }
    };

    return (
        <section className="text-center py-12 sm:py-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg mb-12 shadow-xl text-white">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Find Your Next Perfect Stay</h1>
                <p className="text-lg sm:text-xl text-red-100 mb-8">
                    Discover amazing deals on hotels, homes, and unique places to stay.
                </p>
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., London, Paris, Italy"
                            className="flex-grow w-full sm:w-auto p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none text-gray-700"
                        />
                        <select
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value)}
                            className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none text-gray-700 bg-white"
                        >
                            <option value="city">Search by City</option>
                            <option value="country">Search by Country</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 w-full sm:w-auto bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-150 ease-in-out transform hover:scale-105"
                    >
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default HeroSearch;
