"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupportTicketList } from "./support-ticket-list"
import { SupportChat } from "./support-chat"

export function SupportManagement() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("tickets")

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setActiveTab("chat")
  }

  const handleBackToList = () => {
    setSelectedTicketId(null)
    setActiveTab("tickets")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="chat" disabled={!selectedTicketId}>
            Chat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="mt-6">
          <SupportTicketList onSelectTicket={handleSelectTicket} />
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
          {selectedTicketId && <SupportChat ticketId={selectedTicketId} onBack={handleBackToList} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
