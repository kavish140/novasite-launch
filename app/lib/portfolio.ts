import { z } from "zod";
import { customerProjects, showcaseProjects, type PortfolioProjectMeta } from "./portfolio-meta";

const webUrl = z.string().url().refine(value => /^https?:\/\//i.test(value), "Use an HTTP or HTTPS URL");
const imageUrl = z.string().refine(value => /^\/(?!\/)[^\\]*$/.test(value) || /^https:\/\//i.test(value), "Use a site image path or HTTPS image URL");
export const projectSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(2000),
  image: imageUrl,
  liveUrl: webUrl,
  localFocus: z.string().max(1000).optional(),
  useIframePreview: z.boolean().optional(),
  isSpecialHighlight: z.boolean().optional(),
  caseStudyPath: z.string().regex(/^\/portfolio\/[a-z0-9-]+$/).optional().or(z.literal("")),
});
export const portfolioRowSchema = z.object({
  slug: z.string(),
  project: projectSchema,
  category: z.enum(["client", "showcase"]),
  position: z.number().int().min(0).max(100000),
  is_visible: z.boolean(),
  revision: z.number().int().min(1),
});
export type PortfolioRow = {
  slug:string; project:PortfolioProjectMeta & {caseStudyPath?:string};
  category:"client"|"showcase"; position:number; is_visible:boolean; revision:number;
};
export const defaultPortfolio: PortfolioRow[] = [
  ...customerProjects.map((project, position) => ({ slug: project.slug, project, position, category: "client" as const, is_visible: true, revision: 1 })),
  ...showcaseProjects.map((project, position) => ({ slug: project.slug, project, position, category: "showcase" as const, is_visible: true, revision: 1 })),
];
export function parsePortfolio(data: unknown) {
  return (z.array(portfolioRowSchema).parse(data) as PortfolioRow[]).sort((a,b) => a.position-b.position || a.slug.localeCompare(b.slug));
}
