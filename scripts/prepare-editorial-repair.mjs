/** Offline only. Generates guarded SQL; never connects to or writes a database. */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const snapshot = process.argv[2];
if (!snapshot) throw new Error("Usage: node scripts/prepare-editorial-repair.mjs <blog-snapshot.json>");
const before = JSON.parse(readFileSync(snapshot, "utf8"));
const specs = [
  ["website-for-architects-mumbai-2026", "architects", "Architecture Portfolio Engineering: Projects, Galleries and Commission Enquiries", "Plan project narratives, responsive images, stable galleries and private drawing delivery for an architecture practice.", ["Architecture", "Web Design", "Performance"]],
  ["5-things-every-ca-firm-website-must-have", "ca-firms", "A CA Firm Website: Professional Review, Enquiry Routing and Document Boundaries", "A practical architecture for factual firm information, reviewed preparation checklists and controlled client-document workflows.", ["Professional Services", "Web Design", "Security"]],
  ["5-things-every-salon-spa-website-needs", "salons", "Salon Website Booking Design: Services, Staff and Honest Availability", "Design a salon service menu and appointment journey that distinguishes requests from reservations and handles scheduling conflicts.", ["Booking", "Web Design", "User Experience"]],
  ["why-every-doctor-in-mumbai-needs-a-website-in-2026", "clinics", "Clinic Website Architecture: Patient Information Before Appointment Requests", "Organise verified practitioner information, MedicalClinic markup, mobile performance and a minimal appointment enquiry flow.", ["Healthcare", "Web Design", "Performance"]],
  ["do-interior-designers-mumbai-need-website-2026", "interiors", "Interior Design Portfolios: Room Stories, Image Delivery and Fit-Out Briefs", "Build a maintainable interiors portfolio with clear project scope, stable before-and-after galleries and useful renovation enquiries.", ["Interiors", "Web Design", "Performance"]],
  ["do-photographers-mumbai-need-website-2026", "photographers", "Photography Website Engineering: Public Edits and Private Client Galleries", "Separate portfolio publishing from client delivery, budget image bytes and make assignment enquiries explicit.", ["Photography", "Web Design", "Performance"]],
  ["do-consultants-in-mumbai-need-a-website-2026", "consultants", "Consultant Website Design: Engagement Fit, Evidence and Lead Triage", "Explain consulting scope, distinguish outputs from outcomes and build a reviewed qualification and scheduling handoff.", ["Consulting", "Professional Services", "Web Design"]],
  ["caterers-event-planners-mumbai-need-website-2026", "events", "Event and Catering Websites: Feasibility Briefs, Menus and Date Handling", "Design event enquiries around guest count, venue constraints, local dates and a clear boundary between requests and confirmed availability.", ["Events", "Booking", "Web Design"]],
];
const literal = (value) => value === null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const md5 = (value) => createHash("md5").update(value ?? "").digest("hex");
const updates = specs.map(([slug, file, title, excerpt, tags]) => {
  const old = before.find((post) => post.slug === slug);
  if (!old) throw new Error(`Missing original: ${slug}`);
  const base = readFileSync(`content/editorial-20261020/${file}.html`, "utf8");
  const extension = ["interiors", "photographers", "consultants", "events"].includes(file)
    ? readFileSync(`content/editorial-20261020/${file}-engineering.html`, "utf8") : "";
  const content = base + extension;
  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  if (words < 900) throw new Error(`${slug}: only ${words} words`);
  return { old, file, title, excerpt, tags, content, words };
});
const canonicalCopy = before.find((post) => post.slug === "openai-agent-medicare-breach-disclosure-delay");
const original = before.find((post) => post.slug === "openai-agent-medicare-portal-breach");
if (!canonicalCopy || !original) throw new Error("Missing original duplicate pair");
const guard = (old) => `id = ${literal(old.id)}::uuid and slug = ${literal(old.slug)} and md5(content) = ${literal(md5(old.content))} and title = ${literal(old.title)} and status = ${literal(old.status)} and updated_at is not distinct from ${literal(old.updated_at)}::timestamptz`;
let sql = "-- Review then apply AFTER the canonical_url schema migration.\n-- All-or-nothing; preserves status and published_at. Aborts on concurrent edits.\nbegin;\n";
for (const item of updates) {
  sql += `\ndo $repair$ begin\n  if not exists (select 1 from public.blog_posts where ${guard(item.old)} for update) then\n    raise exception 'Editorial source changed: ${item.old.slug}';\n  end if;\n  update public.blog_posts set title = ${literal(item.title)}, excerpt = ${literal(item.excerpt)}, content = ${literal(item.content)}, tags = ARRAY[${item.tags.map(literal).join(", ")}]::text[], blanks_metadata = '[]'::jsonb, updated_at = now() where id = ${literal(item.old.id)}::uuid;\nend $repair$;\n`;
}
sql += `\ndo $repair$ begin\n  if not exists (select 1 from public.blog_posts where ${guard(original)} for update) then raise exception 'Original source changed'; end if;\n  if not exists (select 1 from public.blog_posts where ${guard(canonicalCopy)} and canonical_url is null for update) then raise exception 'Duplicate source changed'; end if;\n  update public.blog_posts set canonical_url = ${literal(`https://sitenova.dev/blog/${original.slug}`)}, updated_at = now() where id = ${literal(canonicalCopy.id)}::uuid;\nend $repair$;\ncommit;\n`;
writeFileSync("content/editorial-20261020/apply.sql", sql);
writeFileSync("content/editorial-20261020/manifest.json", JSON.stringify(updates.map(({ old, file, title, excerpt, tags, words }) => ({ id: old.id, slug: old.slug, file, title, excerpt, tags, words, status: old.status, original_content_md5: md5(old.content) })), null, 2) + "\n");
console.log(`Prepared ${updates.length} distinct articles and one internal canonical repair. No database writes.`);
