import "./studio-sections.css";

const technologies = ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Figma", "Node.js", "Supabase"];

export default function TechMarquee() {
  return <div className="sn-tech" aria-label="Technologies we use"><div className="sn-container"><p>Thoughtfully designed.<br />Built with modern tools.</p><ul>{technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul></div></div>;
}
