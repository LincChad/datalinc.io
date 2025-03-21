"use client"

import { Suspense } from "react"
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
  Repeat, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock,
  PlusCircle,
  BarChart3
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Subscription card component
function SubscriptionCard({
  client,
  plan,
  amount,
  billingCycle,
  nextBilling,
  status,
  avatar,
}: {
  client: string
  plan: string
  amount: number
  billingCycle: "monthly" | "yearly" | "quarterly"
  nextBilling: string
  status: "active" | "pending" | "canceled"
  avatar: string
}) {
  const statusColor = {
    active: "text-emerald-500",
    pending: "text-amber-500",
    canceled: "text-gray-400",
  }

  const cycleText = {
    monthly: "Monthly",
    yearly: "Yearly",
    quarterly: "Quarterly",
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={avatar} alt={client} />
            <AvatarFallback>{client.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{client}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-primary/10 ${statusColor[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">{plan}</p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">${amount}/mo</p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">{cycleText[billingCycle]}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Next billing</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{nextBilling}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              View Details
            </button>
            <button className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              Manage Plan
            </button>
          </div>
          {status === "active" && (
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle className="h-3 w-3" />
              <span>Renews automatically</span>
            </div>
          )}
          {status === "pending" && (
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              <span>Awaiting confirmation</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Dummy subscription data
const dummySubscriptions = [
  {
    id: 1,
    client: "Acme Corporation",
    plan: "Enterprise Plan",
    amount: 499,
    billingCycle: "monthly" as const,
    nextBilling: "May 15, 2023",
    status: "active" as const,
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: 2,
    client: "Globex Inc",
    plan: "Business Plan",
    amount: 299,
    billingCycle: "yearly" as const,
    nextBilling: "Dec 12, 2023",
    status: "active" as const,
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 3,
    client: "Stark Industries",
    plan: "Enterprise Plan",
    amount: 499,
    billingCycle: "quarterly" as const,
    nextBilling: "Jun 30, 2023",
    status: "pending" as const,
    avatar: "https://i.pravatar.cc/150?img=23",
  },
  {
    id: 4,
    client: "Wayne Enterprises",
    plan: "Professional Plan",
    amount: 199,
    billingCycle: "monthly" as const,
    nextBilling: "May 02, 2023",
    status: "active" as const,
    avatar: "https://i.pravatar.cc/150?img=24",
  },
  {
    id: 5,
    client: "Umbrella Corporation",
    plan: "Starter Plan",
    amount: 99,
    billingCycle: "monthly" as const,
    nextBilling: "May 18, 2023",
    status: "canceled" as const,
    avatar: "https://i.pravatar.cc/150?img=25",
  },
]

export default function SubscriptionsPage() {
  // Calculate summary data
  const activeSubscriptions = dummySubscriptions.filter(
    (subscription) => subscription.status === "active"
  ).length
  
  const monthlyRecurringRevenue = dummySubscriptions
    .filter((subscription) => subscription.status === "active")
    .reduce((sum, subscription) => sum + subscription.amount, 0)

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Subscriptions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage recurring revenue and subscription plans
        </motion.p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Repeat className="h-4 w-4 text-primary" />
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{activeSubscriptions}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="h-3 w-3 mr-1" />
                  Current subscribers
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
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Monthly Recurring Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">${monthlyRecurringRevenue}</div>
                <div className="flex items-center text-xs text-emerald-500">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  <span>+8% from last month</span>
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
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">12</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  In the next 30 days
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>
              Overview of your available subscription plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <h3 className="font-medium">Starter Plan</h3>
                  <p className="text-sm text-muted-foreground">Basic features for small businesses</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">$99/mo</div>
                  <p className="text-xs text-muted-foreground">12 active subscribers</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <h3 className="font-medium">Professional Plan</h3>
                  <p className="text-sm text-muted-foreground">Advanced features for growing teams</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">$199/mo</div>
                  <p className="text-xs text-muted-foreground">24 active subscribers</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <h3 className="font-medium">Business Plan</h3>
                  <p className="text-sm text-muted-foreground">Complete solution for established businesses</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">$299/mo</div>
                  <p className="text-xs text-muted-foreground">18 active subscribers</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                <div>
                  <h3 className="font-medium">Enterprise Plan</h3>
                  <p className="text-sm text-muted-foreground">Custom solutions for large organizations</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">$499/mo</div>
                  <p className="text-xs text-muted-foreground">8 active subscribers</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common subscription management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                <PlusCircle className="h-4 w-4 text-primary" />
                <span>Create New Plan</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Update Pricing</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>View Analytics</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded-lg hover:bg-primary/10 transition-colors">
                <Users className="h-4 w-4 text-primary" />
                <span>Manage Subscribers</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <PlusCircle className="h-4 w-4" />
            <span>Add Subscription</span>
          </button>
        </div>

        <div className="space-y-4">
          {dummySubscriptions.map((subscription) => (
            <motion.div 
              key={subscription.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * subscription.id }}
            >
              <SubscriptionCard
                client={subscription.client}
                plan={subscription.plan}
                amount={subscription.amount}
                billingCycle={subscription.billingCycle}
                nextBilling={subscription.nextBilling}
                status={subscription.status}
                avatar={subscription.avatar}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 