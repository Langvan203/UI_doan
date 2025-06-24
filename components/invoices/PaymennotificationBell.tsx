"use client"

import { useState } from "react"
import { Bell, CreditCard, XCircle, Clock, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { usePaymentNotifications } from "../context/PaymentNotificationContext"

export function PaymentNotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = usePaymentNotifications()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'EXPIRED':
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <CreditCard className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán'
      case 'CANCELLED':
        return 'Đã hủy'
      case 'EXPIRED':
        return 'Hết hạn'
      case 'PENDING':
        return 'Chờ thanh toán'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'EXPIRED':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'PENDING':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const formatVietnameseCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} phút trước`
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`
    } else {
      return date.toLocaleDateString('vi-VN')
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Thông báo thanh toán</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <EyeOff className="h-3 w-3 mr-1" />
                Đánh dấu tất cả
              </Button>
            )}
            <Badge variant="secondary">{notifications.length}</Badge>
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            HD-{notification.maHD.toString().padStart(4, '0')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(notification.status)}`}
                          >
                            {getStatusText(notification.status)}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-1 truncate">
                          {notification.customerName}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {formatVietnameseCurrency(notification.amount)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.paymentTime || notification.createdAt)}
                          </span>
                        </div>

                        {notification.transactionId && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Mã GD: {notification.transactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              Xem tất cả thông báo
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}