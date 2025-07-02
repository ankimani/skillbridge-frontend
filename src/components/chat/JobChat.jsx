import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getMessagesForUser,
  sendMessage,
  markAsRead
} from '../services/chatService';
import { fetchUserProfile, fetchUsernameById } from '../services/authProfile';
import { getJobById } from '../services/myRequirements';
import CustomHeader from '../pages/CustomHeader';

const JobChat = () => {
  const { jobId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [recipientId, setRecipientId] = useState(null);
  const [jobRequirements, setJobRequirements] = useState('');
  const [usernames, setUsernames] = useState({});
  const textareaRef = useRef(null);
  const token = localStorage.getItem('authToken');

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token]);

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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* <CustomHeader /> */}
      
      {/* Header with job requirements title */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {chatTitle}
            </h1>
            <p className="text-sm text-gray-500 truncate">
              {jobRequirements && jobRequirements.length > 50 ? 
               `${jobRequirements.substring(0, 50)}...` : 
               jobRequirements || 'Chat with your team'}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {userProfile.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden max-w-5xl w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start the conversation by sending a message</p>
                </div>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  {dateMessages.map((message) => {
                    const isSender = message.senderId === userProfile.userId;
                    return (
                      <div 
                        key={message.id}
                        className={`flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          isSender 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        } shadow-sm`}>
                          {/* Username display */}
                          <div className={`text-xs font-medium mb-1 ${
                            isSender ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {usernames[message.senderId] || `User ${message.senderId}`}
                          </div>
                          <p className="text-base whitespace-pre-wrap">{message.message}</p>
                          <div className={`flex items-center mt-1 ${
                            isSender ? 'justify-end' : 'justify-start'
                          }`}>
                            <p className={`text-xs ${
                              isSender ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatMessageTime(message.createdAt)}
                            </p>
                            {message.status === 'SENT' && isSender && (
                              <svg className="w-3 h-3 ml-1 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
                  placeholder="Type your message..."
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '150px',
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 bottom-2 inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              <p className="text-xs text-gray-500 pl-1">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobChat;