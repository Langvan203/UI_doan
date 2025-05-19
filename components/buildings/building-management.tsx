"use client"

import { useState } from "react"
import { Building2, Home, Users, Layers, Plus } from "lucide-react"
import { DashboardSummaryCard } from "@/components/dashboard/dashboard-summary-card"
import { BuildingList } from "@/components/buildings/building-list"
import { BuildingDetail } from "@/components/buildings/building-detail"
import { Building } from "@/components/buildings/building-list"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock data for buildings
const buildingsData: Building[] = [
  {
    id: 1,
    name: "Happy Residence",
    address: "123 Main Street, District 1",
    occupancyRate: 85,
    constructionYear: 2020,
    status: "active",
    soTangHam: 1,
    soTangNoi: 16,
    dienTichXayDung: 1200,
    tongDienTichSan: 5000,
    tongDienTichChoThueNET: 4500,
    tongDienTichChoThueGross: 4800,
    totalResidents: 120,
  },
  {
    id: 2,
    name: "Sunshine Apartments",
    address: "456 Park Avenue, District 2",
    occupancyRate: 78,
    constructionYear: 2019,
    status: "active",
    soTangHam: 1,
    soTangNoi: 16,
    dienTichXayDung: 1100,
    tongDienTichSan: 4800,
    tongDienTichChoThueNET: 4300,
    tongDienTichChoThueGross: 4600,
    totalResidents: 110,
  },
]

export function BuildingManagement() {
  const [selectedBuilding, setSelectedBuilding] = useState<number>(1)
  const [showBuildingDetail, setShowBuildingDetail] = useState<boolean>(true)

  // Get the selected building data
  const building = buildingsData.find((b) => b.id === selectedBuilding) || buildingsData[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Building Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Building</DialogTitle>
              <DialogDescription>
                Enter the details for the new building. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Building Name</Label>
                  <Input id="name" placeholder="Enter building name" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter building address" />
                </div>
                <div>
                  <Label htmlFor="constructionYear">Construction Year</Label>
                  <Input id="constructionYear" type="number" placeholder="YYYY" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter building description" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Building</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardSummaryCard
          title="Total Buildings"
          value={buildingsData.length.toString()}
          icon={<Building2 className="h-5 w-5 text-[#2563eb]" />}
          description="Under your management"
          trend={{ value: "+0", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Blocks"
          value={building.soTangNoi.toString()}
          icon={<Layers className="h-5 w-5 text-[#2563eb]" />}
          description={`In ${building.name}`}
          trend={{ value: "+0", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Premises"
          value={building.tongDienTichSan.toString()}
          icon={<Home className="h-5 w-5 text-[#2563eb]" />}
          description={`${Math.round((building.tongDienTichChoThueNET / building.tongDienTichSan) * 100)}% occupied`}
          trend={{ value: "+3", direction: "up", label: "from last month" }}
        />
        <DashboardSummaryCard
          title="Total Residents"
          value={building.totalResidents?.toString() || "0"}
          icon={<Users className="h-5 w-5 text-[#2563eb]" />}
          description={`In ${building.name}`}
          trend={{ value: "+5", direction: "up", label: "from last month" }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <BuildingList
          buildings={buildingsData}
          selectedBuildingId={selectedBuilding}
          onSelectBuilding={(id) => {
            setSelectedBuilding(id)
            setShowBuildingDetail(true)
          }}
        />
        {showBuildingDetail && (
          <BuildingDetail 
            building={building} 
            onClose={() => setShowBuildingDetail(false)} 
          />
        )}
      </div>
    </div>
  )
}
