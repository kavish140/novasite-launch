import { Link } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { JsonLd } from "@/components/JsonLd";
import { buildLocationJsonLd } from "@/lib/locationMeta";
import { locationContent } from "@/lib/location-content";

export default function LocationPageTemplate({ locationName }: { locationName: string }) {
  const market = locationContent[locationName];
  if (!market) throw new Error(`Missing local editorial data: ${locationName}`);
  return <PageTransition><div className="min-h-screen bg-background text-foreground">
    <JsonLd data={buildLocationJsonLd(locationName)} />
    <Navbar />
    <main className="pt-32 pb-20 mx-auto max-w-5xl px-6">
      <header className="mb-12">
        <Link to="/" className="text-sm text-primary">SiteNova · Mumbai web design</Link>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold mt-5">Web design for {locationName} businesses</h1>
        <p className="mt-6 text-lg text-muted-foreground">{market.introduction}</p>
        <Link className="mt-6 inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold" to="/quote" state={{ projectType: "Business Website", requirements: `Client located near: ${locationName}. Interested in building a local business website.` }}>Discuss your website</Link>
      </header>
      <section className="prose dark:prose-invert max-w-none prose-headings:font-heading">
        <h2>{market.heading}</h2>
        {market.localBusinessLandscape.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
      <section className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="search-intent">
        <h2 id="search-intent" className="text-2xl font-heading font-semibold">Search intent and website priorities</h2>
        <p className="text-xs text-muted-foreground mt-2">Illustrative queries · no measured keyword volumes</p>
        <ul className="my-5 list-disc pl-6 space-y-2">{market.localSearchBehavior.queries.map((query) => <li key={query}>{query}</li>)}</ul>
        <p className="text-muted-foreground leading-relaxed">{market.localSearchBehavior.analysis}</p>
        <p className="mt-4 text-muted-foreground leading-relaxed">{market.localSearchBehavior.competition}</p>
      </section>
      <section className="mt-12 border-l-2 border-primary pl-6">
        <h2 className="font-heading text-2xl font-semibold">{market.caseStudyHighlight.title}</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">{market.caseStudyHighlight.relevance}</p>
        <Link className="mt-4 inline-block text-primary underline underline-offset-4" to={`/portfolio/${market.caseStudyHighlight.slug}`}>Read the project case study</Link>
      </section>
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-semibold mb-6">Planning questions from this business context</h2>
        <div className="space-y-4">{market.suburbSpecificFAQs.map(({ q, a }) => <details key={q} className="rounded-xl border border-border p-5"><summary className="font-semibold cursor-pointer">{q}</summary><p className="mt-3 text-muted-foreground leading-relaxed">{a}</p></details>)}</div>
      </section>
      <div className="mt-10 text-sm text-muted-foreground flex flex-wrap gap-4">
        <a href={market.source.url} rel="noopener noreferrer" target="_blank">Geographic context: {market.source.label}</a>
        <p className="basis-full">Business examples are editorial planning scenarios, not a census of local firms or measured search demand. The geographic reference does not endorse these recommendations.</p>
        <Link to="/pricing" className="text-primary">Current packages and pricing</Link>
        <Link to="/contact-us" className="text-primary">Contact SiteNova</Link>
      </div>
    </main><Footer />
  </div></PageTransition>;
}
