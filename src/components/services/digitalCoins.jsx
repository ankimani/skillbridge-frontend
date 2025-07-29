import createApiInstance from "./apiInterceptor";

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;

const digitalCoinsApi = createApiInstance(API_BASE_URL);

// Buy coins endpoint
export const buyCoins = async (userId, payload, token) => {
  try {
    const response = await digitalCoinsApi.post(
      `/buy-coins/${userId}`,
      payload
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to buy coins:", error);
    throw error;
  }
};

// Deduct coins endpoint
export const deductCoins = async (userId, payload, token) => {
  try {
    const response = await digitalCoinsApi.post(
      `/deduct-coins/${userId}`,
      payload,
      {
        validateStatus: function (status) {
          // Consider 409 as a valid status (not an error)
          return (status >= 200 && status < 300) || status === 409;
        }
      }
    );
    return response.data; // Return the full response data including headers
  } catch (error) {
    console.error("Failed to deduct coins:", error);
    throw error;
  }
};

export const deductCoinsClient = async (teacherId, userId, payload, token) => {
  try {
    console.log('deductCoinsClient: Calling endpoint with teacherId:', teacherId, 'userId:', userId, 'payload:', payload);
    const response = await digitalCoinsApi.post(
      `/deduct-coins/${userId}/student/${teacherId}`,
      payload,
      {
        validateStatus: function (status) {
          // Consider 409 as a valid status (not an error)
          return status >= 200 && status < 500 || status === 409;
        }
      }
    );
    console.log("deductCoinsClient: response data", response.data);
    console.log("deductCoinsClient: response headers", response.data?.headers);
    console.log("deductCoinsClient: response body", response.data?.body);
    return response.data; // Return the full response data including headers
  } catch (error) {
    console.error("deductCoinsClient: Failed to deduct coins:", error);
    throw error;
  }
};

// Get coin balance endpoint
export const getCoinBalance = async (userId, token) => {
  try {
    console.log('digitalCoins.getCoinBalance: Fetching balance for userId:', userId);
    const response = await digitalCoinsApi.get(
      `/account/balance/${userId}`
    );
    console.log('digitalCoins.getCoinBalance: API response:', response.data);
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to fetch coin balance:", error);
    throw error;
  }
};

// Calculate coin price endpoint
export const calculateCoinPrice = async (coins, token) => {
  try {
    const response = await digitalCoinsApi.get(
      `/pricing/calculate?coins=${coins}`
    );
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to calculate coin price:", error);
    throw error;
  }
};

// Get transactions endpoint
export const getTransactions = async (userId, token) => {
  try {
    console.log('digitalCoins.getTransactions: Fetching transactions for userId:', userId);
    const response = await digitalCoinsApi.get(
      `/transactions/${userId}`
    );
    console.log('digitalCoins.getTransactions: API response:', response.data);
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};