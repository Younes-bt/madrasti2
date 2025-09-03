/**
 * Real-time Features Hook
 * Enhanced WebSocket integration with comprehensive real-time data synchronization
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const heartbeatInterval = useRef(null);

  const connect = useCallback(() => {
    if (!user?.id || !user?.access_token) {
      console.warn('⚠️ Cannot connect: User not authenticated');
      return;
    }

    try {
      // Enhanced WebSocket URL with proper authentication
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.hostname}:8000/ws/notifications/${user.id}/`;
      
      console.log('📡 Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        setConnectionStatus('Connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Send authentication
        ws.send(JSON.stringify({
          type: 'auth',
          token: user.access_token
        }));

        // Start heartbeat
        heartbeatInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat' }));
          }
        }, 30000);

        // Show success notification
        toast.success('Real-time updates enabled', {
          duration: 2000,
          position: 'top-right'
        });

        options.onOpen?.(ws);
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket connection closed:', event.code, event.reason);
        setConnectionStatus('Disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Clear heartbeat
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }
        
        // Auto-reconnect logic with exponential backoff
        if (!event.wasClean && reconnectAttempts.current < 5) {
          reconnectAttempts.current++;
          const timeout = Math.min(Math.pow(2, reconnectAttempts.current) * 1000, 30000);
          console.log(`🔄 Reconnecting in ${timeout}ms (attempt ${reconnectAttempts.current}/5)`);
          
          reconnectTimeoutRef.current = setTimeout(connect, timeout);
          
          toast.error('Connection lost. Reconnecting...', {
            duration: 3000,
            position: 'top-right'
          });
        } else if (reconnectAttempts.current >= 5) {
          toast.error('Connection lost. Please refresh the page.', {
            duration: 0,
            position: 'top-center'
          });
        }
        
        options.onClose?.(event);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('Error');
        options.onError?.(error);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message);
          
          setLastMessage(message);
          handleIncomingMessage(message);
          options.onMessage?.(message);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      setConnectionStatus('Error');
    }
  }, [user, options]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    if (socket) {
      socket.close(1000, 'Manual disconnect');
    }
    setIsConnected(false);
  }, [socket]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message:', message);
    }
  }, [socket]);

  // Handle different types of incoming messages
  const handleIncomingMessage = useCallback((message) => {
    switch (message.type) {
      case 'auth_success':
        console.log('🔐 WebSocket authentication successful');
        break;
      
      case 'attendance_alert':
        handleAttendanceAlert(message.data);
        break;
      
      case 'grade_published':
        handleGradeNotification(message.data);
        break;
      
      case 'badge_earned':
        handleBadgeNotification(message.data);
        break;
      
      case 'assignment_due':
        handleAssignmentDue(message.data);
        break;
      
      case 'system_alert':
        handleSystemAlert(message.data);
        break;
      
      case 'heartbeat_ack':
        // Heartbeat acknowledged
        break;
      
      default:
        console.log('🔔 Unknown notification type:', message.type);
    }
  }, []);

  // Message handlers
  const handleAttendanceAlert = (data) => {
    const { student_name, class: className, subject, status, priority } = data;
    
    const icons = { absent: '🚫', late: '⏰', present: '✅' };
    const message = `${student_name} is ${status} in ${subject} (${className})`;
    
    if (status === 'absent' && priority === 'high') {
      toast.error(`${icons[status]} ${message}`, { duration: 8000 });
    } else if (status === 'late') {
      toast(`⚠️ ${message}`, { duration: 5000 });
    } else {
      toast.success(`${icons[status]} ${message}`, { duration: 5000 });
    }
  };

  const handleGradeNotification = (data) => {
    const { assignment_title, score_percentage, points_earned } = data;
    toast.success(
      `📊 Grade: ${assignment_title} - ${score_percentage}% (+${points_earned} points)`,
      { duration: 6000 }
    );
  };

  const handleBadgeNotification = (data) => {
    const { badge_name, badge_icon, points_awarded, rarity } = data;
    const rarityColors = {
      COMMON: '#94a3b8', RARE: '#3b82f6', 
      EPIC: '#8b5cf6', LEGENDARY: '#f59e0b'
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
  };

  const handleAssignmentDue = (data) => {
    const { assignment_title, time_remaining } = data;
    toast(`⏰ Assignment Due: ${assignment_title} (${time_remaining})`, {
      duration: 7000,
      icon: '📝'
    });
  };

  const handleSystemAlert = (data) => {
    const { title, message, priority } = data;
    const duration = priority === 'high' ? 10000 : 6000;
    
    if (priority === 'urgent') {
      toast.error(`🚨 ${title}: ${message}`, { duration });
    } else if (priority === 'high') {
      toast(`⚠️ ${title}: ${message}`, { duration });
    } else {
      toast(`ℹ️ ${title}: ${message}`, { duration });
    }
  };

  useEffect(() => {
    if (user?.id && user?.access_token) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    socket,
    lastMessage,
    connectionStatus,
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { lastMessage } = useWebSocket('/ws/notifications/', {
    onMessage: (message) => {
      if (message.type === 'notification') {
        addNotification(message.data)
      }
    },
  })

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
  }, [])

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }, [])

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      return prev.filter(n => n.id !== notificationId)
    })
  }, [])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
}