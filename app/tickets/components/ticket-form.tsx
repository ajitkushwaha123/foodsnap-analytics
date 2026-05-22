"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ticket } from "../page"
import { useEffect } from "react"

const formSchema = z.object({
  status: z.enum(["open", "in-progress", "closed"]).default("open"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
})

interface TicketFormProps {
  initialData?: Ticket | null
  onSubmit: (data: z.infer<typeof formSchema>) => void
  onCancel: () => void
}

export function TicketForm({ initialData, onSubmit, onCancel }: TicketFormProps) {
  const { control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "open",
      priority: "medium",
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        status: initialData.status as any,
        priority: initialData.priority as any,
      })
    } else {
      reset({
        status: "open",
        priority: "medium",
      })
    }
  }, [initialData, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold mb-2">Ticket Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Name:</div>
          <div>{initialData?.details?.name || "N/A"}</div>
          <div className="text-muted-foreground">Email:</div>
          <div>{initialData?.details?.email || "N/A"}</div>
          <div className="text-muted-foreground">Phone:</div>
          <div>{initialData?.details?.phone || "N/A"}</div>
          <div className="text-muted-foreground">Subject:</div>
          <div className="font-medium">{initialData?.details?.subject || "N/A"}</div>
          <div className="text-muted-foreground col-span-2 mt-2">Message:</div>
          <div className="col-span-2 bg-muted p-3 rounded-md whitespace-pre-wrap">
            {initialData?.details?.message || "N/A"}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
