import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const projects = [
  {
    title: "Customer Management System",
    description:
      "Engineered a custom customer management system for a startup to help them manage their customers and orders.",
    image:
      "https://images.unsplash.com/photo-1641736494173-e7d5775121b2?q=80&w=2940&auto=format",
    alt: "Customer management system",
    url: "https://datalinc.com.au",
  },
  {
    title: "Chrome Extention App",
    description:
      "Developed light weight chrome extension app for a startup to help them track their notes and gain a Google backlink.",
    image:
      "https://images.unsplash.com/photo-1730818875491-6cab2653a0ec?q=80&w=2940&auto=format",
    alt: "Chrome extension app for note taking",
    url: "https://chromewebstore.google.com/detail/jotbox/hfemjgkepcllhogddebkbekfnafbbljj",
  },
  {
    title: "Quoting Automation With AI",
    description:
      "Created a quoting automation tool for a quoting company to help them automate their quoting process.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=3132&auto=format",
    alt: "Quoting automation with AI",
    url: "https://elitecretegc.com.au",
  },
];

export default function SoftwareDevelopmentPage() {
  return (
    <>
      <Header />
      <section className="py-24 bg-gradient-to-b from-background to-background/95 mx-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Software Development Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Datalinc delivers custom software solutions that solve your unique
              business challenges. From desktop to mobile, we build secure,
              scalable, and maintainable applications.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
            {projects.map((project) => (
              <Card
                key={project.title}
                className="overflow-hidden border-0 bg-background/40 backdrop-blur h-full"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  <Link href={project.url} className="pt-12 text-blue-600">
                    View Project
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-white max-w-2xl mx-auto">
              We engineer robust software for startups and enterprises,
              leveraging modern tech stacks and best practices.
            </p>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}
