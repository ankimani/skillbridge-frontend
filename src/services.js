const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_URL = `${BACKEND_BASE_URL}/api/v1/post/jobs`;

const postTutorRequest = async (formData, userId) => {
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    console.error('No auth token found');
    return {
      status: 401,
      error: 'No auth token',
      message: 'Authentication required'
    };
  }
  
  const requestBody = {
    userId: userId, 
    location: formData.location,
    phone: `${formData.countryCode}${formData.phone}`,
    jobRequirements: formData.requirements,
    subjects: formData.subjects,
    level: formData.level,
    jobNature: formData.partTime,
    meetingOptions: formData.meetingOption.join(', '), 
    budget: parseFloat(formData.budget),
    frequency: formData.rate === 'Per Hour' ? 'Hourly' : 
              formData.rate === 'Per Week' ? 'Weekly' :
              formData.rate === 'Per Month' ? 'Monthly' : 'Fixed',
    numberOfTutors: formData.tutorCount === 'Only One' ? 1 : 
                  formData.tutorCount === 'Two' ? 2 : 3,
    jobType: formData.iWant, // Use the form field value
    language: formData.languages,
    jobCategory: formData.jobCategory
  };

  console.log('Request body:', requestBody); // Add logging for debugging
  console.log('API URL:', API_URL); // Log the API URL

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return {
        status: response.status,
        error: 'HTTP error',
        message: `HTTP ${response.status}: ${response.statusText}`,
        body: errorText
      };
    }

    const result = await response.json();
    
    console.log('Response body:', result); // Add logging for debugging
    
    // Always return the full response, regardless of status code
    return {
      status: response.status,
      headers: result.headers,
      body: result.body,
      ok: response.ok
    };

  } catch (error) {
    console.error('Network error during the fetch request:', error);
    return {
      status: 0,
      error: 'Network error',
      message: error.message
    };
  }
};

export default postTutorRequest;