export type PortfolioProjectMeta = {
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  localFocus?: string;
};

export const showcaseProjects: PortfolioProjectMeta[] = [
  {
    slug: "ai-smartkit",
    title: "AI SmartKit",
    description:
      "A cutting-edge AI tools platform with a clean interface, intuitive navigation, and high-performance architecture.",
    image: "/assets/Aismartkit.webp",
    liveUrl: "https://aismartkit.tech",
    localFocus: "Global-ready SaaS presentation for international product users.",
  },
  {
    slug: "business-showcase",
    title: "Business Showcase",
    description:
      "A modern, premium business showcase showcasing state-of-the-art interactive sections and smooth user experiences.",
    image: "/assets/business-showcase.png",
    liveUrl: "https://buisness-showcase.sitenova.dev/",
    localFocus: "High-performance marketing site showing design aesthetics and templates.",
  },
  {
    slug: "design-showcase",
    title: "Design Showcase",
    description:
      "A premium UI/UX design system showcase displaying interactive components, modern typography, and curated color palettes.",
    image: "/assets/design-showcase.png",
    liveUrl: "http://design.sitenova.dev/",
    localFocus: "Modern design library displaying web aesthetics and component templates.",
  },
];

export const customerProjects: PortfolioProjectMeta[] = [
  {
    slug: "dr-dipti-ganatra",
    title: "Dr. Dipti Ganatra",
    description:
      "A professional clinic website designed for Dr. Dipti Ganatra with elegant branding and easy appointment flow.",
    image: "/assets/Drdiptiganatra.webp",
    liveUrl: "https://drdiptiganatra.com",
    localFocus: "Healthcare lead generation for Mumbai and Mulund audiences.",
  },
  {
    slug: "jupiter-finance",
    title: "Jupiter Fast Finance",
    description:
      "A sleek finance landing page with modern UI, clear call-to-actions, and responsive design across all devices.",
    image: "/assets/jupiterfastfinance.webp",
    liveUrl: "https://jupiterfastfinance.com",
    localFocus: "Finance-focused conversion flow built for India and global prospects.",
  },
];

export const portfolioSeoBySlug = Object.fromEntries(
  [...showcaseProjects, ...customerProjects].map((project) => [
    project.slug,
    {
      pageTitle: `${project.title} Portfolio Case Study | SiteNova`,
      pageDescription: `${project.description} ${project.localFocus ?? ""}`.trim(),
      canonicalPath: `/portfolio/${project.slug}`,
      imagePath: project.image,
    },
  ]),
);

