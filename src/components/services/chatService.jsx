import axios from 'axios';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1/chat`;

export const sendMessage = async (message, token) => {
  console.log('API call: sendMessage', { endpoint: API_BASE_URL, token });
  console.log("message ", message);
  return axios.post(`${API_BASE_URL}`, message, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getMessagesByJob = async (jobId, token) => {
  console.log('API call: getMessagesByJob', { endpoint: `${API_BASE_URL}/job/${jobId}`, token });
  return axios.get(`${API_BASE_URL}/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getMessagesForUser = async (jobId, userId, token) => {
  console.log('API call: getMessagesForUser', { endpoint: `${API_BASE_URL}/job/${jobId}/user/${userId}`, token });
  console.log("jobId: ", jobId, "userId: ", userId);
  return axios.get(`${API_BASE_URL}/job/${jobId}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const markAsDelivered = async (messageId, token) => {
  console.log('API call: markAsDelivered', { endpoint: `${API_BASE_URL}/${messageId}/delivered`, token });
  return axios.patch(`${API_BASE_URL}/${messageId}/delivered`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const markAsRead = async (messageId, token) => {
  console.log('API call: markAsRead', { endpoint: `${API_BASE_URL}/${messageId}/read`, token });
  return axios.patch(`${API_BASE_URL}/${messageId}/read`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const archiveMessage = async (messageId, token) => {
  console.log('API call: archiveMessage', { endpoint: `${API_BASE_URL}/${messageId}/archive`, token });
  return axios.delete(`${API_BASE_URL}/${messageId}/archive`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const streamMessages = (jobId, token, onMessage) => {
  console.log('API call: streamMessages', { endpoint: `${API_BASE_URL}/job/${jobId}/stream`, token });
  const eventSource = new EventSource(`${API_BASE_URL}/job/${jobId}/stream?token=${token}`);
  
  eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };
  
  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close();
  };
  
  return () => eventSource.close();
};

export const createWebSocketConnection = (jobId, token, onMessage, onError) => {
  console.log('API call: createWebSocketConnection', { endpoint: `ws://${BACKEND_BASE_URL}/ws/chat?jobId=${jobId}&token=${token}`, token });
  const socket = new WebSocket(`ws://${BACKEND_BASE_URL}/ws/chat?jobId=${jobId}&token=${token}`);
  
  socket.onopen = () => console.log('WebSocket connected');
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    onError(error);
  };
  socket.onclose = () => console.log('WebSocket disconnected');
  
  return {
    send: (message) => socket.send(JSON.stringify(message)),
    close: () => socket.close()
  };
};

export const getMessagesForRecipient = async (recipientId, page = 1, size = 10, status = null, token) => {
  console.log('API call: getMessagesForRecipient', { endpoint: `${API_BASE_URL}/recipient/${recipientId}`, token });
  return axios.get(`${API_BASE_URL}/recipient/${recipientId}`, {
    params: {
      page,
      size,
      status
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getMessagesForSender = async (senderId, page = 1, size = 10, status = null, token) => {
  console.log('API call: getMessagesForSender', { endpoint: `${API_BASE_URL}/sender/${senderId}`, token });
  try {
    return axios.get(`${API_BASE_URL}/sender/${senderId}`, {
      params: {
        page,
        size,
        status
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.log('getMessagesForSender: Endpoint not available:', error.message);
    // If the /sender/{senderId} endpoint doesn't exist, return empty
    return {
      data: {
        body: {
          data: {
            messages: []
          }
        }
      }
    };
  }
};

export const getChatList = async (userId, token) => {
  console.log('API call: getChatList', { userId, token });
  
  try {
    // Get messages where user is recipient
    const recipientResponse = await getMessagesForRecipient(userId, 1, 20, null, token);
    console.log('getChatList: Recipient response:', recipientResponse.data);
    const recipientMessages = recipientResponse.data.body.data.messages || [];
    console.log('getChatList: Recipient messages:', recipientMessages);
    
    // Get all messages for the user (both sent and received)
    let allMessages = [...recipientMessages];
    
    try {
      const senderMessagesResponse = await getMessagesForSender(userId, 1, 20, null, token);
      console.log('getChatList: Sender messages response:', senderMessagesResponse.data);
      const senderMessages = senderMessagesResponse.data.body.data.messages || [];
      console.log('getChatList: Sender messages:', senderMessages);
      
      // Merge messages, avoiding duplicates
      const messageIds = new Set(recipientMessages.map(m => m.id));
      senderMessages.forEach(message => {
        if (!messageIds.has(message.id)) {
          allMessages.push(message);
          messageIds.add(message.id);
        }
      });
    } catch (error) {
      console.log('getChatList: Could not fetch sender messages, using recipient messages only:', error.message);
    }
    
    console.log('getChatList: Combined all messages:', allMessages);
    
    // Group messages by jobId
    const messagesByJob = {};
    allMessages.forEach(message => {
      if (!messagesByJob[message.jobId]) {
        messagesByJob[message.jobId] = [];
      }
      messagesByJob[message.jobId].push(message);
    });

    console.log('getChatList: Messages grouped by jobId:', messagesByJob);

    // Create chat list items with summary info
    const chatList = Object.keys(messagesByJob).map(jobId => {
      const messages = messagesByJob[jobId];
      const unreadCount = messages.filter(m => 
        m.recipientId === userId && m.status === 'SENT'
      ).length;
      
      const lastMessage = messages.reduce((latest, current) => 
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      );

      return {
        jobId,
        lastMessage: lastMessage.message,
        lastMessageTime: lastMessage.createdAt,
        unreadCount,
        senderId: lastMessage.senderId,
        recipientId: lastMessage.recipientId
      };
    });

    console.log('getChatList: Final chat list:', chatList);
    return chatList;
  } catch (error) {
    console.error('getChatList: Error fetching chat list:', error);
    return [];
  }
};