import { getTeacherDetailsByUserId } from "./displayTeacherId";
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
export const fetchTeacherEducation = async (userId, token) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/v1/teachers/education/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch education data');
  }
  
  const data = await response.json();
  return data.body.data;
};

export const updateTeacherEducation = async (educationId, userId, educationData, token) => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/v1/teachers/education/${educationId}?userId=${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      institutionName: educationData.institutionName,
      degreeType: educationData.degreeType,
      degreeName: educationData.degreeName,
      startDate: educationData.startDate,
      endDate: educationData.endDate,
      association: educationData.association,
      specialization: educationData.specialization,
      score: educationData.score
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update education data');
  }

  const data = await response.json();
  return data.body.data;
};

export const createTeacherEducation = async (userId, educationData, token) => {
  // First get teacherId from user profile
  const teacherDetails = await getTeacherDetailsByUserId(userId);
  
  if (!teacherDetails.success) {
    throw new Error(teacherDetails.error || 'Failed to get teacher details');
  }

  const teacherId = teacherDetails.teacher.teacherId;

  const response = await fetch(`${BACKEND_BASE_URL}/api/v1/teachers/education`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: userId,
      teacherId: teacherId,
      institutionName: educationData.institutionName,
      degreeType: educationData.degreeType,
      degreeName: educationData.degreeName,
      startDate: educationData.startDate,
      endDate: educationData.endDate,
      association: educationData.association,
      specialization: educationData.specialization,
      score: educationData.score
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create education record');
  }

  const data = await response.json();
  return data.body.data;
};
