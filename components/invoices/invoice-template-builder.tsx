"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Trash2, Move } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface TemplateComponent {
  id: string
  type: string
  content: string
  position: number
}

interface InvoiceTemplateBuilderProps {
  onSave: (template: any) => void
  onClose: () => void
}

export function InvoiceTemplateBuilder({ onSave, onClose }: InvoiceTemplateBuilderProps) {
  const [templateName, setTemplateName] = useState("")
  const [components, setComponents] = useState<TemplateComponent[]>([])
  const { toast } = useToast()

  const availableComponents = [
    { type: "header", label: "Header" },
    { type: "company_info", label: "Company Information" },
    { type: "customer_info", label: "Customer Information" },
    { type: "invoice_details", label: "Invoice Details" },
    { type: "items_table", label: "Items Table" },
    { type: "total", label: "Total Amount" },
    { type: "footer", label: "Footer" },
    { type: "qr_code", label: "QR Code" },
  ]

  const addComponent = (type: string) => {
    const newComponent: TemplateComponent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: "",
      position: components.length,
    }
    setComponents([...components, newComponent])
  }

  const removeComponent = (id: string) => {
    setComponents(components.filter((comp) => comp.id !== id))
  }

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const draggedComponent = components[dragIndex]
    const newComponents = [...components]
    newComponents.splice(dragIndex, 1)
    newComponents.splice(hoverIndex, 0, draggedComponent)
    setComponents(newComponents)
  }

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      })
      return
    }

    if (components.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one component to the template",
        variant: "destructive",
      })
      return
    }

    onSave({
      name: templateName,
      components,
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Invoice Template Builder</h2>
            <p className="text-muted-foreground">
              Create and customize your invoice template by dragging and dropping components
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - Available components */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>Drag and drop components to build your template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableComponents.map((component) => (
                    <Button
                      key={component.type}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => addComponent(component.type)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {component.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Template preview */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Template Preview</CardTitle>
                    <CardDescription>Preview and arrange your template components</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Template Name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[500px] space-y-4 rounded-md border p-4">
                  {components.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Drag components from the sidebar to build your template
                    </div>
                  ) : (
                    components.map((component, index) => (
                      <div
                        key={component.id}
                        className="group relative flex items-center justify-between rounded-md border p-4"
                      >
                        <div className="flex items-center gap-2">
                          <Move className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {availableComponents.find((c) => c.type === component.type)?.label}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={() => removeComponent(component.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  )
} 