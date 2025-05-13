"use client"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2 } from "lucide-react"

// Mock data for floors
const floorsData = [
  { id: 1, buildingId: 1, blockId: 1, number: 1, premises: 4, status: "active" },
  { id: 2, buildingId: 1, blockId: 1, number: 2, premises: 4, status: "active" },
  { id: 3, buildingId: 1, blockId: 1, number: 3, premises: 4, status: "active" },
  { id: 4, buildingId: 1, blockId: 1, number: 4, premises: 4, status: "active" },
  { id: 5, buildingId: 1, blockId: 2, number: 1, premises: 4, status: "active" },
  { id: 6, buildingId: 1, blockId: 2, number: 2, premises: 4, status: "active" },
]

// Mock data for buildings
const buildingsData = [
  { id: 1, name: "Happy Residence" },
  { id: 2, name: "Sunshine Apartments" },
]

// Mock data for blocks
const blocksData = [
  { id: 1, buildingId: 1, name: "Block A" },
  { id: 2, buildingId: 1, name: "Block B" },
  { id: 3, buildingId: 1, name: "Block C" },
  { id: 4, buildingId: 1, name: "Block D" },
  { id: 5, buildingId: 2, name: "Block A" },
  { id: 6, buildingId: 2, name: "Block B" },
]

interface FloorListProps {
  buildingId?: number
}

export function FloorList({ buildingId }: FloorListProps) {
  // Filter floors by building ID if provided
  const filteredFloors = buildingId ? floorsData.filter((floor) => floor.buildingId === buildingId) : floorsData

  return (
    <div className="space-y-4">
      {!buildingId && (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Floor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Floor</DialogTitle>
                <DialogDescription>Enter the details for the new floor.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingsData.map((building) => (
                        <SelectItem key={building.id} value={building.id.toString()}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor-block">Block</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      {blocksData.map((block) => (
                        <SelectItem key={block.id} value={block.id.toString()}>
                          {block.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor-number">Floor Number</Label>
                  <Input id="floor-number" type="number" placeholder="e.g., 1" />
                </div>
                <div>
                  <Label htmlFor="floor-premises">Number of Premises</Label>
                  <Input id="floor-premises" type="number" placeholder="e.g., 4" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Floor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <div className="grid grid-cols-6 border-b p-3 font-medium">
          <div className="hidden sm:block">Building</div>
          <div>Block</div>
          <div>Floor Number</div>
          <div className="hidden md:block">Premises</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {filteredFloors.map((floor) => (
          <div key={floor.id} className="grid grid-cols-6 border-b p-3 last:border-0">
            <div className="hidden sm:block">{buildingsData.find((b) => b.id === floor.buildingId)?.name}</div>
            <div>
              {blocksData.find((b) => b.id === floor.blockId)?.name}
              <div className="sm:hidden text-xs text-muted-foreground">
                {buildingsData.find((b) => b.id === floor.buildingId)?.name}
              </div>
            </div>
            <div>{floor.number}</div>
            <div className="hidden md:block">{floor.premises}</div>
            <div>
              <Badge variant={floor.status === "active" ? "default" : "outline"}>
                {floor.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Floor</DropdownMenuItem>
                    <DropdownMenuItem>View Premises</DropdownMenuItem>
                    <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
