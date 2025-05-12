import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const projects = [
  {
    title: "Landscaper Website Redesign",
    description:
      "Revamped a landscaping company's marketing site for better conversion and mobile experience.",
    image: "/images/outdooroasis.png",
    alt: "Landscaper website",
    url: "https://www.outdooroasis.com.au/",
  },
  {
    title: "E-commerce Platform",
    description:
      "Developed a scalable, high-performance e-commerce platform with custom checkout and Stripe integration.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=800&auto=format",
    alt: "E-commerce website",
    url: "https://datalinc.com.au",
  },
  {
    title: "Blogging Website",
    description:
      "Built a fast, SEO-optimized blogging website for a startup to help them share their knowledge and insights with their audience.",
    image: "/images/qwiksmarts.png",
    alt: "Blogging website",
    url: "https://qwiksmart.com",
  },
];

export default function WebDevelopmentPage() {
  return (
    <>
      <Header />
      <section className="py-24 bg-gradient-to-b from-background to-background/95 mx-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Web Development Services
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Datalinc crafts beautiful, responsive, and high-performance
              websites that engage your audience and drive results. From landing
              pages to complex web apps, we deliver modern web experiences.
            </p>
            <p className="text-xl text-muted-foreground">
              We service most of our Web Development clients in Australia, with
              our head office in Sydney, NSW. We also offer other services
              through our agency{" "}
              <Link href="https://datalinc.com.au" className="text-blue-600">
                Datalinc
              </Link>
              .
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
                  <Link href={project.url} className="pt-12 text-blue-600">
                    View Project
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-white max-w-2xl mx-auto">
              We use the latest web technologies to ensure your site is fast,
              secure, and scalable.
            </p>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}
