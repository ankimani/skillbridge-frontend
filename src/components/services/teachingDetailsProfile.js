// Add this to your services/teacherProfile.js file (or create it if it doesn't exist)
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
export const fetchTeachingDetails = async (userId, token) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/teaching/details/teacher/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Return null when no details exist
      }
      throw new Error('Failed to fetch teaching details');
    }
    
    const data = await response.json();
    return data.body.data; // Return the array of experience items
  };

  export const updateTeachingDetails = async (id, userId, teachingDetail, token) => {
    console.log("teachingDetail",teachingDetail)
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/teaching/details/${id}?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rate: teachingDetail.rate,
        maxFee: Number(teachingDetail.maxFee),
        minFee: Number(teachingDetail.minFee),
        paymentDetails: teachingDetail.paymentDetails || "",
        totalExpYears: Number(teachingDetail.totalExpYears),
        onlineExpYears: Number(teachingDetail.onlineExpYears),
        travelWillingness: Boolean(teachingDetail.travelWillingness),
        travelDistance: Number(teachingDetail.travelDistance || 0),
        onlineAvailability: Boolean(teachingDetail.onlineAvailability),
        homeAvailability: Boolean(teachingDetail.homeAvailability),
        homeworkHelp: Boolean(teachingDetail.homeworkHelp),
        currentlyEmployed: Boolean(teachingDetail.currentlyEmployed),
        workPreference: teachingDetail.workPreference || "",
    
      })
    });
  console.log("response ",response)
    if (!response.ok) {
      throw new Error('Failed to update teaching details');
    }
    
    const data = await response.json();
    console.log("data ",data)
  
    return data.body.data;
  };