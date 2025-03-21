"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Mail,
  Globe,
  Phone,
  MapPin,
  FileText,
  Edit,
  Trash2,
  Hash,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getClient,
  deleteClient,
  ClientDetails,
} from "@/app/actions/client-actions";
import { useParams } from "next/navigation";
import { getFormConfigs, createFormConfig, updateFormConfig, deleteFormConfig } from "@/app/actions/form-config-actions";
import { FormConfigCard } from "@/components/forms/FormConfigCard";

function ClientSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusMap = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  const className =
    statusMap[status as keyof typeof statusMap] || "bg-gray-100 text-gray-800";

  return (
    <Badge variant="outline" className={`${className} capitalize`}>
      {status}
    </Badge>
  );
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[];
}

interface FormConfigUpdate {
  form_type: 'contact' | 'quote' | 'support' | 'other';
  recipient_emails: string[];
  success_message: string;
  is_active: boolean;
  email_template: string | null;
  form_fields: FormField[] | null;
}

interface ClientFormConfig extends FormConfigUpdate {
  id: string;
}

export default function ClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formConfigs, setFormConfigs] = useState<ClientFormConfig[]>([]);

  useEffect(() => {
    async function loadClient() {
      setIsLoading(true);
      try {
        const [clientData, formConfigsData] = await Promise.all([
          getClient(id),
          getFormConfigs(id)
        ]);
        setClient(clientData);
        setFormConfigs(formConfigsData);
      } catch (err) {
        console.error("Error loading client:", err);
        setError("Failed to load client details");
      } finally {
        setIsLoading(false);
      }
    }

    loadClient();
  }, [id]);

  async function handleDeleteClient() {
    setIsDeleting(true);
    try {
      const result = await deleteClient(id);

      if (!result.success) {
        toast.error(result.error || "Failed to delete client");
        setShowDeleteDialog(false);
        return;
      }

      toast.success(result.message || "Client deleted successfully");
      router.push("/dashboard/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  const handleCreateForm = async () => {
    try {
      const newConfig = await createFormConfig(id, {
        form_type: "contact",
        recipient_emails: [client?.email || ""],
        success_message: "Thank you for your submission. We'll get back to you shortly.",
        is_active: true,
        email_template: null,
        form_fields: null
      });
      setFormConfigs([newConfig, ...formConfigs]);
      toast.success("Form configuration created successfully");
    } catch (error: unknown) {
      console.error("Error creating form:", error);
      toast.error("Failed to create form configuration");
    }
  };

  const handleUpdateForm = async (configId: string, data: Partial<FormConfigUpdate>) => {
    try {
      const updatedConfig = await updateFormConfig(configId, {
        form_type: data.form_type || 'contact',
        recipient_emails: data.recipient_emails || [],
        success_message: data.success_message || 'Thank you for your submission.',
        is_active: data.is_active ?? true,
        email_template: data.email_template || null,
        form_fields: data.form_fields || null
      });
      setFormConfigs(formConfigs.map(config => 
        config.id === configId ? updatedConfig : config
      ));
    } catch (error: unknown) {
      console.error("Error updating form:", error);
      throw error;
    }
  };

  const handleDeleteForm = async (configId: string) => {
    try {
      await deleteFormConfig(configId);
      setFormConfigs(formConfigs.filter(config => config.id !== configId));
      toast.success("Form configuration deleted successfully");
    } catch (error: unknown) {
      console.error("Error deleting form:", error);
      toast.error("Failed to delete form configuration");
    }
  };

  if (isLoading) {
    return <ClientSkeleton />;
  }

  if (error || !client) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "Client not found"}</p>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard/clients">
            <Button>Return to Clients</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight p-4"
          >
            {client.name}
          </motion.h1>
          <StatusBadge status={client.status} />
        </div>

        <div className="flex gap-2">
          <Link href={`/dashboard/clients/${id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Client
            </Button>
          </Link>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Client</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {client.name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClient}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Client"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Client Details</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Details about {client.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Client ID</p>
                  <p className="text-muted-foreground">{client.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Company</p>
                  <p className="text-muted-foreground">
                    {client.company_name || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">
                    {client.email || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <a
                    href={client.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {client.domain || "Not specified"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Contact Phone</p>
                  <p className="text-muted-foreground">
                    {client.contact_phone || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    {client.address || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Notes</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {client.notes || "No notes"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Client added on {new Date(client.created_at).toLocaleDateString()}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Form Configurations</h2>
            <Button onClick={handleCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>

          <div className="grid gap-6">
            {formConfigs.map((config) => (
              <FormConfigCard
                key={config.id}
                config={config}
                onSave={(data) => handleUpdateForm(config.id, data)}
                onDelete={() => handleDeleteForm(config.id)}
              />
            ))}
            {formConfigs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No form configurations yet. Create one to get started.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                Invoices associated with {client.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No invoices found for this client.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Create New Invoice</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
