"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const services = [
  {
    title: "Custom Software Development",
    description: "Tailored solutions that solve your unique business challenges with cutting-edge technology.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format",
    alt: "Code on computer screen",
    link: "/software-development"
  },
  {
    title: "Web Development",
    description: "Beautiful, responsive websites that engage your audience and drive conversions.",
    image: "/images/outdooroasis.png",
    alt: "Outdoor oasis screenshot",
    link: "/web-development"
  },
  {
    title: "SaaS Solutions",
    description: "Cloud-based software that scales with your business and delivers value to your customers.",
    image: "/images/customisedresume.png",
    alt: "Customising resume app",
    link: "/saas-development"
  }, 
  {
    title: "Data Analysis",
    description: "Extract insights from your data to drive informed decisions and growth.",
    image: "/images/turbinedata.png",
    alt: "Turbine data",
    link: "/data-analysis"
  },
];

export default function About() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-background/95 mx-4">
      <div className="container max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              Crafting Digital Excellence
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mt-4 text-xl text-muted-foreground"
            >
              We transform ideas into powerful digital solutions, helping businesses thrive in the modern world.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full max-w-md"
              >
                <Card className="overflow-hidden border-0 bg-background/40 backdrop-blur h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Link href={service.link}>
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                    </Link>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From startups to enterprises, we deliver scalable solutions that adapt to your evolving needs. 
              Our expertise spans across modern tech stacks, ensuring your project leverages the latest innovations.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
