import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('Disconnected')
  const { token } = useAuth()
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)

  const connect = useCallback(() => {
    try {
      const wsUrl = token ? `${url}?token=${token}` : url
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        setConnectionStatus('Connected')
        reconnectAttempts.current = 0
        options.onOpen?.(ws)
      }

      ws.onclose = (event) => {
        setConnectionStatus('Disconnected')
        setSocket(null)
        
        // Auto-reconnect logic
        if (!event.wasClean && reconnectAttempts.current < 5) {
          reconnectAttempts.current++
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000
          reconnectTimeoutRef.current = setTimeout(connect, timeout)
        }
        
        options.onClose?.(event)
      }

      ws.onerror = (error) => {
        setConnectionStatus('Error')
        options.onError?.(error)
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setLastMessage(message)
        options.onMessage?.(message)
      }

      setSocket(ws)
    } catch (error) {
      console.error('WebSocket connection error:', error)
      setConnectionStatus('Error')
    }
  }, [url, token, options])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socket) {
      socket.close()
    }
  }, [socket])

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }, [socket])

  useEffect(() => {
    if (token) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [token, connect, disconnect])

  return {
    socket,
    lastMessage,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
  }
}

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