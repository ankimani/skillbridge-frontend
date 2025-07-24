// Add this to your services/teacherProfile.js file (or create it if it doesn't exist)
import { getTeacherDetailsByUserId } from './displayTeacherId';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8089';
export const fetchTeacherExperience = async (userId, token) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/experiences/teacher/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch experience data');
    }
    
    const data = await response.json();
    return data.body.data; // Return the array of experience items
  };
  export const updateTeacherExperience = async (experienceId, userId, experienceData, token) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/experiences/${experienceId}?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        organizationName: experienceData.organizationName,
        designation: experienceData.designation,
        association: experienceData.association,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        jobDescription: experienceData.jobDescription,
        currentJob: experienceData.currentJob,
        
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to update experience data');
    }
  
    const data = await response.json();
    return data.body.data;
  };
  export const createTeacherExperience = async (userId, experienceData, token) => {
    // First get teacherId from user profile
    const teacherDetails = await getTeacherDetailsByUserId(userId);
    
    if (!teacherDetails.success) {
      throw new Error(teacherDetails.error || 'Failed to get teacher details');
    }
  
    const teacherId = teacherDetails.teacher.teacherId;
  
    const response = await fetch(`${BACKEND_BASE_URL}/api/v1/experiences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        teacherId: teacherId,
        organizationName: experienceData.organizationName,
        designation: experienceData.designation,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        association: experienceData.association,
        jobDescription: experienceData.jobDescription,
        currentJob: experienceData.currentJob
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to create education record');
    }
  
    const data = await response.json();
    return data.body.data;
  };