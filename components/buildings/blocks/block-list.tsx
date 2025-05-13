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

// Mock data for blocks
const blocksData = [
  { id: 1, buildingId: 1, name: "Block A", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 2, buildingId: 1, name: "Block B", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 3, buildingId: 1, name: "Block C", floors: 8, premises: 32, type: "Mixed Use", status: "active" },
  { id: 4, buildingId: 1, name: "Block D", floors: 8, premises: 32, type: "Mixed Use", status: "active" },
  { id: 5, buildingId: 2, name: "Block A", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 6, buildingId: 2, name: "Block B", floors: 8, premises: 32, type: "Residential", status: "active" },
  { id: 7, buildingId: 2, name: "Block C", floors: 8, premises: 32, type: "Commercial", status: "active" },
  { id: 8, buildingId: 2, name: "Block D", floors: 8, premises: 32, type: "Commercial", status: "active" },
]

// Mock data for buildings
const buildingsData = [
  {
    id: 1,
    name: "Happy Residence",
  },
  {
    id: 2,
    name: "Sunshine Apartments",
  },
]

interface BlockListProps {
  buildingId?: number
}

export function BlockList({ buildingId }: BlockListProps) {
  // Filter blocks by building ID if provided
  const filteredBlocks = buildingId ? blocksData.filter((block) => block.buildingId === buildingId) : blocksData

  return (
    <div className="space-y-4">
      {!buildingId && (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Block</DialogTitle>
                <DialogDescription>Enter the details for the new block.</DialogDescription>
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
                  <Label htmlFor="block-name">Block Name</Label>
                  <Input id="block-name" placeholder="e.g., Block A" />
                </div>
                <div>
                  <Label htmlFor="block-floors">Number of Floors</Label>
                  <Input id="block-floors" type="number" placeholder="e.g., 8" />
                </div>
                <div>
                  <Label htmlFor="block-type">Block Type</Label>
                  <Select defaultValue="residential">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="mixed">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Block</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <div className="grid grid-cols-6 border-b p-3 font-medium">
          <div>Block Name</div>
          <div className="hidden sm:block">Building</div>
          <div className="hidden md:block">Type</div>
          <div className="hidden md:block">Floors</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {filteredBlocks.map((block) => (
          <div key={block.id} className="grid grid-cols-6 border-b p-3 last:border-0">
            <div>
              {block.name}
              <div className="sm:hidden text-xs text-muted-foreground">
                {buildingsData.find((b) => b.id === block.buildingId)?.name}
              </div>
            </div>
            <div className="hidden sm:block">{buildingsData.find((b) => b.id === block.buildingId)?.name}</div>
            <div className="hidden md:block">{block.type}</div>
            <div className="hidden md:block">{block.floors}</div>
            <div>
              <Badge variant={block.status === "active" ? "default" : "outline"}>
                {block.status === "active" ? "Active" : "Inactive"}
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
                    <DropdownMenuItem>Edit Block</DropdownMenuItem>
                    <DropdownMenuItem>View Floors</DropdownMenuItem>
                    <DropdownMenuItem>View Premises</DropdownMenuItem>
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
