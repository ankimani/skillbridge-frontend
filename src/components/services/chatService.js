import axios from 'axios';
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8089";
const API_BASE_URL = `${BACKEND_BASE_URL}/api/v1/chat`;

export const sendMessage = async (message, token) => {
  console.log("message ", message);
  return axios.post(`${API_BASE_URL}`, message, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getMessagesByJob = async (jobId, token) => {
  return axios.get(`${API_BASE_URL}/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getMessagesForUser = async (jobId,userId, token) => {
  console.log("jobIds ",jobId)
  return axios.get(`${API_BASE_URL}/job/${jobId}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const markAsDelivered = async (messageId, token) => {
  return axios.patch(`${API_BASE_URL}/${messageId}/delivered`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const markAsRead = async (messageId, token) => {
  return axios.patch(`${API_BASE_URL}/${messageId}/read`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const archiveMessage = async (messageId, token) => {
  return axios.delete(`${API_BASE_URL}/${messageId}/archive`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const streamMessages = (jobId, token, onMessage) => {
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

export const getChatList = async (userId, token) => {
  // First get all messages
  const response = await getMessagesForRecipient(userId, 1, 20, null, token);
  
  // Group messages by jobId
  const messagesByJob = {};
  response.data.body.data.messages.forEach(message => {
    if (!messagesByJob[message.jobId]) {
      messagesByJob[message.jobId] = [];
    }
    messagesByJob[message.jobId].push(message);
  });

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

  return chatList;
};