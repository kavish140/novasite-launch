import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Content from "@/components/FaqSection";
import { Link } from "react-router";

export default function Page() {

  return <div className="studio-home min-h-screen bg-background text-foreground"><Navbar /><main id="main-content"><header className="studio-container studio-directory-heading"><p className="studio-eyebrow">Explore SiteNova</p><h1>FAQ</h1><p>Take a closer look, then let’s talk about your website.</p></header><div><Content /></div><div className="studio-container py-8"><Link to="/quote" className="studio-button">Discuss your project ↗</Link></div></main><Footer /></div>;
}
