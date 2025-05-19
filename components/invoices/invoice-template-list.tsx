"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Edit, Trash2, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { InvoiceTemplatePreviewDialog } from "./invoice-template-preview-dialog"
import { InvoiceTemplateDeleteDialog } from "./invoice-template-delete-dialog"

// Mock data for templates
const mockTemplates = [
  {
    id: "1",
    name: "Standard Invoice Template",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
    components: [
      { id: "1", type: "header", content: "INVOICE", position: 0 },
      { id: "2", type: "company_info", content: "Company Name\nAddress\nPhone", position: 1 },
      { id: "3", type: "customer_info", content: "Customer Name\nAddress\nPhone", position: 2 },
      { id: "4", type: "items_table", content: "Items table format", position: 3 },
      { id: "5", type: "total", content: "Total: $0.00", position: 4 },
      { id: "6", type: "footer", content: "Thank you for your business!", position: 5 },
    ],
    isDefault: true,
  },
  {
    id: "2",
    name: "Detailed Invoice Template",
    createdAt: "2024-03-14",
    updatedAt: "2024-03-14",
    components: [
      { id: "1", type: "header", content: "DETAILED INVOICE", position: 0 },
      { id: "2", type: "company_info", content: "Company Name\nAddress\nPhone\nEmail", position: 1 },
      { id: "3", type: "customer_info", content: "Customer Name\nAddress\nPhone\nEmail", position: 2 },
      { id: "4", type: "invoice_details", content: "Invoice details format", position: 3 },
      { id: "5", type: "items_table", content: "Detailed items table format", position: 4 },
      { id: "6", type: "total", content: "Subtotal: $0.00\nTax: $0.00\nTotal: $0.00", position: 5 },
      { id: "7", type: "qr_code", content: "bottom-right", position: 6 },
      { id: "8", type: "footer", content: "Thank you for your business!\nPayment terms: Net 30", position: 7 },
    ],
    isDefault: false,
  },
]

export function InvoiceTemplateList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { toast } = useToast()

  const filteredTemplates = mockTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleDelete = (template: any) => {
    setSelectedTemplate(template)
    setIsDeleteOpen(true)
  }

  const handlePreview = (template: any) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleSetDefault = (templateId: string) => {
    // TODO: Implement set default functionality
    console.log("Set default template:", templateId)
    toast({
      title: "Success",
      description: "Default template updated successfully",
    })
  }

  const handleSaveTemplate = (updatedTemplate: any) => {
    // TODO: Implement save functionality
    console.log("Save template:", updatedTemplate)
    toast({
      title: "Success",
      description: "Template updated successfully",
    })
  }

  const handleConfirmDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete template:", selectedTemplate)
    toast({
      title: "Success",
      description: "Template deleted successfully",
    })
    setIsDeleteOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice Templates</CardTitle>
              <CardDescription>Manage your invoice templates</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Components</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No templates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.components.map((component: any) => (
                          <Badge key={component.id} variant="secondary">
                            {component.type.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {template.isDefault ? (
                        <Badge variant="default">Default</Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(template.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreview(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(template)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <>
          <InvoiceTemplatePreviewDialog
            template={selectedTemplate}
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            onSave={handleSaveTemplate}
          />
          <InvoiceTemplateDeleteDialog
            templateName={selectedTemplate.name}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}
    </>
  )
} 