// Index-only route: case studies render their own page components.
import { buildMeta } from "@/lib/meta";
import type { LoaderFunctionArgs } from "react-router";
import { readPortfolio } from "@/lib/portfolio.server";
export async function loader({context}: LoaderFunctionArgs) { return readPortfolio(context); }
export function headers() { return {"Cache-Control":"no-store"}; }
export { default } from "@/pages/PortfolioDirectory";
export function meta() { return buildMeta({ title: "Portfolio | SiteNova", description: "Explore SiteNova portfolio and plan your custom website project.", canonicalPath: "/portfolio" }); }
