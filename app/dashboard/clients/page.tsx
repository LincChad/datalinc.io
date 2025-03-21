"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, UserPlus, UserMinus, UserCheck } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { getClients } from "@/app/actions/client-actions"

// Define types for Supabase data
interface Client {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  joined_date: string
  avatar_url: string | null
  company_name: string | null
}

// Client card component
function ClientCard({
  id,
  name,
  email,
  status,
  joinedDate,
  avatar,
}: {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "pending"
  joinedDate: string
  avatar: string | null
}) {
  const statusColor = {
    active: "text-emerald-500",
    inactive: "text-gray-400",
    pending: "text-amber-500",
  }

  // Format date to readable format
  const formattedDate = new Date(joinedDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6 flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary/10">
          <AvatarImage src={avatar || undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs ${statusColor[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground">• Joined {formattedDate}</span>
          </div>
        </div>
        <Link href={`/dashboard/clients/${id}`} className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
          View Details
        </Link>
      </CardContent>
    </Card>
  )
}

// Loading skeleton
function ClientCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </CardContent>
    </Card>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    pending: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [newClients, setNewClients] = useState<Client[]>([])
  
  useEffect(() => {
    async function loadClientData() {
      setIsLoading(true)
      
      try {
        const data = await getClients()
        
        if (data) {
          const { clients: clientsData, stats: statsData, newClients: recentClients } = data
          
          setClients(clientsData)
          setStats(statsData)
          setNewClients(recentClients)
        }
      } catch (error) {
        console.error('Error fetching clients:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadClientData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Clients
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage your clients and their information
        </motion.p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Client Statistics
              </CardTitle>
              <CardDescription>
                Overview of your client base
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <UserCheck className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : stats.active}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <UserMinus className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : stats.inactive}</div>
                <div className="text-xs text-muted-foreground">Inactive</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-8 mx-auto" /> : stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2"
        >
          <Card className="bg-card/50 backdrop-blur-sm border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Recent Signups
              </CardTitle>
              <CardDescription>
                New clients from the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : newClients.length > 0 ? (
                <div className="space-y-2">
                  {newClients.map((client) => (
                    <div key={client.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={client.avatar_url || undefined} alt={client.name} />
                        <AvatarFallback>{client.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(client.joined_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-primary/10">
                        {client.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No new clients in the last 30 days</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Clients</h2>
          <Link href="/dashboard/clients/add" className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" />
            <span>Add Client</span>
          </Link>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            // Show skeletons while loading
            Array(6).fill(0).map((_, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ClientCardSkeleton />
              </motion.div>
            ))
          ) : clients.length > 0 ? (
            // Show actual client data
            clients.map((client, index) => (
              <motion.div 
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ClientCard
                  id={client.id}
                  name={client.name}
                  email={client.email}
                  status={client.status}
                  joinedDate={client.joined_date}
                  avatar={client.avatar_url}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No clients found. Add your first client to get started.</p>
          )}
        </div>
      </div>
    </div>
  )
} 