// frontend/src/app/(main)/bookings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserBookingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login?redirect=/bookings'); // Redirect if not logged in
        return;
      }

      const fetchBookings = async () => {
        setIsLoading(true);
        try {
          const userBookings = await bookingService.getUserBookings();
          setBookings(userBookings);
        } catch (err: any) {
          setError(err.response?.data?.message || err.message || "Failed to fetch your bookings.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user, isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading your bookings...</p>
          {/* Optional: Add a spinner */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex justify-center items-center">
        <div className="text-center text-red-500 bg-red-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <Link href="/" className="mt-4 inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">You have no bookings yet.</p>
          <Link href="/properties" className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
            Explore Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white shadow-lg rounded-lg overflow-hidden md:flex hover:shadow-xl transition-shadow duration-300">
            {booking.property?.image_urls?.[0] && (
              <div className="md:w-1/3 relative h-56 md:h-auto"> {/* Fixed height for mobile, auto for md */}
                <Image
                  src={booking.property.image_urls[0]}
                  alt={booking.property.title || 'Property image'}
                  fill
                  style={{objectFit: 'cover'}}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className={`p-5 ${booking.property?.image_urls?.[0] ? 'md:w-2/3' : 'w-full'}`}>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{booking.property?.title || 'Property Details Unavailable'}</h2>
              <div className="text-sm text-gray-600 mb-3 space-y-1">
                <p><strong>Check-in:</strong> {new Date(booking.check_in_date).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(booking.check_out_date).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {booking.number_of_guests}</p>
                <p><strong>Total Price:</strong> <span className="font-semibold text-gray-800">${parseFloat(booking.total_price).toFixed(2)}</span></p>
                <p>
                  <strong>Status:</strong>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </p>
                 <p>
                  <strong>Payment:</strong>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                      booking.payment_status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'}`}>
                    {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                  </span>
                </p>
              </div>
              {booking.property && (
                <Link href={`/properties/${booking.property_id}`} className="text-red-500 hover:text-red-700 font-medium text-sm mt-3 inline-block group">
                  View Property Details
                  <span className="ml-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1">&rarr;</span>
                </Link>
              )}
              {/* Future actions: Cancel booking, leave review, etc. */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
