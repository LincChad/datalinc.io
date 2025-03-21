"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo/Logo";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center w-full mx-4 mt-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-background to-background/80 -z-10" />
      
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-w-7xl mx-auto">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                Transform Your Digital Vision Into Reality
              </h1>
              <p className="text-xl text-muted-foreground md:w-[85%]">
                We craft exceptional web experiences that drive growth and innovation for forward-thinking businesses.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                View Our Work
              </Button>
            </div>
          </motion.div>

          {/* Right content - Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative h-[700px] w-full"
          >
            <Logo />
          </motion.div>
        </div>
      </div>
    </div>
  )
}