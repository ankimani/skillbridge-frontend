// Token management utilities
export const TOKEN_KEY = 'authToken';
export const USER_PROFILE_KEY = 'userProfile';

// Secure token storage (keeping localStorage for now to maintain compatibility)
// TODO: Migrate to HttpOnly cookies for production
export const tokenStorage = {
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },
  
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },
  
  remove: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem('coinBalance');
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },
  
  exists: () => {
    return !!tokenStorage.get();
  }
};

// JWT token utilities
export const jwtUtils = {
  decode: (token) => {
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  },
  
  isExpired: (token) => {
    const decoded = jwtUtils.decode(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  },
  
  getUserRole: (token = null) => {
    const tokenToUse = token || tokenStorage.get();
    if (!tokenToUse) return null;
    
    const decoded = jwtUtils.decode(tokenToUse);
    return decoded?.roles || null;
  },
  
  getUserId: (token = null) => {
    const tokenToUse = token || tokenStorage.get();
    if (!tokenToUse) return null;
    
    const decoded = jwtUtils.decode(tokenToUse);
    return decoded?.sub || decoded?.userId || null;
  }
};

// Auth state utilities
export const authUtils = {
  isAuthenticated: () => {
    const token = tokenStorage.get();
    return token && !jwtUtils.isExpired(token);
  },
  
  logout: () => {
    tokenStorage.remove();
    // Clear any other auth-related data
    window.location.href = '/login';
  },
  
  getAuthHeaders: () => {
    const token = tokenStorage.get();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};