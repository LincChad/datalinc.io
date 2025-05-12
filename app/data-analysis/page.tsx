import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    title: "E-commerce Analytics Dashboard",
    description:
      "Built a real-time analytics dashboard for a retail client, enabling actionable insights from sales and customer data.",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format",
    alt: "Analytics dashboard screenshot",
  },
  {
    title: "Wind Turbine Data Pipeline",
    description:
      "Automated data ingestion and analysis for a wind turbine construction company, improving turbine performance with predictive analytics.",
    image: "/images/turbinedata.png",
    alt: "Wind turbine data pipeline",
  },
  {
    title: "Financial Forecasting Tool",
    description:
      "Developed a forecasting tool for a fintech startup, leveraging machine learning to predict market trends.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=800&auto=format",
    alt: "Financial forecasting",
  },
];

export default function DataAnalysisPage() {
  return (
    <>
      <Header />
      <section className="py-24 bg-gradient-to-b from-background to-background/95 mx-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Data Analysis Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Unlock the power of your data. Datalinc helps you extract
              actionable insights, automate reporting, and drive smarter
              business decisions with advanced analytics and visualization.
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
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-16 text-center">
            <p className="text-xl text-white max-w-2xl mx-auto">
              From data pipelines to dashboards, Datalinc delivers scalable
              analytics solutions tailored to your business needs.
            </p>
          </div>
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}
