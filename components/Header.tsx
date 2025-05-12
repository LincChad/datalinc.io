"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 ml-4">
            <Image
              src="/Datalinc-2.png"
              alt="Datalinc"
              width={120}
              height={40}
              className="h-16 w-auto"
            />
          </Link>
          <nav className="flex items-center space-x-4 mr-4">
            <Button variant="ghost" asChild>
              <Link href="#services">What we do</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#contact">Contact</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
