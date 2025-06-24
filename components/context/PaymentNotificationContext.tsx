"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { toast } from "react-toastify"

interface PaymentNotification {
  id: string
  maHD: number
  orderCode: string
  amount: number
  customerName: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'
  paymentTime?: string
  transactionId?: string
  bankCode?: string
  isRead: boolean
  createdAt: string
}

interface PaymentNotificationContextType {
  notifications: PaymentNotification[]
  unreadCount: number
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  connectWebSocket: () => void
  disconnectWebSocket: () => void
}

const PaymentNotificationContext = createContext<PaymentNotificationContextType | undefined>(undefined)

export const PaymentNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]) // Ensure it's always an array
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const { token } = useAuth()
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://localhost:7246'

  // Safe calculation - always ensure notifications is an array
  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0

  // Kết nối WebSocket để nhận thông báo real-time
  const connectWebSocket = () => {
    if (!token) return

    const ws = new WebSocket(`${WS_URL}/hubs/payment-notifications?access_token=${token}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected for payment notifications')
    }

    ws.onmessage = (event) => {
      try {
        const notification: PaymentNotification = JSON.parse(event.data)
        
        // Thêm notification mới vào đầu danh sách - ensure prev is always array
        setNotifications(prev => {
          const currentNotifications = Array.isArray(prev) ? prev : []
          return [notification, ...currentNotifications]
        })
        
        // Hiển thị toast notification
        if (notification.status === 'PAID') {
          toast.success(
            `Thanh toán thành công! Hóa đơn HD-${notification.maHD.toString().padStart(4, '0')} - ${notification.customerName}`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            }
          )
        } else if (notification.status === 'CANCELLED') {
          toast.warning(
            `Thanh toán đã bị hủy! Hóa đơn HD-${notification.maHD.toString().padStart(4, '0')} - ${notification.customerName}`,
            {
              position: "top-right",
              autoClose: 5000,
            }
          )
        } else if (notification.status === 'EXPIRED') {
          toast.error(
            `Thanh toán đã hết hạn! Hóa đơn HD-${notification.maHD.toString().padStart(4, '0')} - ${notification.customerName}`,
            {
              position: "top-right",
              autoClose: 5000,
            }
          )
        }

        // Phát âm thanh thông báo
        playNotificationSound(notification.status)
        
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...')
      // Tự động kết nối lại sau 5 giây
      setTimeout(connectWebSocket, 5000)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setSocket(ws)
  }

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close()
      setSocket(null)
    }
  }

  const playNotificationSound = (status: string) => {
    try {
      const audio = new Audio()
      
      switch (status) {
        case 'PAID':
          // Âm thanh thành công
          audio.src = '/sounds/success.mp3'
          break
        case 'CANCELLED':
        case 'EXPIRED':
          // Âm thanh cảnh báo
          audio.src = '/sounds/warning.mp3'
          break
        default:
          // Âm thanh thông báo thường
          audio.src = '/sounds/notification.mp3'
      }
      
      audio.volume = 0.5
      audio.play().catch(e => console.log('Cannot play notification sound:', e))
    } catch (error) {
      console.error('Error playing notification sound:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Payment/GetNotifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Ensure data is always an array
        const notificationArray = Array.isArray(data) ? data : []
        setNotifications(notificationArray)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Set empty array on error
      setNotifications([])
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`${API_BASE_URL}/Payment/MarkNotificationAsRead/${notificationId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotifications(prev => {
        const currentNotifications = Array.isArray(prev) ? prev : []
        return currentNotifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/Payment/MarkAllNotificationsAsRead`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNotifications(prev => {
        const currentNotifications = Array.isArray(prev) ? prev : []
        return currentNotifications.map(n => ({ ...n, isRead: true }))
      })
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchNotifications()
      connectWebSocket()
    }

    return () => {
      disconnectWebSocket()
    }
  }, [token])

  return (
    <PaymentNotificationContext.Provider value={{
      notifications: Array.isArray(notifications) ? notifications : [], // Ensure it's always an array
      unreadCount,
      markAsRead,
      markAllAsRead,
      connectWebSocket,
      disconnectWebSocket
    }}>
      {children}
    </PaymentNotificationContext.Provider>
  )
}

export const usePaymentNotifications = () => {
  const context = useContext(PaymentNotificationContext)
  if (!context) {
    throw new Error("usePaymentNotifications must be used within a PaymentNotificationProvider")
  }
  return context
}