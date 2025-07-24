import React, { useState, useEffect } from 'react';
import { getChatList } from '../services/chatService';
import { getJobById } from '../services/myRequirements';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUsernameById } from '../services/authProfile';
import { FiMessageSquare, FiCheck, FiClock, FiInfo } from 'react-icons/fi';
import CustomHeader from '../pages/CustomHeader';

const Chats = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [jobDetails, setJobDetails] = useState({});
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  // Get first 10 words of a string
  const getFirstWords = (str, wordCount = 10) => {
    if (!str) return '';
    return str.split(/\s+/).slice(0, wordCount).join(' ') + 
      (str.split(/\s+/).length > wordCount ? '...' : '');
  };

  // Enhanced date formatting
  const formatDate = (dateArray) => {
    try {
      if (Array.isArray(dateArray)) {
        const date = new Date(
          dateArray[0],        // year
          dateArray[1] - 1,    // month (0-indexed)
          dateArray[2],        // day
          dateArray[3],        // hours
          dateArray[4],        // minutes
          dateArray[5],        // seconds
          dateArray[6] / 1000000 // nanoseconds to milliseconds
        );
        
        if (isNaN(date.getTime())) return 'Just now';
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date >= today) {
          return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } 
        else if (date >= yesterday) {
          return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } 
        
          return date.toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        
      }
      return 'Just now';
    } catch {
      return 'Just now';
    }
  };

  // Fetch job details
  const fetchJobDetails = async (jobId, token) => {
    try {
      const job = await getJobById(jobId, token);
      setJobDetails(prev => ({ ...prev, [jobId]: job }));
    } catch (error) {
      console.error(`Error fetching job details for job ${jobId}:`, error);
    }
  };

  // Fetch usernames
  const fetchUsernames = async (chatList, token) => {
    const usernamePromises = chatList.map(async (chat) => {
      if (!usernames[chat.recipientId]) {
        try {
          const username = await fetchUsernameById(chat.recipientId, token);
          return { recipientId: chat.recipientId, username };
        } catch (error) {
          console.error(`Error fetching username for user ${chat.recipientId}:`, error);
          return { recipientId: chat.recipientId, username: 'Unknown' };
        }
      }
      return null;
    });

    const newUsernames = await Promise.all(usernamePromises);
    const updatedUsernames = { ...usernames };
    
    newUsernames.forEach(item => {
      if (item) {
        updatedUsernames[item.recipientId] = item.username;
      }
    });

    setUsernames(updatedUsernames);
  };

  const handleChatClick = (jobId) => {
    navigate(`/job-chat/${jobId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const userProfile = await fetchUserProfile(token);
        if (!userProfile?.userId) {
          throw new Error('Failed to fetch user profile');
        }

        const chats = await getChatList(userProfile.userId, token);
        setChatList(chats);

        chats.forEach(chat => {
          fetchJobDetails(chat.jobId, token);
        });
        await fetchUsernames(chats, token);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const pollInterval = setInterval(fetchData, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const filteredChats = activeTab === 'unread' 
    ? chatList.filter(chat => chat.unreadCount > 0)
    : chatList;

  return (
    <div className="flex flex-col h-screen">
      
      <div className="max-w-2xl mx-auto p-4 flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-white sticky top-0 z-10 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiMessageSquare className="mr-2" /> Messages
            </h1>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white shadow-sm text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'unread' 
                    ? 'bg-white shadow-sm text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Unread
              </button>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto pb-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FiMessageSquare className="text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500 text-lg">
                {activeTab === 'unread' ? 'No unread messages' : 'No messages yet'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {activeTab === 'unread' ? 'All caught up!' : 'Start a conversation'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div 
                  key={chat.jobId}
                  onClick={() => handleChatClick(chat.jobId)}
                  className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${
                    chat.unreadCount > 0 ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">
                        {usernames[chat.recipientId]?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {usernames[chat.recipientId] || `User #${chat.recipientId}`}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatDate(chat.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {jobDetails[chat.jobId]?.jobRequirements 
                            ? getFirstWords(jobDetails[chat.jobId].jobRequirements) 
                            : `Job #${chat.jobId}`}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                      {jobDetails[chat.jobId]?.jobRequirements && (
                        <div className="mt-2 flex items-start text-xs text-gray-500">
                          <FiInfo className="flex-shrink-0 mt-0.5 mr-1" />
                          <span className="line-clamp-2">
                            {jobDetails[chat.jobId].jobRequirements}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center text-xs text-gray-400">
                      {chat.lastMessageStatus === 'SENT' && (
                        <>
                          <FiCheck className="mr-1" /> Sent
                        </>
                      )}
                      {chat.lastMessageStatus === 'DELIVERED' && (
                        <>
                          <FiCheck className="mr-1" /> Delivered
                        </>
                      )}
                      {chat.lastMessageStatus === 'READ' && (
                        <>
                          <FiCheck className="mr-1" /> Read
                        </>
                      )}
                      {!chat.lastMessageStatus && (
                        <>
                          <FiClock className="mr-1" /> Pending
                        </>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 px-2 text-xs font-bold text-white bg-blue-500 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;