  import React, { useState, useEffect, useRef } from 'react';
  import { FiSend, FiX } from 'react-icons/fi';
  import { format } from 'date-fns';
  import { sendMessage, getMessagesForUser } from '../services/chatService';
  import { fetchUserProfile } from '../services/authProfile';

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
      console.log('Raw date input:', dateInput); // Debug the input
      
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
        console.warn('Invalid date:', dateInput);
        return 'Just now';
      }

      return format(date, 'h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Just now';
    }
  };
    // Initialize user and token
    useEffect(() => {
      const initializeUser = async () => {
        try {
          const authToken = localStorage.getItem('authToken');
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
      if (!isOpen || !user?.userId || !token) return;

      const fetchMessages = async () => {
        try {
          setLoading(true);
          const response = await getMessagesForUser(jobId, user.userId, token);
          console.log('res ',response.data);
          if (response?.data) {
            const sortedMessages = response.data
              .filter(msg => msg?.createdAt)
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages(sortedMessages);
          }
        } catch (err) {
          setError('Failed to load messages');
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
      if (!newMessage.trim() || !user?.userId || !token) return;

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {senderType === 'tutor' ? 'Message Student' : 'Message Tutor'}
            </h3>
            <button 
              onClick={onClose} 
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.senderId === user.userId 
                        ? 'bg-indigo-100 text-indigo-900' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {formatMessageTime(message.createdAt)}
                      {message.senderId === user.userId && (
                        <span className={`ml-2 ${
                          message.status === 'READ' ? 'text-blue-500' : 
                          message.status === 'DELIVERED' ? 'text-green-500' : 
                          'text-gray-500'
                        }`}>
                          {message.status === 'READ' ? '✓✓' : 
                          message.status === 'DELIVERED' ? '✓' : 
                          message.status === 'SENDING' ? '...' : ''}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-end space-x-2">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '150px' }}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 h-[44px]"
                  disabled={!newMessage.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default ChatModal;