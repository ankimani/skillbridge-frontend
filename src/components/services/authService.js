// src/services/authService.js
import apiClient from '../../utils/apiClient';
import { API_CONFIG } from '../../config/api';
import logger from '../../utils/logger';

export const loginUser = async (username, password) => {
    try {
        // Step 1: Login and get JWT token
        const loginResponse = await apiClient.post('/api/v1/auth/login', { username, password });

        if (!loginResponse.success) {
            const errorMessage = loginResponse.error || 'Login failed';
            logger.authError('login', errorMessage);
            throw new Error(errorMessage);
        }

        const token = loginResponse.data?.body?.data;

        // Step 2: Use token to get user profile  
        const profileResponse = await apiClient.get('/api/v1/users/me');

        if (!profileResponse.success) {
            logger.authError('profile-fetch', 'Failed to fetch user profile');
            throw new Error('Failed to fetch user profile');
        }

        logger.authSuccess('login');
        return {
            token,
            user: profileResponse.data?.body?.data
        };
    } catch (error) {
        logger.authError('login', error.message);
        throw error;
    }
};