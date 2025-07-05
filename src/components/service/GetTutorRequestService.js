const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1`;

// Function to get a single tutor request by jobId
const getTutorRequestById = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Job fetched successfully:', result.body.data);
      return result.body.data;
    } else {
      console.error('Failed to fetch job:', result);
      return null;
    }
  } catch (error) {
    console.error('Error during the fetch request:', error);
    return null;
  }
};

export default getTutorRequestById;