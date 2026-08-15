import aiSmartkitImg from "@/assets/Aismartkit.webp";
import businessShowcaseImg from "@/assets/business-showcase.webp";
import designShowcaseImg from "@/assets/design-showcase.webp";
import ecommerceShowcaseImg from "@/assets/ecommerce-showcase.webp";
import drDiptiGanatraImg from "@/assets/Drdiptiganatra.webp";
import jupiterFinanceImg from "@/assets/jupiterfastfinance.webp";

export type PortfolioProjectMeta = {
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  localFocus?: string;
  useIframePreview?: boolean;
};

export const showcaseProjects: PortfolioProjectMeta[] = [
  {
    slug: "ai-smartkit",
    title: "AI SmartKit",
    description:
      "A cutting-edge AI tools platform with a clean interface, intuitive navigation, and high-performance architecture.",
    image: aiSmartkitImg,
    liveUrl: "https://aismartkit.tech",
    localFocus: "Global-ready SaaS presentation for international product users.",
    useIframePreview: true,
  },
  {
    slug: "business-showcase",
    title: "Business Showcase",
    description:
      "A modern, premium business showcase showcasing state-of-the-art interactive sections and smooth user experiences.",
    image: businessShowcaseImg,
    liveUrl: "https://business-showcase.sitenova.dev/",
    localFocus: "High-performance marketing site showing design aesthetics and templates.",
    useIframePreview: true,
  },
  {
    slug: "design-showcase",
    title: "Design Showcase",
    description:
      "A premium UI/UX design system showcase displaying interactive components, modern typography, and curated color palettes.",
    image: designShowcaseImg,
    liveUrl: "https://design.sitenova.dev/",
    localFocus: "Modern design library displaying web aesthetics and component templates.",
    useIframePreview: true,
  },
  {
    slug: "ecommerce-showcase",
    title: "E-commerce Showcase",
    description:
      "A modern, ultra-fast online storefront template featuring seamless cart actions, grid filtering, and checkout flows.",
    image: ecommerceShowcaseImg,
    liveUrl: "https://ecommerce.sitenova.dev/",
    localFocus: "High-speed conversion checkout layout showing transaction flow and design templates.",
    useIframePreview: true,
  },
];

export const customerProjects: PortfolioProjectMeta[] = [
  {
    slug: "dr-dipti-ganatra",
    title: "Dr. Dipti Ganatra",
    description:
      "A professional clinic website designed for Dr. Dipti Ganatra with elegant branding and easy appointment flow.",
    image: drDiptiGanatraImg,
    liveUrl: "https://drdiptiganatra.com",
    localFocus: "Healthcare lead generation for Mumbai and Mulund audiences.",
  },
  {
    slug: "jupiter-finance",
    title: "Jupiter Fast Finance",
    description:
      "A sleek finance landing page with modern UI, clear call-to-actions, and responsive design across all devices.",
    image: jupiterFinanceImg,
    liveUrl: "https://jupiterfastfinance.com",
    localFocus: "Finance-focused conversion flow built for India and global prospects.",
  },
  {
    slug: "corporate-zone",
    title: "CorporateZone",
    description:
      "A clean, professional B2B services website built for CorporateZone — strong brand identity, clear service hierarchy, and a lead-generation layout designed for corporate clients.",
    image: jupiterFinanceImg, // unused — useIframePreview renders live site as the card thumbnail
    liveUrl: "https://corporatezone.in",
    localFocus: "B2B corporate services website targeting Mumbai and pan-India business clients.",
    useIframePreview: true,
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

