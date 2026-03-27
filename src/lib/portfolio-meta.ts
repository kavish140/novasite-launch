export type PortfolioProjectMeta = {
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  localFocus?: string;
};

export const portfolioProjects: PortfolioProjectMeta[] = [
  {
    slug: "dr-dipti-ganatra",
    title: "Dr. Dipti Ganatra",
    description:
      "A professional clinic website designed for Dr. Dipti Ganatra with elegant branding and easy appointment flow.",
    image: "/assets/Drdiptiganatra.png",
    liveUrl: "https://drdiptiganatra.com",
    localFocus: "Healthcare lead generation for Mumbai and Mulund audiences.",
  },
  {
    slug: "jupiter-finance",
    title: "Jupiter Finance",
    description:
      "A sleek finance landing page with modern UI, clear call-to-actions, and responsive design across all devices.",
    image: "/assets/jupiterfastfinance.png",
    liveUrl: "https://kavish140.github.io/jupiter-finance-launch/",
    localFocus: "Finance-focused conversion flow built for India and global prospects.",
  },
  {
    slug: "ai-smartkit",
    title: "AI SmartKit",
    description:
      "A cutting-edge AI tools platform with a clean interface, intuitive navigation, and high-performance architecture.",
    image: "/assets/Aismartkit.png",
    liveUrl: "https://aismartkit.tech",
    localFocus: "Global-ready SaaS presentation for international product users.",
  },
];

export const portfolioSeoBySlug = Object.fromEntries(
  portfolioProjects.map((project) => [
    project.slug,
    {
      pageTitle: `${project.title} Portfolio Case Study | SiteNova`,
      pageDescription: `${project.description} ${project.localFocus ?? ""}`.trim(),
      canonicalPath: `/portfolio/${project.slug}`,
      imagePath: project.image,
    },
  ]),
);

