import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/api';
import logger from '../../utils/logger';

// Buy coins endpoint
export const buyCoins = async (userId, payload) => {
  try {
    const response = await apiClient.post(`/api/v1/buy-coins/${userId}`, payload);
    
    if (response.success) {
      logger.apiSuccess('POST', `buy-coins/${userId}`, 'Coins purchased successfully');
      return response.data?.body?.data;
    } else {
      logger.apiError('POST', `buy-coins/${userId}`, response.error);
      throw new Error(response.error || 'Failed to buy coins');
    }
  } catch (error) {
    logger.apiError('POST', `buy-coins/${userId}`, error.message);
    throw error;
  }
};

// Deduct coins endpoint
export const deductCoins = async (userId, payload) => {
  try {
    const response = await apiClient.post(`/api/v1/deduct-coins/${userId}`, payload);
    
    if (response.success || response.statusCode === 409) {
      logger.apiSuccess('POST', `deduct-coins/${userId}`, 'Coins deducted successfully');
      return response.data;
    } else {
      logger.apiError('POST', `deduct-coins/${userId}`, response.error);
      throw new Error(response.error || 'Failed to deduct coins');
    }
  } catch (error) {
    logger.apiError('POST', `deduct-coins/${userId}`, error.message);
    throw error;
  }
};
export const deductCoinsClient = async (teacherId, userId, payload) => {
  try {
    const response = await apiClient.post(`/api/v1/deduct-coins/${userId}/student/${teacherId}`, payload);
    
    if (response.success || response.statusCode === 409) {
      logger.apiSuccess('POST', `deduct-coins/${userId}/student/${teacherId}`, 'Client coins deducted successfully');
      return response.data;
    } else {
      logger.apiError('POST', `deduct-coins/${userId}/student/${teacherId}`, response.error);
      throw new Error(response.error || 'Failed to deduct client coins');
    }
  } catch (error) {
    logger.apiError('POST', `deduct-coins/${userId}/student/${teacherId}`, error.message);
    throw error;
  }
};
// Get coin balance endpoint
export const getCoinBalance = async (userId) => {
  try {
    const response = await apiClient.get(`/api/v1/account/balance/${userId}`);
    
    if (response.success) {
      logger.apiSuccess('GET', `account/balance/${userId}`, 'Balance fetched successfully');
      return response.data?.body?.data;
    } else {
      logger.apiError('GET', `account/balance/${userId}`, response.error);
      throw new Error(response.error || 'Failed to fetch coin balance');
    }
  } catch (error) {
    logger.apiError('GET', `account/balance/${userId}`, error.message);
    throw error;
  }
};

// Calculate coin price endpoint
export const calculateCoinPrice = async (coins) => {
  try {
    const response = await apiClient.get(`/api/v1/pricing/calculate?coins=${coins}`);
    
    if (response.success) {
      logger.apiSuccess('GET', 'pricing/calculate', 'Price calculated successfully');
      return response.data?.body?.data;
    } else {
      logger.apiError('GET', 'pricing/calculate', response.error);
      throw new Error(response.error || 'Failed to calculate coin price');
    }
  } catch (error) {
    logger.apiError('GET', 'pricing/calculate', error.message);
    throw error;
  }
};

// Get transactions endpoint
export const getTransactions = async (userId) => {
  try {
    const response = await apiClient.get(`/api/v1/transactions/${userId}`);
    
    if (response.success) {
      logger.apiSuccess('GET', `transactions/${userId}`, 'Transactions fetched successfully');
      return response.data?.body?.data;
    } else {
      logger.apiError('GET', `transactions/${userId}`, response.error);
      throw new Error(response.error || 'Failed to fetch transactions');
    }
  } catch (error) {
    logger.apiError('GET', `transactions/${userId}`, error.message);
    throw error;
  }
};