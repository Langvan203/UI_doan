"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for a specific ticket
const mockTicketDetails = {
  id: "T-1001",
  subject: "Water leakage in bathroom",
  status: "open",
  priority: "high",
  createdAt: "2023-05-10T08:30:00",
  resident: {
    id: "R-101",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  premise: "Block A, Floor 3, Unit 302",
  category: "Plumbing",
  description:
    "There is water leaking from the ceiling in the bathroom. It started yesterday evening and is getting worse.",
  messages: [
    {
      id: "msg-1",
      sender: "resident",
      senderName: "John Doe",
      content: "Hello, I have a water leakage issue in my bathroom. The ceiling is dripping water.",
      timestamp: "2023-05-10T08:30:00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "msg-2",
      sender: "staff",
      senderName: "Support Agent",
      content: "Hello Mr. Doe, I'm sorry to hear about the issue. Can you provide more details about the leak?",
      timestamp: "2023-05-10T09:15:00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "msg-3",
      sender: "resident",
      senderName: "John Doe",
      content:
        "It's coming from the ceiling, right above the shower. It started as a small drip but now it's a steady stream.",
      timestamp: "2023-05-10T09:20:00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "msg-4",
      sender: "staff",
      senderName: "Support Agent",
      content:
        "Thank you for the details. I'll send a plumber to check it out. They should be there within the next 2 hours. Is that okay?",
      timestamp: "2023-05-10T09:30:00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "msg-5",
      sender: "resident",
      senderName: "John Doe",
      content: "Yes, that would be great. Thank you for the quick response!",
      timestamp: "2023-05-10T09:35:00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

interface SupportChatProps {
  customerId: string | null
}

export function SupportChat({ customerId }: SupportChatProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(mockTicketDetails.messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: `msg-${messages.length + 1}`,
      sender: "staff",
      senderName: "Support Agent",
      content: newMessage,
      timestamp: new Date().toISOString(),
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col">
      <Card className="flex h-full flex-col">
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={mockTicketDetails.resident.avatar || "/placeholder.svg"}
                  alt={mockTicketDetails.resident.name}
                />
                <AvatarFallback>
                  {mockTicketDetails.resident.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{mockTicketDetails.resident.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{mockTicketDetails.premise}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Xem thông tin khách hàng</DropdownMenuItem>
                <DropdownMenuItem>Tạo ticket hỗ trợ</DropdownMenuItem>
                <DropdownMenuItem>Chặn khách hàng</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "staff" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] gap-2 ${message.sender === "staff" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.senderName} />
                    <AvatarFallback>
                      {message.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "staff" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center gap-2">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
