"use client"

import { Suspense, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileSpreadsheet,
  Download,
  Eye,
  Calendar,
  AlertCircle
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { getSubmissions, FormSubmission, SubmissionStats } from "@/app/actions/submission-actions"

// Submission card component
function SubmissionCard({
  id,
  domain,
  status,
  submittedBy,
  submittedAt,
  formType,
  avatar,
}: {
  id: string
  domain: string
  status: "completed" | "pending" | "rejected" | "new"
  submittedBy: string
  submittedAt: string
  formType: string
  avatar?: string
}) {
  const statusIcon = {
    completed: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    rejected: <XCircle className="h-4 w-4 text-rose-500" />,
    new: <FileText className="h-4 w-4 text-blue-500" />
  }

  const statusText = {
    completed: "Completed",
    pending: "Pending",
    rejected: "Rejected",
    new: "New"
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{formType.charAt(0).toUpperCase() + formType.slice(1)} Form</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10">
              {domain}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {statusIcon[status]}
              <span className="text-xs">{statusText[status]}</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={avatar} alt={submittedBy} />
                <AvatarFallback>{submittedBy.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{submittedBy}</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{formatDate(submittedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/submissions/${id}`} className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <Eye className="h-4 w-4 text-muted-foreground" />
          </Link>
          <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
            <Download className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton
function SubmissionCardSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border">
      <CardContent className="p-6 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardContent>
    </Card>
  )
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    thisMonth: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    new: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      
      try {
        // Use the server action to get submissions
        const data = await getSubmissions()
        setSubmissions(data.submissions)
        setStats(data.stats)
        console.log(`Retrieved ${data.submissions.length} submissions`)
      } catch (err) {
        console.error('Error fetching submissions:', err)
        setError(err instanceof Error ? err.message : 'Failed to load submissions')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
        >
          Form Submissions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          View and manage all submitted forms
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
        <Suspense fallback={<Skeleton className="h-[100px]" />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : stats.total}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <FileText className="h-3 w-3 mr-1" />
                  All time submissions
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
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : stats.thisMonth}
                </div>
                <div className="flex items-center text-xs text-emerald-500">
                  <span className="text-muted-foreground mr-1">New submissions this month</span>
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
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : stats.completed}
                </div>
                <div className="flex items-center text-xs">
                  <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                  <span className="text-muted-foreground">Processed submissions</span>
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
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : stats.pending + stats.new}
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1 text-amber-500" />
                  <span className="text-muted-foreground">Awaiting action</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Suspense>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Submissions</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-card hover:bg-card/80 border border-border transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-card hover:bg-card/80 border border-border transition-colors">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
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
              <SubmissionCardSkeleton />
            </motion.div>
          ))
        ) : submissions.length > 0 ? (
          // Show actual submission data
          submissions.map((submission: FormSubmission, index: number) => {
            // Debug client data
            console.log(`Submission ${index}:`, {
              id: submission.id,
              status: submission.status,
              clientId: submission.client_id,
              clientData: submission.clients,
            });
            
            // Safely extract domain with fallback
            const clientDomain = submission.clients?.domain 
              ? submission.clients.domain.replace(/(^\w+:|^)\/\//, '') 
              : 'Unknown';
            
            return (
              <motion.div 
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <SubmissionCard
                  id={submission.id}
                  domain={clientDomain}
                  status={submission.status}
                  submittedBy={submission.sender_name}
                  submittedAt={submission.submitted_at}
                  formType={submission.form_type}
                />
              </motion.div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground py-8">No submissions found.</p>
        )}
      </div>
    </div>
  )
} 