// Global API Configuration

// // API Base URL
 export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://devapi.insites.tech';

//export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5173';

// Tenant ID for multi-tenant applications
export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'default-tenant';

// JWT Token - In production, this should be handled securely through authentication
// This is a placeholder that should be populated after user login
export let JWT_TOKEN = '';

// Function to set JWT token after login
export const setJwtToken = (token) => {
  JWT_TOKEN = token;
  
  // Optionally store in localStorage for persistence across page refreshes
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
};

// Function to get JWT token
export const getJwtToken = () => {
  // Try to get from memory first
  if (JWT_TOKEN) return JWT_TOKEN;
  
  // If not in memory, try to get from localStorage
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      JWT_TOKEN = storedToken;
      return storedToken;
    }
  }
  
  return '';
};

// Function to clear JWT token on logout
export const clearJwtToken = () => {
  JWT_TOKEN = '';
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
};

// Default headers for API requests
export const getDefaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getJwtToken()}`,
    'X-Tenant-ID': TENANT_ID
  };
};