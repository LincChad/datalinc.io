"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Download,
  Plus,
} from "lucide-react"

// Invoice card component
function InvoiceCard({
  id,
  client,
  amount,
  status,
  date,
  dueDate,
}: {
  id: string
  client: string
  amount: number
  status: "paid" | "pending" | "overdue"
  date: string
  dueDate: string
}) {
  const statusColor = {
    paid: "text-emerald-500",
    pending: "text-amber-500",
    overdue: "text-rose-500",
  }

  const statusIcon = {
    paid: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    overdue: <AlertCircle className="h-4 w-4 text-rose-500" />,
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Invoice #{id}</h3>
              <div className={`flex items-center gap-1 text-xs ${statusColor[status]}`}>
                {statusIcon[status]}
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{client}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${amount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {status === "paid" ? `Paid on ${date}` : `Due on ${dueDate}`}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex gap-2">
            <div className="text-xs px-2 py-1 rounded-full bg-primary/10">
              Issued: {date}
            </div>
            {status !== "paid" && (
              <div className="text-xs px-2 py-1 rounded-full bg-primary/10">
                Due: {dueDate}
              </div>
            )}
          </div>
          <button className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <Download className="h-3 w-3" />
            <span>Download</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton
function InvoiceCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="text-right">
            <Skeleton className="h-7 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

// Dummy invoice data
const dummyInvoices = [
  {
    id: "INV-2024-042",
    client: "Acme Corporation",
    amount: 5750.00,
    status: "paid" as const,
    date: "Apr 15, 2023",
    dueDate: "Apr 30, 2023",
  },
  {
    id: "INV-2024-041",
    client: "Globex Inc",
    amount: 3200.00,
    status: "pending" as const,
    date: "Apr 12, 2023",
    dueDate: "Apr 27, 2023",
  },
  {
    id: "INV-2024-040",
    client: "Stark Industries",
    amount: 12500.00,
    status: "overdue" as const,
    date: "Apr 1, 2023",
    dueDate: "Apr 16, 2023",
  },
  {
    id: "INV-2024-039",
    client: "Wayne Enterprises",
    amount: 8400.00,
    status: "paid" as const,
    date: "Mar 28, 2023",
    dueDate: "Apr 12, 2023",
  },
  {
    id: "INV-2024-038",
    client: "Umbrella Corporation",
    amount: 4750.00,
    status: "paid" as const,
    date: "Mar 22, 2023",
    dueDate: "Apr 6, 2023",
  },
]

export default function InvoicesPage() {
  // Calculate summary data
  const totalAmount = dummyInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = dummyInvoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = dummyInvoices
    .filter((invoice) => invoice.status === "pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const overdueAmount = dummyInvoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Invoices
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage and track all your invoices
        </motion.p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">${totalAmount.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3 mr-1" />
                  All invoices
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">${paidAmount.toLocaleString()}</div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                  <span className="text-muted-foreground">Collected</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">${pendingAmount.toLocaleString()}</div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  <span className="text-muted-foreground">Awaiting payment</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">${overdueAmount.toLocaleString()}</div>
                <div className="flex items-center text-xs">
                  <AlertCircle className="h-3 w-3 mr-1 text-rose-500" />
                  <span className="text-muted-foreground">Past due date</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Invoices</h2>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </button>
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            <InvoiceCardSkeleton />
            <InvoiceCardSkeleton />
            <InvoiceCardSkeleton />
          </div>
        }>
          <div className="space-y-4">
            {dummyInvoices.map((invoice) => (
              <motion.div 
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * parseInt(invoice.id.split('-')[2]) / 100 }}
              >
                <InvoiceCard
                  id={invoice.id}
                  client={invoice.client}
                  amount={invoice.amount}
                  status={invoice.status}
                  date={invoice.date}
                  dueDate={invoice.dueDate}
                />
              </motion.div>
            ))}
          </div>
        </Suspense>
      </div>
    </div>
  )
} 