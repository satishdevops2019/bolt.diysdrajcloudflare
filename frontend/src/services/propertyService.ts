// frontend/src/services/propertyService.ts
import axios from 'axios';
import { Property, PaginatedProperties } from '@/types/property';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/properties';

export const propertyService = {
  getAllProperties: async (params: URLSearchParams = new URLSearchParams()): Promise<PaginatedProperties> => {
    // Example params: params.set('city', 'Paris'); params.set('limit', '10');
    const response = await axios.get<PaginatedProperties>(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  getPropertyById: async (id: string): Promise<Property> => {
    const response = await axios.get<Property>(`${API_URL}/${id}`);
    return response.data;
  }
  // Add create, update, delete methods later if needed for host dashboard
};
