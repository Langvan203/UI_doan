"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InvoiceTemplateBuilder } from "./invoice-template-builder"
import { useToast } from "@/components/ui/use-toast"

interface InvoiceTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceTemplateDialog({ open, onOpenChange }: InvoiceTemplateDialogProps) {
  const { toast } = useToast()

  const handleSaveTemplate = (template: any) => {
    // TODO: Save template to backend
    console.log("Saving template:", template)
    toast({
      title: "Success",
      description: "Invoice template saved successfully",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[1200px] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
          <DialogTitle>Create Invoice Template</DialogTitle>
          <DialogDescription>
            Design your invoice template by dragging and dropping components
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <InvoiceTemplateBuilder onSave={handleSaveTemplate} onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
} 