import { useState, useCallback } from 'react';

// Custom hook for managing API call states
export const useApiState = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute an async API call with proper state management
  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      setData(result);
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state to initial values
  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearError,
    setData,
    setLoading,
    setError
  };
};

// Hook for managing paginated data
export const usePaginatedApiState = (initialData = { items: [], pagination: {} }) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      setData(result);
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoadingMore(true);
      setError(null);
      
      const result = await asyncFunction(...args);
      
      // Append new items to existing data
      setData(prevData => ({
        ...result,
        items: [...prevData.items, ...result.items]
      }));
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingMore(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    loadingMore,
    error,
    execute,
    loadMore,
    reset,
    setData,
    setError
  };
};

export default useApiState;