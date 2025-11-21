import api from './api';

class CommunicationService {
  // ==================== CONVERSATIONS ====================
  async getConversations() {
    const response = await api.get('/communication/conversations/');
    return response.data;
  }

  async getConversation(id) {
    const response = await api.get(`/communication/conversations/${id}/`);
    return response.data;
  }

  async startDirectConversation(userId) {
    const response = await api.post('/communication/conversations/start_direct/', { user_id: userId });
    return response.data;
  }

  async markAsRead(conversationId) {
    const response = await api.post(`/communication/conversations/${conversationId}/read/`);
    return response.data;
  }

  // ==================== MESSAGES ====================
  async getMessages(params = {}) {
    const response = await api.get('/communication/messages/', { params });
    return response.data;
  }

  async sendMessage(data) {
    // Handle file uploads
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await api.post('/communication/messages/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ==================== ANNOUNCEMENTS ====================
  async getAnnouncements(params = {}) {
    const response = await api.get('/communication/announcements/', { params });
    return response.data;
  }

  async createAnnouncement(data) {
    const response = await api.post('/communication/announcements/', data);
    return response.data;
  }

  async updateAnnouncement(id, data) {
    const response = await api.patch(`/communication/announcements/${id}/`, data);
    return response.data;
  }

  async deleteAnnouncement(id) {
    const response = await api.delete(`/communication/announcements/${id}/`);
    return response.data;
  }
}

export const communicationService = new CommunicationService();
export default communicationService;
