"use client"

import { Building2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export interface Building {
  id: number
  name: string
  address: string
  occupancyRate: number
  constructionYear: number
  status: string
  soTangHam: number
  soTangNoi: number
  dienTichXayDung: number
  tongDienTichSan: number
  tongDienTichChoThueNET: number
  tongDienTichChoThueGross: number
  totalResidents?: number
}

interface BuildingListProps {
  buildings: Building[]
  selectedBuildingId: number
  onSelectBuilding: (id: number) => void
}

export function BuildingList({ buildings, selectedBuildingId, onSelectBuilding }: BuildingListProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Buildings</CardTitle>
        <CardDescription>Select a building to view details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {buildings.map((building) => (
            <div
              key={building.id}
              className={`flex items-center justify-between rounded-md p-2 cursor-pointer ${
                selectedBuildingId === building.id ? "bg-[#2563eb] text-white" : "hover:bg-accent"
              }`}
              onClick={() => onSelectBuilding(building.id)}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>{building.name}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
