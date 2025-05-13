"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Paperclip } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SendEmailDialogProps {
  invoice: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendEmailDialog({ invoice, open, onOpenChange }: SendEmailDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState(`Invoice ${invoice.id} for ${invoice.resident}`)
  const [message, setMessage] = useState(
    `Dear ${invoice.resident},\n\nPlease find attached the invoice ${invoice.id} for your premise at ${invoice.premise}. The total amount due is ${invoice.amount.toFixed(2)} and the payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease let us know if you have any questions.\n\nThank you,\nBuilding Management Team`,
  )
  const [attachPdf, setAttachPdf] = useState(true)

  const handleSendEmail = () => {
    setIsLoading(true)

    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false)
      setIsSent(true)

      // Close dialog after showing success message
      setTimeout(() => {
        onOpenChange(false)
        setIsSent(false)
        // Reset form for next time
        setEmail("")
        setSubject(`Invoice ${invoice.id} for ${invoice.resident}`)
        setMessage(
          `Dear ${invoice.resident},\n\nPlease find attached the invoice ${invoice.id} for your premise at ${invoice.premise}. The total amount due is ${invoice.amount.toFixed(2)} and the payment is due by ${new Date(invoice.dueDate).toLocaleDateString()}.\n\nPlease let us know if you have any questions.\n\nThank you,\nBuilding Management Team`,
        )
        setAttachPdf(true)
      }, 2000)
    }, 2000)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isLoading) {
          onOpenChange(newOpen)
          if (!newOpen) {
            setIsSent(false)
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Invoice Email</DialogTitle>
          <DialogDescription>Send the invoice to the resident via email</DialogDescription>
        </DialogHeader>

        {isSent ? (
          <Alert className="bg-green-50">
            <AlertDescription className="text-green-800">
              Email has been sent successfully to {email || invoice.resident}!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                placeholder={`${invoice.resident.toLowerCase().replace(/\s/g, ".")}@example.com`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachPdf"
                checked={attachPdf}
                onCheckedChange={(checked) => setAttachPdf(checked as boolean)}
              />
              <Label htmlFor="attachPdf" className="flex cursor-pointer items-center text-sm">
                <Paperclip className="mr-2 h-4 w-4" />
                Attach invoice PDF
              </Label>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isSent && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
