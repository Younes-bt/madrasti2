/**
 * WebSocket Service for Real-time Features
 * Handles real-time notifications, attendance updates, and system alerts
 */

import { toast } from 'react-hot-toast';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.heartbeatInterval = null;
    this.eventListeners = new Map();
    this.userId = null;
    this.accessToken = null;
  }

  /**
   * Initialize WebSocket connection
   * @param {number} userId - Current user ID
   * @param {string} accessToken - JWT access token
   */
  connect(userId, accessToken) {
    if (this.isConnected || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this.userId = userId;
    this.accessToken = accessToken;

    try {
      const wsUrl = `${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${
        window.location.hostname
      }:8000/ws/notifications/${userId}/`;

      this.ws = new WebSocket(wsUrl);

      // Set up event handlers
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);

      console.log('📡 Attempting WebSocket connection to:', wsUrl);
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Handle connection open
   */
  handleOpen() {
    console.log('✅ WebSocket connected successfully');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;

    // Send authentication
    this.send({
      type: 'auth',
      token: this.accessToken
    });

    // Start heartbeat
    this.startHeartbeat();

    // Notify listeners
    this.emit('connected');
    
    toast.success('Real-time notifications enabled', {
      duration: 3000,
      position: 'top-right'
    });
  }

  /**
   * Handle incoming messages
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 WebSocket message received:', data);

      // Handle different message types
      switch (data.type) {
        case 'auth_success':
          console.log('🔐 WebSocket authentication successful');
          break;

        case 'auth_error':
          console.error('🔒 WebSocket authentication failed:', data.message);
          this.disconnect();
          break;

        case 'attendance_alert':
          this.handleAttendanceAlert(data);
          break;

        case 'grade_published':
          this.handleGradeNotification(data);
          break;

        case 'badge_earned':
          this.handleBadgeNotification(data);
          break;

        case 'assignment_due':
          this.handleAssignmentDue(data);
          break;

        case 'system_alert':
          this.handleSystemAlert(data);
          break;

        case 'flag_created':
          this.handleFlagCreated(data);
          break;

        case 'heartbeat_ack':
          // Heartbeat acknowledged
          break;

        default:
          console.log('🔔 Unknown notification type:', data.type);
          this.emit('notification', data);
      }

      // Emit the raw event for custom handling
      this.emit('message', data);
    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  /**
   * Handle attendance alert notifications
   */
  handleAttendanceAlert(data) {
    const { student_name, class: className, subject, status, priority } = data.data;
    
    const icons = {
      absent: '🚫',
      late: '⏰',
      present: '✅'
    };

    const messages = {
      absent: `${student_name} is absent from ${subject} (${className})`,
      late: `${student_name} arrived late to ${subject} (${className})`,
      present: `${student_name} marked present in ${subject} (${className})`
    };

    const toastConfig = {
      icon: icons[status] || '📢',
      duration: priority === 'high' ? 8000 : 5000,
      position: 'top-right'
    };

    if (status === 'absent' && priority === 'high') {
      toast.error(messages[status], toastConfig);
    } else if (status === 'late') {
      toast(`⚠️ ${messages[status]}`, toastConfig);
    } else {
      toast.success(messages[status], toastConfig);
    }

    this.emit('attendance_update', data.data);
  }

  /**
   * Handle grade published notifications
   */
  handleGradeNotification(data) {
    const { assignment_title, score_percentage, points_earned } = data.data;
    
    toast.success(
      `📊 Grade published: ${assignment_title} - ${score_percentage}% (+${points_earned} points)`,
      {
        duration: 6000,
        position: 'top-right'
      }
    );

    this.emit('grade_update', data.data);
  }

  /**
   * Handle badge earned notifications
   */
  handleBadgeNotification(data) {
    const { badge_name, badge_icon, points_awarded, rarity } = data.data;
    
    const rarityColors = {
      COMMON: '#94a3b8',
      RARE: '#3b82f6', 
      EPIC: '#8b5cf6',
      LEGENDARY: '#f59e0b'
    };

    toast(
      `🏆 Badge Earned: ${badge_icon} ${badge_name} (+${points_awarded} points)`,
      {
        duration: 8000,
        position: 'top-center',
        style: {
          background: rarityColors[rarity] || '#3b82f6',
          color: 'white',
          fontWeight: 'bold'
        }
      }
    );

    this.emit('badge_earned', data.data);
  }

  /**
   * Handle assignment due notifications
   */
  handleAssignmentDue(data) {
    const { assignment_title, due_date, time_remaining } = data.data;
    
    toast(`⏰ Assignment Due: ${assignment_title} (${time_remaining})`, {
      duration: 7000,
      position: 'top-right',
      icon: '📝'
    });

    this.emit('assignment_due', data.data);
  }

  /**
   * Handle system alerts
   */
  handleSystemAlert(data) {
    const { title, message, priority } = data.data;
    
    const toastConfig = {
      duration: priority === 'high' ? 10000 : 6000,
      position: 'top-center'
    };

    if (priority === 'urgent') {
      toast.error(`🚨 ${title}: ${message}`, toastConfig);
    } else if (priority === 'high') {
      toast(`⚠️ ${title}: ${message}`, toastConfig);
    } else {
      toast(`ℹ️ ${title}: ${message}`, toastConfig);
    }

    this.emit('system_alert', data.data);
  }

  /**
   * Handle absence flag created notifications
   */
  handleFlagCreated(data) {
    const { student_name, flag_type, priority } = data.data;
    
    if (priority === 'urgent') {
      toast.error(`🚩 Urgent: ${flag_type} flag for ${student_name}`, {
        duration: 10000,
        position: 'top-right'
      });
    } else {
      toast(`🚩 New ${flag_type.toLowerCase()} flag for ${student_name}`, {
        duration: 6000,
        position: 'top-right'
      });
    }

    this.emit('flag_created', data.data);
  }

  /**
   * Handle connection close
   */
  handleClose(event) {
    console.log('🔌 WebSocket connection closed:', event.code, event.reason);
    this.isConnected = false;
    this.stopHeartbeat();
    this.emit('disconnected', event);

    // Don't reconnect if it was a clean close
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  /**
   * Handle connection error
   */
  handleError(error) {
    console.error('❌ WebSocket error:', error);
    this.emit('error', error);
  }

  /**
   * Send message through WebSocket
   */
  send(data) {
    if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message:', data);
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'heartbeat' });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Schedule reconnection attempt
   */
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      toast.error('Connection lost. Please refresh the page.', {
        duration: 0, // Don't auto-dismiss
        position: 'top-center'
      });
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Scheduling reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectDelay}ms`);

    setTimeout(() => {
      if (!this.isConnected) {
        this.connect(this.userId, this.accessToken);
      }
    }, this.reconnectDelay);

    // Exponential backoff with jitter
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      this.stopHeartbeat();
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.ws?.readyState,
      reconnectAttempts: this.reconnectAttempts,
      userId: this.userId
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;

/**
 * React Hook for WebSocket integration
 */
export const useWebSocket = (userId, accessToken) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [lastMessage, setLastMessage] = React.useState(null);

  React.useEffect(() => {
    if (userId && accessToken) {
      // Connect to WebSocket
      websocketService.connect(userId, accessToken);

      // Set up event listeners
      const handleConnected = () => setIsConnected(true);
      const handleDisconnected = () => setIsConnected(false);
      const handleMessage = (message) => setLastMessage(message);

      websocketService.on('connected', handleConnected);
      websocketService.on('disconnected', handleDisconnected);
      websocketService.on('message', handleMessage);

      // Cleanup
      return () => {
        websocketService.off('connected', handleConnected);
        websocketService.off('disconnected', handleDisconnected);
        websocketService.off('message', handleMessage);
        websocketService.disconnect();
      };
    }
  }, [userId, accessToken]);

  return {
    isConnected,
    lastMessage,
    send: websocketService.send.bind(websocketService),
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService)
  };
};