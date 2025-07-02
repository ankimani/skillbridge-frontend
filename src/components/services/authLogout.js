export const logoutUser = () => {
    try {
      // Remove all auth-related items from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('coinBalance');
      
      // Clear any other session-related data
      // sessionStorage.clear(); // Uncomment if using sessionStorage
      
      // Return success object matching your API response format
      return {
        success: true,
        message: 'Logged out successfully',
        body: {
          data: {
            status: 'success'
          }
        }
      };
    } catch (error) {
      console.error("Logout failed:", error);
      // Return error object matching your API error format
      return {
        success: false,
        message: 'Logout failed',
        error: {
          message: error.message,
          code: 'LOGOUT_ERROR'
        }
      };
    }
  };