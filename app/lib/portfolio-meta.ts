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
  isSpecialHighlight?: boolean;
};

export const showcaseProjects: PortfolioProjectMeta[] = [
  {
    slug: "toolbox",
    title: "Toolbox by Site Nova",
    description:
      "A fast, client-side web application suite featuring 17+ free online calculators and utilities. Demonstrates complex state management and zero-latency performance.",
    image: aiSmartkitImg, // fallback
    liveUrl: "https://tools.sitenova.dev",
    localFocus: "Client-side React application demonstrating interactive tool development.",
    useIframePreview: true,
    isSpecialHighlight: true, // We will use this to highlight it in the UI
  },
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
  {
    slug: "sanitaryware-showcase",
    title: "Sanitaryware Showcase",
    description:
      "A premium sanitary ware product showcase with elegant category browsing, high-res visuals, and a clean e-commerce-style layout.",
    image: ecommerceShowcaseImg,
    liveUrl: "https://sanitaryware-showcase.sitenova.dev/",
    localFocus: "Product-focused showcase template ideal for hardware, home décor, and building materials businesses.",
    useIframePreview: true,
  },
  {
    slug: "nuts-design-golden-showcase",
    title: "Nuts Design Golden Showcase",
    description:
      "A luxurious golden-themed design showcase with bold typography, rich visuals, and a refined aesthetic perfect for premium brands.",
    image: designShowcaseImg,
    liveUrl: "https://nuts-design-golden-showcase.sitenova.dev/",
    localFocus: "Premium brand design template for luxury products, jewellery, and high-end retail experiences.",
    useIframePreview: true,
  },
  {
    slug: "artistry-showcase",
    title: "Artistry Showcase",
    description:
      "A creative and visual-forward showcase template designed for artists, studios, and creative agencies with dynamic layouts.",
    image: designShowcaseImg,
    liveUrl: "https://artistry-showcase.sitenova.dev/",
    localFocus: "Creative portfolio showcase highlighting visual aesthetics and artistic presentation.",
    useIframePreview: true,
  },
  {
    slug: "artisan-gallery",
    title: "Artisan Gallery",
    description:
      "An elegant gallery showcase template perfect for handcrafted goods, art exhibitions, and boutique collections.",
    image: designShowcaseImg,
    liveUrl: "https://artisan-gallery.sitenova.dev/",
    localFocus: "Boutique gallery showcase designed for visual storytelling and curated collections.",
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

