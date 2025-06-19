import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sets the JWT token in the apiClient's headers for authenticated requests.
 * @param {string|null} token - The JWT token, or null to remove it.
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Fetches listings from the API.
 * @param {object} filterParams - Optional filter parameters to be sent as URL query params.
 * @returns {Promise<Array>} A promise that resolves to an array of listings.
 * @throws Will throw an error if the request fails.
 */
export const fetchListings = async (filterParams = {}) => {
  try {
    const response = await apiClient.get('/listings', { params: filterParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error.response ? error.response.data : error.message);
    // Re-throw a more specific error or the error data from the server response
    if (error.response && error.response.data) {
      // If the server sends a structured error message, throw that
      throw error.response.data;
    } else {
      // Otherwise, throw a generic error
      throw new Error('Network error or server is not responding');
    }
  }
};

// Add more API functions here as needed, e.g.:
// export const fetchListingById = async (id) => { ... };
// export const loginUser = async (credentials) => { ... };
// export const registerUser = async (userData) => { ... };
// export const createBooking = async (bookingData) => { ... };

export default apiClient; // Exporting the instance itself can also be useful
