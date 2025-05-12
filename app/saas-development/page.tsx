import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const projects = [
  {
    title: "Resume Builder Platform",
    description:
      "Developed a resume builder platform with AI tailoring and Stripe integration.",
    image: "/images/customisedresume.png",
    alt: "Resume builder platform",
    url: "https://customisedresume.com/",
  },
  {
    title: "Team Collaboration Suite",
    description:
      "Built a real-time collaboration tool for distributed teams, featuring chat, file sharing, and project management.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format",
    alt: "Collaboration software",
    url: "https://datalinc.com.au",
  },
  {
    title: "API-as-a-Service",
    description:
      "Launched a scalable API platform for developers, with usage analytics and automated onboarding.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format",
    alt: "API service",
    url: "https://datalinc.com.au",
  },
];

export default function SaasDevelopmentPage() {
  return (
    <>
      <Header />
      <section className="py-24 bg-gradient-to-b from-background to-background/95 mx-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              SaaS Development Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Datalinc builds scalable, secure, and user-friendly SaaS products.
              We handle everything from MVP to full-scale launch, including
              payments, onboarding, and analytics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
            {projects.map((project) => (
              <Card
                key={project.title}
                className="overflow-hidden border-0 bg-background/40 backdrop-blur h-full"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Link href={project.url} target="_blank">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  <Link
                    href={project.url}
                    target="_blank"
                    className="pt-12 text-blue-600"
                  >
                    View Project
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-white max-w-2xl mx-auto">
              From SaaS MVPs to enterprise platforms, Datalinc delivers cloud
              solutions that scale with your business.
            </p>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}
