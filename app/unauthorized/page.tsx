import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="p-8 mx-auto max-w-md bg-card/50 backdrop-blur-sm border rounded-lg shadow-lg">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Access Denied
        </h1>
        <p className="text-muted-foreground">
          You don&apos;t have permission to access this page
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/"
            className="px-4 py-2 rounded-md border bg-background hover:bg-accent transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            href="/auth/login"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
} 