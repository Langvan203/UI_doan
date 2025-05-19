"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2, X } from "lucide-react"
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
import { BuildingOverview } from "@/components/buildings/building-overview"
import { BlockList } from "@/components/buildings/blocks/block-list"
import { FloorList } from "@/components/buildings/floors/floor-list"
import { PremiseList } from "@/components/buildings/premises/premise-list"

interface Building {
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
}

interface BuildingDetailProps {
  building: Building
  onClose?: () => void
}

export function BuildingDetail({ building, onClose }: BuildingDetailProps) {
  const [selectedTab, setSelectedTab] = useState<string>("overview")

  return (
    <Card className="col-span-3 relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{building.name}</CardTitle>
            <CardDescription>{building.address}</CardDescription>
          </div>
          <div className="flex gap-2">
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Edit Building</DialogTitle>
                  <DialogDescription>Update the building details. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="edit-name">Building Name</Label>
                      <Input id="edit-name" defaultValue={building.name} />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit-address">Address</Label>
                      <Input id="edit-address" defaultValue={building.address} />
                    </div>
                    <div>
                      <Label htmlFor="edit-constructionYear">Construction Year</Label>
                      <Input id="edit-constructionYear" type="number" defaultValue={building.constructionYear} />
                    </div>
                    <div>
                      <Label htmlFor="edit-status">Status</Label>
                      <Select defaultValue={building.status}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Đang hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea id="edit-description" placeholder="Enter building description" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="floors">Floors</TabsTrigger>
            <TabsTrigger value="premises">Premises</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <BuildingOverview building={building} />
          </TabsContent>

          <TabsContent value="blocks" className="space-y-4">
            <BlockList buildingId={building.id} />
          </TabsContent>

          <TabsContent value="floors" className="space-y-4">
            <FloorList buildingId={building.id} />
          </TabsContent>

          <TabsContent value="premises" className="space-y-4">
            <PremiseList buildingId={building.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
