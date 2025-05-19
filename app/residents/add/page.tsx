"use client"

import { useState } from "react"
import { ResidentForm } from "@/components/residents/resident-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Sample data for buildings, blocks, and floors
// In a real app, you would fetch this from an API
const sampleBuildings = [
  { id: 1, name: "Tòa nhà A" },
  { id: 2, name: "Tòa nhà B" },
  { id: 3, name: "Tòa nhà C" },
]

const sampleBlocks = [
  { id: 1, name: "Khối A1", buildingId: 1 },
  { id: 2, name: "Khối A2", buildingId: 1 },
  { id: 3, name: "Khối B1", buildingId: 2 },
  { id: 4, name: "Khối B2", buildingId: 2 },
  { id: 5, name: "Khối C1", buildingId: 3 },
]

const sampleFloors = [
  { id: 1, number: 1, blockId: 1 },
  { id: 2, number: 2, blockId: 1 },
  { id: 3, number: 3, blockId: 1 },
  { id: 4, number: 1, blockId: 2 },
  { id: 5, number: 2, blockId: 2 },
  { id: 6, number: 1, blockId: 3 },
  { id: 7, number: 2, blockId: 3 },
  { id: 8, number: 1, blockId: 4 },
  { id: 9, number: 1, blockId: 5 },
]

export default function AddResidentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setIsLoading(true)
    
    try {
      // Here you would make an API call to save the data
      console.log("Form values:", values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Thêm khách hàng thành công",
        description: "Khách hàng mới đã được thêm vào hệ thống",
      })
      
      // Redirect to residents list page
      router.push("/residents")
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể thêm khách hàng mới",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Thêm khách hàng mới</h1>
      <ResidentForm
        buildings={sampleBuildings}
        blocks={sampleBlocks}
        floors={sampleFloors}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
} 