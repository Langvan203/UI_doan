"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PremiseTypeList } from "@/components/premises/premise-type-list"
import { PremiseStatusList } from "@/components/premises/premise-status-list"

export default function PremisesManagementPage() {
  const [activeTab, setActiveTab] = useState("types")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý trạng thái và loại mặt bằng</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="types">Loại Mặt Bằng</TabsTrigger>
          <TabsTrigger value="statuses">Trạng Thái Mặt Bằng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types">
          <PremiseTypeList />
        </TabsContent>
        
        <TabsContent value="statuses">
          <PremiseStatusList />
        </TabsContent>
      </Tabs>
    </div>
  )
} 