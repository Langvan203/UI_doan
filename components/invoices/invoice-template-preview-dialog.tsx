"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface TemplateComponent {
  id: string
  type: string
  content: string
  position: number
}

interface InvoiceTemplatePreviewDialogProps {
  template: {
    id: string
    name: string
    components: TemplateComponent[]
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: any) => void
}

export function InvoiceTemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onSave,
}: InvoiceTemplatePreviewDialogProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [editedComponents, setEditedComponents] = useState<TemplateComponent[]>(template.components)
  const { toast } = useToast()

  const handleComponentChange = (id: string, content: string) => {
    setEditedComponents(
      editedComponents.map((comp) => (comp.id === id ? { ...comp, content } : comp))
    )
  }

  const handleSave = () => {
    onSave({
      ...template,
      components: editedComponents,
    })
    toast({
      title: "Success",
      description: "Template updated successfully",
    })
    onOpenChange(false)
  }

  const renderComponentEditor = (component: TemplateComponent) => {
    switch (component.type) {
      case "header":
        return (
          <div className="space-y-2">
            <Label>Header Text</Label>
            <Input
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter header text"
            />
          </div>
        )
      case "company_info":
        return (
          <div className="space-y-2">
            <Label>Company Information</Label>
            <Textarea
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter company information"
              rows={4}
            />
          </div>
        )
      case "customer_info":
        return (
          <div className="space-y-2">
            <Label>Customer Information</Label>
            <Textarea
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter customer information"
              rows={4}
            />
          </div>
        )
      case "invoice_details":
        return (
          <div className="space-y-2">
            <Label>Invoice Details</Label>
            <Textarea
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter invoice details"
              rows={4}
            />
          </div>
        )
      case "items_table":
        return (
          <div className="space-y-2">
            <Label>Items Table</Label>
            <Textarea
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter items table format"
              rows={6}
            />
          </div>
        )
      case "total":
        return (
          <div className="space-y-2">
            <Label>Total Amount</Label>
            <Input
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter total amount format"
            />
          </div>
        )
      case "footer":
        return (
          <div className="space-y-2">
            <Label>Footer</Label>
            <Textarea
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter footer text"
              rows={3}
            />
          </div>
        )
      case "qr_code":
        return (
          <div className="space-y-2">
            <Label>QR Code Position</Label>
            <Input
              value={component.content}
              onChange={(e) => handleComponentChange(component.id, e.target.value)}
              placeholder="Enter QR code position"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[1200px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>Preview and edit your invoice template</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="space-y-4 rounded-md border p-6">
              {editedComponents.map((component) => (
                <div key={component.id} className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium capitalize">{component.type.replace("_", " ")}</h3>
                  {component.content ? (
                    <div className="whitespace-pre-wrap">{component.content}</div>
                  ) : (
                    <div className="text-muted-foreground">No content</div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="mt-4">
            <div className="space-y-6">
              {editedComponents.map((component) => (
                <div key={component.id} className="rounded-md border p-4">
                  <h3 className="mb-4 font-medium capitalize">{component.type.replace("_", " ")}</h3>
                  {renderComponentEditor(component)}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 