  import React, { useState, useEffect, useRef } from 'react';
  import { FiSend, FiX } from 'react-icons/fi';
  import { format } from 'date-fns';
  import { sendMessage, getMessagesForUser, getMessagesByJob } from '../../components/services/chatService';
  import { fetchUserProfile } from '../../components/services/authProfile';
  import { useAuthStore } from '../../store/useAuthStore';

  const ChatModal = ({ 
    isOpen,
    receiverId, 
    jobId, 
    onClose, 
    initialMessage = '',
    senderType = 'tutor'
  }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(initialMessage);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Format message timestamp
  const formatMessageTime = (dateInput) => {
    try {
      console.log("Raw date input:", dateInput); // Debug the input
      
      let date;
      
      // Handle array format [year, month, day, hour, minute, second, nanosecond]
      if (Array.isArray(dateInput)) {
        // Note: Month is 0-indexed in JavaScript (5 = June)
        date = new Date(
          dateInput[0],        // year
          dateInput[1] - 1,    // month (adjusting to 0-index)
          dateInput[2],        // day
          dateInput[3],        // hours
          dateInput[4],        // minutes
          dateInput[5],        // seconds
          dateInput[6] / 1000000 // convert nanoseconds to milliseconds
        );
      }
      // Handle string format
      else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
      }
      // Handle Date object
      else if (dateInput instanceof Date) {
        date = dateInput;
      }
      // Fallback to current date if format not recognized
      else {
        date = new Date();
      }

      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateInput);
        return "Just now";
      }

      return format(date, 'h:mm a');
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Just now";
    }
  };
    // Initialize user and token
    useEffect(() => {
      const initializeUser = async () => {
        try {
          const authToken = useAuthStore.getState().token || localStorage.getItem('authToken');
          if (!authToken) throw new Error('No authentication token found');
          
          setToken(authToken);
          const userProfile = await fetchUserProfile(authToken);
          setUser(userProfile);
        } catch (err) {
          setError('Failed to initialize chat. Please try again.');
          setLoading(false);
        }
      };

      if (isOpen) initializeUser();
    }, [isOpen]);

    // Fetch messages when modal opens
    useEffect(() => {
      if (!isOpen || !user?.userId || !token || !receiverId) return;

      console.log('ChatModal debug:', { jobId, receiverId, user, token }); // Debug log

      const fetchMessages = async () => {
        try {
          setLoading(true);
          let response;
          try {
            response = await getMessagesForUser(jobId, user.userId, token);
          } catch (err) {
            // If 404 or not found, try fallback to getMessagesByJob
            if (err.response && err.response.status === 404) {
              response = await getMessagesByJob(jobId, token);
            } else {
              throw err;
            }
          }
          console.log('fetchMessages response:', response);
          if (response?.data) {
            const sortedMessages = response.data
              .filter(msg => msg?.createdAt)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(sortedMessages);
          } else if (Array.isArray(response?.data) && response.data.length === 0) {
            setMessages([]); // No messages, but not an error
          } else {
            setMessages([]); // No messages, but not an error
          }
        } catch (err) {
          console.error('Failed to load messages:', err);
          setError('No messages found or failed to load messages. You can start the conversation.');
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }, [isOpen, jobId, receiverId, user, token]);

    // Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          150
        )}px`;
      }
    }, [newMessage]);

    // Scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending messages
    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !user?.userId || !token || !receiverId) return;

      const messageToSend = {
        jobId,
        senderId: user.userId,
        recipientId: receiverId,
        message: newMessage.trim()
      };
    
      try {
        // Optimistic update
        const tempMessage = {
          ...messageToSend,
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'SENDING'
        };
    
        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');
        
        // Send to server
        const response = await sendMessage(messageToSend, token);
        
        if (response?.data) {
          // Replace temp message with server response
          setMessages(prev => prev.map(msg => 
            msg.id === tempMessage.id ? response.data : msg
          ));
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        // Rollback on error
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
        setError('Failed to send message. Please try again.');
      }
    };

    // Handle enter key (without shift) for sending
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
      }
    };

    if (!isOpen) return null;

    if (!user && loading) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error && !loading) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 text-center">
              <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">
                {error}
              </div>
              <button
                onClick={onClose}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {senderType === 'tutor' ? 'Message Student' : 'Message Tutor'}
                </h3>
                <p className="text-blue-100 text-sm">Job #{jobId}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-blue-100 focus:outline-none p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                <p className="text-gray-500 text-sm">Start the conversation by sending a message!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${message.senderId === user.userId ? 'order-2' : 'order-1'}`}>
                    <div 
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.senderId === user.userId 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {message.message}
                      </p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.senderId === user.userId ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{formatMessageTime(message.createdAt)}</span>
                        {message.senderId === user.userId && (
                          <span className={`ml-2 ${
                            message.status === 'READ' ? 'text-blue-200' : 
                            message.status === 'DELIVERED' ? 'text-green-200' : 
                            'text-gray-300'
                          }`}>
                            {message.status === 'READ' ? '✓✓' : 
                            message.status === 'DELIVERED' ? '✓' : 
                            message.status === 'SENDING' ? '...' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                    message.senderId === user.userId 
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400 order-1 ml-2' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 order-2 mr-2'
                  }`}>
                    {message.senderId === user.userId 
                      ? (user?.username?.charAt(0) || 'U').toUpperCase()
                      : 'S'
                    }
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 hover:bg-white transition-colors"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '150px' }}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {newMessage.length}/500
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 h-[48px] w-[48px] flex items-center justify-center"
                  disabled={!newMessage.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default ChatModal;