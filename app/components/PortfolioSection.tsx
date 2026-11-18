import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useRouteLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { parsePortfolio, type PortfolioRow } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { type PortfolioProjectMeta } from "@/lib/portfolio-meta";
import IframePreview from "./IframePreview";
import "./studio-sections.css";

const caseStudies: Record<string, string> = {
  "dr-dipti-ganatra": "/portfolio/dr-dipti-ganatra",
  "jupiter-finance": "/portfolio/jupiter-fast-finance",
  "corporate-zone": "/portfolio/corporate-zone",
};
const projectTypes: Record<string, string> = {
  "dr-dipti-ganatra": "Healthcare · Business website",
  "jupiter-finance": "Finance · Business website",
  "corporate-zone": "Wholesale · Product catalog",
};

function ProjectCard({ project, index, showcase = false }: { project: PortfolioProjectMeta; index: number; showcase?: boolean }) {
  const caseStudy = (project as PortfolioProjectMeta & {caseStudyPath?:string}).caseStudyPath ?? caseStudies[project.slug];
  const content = <>
    <div className="sn-project__visual">
      <div className="sn-project__browser" aria-hidden="true"><span /><span /><span /><p>{new URL(project.liveUrl).hostname}</p><ArrowUpRight size={12} /></div>
      <div className="sn-project__preview">
        {project.useIframePreview
          ? <IframePreview src={project.liveUrl} title={project.title} />
          : <img src={project.image} alt={`${project.title} website designed and built by SiteNova`} width={1200} height={675} loading="lazy" decoding="async" />}
      </div>
      <span className="sn-project__open" aria-hidden="true"><ArrowUpRight size={22} /></span>
    </div>
    <div className="sn-project__details">
      <div><p className="sn-project__category">{projectTypes[project.slug] || (project.isSpecialHighlight ? "SiteNova product · Interactive tools" : "SiteNova design demo")}</p><h3>{project.title}</h3></div>
      <span className="sn-project__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <p className="sn-project__description">{project.description}</p>
      <span className="sn-text-link">{caseStudy ? "View case study" : "Explore live website"}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </div>
  </>;
  const className = cn("sn-project", showcase && "sn-project--demo");
  return caseStudy
    ? <Link to={caseStudy} className={className} aria-label={`View ${project.title} case study`}>{content}</Link>
    : <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={className} aria-label={`Open ${project.title} live website`}>{content}</a>;
}

export default function PortfolioSection({ mode = "all" }: { mode?: "all" | "customers" | "showcases" }) {
  const loaded = useRouteLoaderData("routes/portfolio._index") as {projects:PortfolioRow[];available:boolean}|undefined;
  const [catalog, setCatalog] = useState(loaded ?? {projects:[] as PortfolioRow[],available:true});
  useEffect(() => {
    if (loaded) { setCatalog(loaded); return; }
    let active = true;
    fetch("/api/portfolio").then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { if(active) setCatalog({projects:parsePortfolio(data.projects),available:true}); })
      .catch(() => { if(active) setCatalog({projects:[],available:false}); });
    return () => { active = false; };
  }, [loaded]);
  const customerProjects = catalog.projects.filter(row=>row.is_visible && row.category==="client").map(row=>row.project);
  const showcaseProjects = catalog.projects.filter(row=>row.is_visible && row.category==="showcase").map(row=>row.project);
  const demosOnly = mode === "showcases";
  return <section id={demosOnly ? "showcases" : "portfolio"} className="sn-section sn-work" aria-labelledby={`${mode}-portfolio-title`}>
    <div className="sn-container">
      {!catalog.available && <p role="status">Projects are temporarily unavailable. Please try again shortly.</p>}
      <div className="sn-section-head">
        <div><p className="sn-kicker">{demosOnly ? "The design playground" : "Selected client work"}</p><h2 id={`${mode}-portfolio-title`}>{demosOnly ? <>More ideas.<br />More possibilities.</> : <>Different businesses.<br />Distinctly their own.</>}</h2></div>
        <p className="sn-section-intro">{demosOnly ? "Explore our live design demos and digital products. A starting point for a conversation about your own website." : "A clinic, a finance firm, a wholesale business. See how we turn a real business into a clear, considered online experience."}</p>
      </div>
      {mode !== "showcases" && <div className="sn-projects sn-projects--clients">{customerProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>}
      {mode !== "customers" && <div className="sn-demo-group">{mode === "all" && <h3 className="sn-subheading">Design demos &amp; SiteNova products</h3>}<div className="sn-projects sn-projects--demos">{showcaseProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} showcase />)}</div></div>}
      {!demosOnly && <div className="sn-work-bottom"><p>Have a different kind of business? Let’s make something that feels like you.</p><Link to="/quote" className="sn-text-link">Discuss your website<ArrowUpRight size={18} aria-hidden="true" /></Link></div>}
    </div>
  </section>;
}
