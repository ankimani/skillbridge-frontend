// profileService.js
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8089';
const BASE_URL = `${BACKEND_BASE_URL}/api/v1/teaching`;


export const saveTeachingDetails = async (formData) => {
  const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${BASE_URL}/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('data', data);
      // Check if the response code is 200 for success
      if (response.ok && data.headers.responseCode === 200) {
        return { success: true, data: data.body.data };
      } 
        return { success: false, error: data.headers.customerMessage || 'Failed to save subject details' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  