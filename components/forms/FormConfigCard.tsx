"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Save, Plus, Trash2, X } from "lucide-react";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: string[];
}

interface FormConfig {
  id: string;
  form_type: "contact" | "quote" | "support" | "other";
  recipient_emails: string[];
  success_message: string;
  is_active: boolean;
  email_template: string | null;
  form_fields: FormField[] | null;
}

interface FormConfigCardProps {
  config: FormConfig;
  onSave: (data: Partial<FormConfig>) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function FormConfigCard({ config, onSave, onDelete }: FormConfigCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const formSchema = z.object({
    form_type: z.enum(["contact", "quote", "support", "other"]).optional(),
    recipient_emails: z.array(z.string().email()).min(1).optional(),
    success_message: z.string().min(10).optional(),
    is_active: z.boolean().optional(),
    email_template: z.string().nullable().optional(),
    form_fields: z.array(z.object({
      name: z.string(),
      label: z.string(),
      type: z.enum(["text", "email", "tel", "textarea", "select", "checkbox"]),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
    })).nullable().optional(),
  });

  const form = useForm<Partial<FormConfig>>({
    resolver: zodResolver(formSchema) as ReturnType<typeof zodResolver<Partial<FormConfig>>>,
    defaultValues: {
      form_type: config.form_type,
      recipient_emails: config.recipient_emails,
      success_message: config.success_message,
      is_active: config.is_active,
      email_template: config.email_template,
      form_fields: Array.isArray(config.form_fields) ? config.form_fields : [],
    },
  });

  const recipientEmails = form.watch("recipient_emails") || [];

  const handleAddEmail = () => {
    if (!emailInput) return;

    try {
      // Validate email
      z.string().email().parse(emailInput);

      // Add to form
      const currentEmails = form.getValues("recipient_emails") || [];
      if (!currentEmails.includes(emailInput)) {
        form.setValue("recipient_emails", [...currentEmails, emailInput]);
      }

      // Clear input
      setEmailInput("");
    } catch {
      toast.error("Please enter a valid email address");
    }
  };

  const handleRemoveEmail = (email: string) => {
    const currentEmails = form.getValues("recipient_emails") || [];
    form.setValue(
      "recipient_emails",
      currentEmails.filter((e) => e !== email)
    );
  };

  const handleSave = async (data: Partial<FormConfig>) => {
    setIsSaving(true);
    try {
      await onSave(data);
      setIsEditing(false);
      toast.success("Form configuration updated");
    } catch (error: unknown) {
      console.error("Error updating form config:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update form configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = form.handleSubmit(handleSave);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>
            {(config.form_type ?? "new").charAt(0).toUpperCase() +
              (config.form_type ?? "new").slice(1)}{" "}
            Form
          </CardTitle>
          <CardDescription>
            Configure form settings and notifications
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {config && onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="form_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Type</FormLabel>
                  <Select
                    disabled={!isEditing}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a form type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient_emails"
              render={() => (
                <FormItem>
                  <FormLabel>Recipient Emails</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        disabled={!isEditing}
                        placeholder="Add email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddEmail();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!isEditing}
                        onClick={handleAddEmail}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipientEmails.map((email) => (
                        <Badge
                          key={email}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {email}
                          {isEditing && (
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveEmail(email)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="success_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Success Message</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!isEditing}
                      placeholder="Message to show after successful submission"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="email-template">
                <AccordionTrigger>Email Template</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="email_template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Template</FormLabel>
                        <FormDescription>
                          Customize the email notification template. Use{" "}
                          {"{field}"} for form field values.
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            disabled={!isEditing}
                            placeholder="Dear team,

New form submission received:
Name: {name}
Email: {email}
Message: {message}

Best regards,
{client_name}"
                            className="min-h-[200px] font-mono"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="form-fields">
                <AccordionTrigger>Form Fields</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="form_fields"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Form Fields</FormLabel>
                        <FormDescription>
                          Configure additional form fields beyond the standard
                          ones.
                        </FormDescription>
                        <div className="space-y-4">
                          {(field.value || [])?.map(
                            (formField: FormField, index: number) => (
                              <div
                                key={index}
                                className="flex gap-2 items-start border p-4 rounded-lg"
                              >
                                <div className="flex-1 space-y-2">
                                  <Input
                                    disabled={!isEditing}
                                    placeholder="Field name"
                                    value={formField.name}
                                    onChange={(e) => {
                                      const newFields = [
                                        ...(field.value || []),
                                      ];
                                      newFields[index] = {
                                        ...formField,
                                        name: e.target.value,
                                      };
                                      field.onChange(newFields);
                                    }}
                                  />
                                  <Input
                                    disabled={!isEditing}
                                    placeholder="Field label"
                                    value={formField.label}
                                    onChange={(e) => {
                                      const newFields = [
                                        ...(field.value || []),
                                      ];
                                      newFields[index] = {
                                        ...formField,
                                        label: e.target.value,
                                      };
                                      field.onChange(newFields);
                                    }}
                                  />
                                  <Select
                                    disabled={!isEditing}
                                    value={formField.type}
                                    onValueChange={(value) => {
                                      const newFields = [
                                        ...(field.value || []),
                                      ];
                                      newFields[index] = {
                                        ...formField,
                                        type: value as "text" | "email" | "tel" | "textarea" | "select" | "checkbox",
                                      };
                                      field.onChange(newFields);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Field type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="email">
                                        Email
                                      </SelectItem>
                                      <SelectItem value="tel">Phone</SelectItem>
                                      <SelectItem value="textarea">
                                        Text Area
                                      </SelectItem>
                                      <SelectItem value="select">
                                        Select
                                      </SelectItem>
                                      <SelectItem value="checkbox">
                                        Checkbox
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      disabled={!isEditing}
                                      checked={formField.required}
                                      onCheckedChange={(checked) => {
                                        const newFields = [
                                          ...(field.value || []),
                                        ];
                                        newFields[index] = {
                                          ...formField,
                                          required: checked,
                                        };
                                        field.onChange(newFields);
                                      }}
                                    />
                                    <FormLabel>Required</FormLabel>
                                  </div>
                                </div>
                                {isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newFields = [
                                        ...(field.value || []),
                                      ];
                                      newFields.splice(index, 1);
                                      field.onChange(newFields);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )
                          )}
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newFields = [...(field.value || [])];
                                newFields.push({
                                  name: "",
                                  label: "",
                                  type: "text",
                                  required: false,
                                });
                                field.onChange(newFields);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Field
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Enable or disable form submissions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={!isEditing}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          {isEditing && (
            <CardFooter>
              <Button type="submit" disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
