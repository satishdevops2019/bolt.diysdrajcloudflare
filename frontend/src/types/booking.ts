// frontend/src/types/booking.ts
import { Property } from './property'; // Assuming Property type is in property.ts
// User type might also be needed if guest details are more complex than just an ID
// For now, guest details might be part of the AuthContext user or fetched separately

export interface Booking {
  id: number;
  property_id: number;
  guest_id: number;
  check_in_date: string; // YYYY-MM-DD
  check_out_date: string; // YYYY-MM-DD
  total_price: string; // Comes as string from Sequelize Decimal
  number_of_guests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  property?: Property; // Optional: for displaying property details with a booking
  // guest?: User; // Optional: for displaying guest details if needed by host
}
