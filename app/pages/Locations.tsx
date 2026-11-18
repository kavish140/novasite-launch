import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { locationContent } from "@/lib/location-content";

export default function Locations() {
  return <PageTransition><div className="studio-page studio-locations min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="mx-auto max-w-6xl px-6 pt-32 pb-20">
      <h1 className="font-heading text-4xl font-bold">Local business website guides</h1>
      <p className="mt-5 max-w-3xl text-lg text-muted-foreground">Explore the business context, website priorities and practical questions for each service area. SiteNova is based in Mulund; these guides describe service coverage, not separate branch offices.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {Object.entries(locationContent).map(([name, market]) => <Link key={name} to={`/location/${name.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50">
          <h2 className="font-heading text-xl font-semibold">{name}</h2>
          <p className="mt-2 font-medium">{market.heading}</p>
          <p className="mt-3 text-sm text-muted-foreground">{market.introduction}</p>
        </Link>)}
      </div>
    </main><Footer />
  </div></PageTransition>;
}
