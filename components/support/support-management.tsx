"use client"

import { useState } from "react"
import { SupportCustomerList } from "./support-customer-list"
import { SupportChat } from "./support-chat"

export function SupportManagement() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background">
      {/* Customer List - Responsive width */}
      <div className="w-80 flex-shrink-0 lg:w-96">
        <SupportCustomerList onSelectCustomer={setSelectedCustomerId} selectedCustomerId={selectedCustomerId} />
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        <SupportChat customerId={selectedCustomerId} />
      </div>
    </div>
  )
}
