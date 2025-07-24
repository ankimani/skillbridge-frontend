import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaCoins, FaArrowLeft, FaArrowRight, FaUsers, FaCheckCircle } from 'react-icons/fa';
import { differenceInHours } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getJobApplicantCount } from '../services/jobApplicantCount';
import { fetchUserProfile } from '../services/authProfile';
import SidebarFilters from './SidebarFilters';
import Footer from '../shared/Footer';
import Search from './SearchForm';
import ProfileIncomplete from './ProfileIncomplete';

const JobDisplay = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    jobCategory: null,
    meetingOptions: [],
    dateFilter: null,
    jobStatus: null,
    startDate: null,
    endDate: null,
  });
  const [keyword, setKeyword] = useState('');
  const [applicantCounts, setApplicantCounts] = useState({});
  const [countsLoading, setCountsLoading] = useState({});
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  const tutorRoutes = {
    PROFILE: '/profileform',
    EDUCATION: '/education',
    EXPERIENCE: '/experience',
    SUBJECTS: '/subjects',
    DETAILS: '/details',
    COMPLETE: '/jobs'
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const profile = await fetchUserProfile(token);
          if (isMounted) {
            setUserProfile(profile);
          }
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        if (isMounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchUserData();

    const fetchJobs = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || 'http://localhost:8089';
        const url = `${BACKEND_BASE_URL}/api/v1/jobs`;
        const queryParams = new URLSearchParams({
          page: currentPage,
          size: pageSize,
          ...(filters.jobCategory && { jobCategory: filters.jobCategory }),
          ...(filters.jobStatus && { jobStatus: filters.jobStatus }),
          ...(filters.dateFilter && { dateFilter: filters.dateFilter }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(Array.isArray(filters.meetingOptions) && filters.meetingOptions.length > 0 && { meetingOptions: filters.meetingOptions.join(',') }),
          ...(keyword && { keyword }),
        });

        const response = await fetch(`${url}?${queryParams.toString()}`);
        const data = await response.json();

        if (!isMounted) return;

        if (data.headers.responseCode === 404) {
          setError(data.headers.customerMessage);
          setJobs([]);
          setTotalPages(0);
        } else {
          setJobs(data.body.data.jobs);
          setTotalPages(data.body.data.totalPages);
          
          const loadingStates = {};
          const counts = {};
          
          data.body.data.jobs.forEach(job => {
            loadingStates[job.jobId] = true;
            counts[job.jobId] = 0;
          });
          
          setCountsLoading(loadingStates);
          setApplicantCounts(counts);

          const token = localStorage.getItem('authToken');
          
          data.body.data.jobs.forEach(async (job) => {
            try {
              const count = await getJobApplicantCount(job.jobId, token);
              if (isMounted) {
                setApplicantCounts(prev => ({...prev, [job.jobId]: count}));
                setCountsLoading(prev => ({...prev, [job.jobId]: false}));
              }
            } catch (err) {
              console.error(`Error fetching applicant count for job ${job.jobId}:`, err);
              if (isMounted) {
                setApplicantCounts(prev => ({...prev, [job.jobId]: 0}));
                setCountsLoading(prev => ({...prev, [job.jobId]: false}));
              }
            }
          });
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (isMounted) {
          setError('Error fetching job postings');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, filters, keyword]);

  const getFormattedDate = (createdAtArray) => {
    try {
      if (!createdAtArray || !Array.isArray(createdAtArray)) {
        return 'some time ago';
      }

      // Array format: [year, month, day, hour, minute, second, nanosecond]
      const date = new Date(
        createdAtArray[0],                     // year
        createdAtArray[1] - 1,                // month (0-11)
        createdAtArray[2],                    // day
        createdAtArray[3],                    // hours
        createdAtArray[4],                    // minutes
        createdAtArray[5],                    // seconds
        Math.floor(createdAtArray[6] / 1000000) // convert nanoseconds to milliseconds
      );

      const now = new Date();
      const hours = differenceInHours(now, date);
      
      if (hours < 1) return 'now';
      if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      
      const months = Math.floor(days / 30);
      if (months < 6) return `${months} ${months === 1 ? 'month' : 'months'} ago`;
      
      return 'over 6 months ago';
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'some time ago';
    }
  };

  const handleCompleteProfile = () => {
    if (userProfile?.roleName === 'ROLE_TUTOR' && userProfile?.stepName) {
      navigate(tutorRoutes[userProfile.stepName] || '/profileform');
    } else {
      navigate('/profileform');
    }
  };

  const handleCancel = () => {
    navigate('/jobs');
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getTitle = (job) => {
    if (job.meetingOptions === 'Travel to tutor' || job.meetingOptions === 'At my place') {
      return `Home ${job.subjects} Professional(s) needed in ${job.location}`;
    }
    if (job.meetingOptions === 'Online') {
      return `Online ${job.subjects} Professional(s) needed in ${job.location}`;
    }
    return `${job.subjects} in ${job.location}`;
  };

  if (!profileLoading && userProfile && userProfile.roleName === 'ROLE_TUTOR' && userProfile.stepName !== 'COMPLETE') {
    return (
      <ProfileIncomplete 
        onComplete={handleCompleteProfile}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Search setKeyword={setKeyword} />
      <div className="flex flex-col md:flex-row flex-1 px-4 md:px-10 py-6 gap-6">
        <aside className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow p-4 sticky top-4">
            <SidebarFilters setFilters={setFilters} />
          </div>
        </aside>

        <main className="w-full md:w-3/4">
          {initialLoad ? (
            <div className="p-6 text-center text-gray-500">Loading jobs...</div>
          ) : error && jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-red-600 text-lg">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {jobs.map((job) => (
                <div key={job.jobId} className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.01]">
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                    <Link to={`/jobinfo/${job.jobId}`} className="hover:underline">
                      {getTitle(job)}
                    </Link>
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="bg-gray-200 text-sm px-3 py-1 rounded-full">{job.subjects}</span>
                    <span className="flex items-center text-sm text-gray-600">
                      <FaRegClock className="mr-1" /> {getFormattedDate(job.createdAt)}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-1" /> {job.location}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{job.jobRequirements}</p>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <FaCoins className="mr-1 text-yellow-500" />
                      {job.coins} coins to apply
                    </div>
                    <div>
                      <strong>Budget:</strong> ${job.budget} {job.frequency}
                    </div>
                  </div>

                  <div className="flex justify-start gap-4 mt-6">
                    <button className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200">
                      <FaUsers />
                      {countsLoading[job.jobId] ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : applicantCounts[job.jobId] === 0 ? (
                        'Be the first one to apply'
                      ) : (
                        `${applicantCounts[job.jobId]} ${applicantCounts[job.jobId] === 1 ? 'person has' : 'people have'} applied`
                      )}
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      job.jobStatus === 'Open' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-red-200'
                    }`}>
                      <FaCheckCircle /> 
                      {job.jobStatus === 'Open' ? 'Open for application' : 'No longer accepting applications'}
                    </button>
                  </div>
                </div>
              ))}

              {jobs.length > 0 && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 disabled:opacity-50"
                  >
                    <FaArrowLeft />
                  </button>
                  <span className="px-6 py-2 text-gray-700 bg-white border-y">{`Page ${currentPage} of ${totalPages}`}</span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:opacity-50"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default JobDisplay;