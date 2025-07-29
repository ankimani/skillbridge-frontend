import React, { useState, useEffect } from 'react';
import { getChatList } from '../../components/services/chatService';
import { fetchMyRequirements } from '../../components/services/myRequirements';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchUsernameById } from '../../components/services/authProfile';
import { FiMessageSquare, FiCheck, FiClock, FiInfo } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const Chats = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [jobDetails, setJobDetails] = useState({});
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  const userProfile = useAuthStore((state) => state.user);
  const currentUserId = userProfile?.userId;

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
        else {
          return date.toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
      return 'Just now';
    } catch {
      return 'Just now';
    }
  };

  // Fetch job details
  const fetchJobDetails = async (jobId, token) => {
    try {
      const job = await fetchMyRequirements(jobId, token);
      setJobDetails(prev => ({ ...prev, [jobId]: job }));
    } catch (error) {
      console.error(`Error fetching job details for job ${jobId}:`, error);
    }
  };

  // Fetch usernames
  const fetchUsernames = async (chatList, token) => {
    const usernamePromises = chatList.map(async (chat) => {
      const chatPartnerId = chat.senderId === currentUserId ? chat.recipientId : chat.senderId;
      if (!usernames[chatPartnerId]) {
        try {
          console.log('Fetching username for user ID:', chatPartnerId);
          const username = await fetchUsernameById(chatPartnerId, token);
          console.log('Fetched username:', username);
          return { recipientId: chatPartnerId, username: username || `User #${chatPartnerId}` };
        } catch (error) {
          console.error(`Error fetching username for user ${chatPartnerId}:`, error);
          return { recipientId: chatPartnerId, username: `User #${chatPartnerId}` };
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

  const handleChatClick = (jobId, recipientId) => {
    navigate(`/job-chat/${jobId}/${recipientId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = useAuthStore.getState().token || localStorage.getItem('authToken');
        console.log('Chats: Token exists:', !!token);
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Check if token is valid
        const checkTokenValid = useAuthStore.getState().isTokenValid;
        if (!checkTokenValid()) {
          console.log('Chats: Token is invalid, forcing logout');
          useAuthStore.getState().forceLogout();
          navigate('/login');
          return;
        }

        const userProfile = await fetchUserProfile(token);
        console.log('Chats: User profile fetched:', userProfile);
        
        if (!userProfile?.userId) {
          throw new Error('Failed to fetch user profile');
        }

        console.log('Chats: Fetching chat list for userId:', userProfile.userId);
        const chats = await getChatList(userProfile.userId, token);
        console.log('Chats: Chat list received:', chats);
        
        // Sort chats by latest first
        const sortedChats = chats.sort((a, b) => {
          // Robust date parsing function
          const parseDate = (dateInput) => {
            if (!dateInput) return new Date(0);
            
            // Handle array format [year, month, day, hour, minute, second, nanosecond]
            if (Array.isArray(dateInput)) {
              return new Date(
                dateInput[0],        // year
                dateInput[1] - 1,    // month (0-indexed)
                dateInput[2],        // day
                dateInput[3],        // hours
                dateInput[4],        // minutes
                dateInput[5],        // seconds
                dateInput[6] / 1000000 // nanoseconds to milliseconds
              );
            }
            
            // Handle string or other formats
            const parsed = new Date(dateInput);
            return isNaN(parsed.getTime()) ? new Date(0) : parsed;
          };
          
          const dateA = parseDate(a.lastMessageTime);
          const dateB = parseDate(b.lastMessageTime);
          
          // Debug logging to check dates
          console.log('Sorting dates:', {
            jobA: a.jobId,
            dateA: a.lastMessageTime,
            parsedA: dateA,
            jobB: b.jobId,
            dateB: b.lastMessageTime,
            parsedB: dateB
          });
          
          return dateB - dateA;
        });
        
        setChatList(sortedChats);

        sortedChats.forEach(chat => {
          fetchJobDetails(chat.jobId, token);
        });
        await fetchUsernames(sortedChats, token);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      <div className="max-w-5xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 sticky top-20 z-10 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                <FiMessageSquare className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-gray-600 text-sm font-medium">
                    {filteredChats.length} {filteredChats.length === 1 ? 'conversation' : 'conversations'} active
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 p-2 rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm rounded-xl transition-all duration-300 font-semibold ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                }`}
              >
                All Messages
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-6 py-3 text-sm rounded-xl transition-all duration-300 font-semibold relative ${
                  activeTab === 'unread' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'
                }`}
              >
                Unread
                {chatList.filter(chat => chat.unreadCount > 0).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-lg animate-pulse">
                    {chatList.filter(chat => chat.unreadCount > 0).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Chat List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading conversations...</p>
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-16 text-center">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <FiMessageSquare className="text-blue-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                {activeTab === 'unread' ? 'All Caught Up!' : 'No Messages Yet'}
              </h3>
              <p className="text-gray-500 mb-8 text-lg">
                {activeTab === 'unread' 
                  ? 'You have no unread messages at the moment.' 
                  : 'Start connecting with job posters to see your conversations here.'}
              </p>
              <button 
                onClick={() => navigate('/jobs')}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredChats.map((chat) => {
                const chatPartnerId = chat.senderId === currentUserId ? chat.recipientId : chat.senderId;
                const chatPartnerUsername = chat.senderId === currentUserId
                  ? chat.recipientUsername
                  : chat.senderUsername;
                return (
                  <div 
                    key={chat.jobId}
                    onClick={() => handleChatClick(chat.jobId, chatPartnerId)}
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/30 overflow-hidden group ${
                      chat.unreadCount > 0 ? 'ring-2 ring-blue-500/30' : ''
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 ${
                            chat.unreadCount > 0 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}>
                            <span className="text-white font-bold text-xl">
                              {chatPartnerUsername?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 ml-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                {chatPartnerUsername || `User #${chatPartnerId}`}
                              </h3>
                              <p className="text-sm text-gray-500 mt-2 truncate">
                                {jobDetails[chat.jobId]?.jobRequirements 
                                  ? getFirstWords(jobDetails[chat.jobId].jobRequirements) 
                                  : `Job #${chat.jobId}`}
                              </p>
                            </div>
                            <div className="flex flex-col items-end space-y-3">
                              <span className="text-xs text-gray-400 font-medium">
                                {formatDate(chat.lastMessageTime)}
                              </span>
                              {chat.unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center h-8 px-4 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 truncate">
                              {chat.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                          
                          {jobDetails[chat.jobId]?.jobRequirements && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                              <div className="flex items-start text-xs text-gray-600">
                                <FiInfo className="flex-shrink-0 mt-0.5 mr-3 text-blue-500" />
                                <span className="line-clamp-2 leading-relaxed">
                                  {jobDetails[chat.jobId].jobRequirements}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-400">
                          {chat.lastMessageStatus === 'SENT' && (
                            <div className="flex items-center">
                              <FiCheck className="mr-2 text-blue-500" /> 
                              <span className="text-blue-500 font-medium">Sent</span>
                            </div>
                          )}
                          {chat.lastMessageStatus === 'DELIVERED' && (
                            <div className="flex items-center">
                              <FiCheck className="mr-2 text-green-500" /> 
                              <span className="text-green-500 font-medium">Delivered</span>
                            </div>
                          )}
                          {chat.lastMessageStatus === 'READ' && (
                            <div className="flex items-center">
                              <FiCheck className="mr-2 text-green-600" /> 
                              <span className="text-green-600 font-medium">Read</span>
                            </div>
                          )}
                          {!chat.lastMessageStatus && (
                            <div className="flex items-center">
                              <FiClock className="mr-2 text-yellow-500" /> 
                              <span className="text-yellow-500 font-medium">Pending</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                          <span className="text-xs text-gray-400 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;