// frontend/src/types/property.ts
export interface Host {
  id: number;
  username: string;
  email: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price_per_night: string; // Comes as string from Sequelize Decimal
  address: string;
  city: string;
  country: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  image_urls: string[];
  host_id: number;
  property_type: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
  updatedAt: string;
  host?: Host; // Optional if not always included
}

export interface PaginatedProperties {
    data: Property[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}
