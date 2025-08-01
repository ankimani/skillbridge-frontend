import axios from "axios";
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;

// Buy coins endpoint
export const buyCoins = async (userId, payload, token) => {
  try {
    // Generate a unique idempotency key if not provided
    const idempotencyKey = payload.idempotencyKey || crypto.randomUUID();
    
    const response = await axios.post(
      `${API_BASE_URL}/buy-coins/${userId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        }
      }
    );
    console.log("response ",response)
    console.log("response data ",response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to buy coins:", error);
    throw error;
  }
};

// Buy coins via M-Pesa endpoint
export const buyCoinMpesa = async (userId, phoneNumber, amount, coins, token) => {
  try {
    const idempotencyKey = crypto.randomUUID();
    const response = await axios.post(
      `${API_BASE_URL}/payments/m/initiate`,
      null,
      {
        params: {
          userId,
          phoneNumber,
          amount,
          coins
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': idempotencyKey
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to initiate M-Pesa payment:", error);
    throw error;
  }
};

// Get coin balance endpoint
export const getCoinBalance = async (userId, token) => {
  try {
    console.log('getCoinBalance: Fetching balance for userId:', userId);
    const response = await axios.get(
      `${API_BASE_URL}/account/balance/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    console.log('getCoinBalance: API response:', response.data);
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to fetch coin balance:", error);
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
    console.error("Failed to calculate coin price:", error);
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
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};

// Get billing info endpoint
export const getBillingInfo = async (userId, token) => {
  try {
    console.log('coinWallet.getBillingInfo: Fetching billing info for userId:', userId);
    
    const response = await axios.get(
      `${API_BASE_URL}/billing/address/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    
    console.log('coinWallet.getBillingInfo: API response:', response.data);
    
    // Wrap the response data in the expected structure
    const wrappedResponse = {
      headers: {
        responseCode: 200,
        customerMessage: "Billing address retrieved successfully"
      },
      body: {
        data: response.data // This contains your actual billing info
      }
    };
    
    console.log('coinWallet.getBillingInfo: Wrapped response:', wrappedResponse);
    return wrappedResponse;
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('coinWallet.getBillingInfo: No billing info found (404)');
      return {
        headers: {
          responseCode: 404,
          customerMessage: "No billing address found"
        },
        body: {
          data: null
        }
      };
    }
    console.error("Failed to fetch billing info:", error);
    throw error;
  }
};

// Save billing info endpoint
export const saveBillingInfo = async (userId, billingData, token) => {
  try {
    console.log('coinWallet.saveBillingInfo: Saving billing info for userId:', userId);
    console.log('coinWallet.saveBillingInfo: Billing data:', billingData);
    
    const response = await axios.post(
      `${API_BASE_URL}/billing/address/${userId}`,
      billingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('coinWallet.saveBillingInfo: API response:', response.data);
    return response.data?.body?.data;
  } catch (error) {
    console.error("Failed to save billing info:", error);
    console.error("Billing info error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      userId: userId
    });
    throw error;
  }
};