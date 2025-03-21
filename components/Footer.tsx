"use client";

import Link from "next/link";
import Logo from "./Logo/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 py-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-2 h-12 w-12">
              <Logo autoRotate={true} />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex flex-col md:items-center">
            <p className="text-center">Datalinc Pty Ltd © {new Date().getFullYear()} All rights reserved </p>
            <p className="text-center">ABN: 28682714030 ACN: 682714030</p>
          </div>
          
          <div className="flex flex-col space-y-2 md:items-end">
            <Link 
              href="/privacy-policy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-service" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
