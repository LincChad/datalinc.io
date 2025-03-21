"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  FileText,
  CreditCard,
  Repeat,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { LucideIcon } from "lucide-react"
import { getDashboardData } from "@/app/actions/dashboard-actions"
import type { ActivityItem, DashboardStats } from "@/app/actions/dashboard-actions"

// Stats card with our design system
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: number
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {trend && (
            <div className="flex items-center text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton for stats
function StatsCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-4 w-[150px]" />
      </CardContent>
    </Card>
  )
}

// Recent activity item component
function ActivityItem({
  iconName,
  title,
  description,
  time
}: {
  iconName: string
  title: string
  description: string
  time: string
}) {
  // Map icon names to Lucide icons
  const getIcon = (name: string): LucideIcon => {
    switch (name.toLowerCase()) {
      case 'contact':
        return FileText
      case 'quote':
        return FileText
      case 'support':
        return FileText
      default:
        return FileText // Default to FileText for all form types
    }
  }
  
  const Icon = getIcon(iconName)
  
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: "0",
    formSubmissions: "0",
    activeSubscriptions: "0",
    revenue: "$0"
  })
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Use the server action to get dashboard data
        const data = await getDashboardData()
        
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Dashboard Overview
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Welcome back! Here&apos;s an overview of your business metrics.
        </motion.p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500 font-medium">{error}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Please make sure you are logged in with admin privileges.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <StatsCardSkeleton />
            ) : (
              <StatsCard
                title="Total Clients"
                value={stats.totalClients}
                description="Active clients this month"
                icon={Users}
                trend={12}
              />
            )}
          </motion.div>
        </Suspense>

        <Suspense fallback={<StatsCardSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {isLoading ? (
              <StatsCardSkeleton />
            ) : (
              <StatsCard
                title="Form Submissions"
                value={stats.formSubmissions}
                description="Total submissions received"
                icon={FileText}
              />
            )}
          </motion.div>
        </Suspense>

        <Suspense fallback={<StatsCardSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isLoading ? (
              <StatsCardSkeleton />
            ) : (
              <StatsCard
                title="Active Subscriptions"
                value={stats.activeSubscriptions}
                description="Recurring revenue streams"
                icon={Repeat}
                trend={8}
              />
            )}
          </motion.div>
        </Suspense>

        <Suspense fallback={<StatsCardSkeleton />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isLoading ? (
              <StatsCardSkeleton />
            ) : (
              <StatsCard
                title="Revenue"
                value={stats.revenue}
                description="Total revenue this month"
                icon={CreditCard}
                trend={15}
              />
            )}
          </motion.div>
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest client interactions and form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : recentActivity.length > 0 ? (
                recentActivity.map(activity => (
                  <ActivityItem
                    key={activity.id}
                    iconName={activity.iconName}
                    title={activity.title}
                    description={activity.description}
                    time={activity.time}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent activity found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                View Latest Submissions
              </button>
              <button className="w-full p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                Generate Invoice
              </button>
              <button className="w-full p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                Add New Client
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
