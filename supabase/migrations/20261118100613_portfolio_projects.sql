-- Applied as 20261118100613 via the SiteNova Web connector.
-- Public portfolio content, with owner-only writes. Existing case-study routes are independent.
create table public.portfolio_projects (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)<=100),
  project jsonb not null,
  category text not null check(category in ('client','showcase')),
  position integer not null default 0 check(position between 0 and 100000),
  is_visible boolean not null default true,
  revision integer not null default 1 check(revision>0),
  constraint portfolio_content_valid check (
    jsonb_typeof(project)='object' and project->>'slug'=slug
    and jsonb_typeof(project->'title')='string' and length(trim(project->>'title')) between 1 and 160
    and jsonb_typeof(project->'description')='string' and length(trim(project->>'description')) between 1 and 2000
    and jsonb_typeof(project->'liveUrl')='string' and project->>'liveUrl' ~ '^https?://[^[:space:]]+$'
    and jsonb_typeof(project->'image')='string' and (project->>'image' ~ '^/[^/\\]' or project->>'image' ~ '^https://[^[:space:]]+$')
    and (not project ? 'caseStudyPath' or project->>'caseStudyPath'='' or project->>'caseStudyPath' ~ '^/portfolio/[a-z0-9-]+$')
    and (not project ? 'useIframePreview' or jsonb_typeof(project->'useIframePreview')='boolean')
    and (not project ? 'isSpecialHighlight' or jsonb_typeof(project->'isSpecialHighlight')='boolean')
  ),
  constraint portfolio_required_fields check(project ?& array['slug','title','description','liveUrl','image'])
);
alter table public.portfolio_projects enable row level security;
revoke all on public.portfolio_projects from anon, authenticated;
grant select on public.portfolio_projects to anon, authenticated;
grant insert,update,delete on public.portfolio_projects to authenticated;
create policy portfolio_public_read on public.portfolio_projects for select to anon,authenticated using(is_visible);
create policy portfolio_admin_all on public.portfolio_projects for all to authenticated
 using((select public.is_site_admin())) with check((select public.is_site_admin()));
create index portfolio_visible_order on public.portfolio_projects(position,slug) where is_visible;
insert into public.portfolio_projects(slug,project,category,position) values
('dr-dipti-ganatra','{"slug":"dr-dipti-ganatra","title":"Dr. Dipti Ganatra","description":"A professional clinic website designed for Dr. Dipti Ganatra with elegant branding and easy appointment flow.","image":"/portfolio-images/dr-dipti.webp","liveUrl":"https://drdiptiganatra.com","localFocus":"Healthcare lead generation for Mumbai and Mulund audiences."}'::jsonb,'client',0),
('jupiter-finance','{"slug":"jupiter-finance","title":"Jupiter Fast Finance","description":"A sleek finance landing page with modern UI, clear call-to-actions, and responsive design across all devices.","image":"/portfolio-images/jupiter.webp","liveUrl":"https://jupiterfastfinance.com","localFocus":"Finance-focused conversion flow built for India and global prospects."}'::jsonb,'client',1),
('corporate-zone','{"slug":"corporate-zone","title":"Corporatezone","description":"A wholesale stationery and business essentials catalog for Corporatezone in Lower Parel, Mumbai, with product search, category filters, and bulk quote inquiries.","image":"/portfolio-images/jupiter.webp","liveUrl":"https://corporatezone.in","localFocus":"Wholesale stationery and office supplies for Lower Parel, Mumbai and pan-India corporate buyers.","useIframePreview":true}'::jsonb,'client',2),
('toolbox','{"slug":"toolbox","title":"Toolbox by Site Nova","description":"A fast, client-side web application suite featuring 17+ free online calculators and utilities. Demonstrates complex state management and zero-latency performance.","image":"/portfolio-images/toolbox.webp","liveUrl":"https://tools.sitenova.dev","localFocus":"Client-side React application demonstrating interactive tool development.","useIframePreview":true,"isSpecialHighlight":true}'::jsonb,'showcase',0),
('business-showcase','{"slug":"business-showcase","title":"Business Showcase","description":"A modern, premium business showcase showcasing state-of-the-art interactive sections and smooth user experiences.","image":"/portfolio-images/business.webp","liveUrl":"https://business-showcase.sitenova.dev/","localFocus":"High-performance marketing site showing design aesthetics and templates.","useIframePreview":true}'::jsonb,'showcase',1),
('design-showcase','{"slug":"design-showcase","title":"Design Showcase","description":"A premium UI/UX design system showcase displaying interactive components, modern typography, and curated color palettes.","image":"/portfolio-images/design.webp","liveUrl":"https://design.sitenova.dev/","localFocus":"Modern design library displaying web aesthetics and component templates.","useIframePreview":true}'::jsonb,'showcase',2),
('ecommerce-showcase','{"slug":"ecommerce-showcase","title":"E-commerce Showcase","description":"A modern, ultra-fast online storefront template featuring seamless cart actions, grid filtering, and checkout flows.","image":"/portfolio-images/ecommerce.webp","liveUrl":"https://ecommerce.sitenova.dev/","localFocus":"High-speed conversion checkout layout showing transaction flow and design templates.","useIframePreview":true}'::jsonb,'showcase',3),
('sanitaryware-showcase','{"slug":"sanitaryware-showcase","title":"Sanitaryware Showcase","description":"A premium sanitary ware product showcase with elegant category browsing, high-res visuals, and a clean e-commerce-style layout.","image":"/portfolio-images/ecommerce.webp","liveUrl":"https://sanitaryware-showcase.sitenova.dev/","localFocus":"Product-focused showcase template ideal for hardware, home décor, and building materials businesses.","useIframePreview":true}'::jsonb,'showcase',4),
('nuts-design-golden-showcase','{"slug":"nuts-design-golden-showcase","title":"Nuts Design Golden Showcase","description":"A luxurious golden-themed design showcase with bold typography, rich visuals, and a refined aesthetic perfect for premium brands.","image":"/portfolio-images/design.webp","liveUrl":"https://nuts-design-golden-showcase.sitenova.dev/","localFocus":"Premium brand design template for luxury products, jewellery, and high-end retail experiences.","useIframePreview":true}'::jsonb,'showcase',5),
('artistry-showcase','{"slug":"artistry-showcase","title":"Artistry Showcase","description":"A creative and visual-forward showcase template designed for artists, studios, and creative agencies with dynamic layouts.","image":"/portfolio-images/design.webp","liveUrl":"https://artistry-showcase.sitenova.dev/","localFocus":"Creative portfolio showcase highlighting visual aesthetics and artistic presentation.","useIframePreview":true}'::jsonb,'showcase',6),
('artisan-gallery','{"slug":"artisan-gallery","title":"Artisan Gallery","description":"An elegant gallery showcase template perfect for handcrafted goods, art exhibitions, and boutique collections.","image":"/portfolio-images/design.webp","liveUrl":"https://artisan-gallery.sitenova.dev/","localFocus":"Boutique gallery showcase designed for visual storytelling and curated collections.","useIframePreview":true}'::jsonb,'showcase',7);
