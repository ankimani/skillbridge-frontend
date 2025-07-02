import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import ValidateSubject from "../services/ValidateSubject";
import { saveSubjectDetails } from "../services/subjectService";
import { fetchUserProfile } from "../services/authProfile";
import { getTeacherDetailsByUserId } from "../services/displayTeacherId";
import { useNavigate } from "react-router-dom";

const TeachersSubject = () => {
  const [formData, setFormData] = useState({
    userId: null,
    teacherId: null,
    selectedSubjects: []
  });
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Load user profile and teacher ID
  useEffect(() => {
    const loadUserProfileAndTeacherId = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const profile = await fetchUserProfile(token);
        const userId = profile.userId;

        setFormData((prevData) => ({
          ...prevData,
          userId: userId,
        }));

        const teacherResponse = await getTeacherDetailsByUserId(userId);

        if (teacherResponse.success) {
          setFormData((prevData) => ({
            ...prevData,
            teacherId: teacherResponse.teacher.teacherId,
          }));
        } else {
          setMessage({
            type: "error",
            text: teacherResponse.error || "Failed to load teacher details.",
          });
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to load user profile or teacher details.",
        });
      }
    };

    loadUserProfileAndTeacherId();
  }, []);

  // Load subject options
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8089/api/v1/subjects/all");
        const data = await response.json();
        const options = data.body.data.map(subject => ({
          value: subject.subjectId,
          label: subject.subjectName,
        }));
        setSubjectOptions(options);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setMessage({
          type: "error",
          text: "Failed to load subject options. Please try again later.",
        });
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedSubjects: selectedOptions || [],
    }));
    if (errors.selectedSubjects) {
      const { selectedSubjects, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = ValidateSubject({ selectedSubjects: formData.selectedSubjects });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit one subject at a time
      for (const subject of formData.selectedSubjects) {
        const updatedFormData = {
          teacherId: formData.teacherId,
          userId: formData.userId,
          subjectId: subject.value,
        };

        const response = await saveSubjectDetails(updatedFormData);

        if (!response.success) {
          if (response.error?.includes("The number of subjects cannot exceed")) {
            setMessage({ type: "error", text: response.error });
            setTimeout(() => {
              navigate("/details");
            }, 3000);
            setIsSubmitting(false);
            return;
          } else {
            setMessage({
              type: "error",
              text: response.error || "Failed to save subject details",
            });
            setIsSubmitting(false);
            return;
          }
        }
      }

      setMessage({
        type: "success",
        text: "Subjects saved successfully",
      });

      // Reset selected subjects
      setFormData((prevData) => ({
        ...prevData,
        selectedSubjects: [],
      }));
    } catch (error) {
      console.error("Error saving subject details:", error);
      setMessage({
        type: "error",
        text: "An error occurred while saving subjects",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '50px',
      borderColor: errors.selectedSubjects ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused && !errors.selectedSubjects ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: errors.selectedSubjects ? '#ef4444' : '#9ca3af'
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#1e40af',
      fontWeight: '500',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#1e40af',
      ':hover': {
        backgroundColor: '#93c5fd',
        color: '#1e3a8a',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700">
            <h2 className="text-2xl font-bold text-white">Teaching Expertise</h2>
            <p className="mt-1 text-sm text-blue-100">Select the subjects you're qualified to teach</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  message.type === "error" 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="subjects" className="block text-sm font-medium text-gray-700 mb-2">
                Subjects <span className="text-red-500">*</span>
              </label>
              <Select
                id="subjects"
                name="subjects"
                options={subjectOptions}
                isMulti
                value={formData.selectedSubjects}
                onChange={handleChange}
                placeholder="Search and select subjects..."
                className="basic-multi-select"
                classNamePrefix="select"
                styles={customStyles}
                noOptionsMessage={() => "No subjects found"}
              />
              {errors.selectedSubjects && (
                <p className="mt-2 text-sm text-red-600">{errors.selectedSubjects}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Select all subjects you're qualified to teach. You can search by subject name.
              </p>
            </div>

            <div className="mt-8 flex justify-between border-t pt-6">
              <button
                type="submit"
                disabled={isSubmitting || formData.selectedSubjects.length === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save and Continue'}
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeachersSubject;