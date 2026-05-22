"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./components/data-table"
import { getColumns } from "./components/columns"
import { TicketForm } from "./components/ticket-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

export type Ticket = {
  _id: string
  user: string | any
  status: "open" | "in-progress" | "closed"
  priority: "low" | "medium" | "high"
  details: {
    name?: string
    phone: string
    email?: string
    subject: string
    message: string
  }
  createdAt: string
  updatedAt: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tickets")
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleCreateOrUpdate = async (data: any) => {
    try {
      const url = editingTicket ? `/api/tickets/${editingTicket._id}` : "/api/tickets"
      const method = editingTicket ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        setEditingTicket(null)
        fetchTickets()
      } else {
        console.error("Failed to save ticket")
      }
    } catch (error) {
      console.error("Error saving ticket:", error)
    }
  }

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setIsDialogOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) setEditingTicket(null)
  }

  const columns = getColumns({
    onEdit: handleEdit,
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Ticket Status</DialogTitle>
              </DialogHeader>
              <TicketForm 
                initialData={editingTicket}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={tickets} />
      )}
    </div>
  )
}
