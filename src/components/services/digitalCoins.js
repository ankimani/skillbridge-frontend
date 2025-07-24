import axios from 'axios';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8089';
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;

// Buy coins endpoint
export const buyCoins = async (userId, payload, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/buy-coins/${userId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error('Failed to buy coins:', error);
    throw error;
  }
};

// Deduct coins endpoint
export const deductCoins = async (userId, payload, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/deduct-coins/${userId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          // Consider 409 as a valid status (not an error)
          return (status >= 200 && status < 300) || status === 409;
        }
      }
    );
    return response.data; // Return the full response data including headers
  } catch (error) {
    console.error('Failed to deduct coins:', error);
    throw error;
  }
};
export const deductCoinsClient = async (teacherId,userId, payload, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/deduct-coins/${userId}/student/${teacherId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          // Consider 409 as a valid status (not an error)
          return status >= 200 && status < 500 || status === 409;
        }
      }
    );
    console.log('response data',response.data);
    return response.data; // Return the full response data including headers
  } catch (error) {
    console.error('Failed to deduct coins:', error);
    throw error;
  }
};
// Get coin balance endpoint
export const getCoinBalance = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/account/balance/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error('Failed to fetch coin balance:', error);
    throw error;
  }
};

// Calculate coin price endpoint
export const calculateCoinPrice = async (coins, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/pricing/calculate?coins=${coins}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error('Failed to calculate coin price:', error);
    throw error;
  }
};

// Get transactions endpoint
export const getTransactions = async (userId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
};