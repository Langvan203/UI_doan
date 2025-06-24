"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, FileDown } from "lucide-react"

interface SaveFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (fileName: string) => Promise<void>
  defaultFileName: string
  fileType: string
  title: string
  description: string
}

export function SaveFileDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  defaultFileName, 
  fileType,
  title,
  description
}: SaveFileDialogProps) {
  const [fileName, setFileName] = useState(defaultFileName)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!fileName.trim()) return

    setIsLoading(true)
    try {
      await onSave(fileName.trim())
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      onOpenChange(open)
      if (open) {
        setFileName(defaultFileName)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fileName">Tên file</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Nhập tên file..."
                disabled={isLoading}
              />
              <span className="text-sm text-muted-foreground">.{fileType}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              File sẽ được lưu với định dạng .{fileType}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!fileName.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Đang lưu...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Lưu file
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}