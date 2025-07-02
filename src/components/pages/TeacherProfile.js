import React, { useState, useEffect } from "react";
import Footer from '../shared/Footer';
import CustomHeader from './CustomHeader';
import { fetchTeacherProfile, updateTeacherProfile } from '../services/teacherProfile';
import { fetchUserProfile } from '../services/authProfile';
import {fetchTeacherEducation,updateTeacherEducation,createTeacherEducation}from '../services/teacherEducationProfile'
import { fetchTeacherExperience,updateTeacherExperience, createTeacherExperience} from "../services/teacherExperienceProfile";
import { fetchTeachingDetails,updateTeachingDetails} from "../services/teachingDetailsProfile";
import { fetchSubjectExperience } from "../services/teacherSubjectsProfile";

// Modal Components


const ProfileEditModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Birthdate</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Description</label>
              <textarea
                name="profileDescription"
                value={formData.profileDescription}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  const EducationEditModal = ({ education, onClose, onSave }) => {
    const [formData, setFormData] = useState(education);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Education</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree Type</label>
                <select
                  name="degreeType"
                  value={formData.degreeType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="PhD">Doctorate/PHD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Higher Secondary">Higher Secondary</option>
                  <option value="Junior Secondary">Junior Secondary</option>
                  <option value="Advanced Diploma">Advanced Diploma</option>
                  <option value="Post Graduation">Post Graduation</option>
                  <option value="Certification">Certification</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree Name</label>
                <input
                  type="text"
                  name="degreeName"
                  value={formData.degreeName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Score (GPA)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  name="score"
                  value={formData.score}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(formData)}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const ExperienceEditModal = ({ experience, onClose, onSave,currentExperienceIndex  }) => {
    const [formData, setFormData] = useState({
      organizationName: experience.organizationName || "",
      organizationUrl: experience.organizationUrl || "",
      designation: experience.designation || "",
      startDate: experience.startDate || "",
      endDate: experience.currentJob ? "" : (experience.endDate || ""),
      association: experience.association || "Full-time",
      jobDescription: experience.jobDescription || "",
      skills: experience.skills ? [...experience.skills] : [],
      currentJob: experience.currentJob || false
    });
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      if (name === 'currentJob') {
        setFormData(prev => ({ 
          ...prev, 
          [name]: checked,
          endDate: checked ? "" : prev.endDate // Clear endDate when currentJob is checked
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [name]: type === 'checkbox' ? checked : value 
        }));
      }
    };
  
    const handleSkillsChange = (e, index) => {
      const newSkills = [...formData.skills];
      newSkills[index] = e.target.value;
      setFormData(prev => ({ ...prev, skills: newSkills }));
    };
  
    const addSkill = () => {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    };
  
    const removeSkill = (index) => {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, skills: newSkills }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentExperienceIndex !== null ? "Edit Experience" : "Add New Experience"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization Name*</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation*</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    required
                  />
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date*</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm ${
                        formData.currentJob ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={formData.currentJob}
                      required={!formData.currentJob}
                    />
                  </div>
                </div>
  
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="currentJob"
                    checked={formData.currentJob}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    id="currentJobCheckbox"
                  />
                  <label htmlFor="currentJobCheckbox" className="ml-2 block text-sm text-gray-700">
                    This is my current job
                  </label>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                    placeholder="Describe your responsibilities and achievements"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillsChange(e, index)}
                          className="flex-grow border border-gray-300 rounded-md p-2 text-sm"
                          placeholder="Enter a skill"
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          aria-label="Remove skill"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              </div>
  
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentExperienceIndex !== null ? "Update Experience" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  const TeachingDetailsEditModal = ({ details, onClose, onSave }) => {
    const [formData, setFormData] = useState(details);
  console.log("data to update",formData)
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Edit Teaching Details</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Fee ($)</label>
                  <input
                    type="number"
                    name="minFee"
                    value={formData.minFee}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        [e.target.name]: value === "" ? "" : Number(value)
                      }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Fee ($)</label>
                  <input
                    type="number"
                    name="maxFee"
                    value={formData.maxFee}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rate Type</label>
                <select
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Experience (Years)</label>
                  <input
                    type="number"
                    name="totalExpYears"
                    value={formData.totalExpYears}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Online Experience (Years)</label>
                  <input
                    type="number"
                    name="onlineExpYears"
                    value={formData.onlineExpYears}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="travelWillingness"
                  checked={formData.travelWillingness}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Willing to travel</label>
              </div>
              {formData.travelWillingness && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Distance (KM)</label>
                  <input
                    type="number"
                    name="travelDistance"
                    value={formData.travelDistance}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Availability</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="onlineAvailability"
                    checked={formData.onlineAvailability}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-700">Online</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="homeAvailability"
                    checked={formData.homeAvailability}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-700">Home</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="homeworkHelp"
                    checked={formData.homeworkHelp}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs text-gray-700">Homework Help</label>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="currentlyEmployed"
                  checked={formData.currentlyEmployed}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Currently Employed</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Preference</label>
                <select
                  name="workPreference"
                  value={formData.workPreference}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
             { /* Add this new Payment Details field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Details</label>
              <textarea
                name="paymentDetails"
                value={formData.paymentDetails || ''}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter your payment details (e.g., bank account, PayPal, etc.)"
              />
            </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(formData)}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default function TeacherProfile() {
  const [userProfile, setUserProfile] = useState({
    userId: '',
    displayName: '',
    gender: '',
    birthdate: '',
    location: '',
    postalCode: '',
    phoneNumber: '',
    profileDescription: '',
    imagePath: '',
  });

  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [teachingDetails, setTeachingDetails] = useState({
    teacherId: '',
    rate: "hourly",
    maxFee: 0,
    minFee: 0,
    paymentDetails: "",
    totalExpYears: 0,
    onlineExpYears: 0,
    travelWillingness: false,
    travelDistance: 0,
    onlineAvailability: false,
    homeAvailability: false,
    homeworkHelp: false,
    currentlyEmployed: false,
    workPreference: "",
  });
  const [subjects, setSubjects] = useState([]);
  // Modal states (keep these the same)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showTeachingModal, setShowTeachingModal] = useState(false);
  const [currentEducationIndex, setCurrentEducationIndex] = useState(null);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(null);

  // Add loading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // First get the userId from auth profile
        const authProfile = await fetchUserProfile(token);
        const userId = authProfile.userId;
        
        // Fetch all data in parallel with proper error handling
        const [
          teacherProfile, 
          educationData, 
          experienceData, 
          teachingDetailsData, 
          subjectData
        ] = await Promise.all([
          fetchTeacherProfile(userId, token),
          fetchTeacherEducation(userId, token).catch(() => []),
          fetchTeacherExperience(userId, token).catch(() => []),
          fetchTeachingDetails(userId, token).catch(() => null), // Returns null if no details exist
          fetchSubjectExperience(userId, token).catch(() => ({ subjects: [] }))
        ]);
    
        // Update state with the fetched data
        setUserProfile({
          userId: teacherProfile.userId,
          displayName: teacherProfile.displayName || '',
          gender: teacherProfile.gender || '',
          birthdate: teacherProfile.birthdate || '',
          location: teacherProfile.location || '',
          postalCode: teacherProfile.postalCode || '',
          phoneNumber: teacherProfile.phoneNumber || '',
          profileDescription: teacherProfile.profileDescription || '',
          imagePath: teacherProfile.imagePath || '',
        });
    
        // Set education list
        setEducationList(
          (educationData || []).map(edu => ({
            educationId: edu.educationId,
            institutionName: edu.institutionName || '',
            degreeType: edu.degreeType || 'Bachelor',
            degreeName: edu.degreeName || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            association: edu.association || "Full-time",
            specialization: edu.specialization || '',
            score: edu.score || 0
          }))
        );
    
        // Set experience list
        setExperienceList(
          (experienceData || []).map(exp => ({
            experienceId: exp.experienceId,
            organizationName: exp.organizationName || '',
            organizationUrl: exp.organizationUrl || "#",
            designation: exp.designation || '',
            jobDescription: exp.jobDescription || "No description provided",
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            association: exp.association || "Full-time",
            skills: exp.skills || [],
            currentJob: exp.currentJob || false
          }))
        );
    
        // Set subjects
        setSubjects(subjectData.subjects || []);
    
        // Set teaching details only if they exist
        if (teachingDetailsData) {
          setTeachingDetails({
            teacherId: teachingDetailsData.teacherId,
            rate: teachingDetailsData.rate || "hourly",
            maxFee: teachingDetailsData.maxFee || 0,
            minFee: teachingDetailsData.minFee || 0,
            paymentDetails: teachingDetailsData.paymentDetails || "",
            totalExpYears: teachingDetailsData.totalExpYears || 0,
            onlineExpYears: teachingDetailsData.onlineExpYears || 0,
            travelWillingness: teachingDetailsData.travelWillingness || false,
            travelDistance: teachingDetailsData.travelDistance || 0,
            onlineAvailability: teachingDetailsData.onlineAvailability || false,
            homeAvailability: teachingDetailsData.homeAvailability || false,
            homeworkHelp: teachingDetailsData.homeworkHelp || false,
            currentlyEmployed: teachingDetailsData.currentlyEmployed || false,
            workPreference: teachingDetailsData.workPreference || "",
          });
        } else {
          // Keep default empty state if no teaching details exist
          setTeachingDetails({
            teacherId: '',
            rate: "hourly",
            maxFee: 0,
            minFee: 0,
            paymentDetails: "",
            totalExpYears: 0,
            onlineExpYears: 0,
            travelWillingness: false,
            travelDistance: 0,
            onlineAvailability: false,
            homeAvailability: false,
            homeworkHelp: false,
            currentlyEmployed: false,
            workPreference: "",
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Add loading and error states to the return
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-10">
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-10">
        </div>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>Error loading profile: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Keep all the modal handlers the same
  const openProfileModal = () => setShowProfileModal(true);
  const openEducationModal = (index = null) => {
    setCurrentEducationIndex(index);
    setShowEducationModal(true);
  };
  const openExperienceModal = (index = null) => {
    setCurrentExperienceIndex(index);
    setShowExperienceModal(true);
  };
  const openTeachingModal = () => setShowTeachingModal(true);

  const saveProfile = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // Call the update API
      const updatedProfile = await updateTeacherProfile(
        userProfile.userId, 
        {
          birthdate: data.birthdate,
          location: data.location,
          postalCode: data.postalCode,
          phoneNumber: data.phoneNumber,
          profileDescription: data.profileDescription,
        },
        token
      );

      setUserProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      setShowProfileModal(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  const saveEducation = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      if (currentEducationIndex !== null) {
        // Update existing education
        const educationToUpdate = educationList[currentEducationIndex];
        const updatedEducation = await updateTeacherEducation(
          educationToUpdate.educationId,
          userProfile.userId,
          {
            institutionName: data.institutionName,
            degreeType: data.degreeType,
            degreeName: data.degreeName,
            startDate: data.startDate,
            endDate: data.endDate,
            association: data.association,
            specialization: data.specialization,
            score: data.score
          },
          token
        );
  
        const updated = [...educationList];
        updated[currentEducationIndex] = updatedEducation;
        setEducationList(updated);
      } else {
        // Create new education
        const newEducation = await createTeacherEducation(
          userProfile.userId,
          {
            institutionName: data.institutionName,
            degreeType: data.degreeType,
            degreeName: data.degreeName,
            startDate: data.startDate,
            endDate: data.endDate,
            association: data.association,
            specialization: data.specialization,
            score: data.score
          },
          token
        );
  
        setEducationList([...educationList, newEducation]);
      }
      
      setShowEducationModal(false);
      setCurrentEducationIndex(null);
    } catch (error) {
      console.error("Error saving education:", error);
      setError(error.message || "Failed to save education. Please try again.");
    }
  };

  const saveExperience = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      if (currentExperienceIndex !== null) {
        // Update existing experience
        const experienceToUpdate = experienceList[currentExperienceIndex];
        const updatedExperience = await updateTeacherExperience(
          experienceToUpdate.experienceId,
          userProfile.userId,
          {
            organizationName: data.organizationName,
            designation: data.designation,
            association: data.association,
            startDate: data.startDate,
            endDate: data.currentJob ? null : data.endDate, // Clear endDate if currentJob is true
            jobDescription: data.jobDescription,
            currentJob: data.currentJob,
            organizationUrl: data.organizationUrl,
            skills: data.skills
          },
          token
        );
  
        const updated = [...experienceList];
        updated[currentExperienceIndex] = {
          ...updatedExperience,
          skills: data.skills,
          organizationUrl: data.organizationUrl
        };
        setExperienceList(updated);
      } else {
        // Create new experience
        const newExperience = await createTeacherExperience(
          userProfile.userId,
          {
            organizationName: data.organizationName,
            designation: data.designation,
            startDate: data.startDate,
            endDate: data.currentJob ? null : data.endDate, // Clear endDate if currentJob is true
            association: data.association,
            jobDescription: data.jobDescription,
            currentJob: data.currentJob,
            organizationUrl: data.organizationUrl,
            skills: data.skills
          },
          token
        );
  
        setExperienceList([...experienceList, newExperience]);
      }
      
      setShowExperienceModal(false);
      setCurrentExperienceIndex(null);
    } catch (error) {
      console.error("Error saving experience:", error);
      setError(error.message || "Failed to save experience. Please try again.");
    }
  };

  const saveTeachingDetails = async (data) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // Prepare the update data
      const updateData = {
        rate: data.rate,
        maxFee: Number(data.maxFee),
        minFee: Number(data.minFee),
        paymentDetails: data.paymentDetails || "",
        totalExpYears: Number(data.totalExpYears),
        onlineExpYears: Number(data.onlineExpYears),
        travelWillingness: data.travelWillingness,
        travelDistance: Number(data.travelDistance || 0),
        onlineAvailability: data.onlineAvailability,
        homeAvailability: data.homeAvailability,
        homeworkHelp: data.homeworkHelp,
        currentlyEmployed: data.currentlyEmployed,
        workPreference: data.workPreference,
      };
  
      // Get the teaching details ID (assuming it's stored in teachingDetails.teacherId)
      const teachingDetailsId = teachingDetails.teacherId;
  
      // Call update with all required parameters
      const updatedDetails = await updateTeachingDetails(
        teachingDetailsId,  // The ID of the teaching details record
        userProfile.userId, // The user ID as query parameter
        updateData,        // The data to update
        token              // Auth token
      );
  
      setTeachingDetails(updatedDetails);
      setShowTeachingModal(false);
    } catch (error) {
      console.error("Failed to update teaching details:", error);
      setError(error.message || "Failed to update teaching details. Please try again.");
    }
  };

  // The rest of your component remains the same
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <div className="sticky top-0 z-10">
      </div>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl mt-10 mb-10 relative">
          

               {/* Profile Header */}
<div className="mb-10 relative bg-white rounded-xl shadow-md p-6">
  <div className="flex flex-col md:flex-row gap-6">
    {/* Profile Image */}
    <div className="flex-shrink-0">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full overflow-hidden flex items-center justify-center shadow-inner">
        {userProfile.imagePath ? (
          <img
            src={userProfile.imagePath}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-4xl text-indigo-300 font-bold">
            {userProfile.displayName?.charAt(0) || '?'}
          </div>
        )}
      </div>
    </div>
    
    {/* Profile Details */}
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {userProfile.displayName}
          </h1>
          
          {/* Professional Title */}
          {userProfile.role && (
            <p className="text-lg text-indigo-600 font-medium mb-4">
              {userProfile.role}
            </p>
          )}
          
          {/* Location and Contact */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            {userProfile.location && (
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {userProfile.location}
              </div>
            )}
            {userProfile.phoneNumber && (
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {userProfile.phoneNumber}
              </div>
            )}
          </div>
          
          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Personal Details</h3>
              <div className="space-y-2">
                <Detail label="Gender">
                  {userProfile.gender ? (
                    <span className="capitalize">{userProfile.gender}</span>
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </Detail>
                <Detail label="Birthdate">
                  {userProfile.birthdate ? (
                    new Date(userProfile.birthdate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  ) : (
                    <span className="text-gray-400">Not specified</span>
                  )}
                </Detail>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</h3>
              <div className="space-y-2">
                <Detail label="Postal Code">
                  {userProfile.postalCode || <span className="text-gray-400">Not specified</span>}
                </Detail>
                {userProfile.companyName && (
                  <Detail label="Company">
                    {userProfile.companyName}
                  </Detail>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Button */}
        <button 
          onClick={openProfileModal}
          className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
          aria-label="Edit profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

{/* About Me */}
<Section title="About Me">
  <div className="relative bg-white rounded-xl shadow-sm p-6">
    <p className="text-gray-700 leading-relaxed">
      {userProfile.profileDescription || (
        <span className="text-gray-400 italic">No description provided</span>
      )}
    </p>
    <button 
      onClick={openProfileModal}
      className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50"
      aria-label="Edit profile description"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  </div>
</Section>

        {/* Education */}
        <Section title="Education">
  {educationList.length > 0 ? (
    <div className="space-y-6">
      {educationList.map((education, index) => (
        <div
          key={education.educationId || index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Institution Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              
              {/* Education Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {education.degreeName}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-2">
                      {education.institutionName}
                    </p>
                  </div>
                  <button 
                    onClick={() => openEducationModal(index)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50 ml-2"
                    aria-label="Edit education"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>

                {/* Degree Badge */}
                <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  {education.degreeType}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    {education.specialization && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Specialization:</span>
                        <p className="text-gray-700">{education.specialization}</p>
                      </div>
                    )}
                    {education.association && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Study Mode:</span>
                        <p className="text-gray-700">{education.association}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration:</span>
                      <p className="text-gray-700">
                        {new Date(education.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                        {new Date(education.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    {education.score && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">GPA:</span>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-2">{education.score}</span>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${(education.score / 4) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-700">No education added</h3>
      <p className="mt-1 text-gray-500">Add your educational background to showcase your qualifications.</p>
      <div className="mt-6">
        <button
          onClick={() => openEducationModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Education
        </button>
      </div>
    </div>
  )}

  {educationList.length > 0 && (
    <div className="mt-6 text-center">
      <button
        onClick={() => openEducationModal()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Another Education
      </button>
    </div>
  )}
</Section>

  {/* Experience */}
  <Section title="Professional Experience">
  {experienceList?.length > 0 ? (
    <div className="space-y-6">
      {experienceList.map((experience, index) => (
        <div
          key={experience.experienceId || index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Company Logo/Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Experience Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {experience.designation}
                    </h3>
                    
                    <div className="flex items-center mt-1">
                      <a 
                        href={experience.organizationUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        {experience.organizationName}
                        {experience.organizationUrl && (
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </a>
                      {experience.association && (
                        <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                          {experience.association}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                      {experience.currentJob ? (
                        <span className="text-green-600 font-medium">Present</span>
                      ) : (
                        new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => openExperienceModal(index)}
                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50 opacity-0 group-hover:opacity-100"
                    aria-label="Edit experience"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>

                {/* Responsibilities */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                  <ul className="space-y-3">
                    {experience.jobDescription.split("\n").filter(Boolean).map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 bg-blue-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                {experience.skills?.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Skills Applied</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-700">No professional experience added</h3>
      <p className="mt-1 text-gray-500">Showcase your work history to highlight your expertise</p>
      <div className="mt-6">
        <button
          onClick={() => openExperienceModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Experience
        </button>
      </div>
    </div>
  )}

  {experienceList?.length > 0 && (
    <div className="mt-6 text-center">
      <button
        onClick={() => openExperienceModal()}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
      >
        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Another Experience
      </button>
    </div>
  )}
</Section>
 {/* NEW SKILLS SECTION */}
 <Section title="Your Proffesional Skills">
            {subjects.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-wrap gap-3">
                  {subjects.map((subject, index) => (
                    <span 
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-700">No subjects added</h3>
                <p className="mt-1 text-gray-500">Add the subjects you're qualified to teach</p>
              </div>
            )}
    </Section>
{/* Teaching Details */}
<Section title="Professional Preferences">
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Professional Preferences and Rates</h3>
          <p className="text-gray-500 text-sm mt-1">Customize your teaching details to match your style</p>
        </div>
        <button 
          onClick={openTeachingModal}
          className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50"
          aria-label="Edit teaching details"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Rate Card */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-purple-800">Rate</h4>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${teachingDetails?.minFee ?? 0} - ${teachingDetails?.maxFee ?? 0}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({teachingDetails?.rate ?? 'hourly'})
            </span>
          </p>
        </div>

        {/* Experience Card */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h4 className="font-medium text-blue-800">Experience</h4>
          </div>
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-semibold">{teachingDetails?.totalExpYears ?? 0}</span> years total experience
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">{teachingDetails?.onlineExpYears ?? 0}</span> years online teaching
            </p>
          </div>
        </div>

        {/* Availability Card */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-green-800">Availability</h4>
          </div>
          <div className="space-y-2">
            {teachingDetails?.onlineAvailability ? (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Online Sessions</span>
              </div>
            ) : null}
            {teachingDetails?.homeAvailability ? (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">In-Home Tutoring</span>
              </div>
            ) : null}
            {teachingDetails?.homeworkHelp ? (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-700">Homework Help</span>
              </div>
            ) : null}
            {!teachingDetails?.onlineAvailability && 
             !teachingDetails?.homeAvailability && 
             !teachingDetails?.homeworkHelp && (
              <p className="text-gray-500 text-sm">No availability specified</p>
            )}
          </div>
        </div>

        {/* Travel Card */}
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="font-medium text-orange-800">Travel Preferences</h4>
          </div>
          <div className="space-y-1">
            <p className="text-gray-700">
              {teachingDetails?.travelWillingness ? (
                <>
                  <span className="font-semibold text-green-600">Willing to travel</span>
                  {teachingDetails?.travelDistance > 0 && (
                    <span> (up to {teachingDetails.travelDistance} km)</span>
                  )}
                </>
              ) : (
                <span className="text-gray-500">Not willing to travel</span>
              )}
            </p>
          </div>
        </div>

        {/* Employment Card */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h4 className="font-medium text-indigo-800">Current Employment</h4>
          </div>
          <p className="text-gray-700">
            {teachingDetails?.currentlyEmployed ? (
              <span className="font-semibold text-green-600">Currently Employed</span>
            ) : (
              <span className="text-gray-500">Not Currently Employed</span>
            )}
          </p>
        </div>

        {/* Work Preference Card */}
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h4 className="font-medium text-pink-800">Work Preference</h4>
          </div>
          <p className="text-gray-700 font-semibold">
            {teachingDetails?.workPreference || "Not specified"}
          </p>
        </div>

        {/* Payment Details Card - Full width if needed */}
        {teachingDetails?.paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-1 md:col-span-3">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="font-medium text-gray-800">Payment Details</h4>
            </div>
            <p className="text-gray-700">
              {teachingDetails.paymentDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</Section>
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <Footer />

      {/* Modals */}
      {showProfileModal && (
        <ProfileEditModal
          profile={userProfile}
          onClose={() => setShowProfileModal(false)}
          onSave={saveProfile}
        />
      )}

      {showEducationModal && (
        <EducationEditModal
          education={currentEducationIndex !== null ? educationList[currentEducationIndex] : {
            institutionName: "",
            degreeType: "Bachelor",
            degreeName: "",
            startDate: "",
            endDate: "",
            association: "Full-time",
            specialization: "",
            score: 0,
          }}
          onClose={() => setShowEducationModal(false)}
          onSave={saveEducation}
        />
      )}

      {showExperienceModal && (
       <ExperienceEditModal
       experience={currentExperienceIndex !== null ? experienceList[currentExperienceIndex] : {
         organizationName: "",
         organizationUrl: "",
         designation: "",
         startDate: "",
         endDate: "",
         association: "Full-time",
         jobDescription: "",
         skills: [],
         currentJob: false,
       }}
       onClose={() => setShowExperienceModal(false)}
       onSave={saveExperience}
       currentExperienceIndex={currentExperienceIndex}  // Add this prop
     />
      )}

      {showTeachingModal && (
        <TeachingDetailsEditModal
          details={teachingDetails}
          onClose={() => setShowTeachingModal(false)}
          onSave={saveTeachingDetails}
        />
      )}
    </div>
  );
}

// Reusable Section Component
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-blue-600">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// Reusable Detail Row
function Detail({ label, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p>{children}</p>
    </div>
  );
}