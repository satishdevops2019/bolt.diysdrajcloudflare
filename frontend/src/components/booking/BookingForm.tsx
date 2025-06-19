// frontend/src/components/booking/BookingForm.tsx
'use client';

import { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker'; // react-datepicker to be installed
// import 'react-datepicker/dist/react-datepicker.css'; // react-datepicker to be installed
import { Property } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  property: Property;
}

const BookingForm: React.FC<BookingFormProps> = ({ property }) => {
  // Store dates as strings for now, until DatePicker is integrated
  const [checkInDateStr, setCheckInDateStr] = useState<string>('');
  const [checkOutDateStr, setCheckOutDateStr] = useState<string>('');
  // const [checkInDate, setCheckInDate] = useState<Date | null>(null); // For DatePicker
  // const [checkOutDate, setCheckOutDate] = useState<Date | null>(null); // For DatePicker
  const [numGuests, setNumGuests] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Basic calculation if dates are entered as YYYY-MM-DD strings
    if (checkInDateStr && checkOutDateStr && property.price_per_night) {
      const date1 = new Date(checkInDateStr);
      const date2 = new Date(checkOutDateStr);
      if (!isNaN(date1.getTime()) && !isNaN(date2.getTime()) && date2 > date1) {
        const timeDiff = date2.getTime() - date1.getTime();
        const nights = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
        const pricePerNight = parseFloat(property.price_per_night);
        if (nights > 0 && !isNaN(pricePerNight)) {
          setTotalPrice(nights * pricePerNight);
        } else {
          setTotalPrice(0);
        }
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkInDateStr, checkOutDateStr, property.price_per_night]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAuthenticated || !user) {
      setError("Please login to make a booking.");
      // Consider redirecting or showing login modal: router.push('/login?redirect=/properties/' + property.id);
      return;
    }
    if (!checkInDateStr || !checkOutDateStr) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    // Basic date validation for string inputs
    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        setError("Invalid date format. Please use YYYY-MM-DD.");
        return;
    }
    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    if (numGuests <= 0) {
      setError("Number of guests must be at least 1.");
      return;
    }
    if (numGuests > property.max_guests) {
        setError(`This property can host a maximum of ${property.max_guests} guests.`);
        return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        property_id: property.id,
        check_in_date: checkInDateStr, // YYYY-MM-DD from string input
        check_out_date: checkOutDateStr, // YYYY-MM-DD from string input
        number_of_guests: numGuests,
      };
      const newBooking = await bookingService.createBooking(bookingData);
      setSuccess(`Booking successful! Your booking ID is ${newBooking.id}. You will be redirected shortly.`);
      setTimeout(() => {
        router.push('/bookings');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-3">
        ${parseFloat(property.price_per_night).toFixed(2)} <span className="text-base font-normal text-gray-500">/ night</span>
      </h3>
      <form onSubmit={handleBookingSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
            {/* DatePicker would replace this input */}
            <input
              type="date"
              value={checkInDateStr}
              onChange={(e) => setCheckInDateStr(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholderText="YYYY-MM-DD"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
            {/* DatePicker would replace this input */}
            <input
              type="date"
              value={checkOutDateStr}
              onChange={(e) => setCheckOutDateStr(e.target.value)}
              min={checkInDateStr} // Basic min validation
              className="w-full p-2 border rounded mt-1"
              placeholderText="YYYY-MM-DD"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
          <input
            type="number"
            id="guests"
            value={numGuests}
            onChange={(e) => setNumGuests(parseInt(e.target.value, 10))}
            min="1"
            max={property.max_guests}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        {totalPrice > 0 && (
          <div className="my-3 text-lg font-semibold">
            Total: ${totalPrice.toFixed(2)}
          </div>
        )}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
        <button
          type="submit"
          disabled={isLoading || !isAuthenticated}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : (isAuthenticated ? 'Request to Book' : 'Login to Book')}
        </button>
        {!isAuthenticated && <p className="text-xs text-center mt-2">You need to be logged in to book.</p>}
      </form>
    </div>
  );
};

export default BookingForm;
