"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientDetails, ClientFormData, getClient, updateClient } from "@/app/actions/client-actions"

// Form schema matching our ClientFormData type
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  domain: z.string().url({ message: "Please enter a valid URL for the domain." }),
  company_name: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

function ClientEditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [client, setClient] = useState<ClientDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize form with react-hook-form
  const form = useForm<ClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      domain: "",
      company_name: "",
      status: "active",
      contact_person: "",
      contact_phone: "",
      address: "",
      notes: "",
    },
  })
  
  // Load client data
  useEffect(() => {
    async function loadClient() {
      setIsLoading(true)
      try {
        const clientData = await getClient(id)
        setClient(clientData)
        
        // Set form values from client data
        form.reset({
          name: clientData.name,
          email: clientData.email,
          domain: clientData.domain || "",
          company_name: clientData.company_name || "",
          status: clientData.status,
          contact_person: clientData.contact_person || "",
          contact_phone: clientData.contact_phone || "",
          address: clientData.address || "",
          notes: clientData.notes || "",
        })
      } catch (err) {
        console.error("Error loading client:", err)
        setError("Failed to load client details")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadClient()
  }, [id, form])
  
  // Handle form submission
  async function onSubmit(values: ClientFormData) {
    setIsSaving(true)
    try {
      const result = await updateClient(id, values)
      
      if (!result.success) {
        toast.error(result.error || "Failed to update client")
        return
      }
      
      toast.success(result.message || "Client updated successfully")
      router.push(`/dashboard/clients/${id}`)
    } catch (error) {
      console.error("Error updating client:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return <ClientEditSkeleton />
  }
  
  if (error || !client) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-red-500">{error || "Client not found"}</p>
        <Button asChild>
          <Link href="/dashboard/clients">Back to Clients</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href={`/dashboard/clients/${id}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Client: {client.name}</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation Ltd" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>The official registered name of the company</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 123 456 7890" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Business St, City, Country" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional notes about this client..."
                      className="min-h-32"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/clients/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? "Saving..." : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 