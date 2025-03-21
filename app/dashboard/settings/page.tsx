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
  User,
  Bell,
  CreditCard,
  Lock,
  UserCog,
  Globe,
  Mail,
  Key,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  LucideIcon
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Setting section component
function SettingSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

// Toggle switch component
function Toggle({
  label,
  description,
  enabled = false,
}: {
  label: string
  description: string
  enabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          enabled ? "bg-primary" : "bg-input"
        }`}
      >
        <span 
          className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`} 
        />
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Manage your account preferences and settings
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SettingSection
              icon={User}
              title="Profile Information"
              description="Update your account profile information"
            >
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-primary/10">
                  <AvatarImage src="https://i.pravatar.cc/150?img=31" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  <button className="text-xs text-primary mt-1">
                    Change profile picture
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Full Name
                  </label>
                  <input
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email Address
                  </label>
                  <input
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Company
                  </label>
                  <input
                    className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value="Acme Corporation"
                  />
                </div>
                <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </SettingSection>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SettingSection
              icon={Bell}
              title="Notification Preferences"
              description="Configure how you receive notifications"
            >
              <div className="space-y-3 divide-y divide-border">
                <Toggle
                  label="Email Notifications"
                  description="Receive email notifications for important updates"
                  enabled={true}
                />
                <Toggle
                  label="SMS Notifications"
                  description="Get text messages for critical alerts"
                  enabled={false}
                />
                <Toggle
                  label="Browser Notifications"
                  description="Show notifications in your browser"
                  enabled={true}
                />
                <Toggle
                  label="Marketing Emails"
                  description="Receive product updates and promotional content"
                  enabled={false}
                />
              </div>
            </SettingSection>
          </motion.div>
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SettingSection
              icon={CreditCard}
              title="Billing Information"
              description="Manage your billing details and payment methods"
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Payment Methods</h3>
                <div className="p-3 rounded-lg border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-14 bg-primary/10 rounded-md flex items-center justify-center text-xs font-medium">
                      VISA
                    </div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-primary/10">
                    Default
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Billing Address</h3>
                <div className="text-sm">
                  <p>John Doe</p>
                  <p>123 Business Avenue</p>
                  <p>San Francisco, CA 94107</p>
                  <p>United States</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                  Add Payment Method
                </button>
                <button className="px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                  Update Billing Address
                </button>
              </div>
            </SettingSection>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SettingSection
              icon={Lock}
              title="Security Settings"
              description="Manage account security and authentication"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Enabled</div>
                      <div className="text-xs text-muted-foreground">Your account is secured with app authentication</div>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Password</h3>
                  <button className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                    <Key className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>
                </div>
                <div className="pt-3 border-t border-border">
                  <h3 className="text-sm font-medium mb-2">Sessions</h3>
                  <div className="text-xs text-muted-foreground mb-2">
                    You&apos;re currently logged in on 2 devices
                  </div>
                  <button className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                    <UserCog className="h-4 w-4" />
                    <span>Manage Sessions</span>
                  </button>
                </div>
              </div>
            </SettingSection>
          </motion.div>
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[150px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-primary" />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[150px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  Email Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Toggle
                    label="Newsletter"
                    description="Product updates and news"
                    enabled={true}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[150px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                    Contact Support
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-md bg-primary/10 text-sm hover:bg-primary/20 transition-colors">
                    Documentation
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>
      </div>

      <div>
        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-rose-500">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all of your data
                    </p>
                  </div>
                  <button className="px-3 py-2 rounded-md bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors">
                    Delete Account
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>
      </div>
    </div>
  )
} 