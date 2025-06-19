// frontend/src/services/bookingService.ts
import axios from 'axios';
import { Booking } from '@/types/booking'; // Ensure this path is correct

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance that includes the token from localStorage if available
// This is better than setting global default if only some requests need auth
const authAxios = axios.create({
  baseURL: API_BASE_URL, // Using the already defined API_BASE_URL
});

authAxios.interceptors.request.use(config => {
  if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['x-access-token'] = token;
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export const bookingService = {
  createBooking: async (bookingData: {
    property_id: number;
    check_in_date: string; // YYYY-MM-DD
    check_out_date: string; // YYYY-MM-DD
    number_of_guests: number;
    // total_price will be calculated backend, or passed if calculated frontend
  }): Promise<Booking> => {
    // The full URL will be API_BASE_URL + /bookings
    const response = await authAxios.post<Booking>(`/bookings`, bookingData);
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await authAxios.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    // Fetches bookings for the currently authenticated user (guest)
    const response = await authAxios.get<Booking[]>(`/bookings/user`);
    return response.data;
  },

  // Optional: getHostBookings - if implementing host dashboard view of bookings
  // getHostBookings: async (): Promise<Booking[]> => {
  //   const response = await authAxios.get<Booking[]>(`/bookings/host`);
  //   return response.data;
  // },

  // Optional: updateBookingStatus
  // updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
  //   const response = await authAxios.put<Booking>(`/bookings/${id}/status`, { status });
  //   return response.data;
  // },
};
