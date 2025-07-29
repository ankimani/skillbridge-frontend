import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getMessagesForUser,
  sendMessage,
  markAsRead
} from '../../components/services/chatService';
import { fetchUserProfile, fetchUsernameById } from '../../components/services/authProfile';
import { getJobById } from '../../components/services/myRequirements';
import CustomHeader from '../shared/CustomHeader';
import { useAuthStore } from '../../store/useAuthStore';

const JobChatStudents = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [jobRequirements, setJobRequirements] = useState('');
  const [usernames, setUsernames] = useState({});
  const textareaRef = useRef(null);
  const token = useAuthStore.getState().token || localStorage.getItem('authToken');

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [newMessage]);

  // Helper function to get first 10 words
  const getFirstWords = (text, wordCount = 10) => {
    if (!text) return '';
    const words = text.split(/\s+/);
    return words.slice(0, wordCount).join(' ') + (words.length > wordCount ? '...' : '');
  };

  // Fetch username by ID
  const fetchUsername = async (userId) => {
    if (!userId || usernames[userId]) return;
    try {
      const username = await fetchUsernameById(userId, token);
      setUsernames(prev => ({ ...prev, [userId]: username }));
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsernames(prev => ({ ...prev, [userId]: `User ${userId}` }));
    }
  };

  // Date formatting functions
  const formatDateHeader = (dateArray) => {
    try {
      if (Array.isArray(dateArray)) {
        const date = new Date(
          dateArray[0], dateArray[1] - 1, dateArray[2],
          dateArray[3], dateArray[4], dateArray[5],
          Math.floor(dateArray[6] / 1000000)
        );
        
        if (isNaN(date.getTime())) return 'Today';
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        
        return date.toLocaleDateString([], { 
          month: 'long', day: 'numeric', year: 'numeric' 
        });
      }
      return 'Today';
    } catch {
      return 'Today';
    }
  };

  const formatMessageTime = (dateArray) => {
    try {
      if (Array.isArray(dateArray)) {
        const date = new Date(
          dateArray[0], dateArray[1] - 1, dateArray[2],
          dateArray[3], dateArray[4], dateArray[5],
          Math.floor(dateArray[6] / 1000000)
        );
        
        if (isNaN(date.getTime())) return 'Just now';
        
        return date.toLocaleTimeString([], { 
          hour: '2-digit', minute: '2-digit', hour12: true 
        });
      }
      return 'Just now';
    } catch {
      return 'Just now';
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = {};
    
    messages.forEach(message => {
      const dateKey = formatDateHeader(message.createdAt);
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
    });
    
    return grouped;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if token is valid
        if (!token) {
          console.log('JobChatStudents: No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const isTokenValid = useAuthStore.getState().isTokenValid;
        if (!isTokenValid()) {
          console.log('JobChatStudents: Token is invalid, redirecting to login');
          useAuthStore.getState().forceLogout();
          navigate('/login');
          return;
        }

        const profile = await fetchUserProfile(token);
        setUserProfile(profile);

        // Get job details
        const jobDetails = await getJobById(jobId, token);
        setRecipientId(jobDetails.userId);
        setJobRequirements(jobDetails.jobRequirements || '');

        const response = await getMessagesForUser(jobId, profile.userId, token);
        setMessages(response.data || []);
        
        // Fetch usernames for all unique senders
        const uniqueUserIds = [...new Set(response.data.map(msg => msg.senderId))];
        uniqueUserIds.forEach(id => fetchUsername(id));
        
        const unreadMessages = response.data.filter(
          msg => msg.status === 'SENT' && msg.recipientId === profile.userId
        );
        
        for (const msg of unreadMessages) {
          await markAsRead(msg.id, token);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          console.log('JobChatStudents: 401 error, redirecting to login');
          useAuthStore.getState().forceLogout();
          navigate('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userProfile) return;

    try {
      let finalRecipientId = messages.find(m => m.senderId !== userProfile.userId)?.senderId;
      
      if (!finalRecipientId && recipientId) {
        finalRecipientId = recipientId;
      }
      
      if (!finalRecipientId) {
        console.error('Recipient ID not found');
        return;
      }

      const messageData = {
        jobId: parseInt(jobId),
        senderId: userProfile.userId,
        message: newMessage,
        recipientId: finalRecipientId
      };

      const response = await sendMessage(messageData, token);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();
  const chatTitle = jobRequirements ? getFirstWords(jobRequirements) : `Job #${jobId}`;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <CustomHeader /> */}
      
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-800 truncate">
                  {chatTitle}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600 truncate">
                    {jobRequirements && jobRequirements.length > 60 ? 
                     `${jobRequirements.substring(0, 60)}...` : 
                     jobRequirements || 'Professional messaging system'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Job #{jobId}</span>
                <span>•</span>
                <span>Active</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">
                  {userProfile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Container */}
      <div className="flex-1 overflow-hidden max-w-6xl w-full mx-auto px-6 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl h-full flex flex-col border border-gray-200/50 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                  <p className="text-gray-500 text-sm">Start the conversation by sending a message</p>
                </div>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-8">
                  <div className="flex justify-center mb-6">
                    <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-4 py-2 rounded-full shadow-sm border border-gray-200/50 font-medium">
                      {date}
                    </span>
                  </div>
                  {dateMessages.map((message) => {
                    const isSender = message.senderId === userProfile.userId;
                    return (
                      <div 
                        key={message.id}
                        className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end space-x-2 max-w-md ${isSender ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                            isSender 
                              ? 'bg-gradient-to-r from-blue-400 to-indigo-400' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}>
                            {(usernames[message.senderId] || `User ${message.senderId}`).charAt(0).toUpperCase()}
                          </div>
                          
                          {/* Message Bubble */}
                          <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            isSender 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md' 
                              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                          }`}>
                            {/* Username display */}
                            <div className={`text-xs font-medium mb-2 ${
                              isSender ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {usernames[message.senderId] || `User ${message.senderId}`}
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                            <div className={`flex items-center justify-between mt-2 ${
                              isSender ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <p className="text-xs">
                                {formatMessageTime(message.createdAt)}
                              </p>
                              {message.status === 'SENT' && isSender && (
                                <div className="flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-xs">Sent</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className="border-t border-gray-200/50 bg-white/90 backdrop-blur-sm p-6">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden bg-gray-50 hover:bg-white transition-colors"
                  placeholder="Type your message..."
                  rows={1}
                  style={{
                    minHeight: '48px',
                    maxHeight: '150px',
                  }}
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{newMessage.length}/500</span>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-white transform rotate-45" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobChatStudents;