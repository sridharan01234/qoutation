// services/api.js
const API_URL = '/api/products'; // Example using dummyJSON API

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.products; // dummyJSON returns { products: [...] }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
