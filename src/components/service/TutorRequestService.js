const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_URL = `${BACKEND_BASE_URL}/api/v1/post/jobs`;

const postTutorRequest = async (formData, userId) => {
  const token = localStorage.getItem("authToken");
  
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
    jobType: formData.iWant,
    language: formData.languages,
    jobCategory: formData.jobCategory
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    
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