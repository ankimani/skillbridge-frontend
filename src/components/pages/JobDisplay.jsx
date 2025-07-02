import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaCoins, FaArrowLeft, FaArrowRight, FaUsers, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { getJobApplicantCount } from '../services/jobApplicantCount';
import CustomHeader from './CustomHeader';
import SidebarFilters from './SidebarFilters';
import Footer from '../shared/Footer';
import Search from './SearchForm';

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

  useEffect(() => {
    let isMounted = true;
    
    const fetchJobs = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
        let url = `${BACKEND_BASE_URL}/api/v1/jobs`;
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
          
          // Initialize loading states for counts
          const loadingStates = {};
          const counts = {};
          
          data.body.data.jobs.forEach(job => {
            loadingStates[job.jobId] = true;
            counts[job.jobId] = 0; // Initialize with 0
          });
          
          setCountsLoading(loadingStates);
          setApplicantCounts(counts);

          // Fetch applicant counts for each job
          const token = localStorage.getItem('authToken');
          
          // Don't await here to avoid blocking the UI
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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getFormattedDate = (createdAt) => {
    try {
      if (createdAt instanceof Date || typeof createdAt === 'number') {
        const date = new Date(createdAt);
        return formatDistanceToNow(date, { addSuffix: true });
      }
      
      if (typeof createdAt === 'string') {
        if (createdAt.includes('T') || createdAt.includes('-')) {
          const date = parseISO(createdAt);
          return formatDistanceToNow(date, { addSuffix: true });
        }
        
        const date = new Date(createdAt);
        if (!isNaN(date.getTime())) {
          return formatDistanceToNow(date, { addSuffix: true });
        }
      }
      
      return 'some time ago';
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'some time ago';
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
                        "Be the first one to apply"
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