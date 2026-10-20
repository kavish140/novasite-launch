-- Archive repair batch 6. Guarded; preserves status/publication dates.
begin;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='dc84cfe7-5426-4631-aa3b-e4aefcf351f4'::uuid and slug='why-web-design-quotes-vary-so-much-mumbai' and title='Why Is One Web Design Quote 3x More Expensive Than Another?' and status='published' and md5(content)='e96fece1b298fd439ccaf819177d89fa' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-web-design-quotes-vary-so-much-mumbai'; end if;
 update public.blog_posts set title='Comparing Website Quotes by Deliverables and Risk', excerpt='A large price difference is a reason to compare scope, not proof that either supplier is dishonest. Ask both parties to describe the resulting behaviour, source responsibilities and exceptio', content='<p>A large price difference is a reason to compare scope, not proof that either supplier is dishonest. Ask both parties to describe the resulting behaviour, source responsibilities and exception handling using the same business brief.</p>

<h2>Translate each quote into the same set of tasks</h2>
<p>This is the single biggest reason for the gap: "a website" isn''t a fixed product, so two quotes with the same label can cover very different scope. A ₹6,000 quote and a ₹30,000 quote might both say "5-page business website" — but one includes a contact form that just opens an email client, while the other includes a proper backend form with spam filtering, a CMS so you can edit content yourself, and basic on-page SEO setup. Neither number is "wrong" on its own; they''re just quoting different things under the same name. This is exactly why we walk through <a href="https://sitenova.dev/blog/website-cost-mumbai-2026">what actually drives website cost in Mumbai</a> line by line with prospective clients, rather than quoting a single flat number.</p>

<h3>Is a cheaper website quote always a bad deal?</h3>
<p>Not always — if your needs are genuinely minimal, a lower-cost build can be the right call. The risk is comparing it against a full-scope quote without realizing how much less it actually includes.</p>

<h3>Should I always go with the highest quote, assuming it means better quality?</h3>
<p>No — price isn''t a reliable quality signal on its own. A higher quote should come with a clear, written breakdown of what''s included; if it doesn''t, the extra cost may just be unexplained margin, not extra value.</p>

<h3>What''s the single most common thing missing from a cheap quote?</h3>
<p>Check explicitly whether copywriting, metadata, structured data and publication responsibilities are included. This guide does not establish which items suppliers omit most often. A polished design does not prove that content or technical SEO is complete, and neither inclusion guarantees discovery.</p>

<h3>Can I ask a designer to itemize their quote instead of giving one flat number?</h3>
<p>Yes, and it''s a reasonable thing to ask for. A designer unwilling to break down what a quote actually covers is itself worth noting before you commit.</p>



<h2>Identify work and responsibilities omitted from the estimate</h2>
<p>A pattern we see often: a business owner comes to us after getting a very low quote elsewhere, and once we ask a few specific questions, it turns out the cheap quote didn''t include things like domain and hosting setup, a working contact form (versus a static "email us at..." line), mobile responsiveness testing, or any SEO basics at all — just a page that exists. None of that is dishonest, exactly, but it''s easy to miss if you''re comparing quotes purely on the final number rather than what''s actually inside them.</p>
<ul>
  <li><strong>Design work:</strong> a custom layout for your brand versus a stock template with your logo dropped in</li>
  <li><strong>Content and copywriting:</strong> whether the designer is writing your page text or waiting for you to supply all of it</li>
  <li><strong>Revisions:</strong> unlimited-within-reason feedback rounds versus "one round of changes, then it''s final"</li>
  <li><strong>SEO setup:</strong> meta titles, descriptions, and schema markup done properly versus not touched at all</li>
  <li><strong>Post-launch support:</strong> someone you can call when a form breaks, versus the relationship ending the day the site goes live</li>
</ul>

<h2>Understand the support and staffing assumptions</h2>
<p>A solo freelancer working from home has very different costs than a small studio with a team, an office, and a support process. That doesn''t automatically make the studio "better" — plenty of freelancers do excellent work — but it does mean part of what you''re paying for in a higher quote is often the infrastructure behind it: someone to fix things if the main developer is unavailable, a documented process instead of ad hoc requests, and specialists rather than one generalist covering design, development, and SEO all at once.</p>

<h2>Use one comparison sheet for both suppliers</h2>
<p>Compare included pages, content preparation, revision rounds, implementation checks and support before judging the total. Two prices can differ for reasons other than omitted work. Ask each supplier to explain the same requirements and record any unresolved assumption. Do not infer a missing capability or dishonest quotation from a lower fee alone.</p>
<p>If you''re not sure how to read a quote you''ve already received, our breakdown of <a href="https://sitenova.dev/blog/how-to-choose-web-designer-mumbai">what to check before hiring a web designer in Mumbai</a> covers the questions worth asking before you sign anything.</p>

<h2>Choose the smaller scope when its limits are acceptable</h2>
<p>To be fair to lower-cost quotes: if you only need a very simple digital business card — your name, address, phone number, nothing more — a stripped-down cheap build might be entirely adequate, and paying for a full custom build with SEO and copywriting would be overkill. The problem isn''t cheap quotes existing; it''s comparing a stripped-down quote against a full-scope one as if they''re interchangeable, and picking based on price alone without knowing what you''re giving up.</p>

<h2>Compare the treatment of a failed submission</h2><p>Ask whether the form merely attempts an email or stores a request, whether the visitor can retry safely and who investigates delivery failure. Both proposals may list contact form while including different work. Do the same for content preparation, redirects, private access and handover. Current packages are only a starting reference; the agreed deliverables and ongoing responsibilities determine whether the estimate answers the actual brief.</p>
<h3>How many quotes should I actually get before deciding?</h3>
<p>Two to three is usually enough to spot the scope differences described above. More than that tends to create decision fatigue without adding much new information.</p>

', updated_at=now() where id='dc84cfe7-5426-4631-aa3b-e4aefcf351f4'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='c4f5fbe8-97d4-4df7-87d4-39d139eaaa70'::uuid and slug='wordpress-vs-custom-website-mumbai-business' and title='WordPress vs Custom Website: Which Is Right for Your Business?' and status='published' and md5(content)='4ebf8a2bd47a3c72621b933ca04d765b' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: wordpress-vs-custom-website-mumbai-business'; end if;
 update public.blog_posts set title='WordPress and Custom Builds: Choose the Editing and Operating Model', excerpt='Begin the platform choice with who will publish content, which workflows must be supported and what the team can maintain. Either approach can fail when responsibilities are unclear, and nei', content='<p>Begin the platform choice with who will publish content, which workflows must be supported and what the team can maintain. Either approach can fail when responsibilities are unclear, and neither guarantees a ranking or performance score on its own.</p>

<h2>Compare responsibility boundaries rather than labels</h2>
<p>WordPress is a content management system — pre-built software that powers a huge share of the websites you visit every day. You (or your developer) pick a theme, add plugins for things like contact forms or online payments, and manage the content through a dashboard. It''s fast to set up and there''s a huge ecosystem of themes and plugins to lean on.</p>
<p>A custom website, on the other hand, is built specifically for your business from the ground up — no theme, no generic plugin stack. The design, the features, and the way the site is structured are all decided based on what your business actually needs, not what a template happens to offer.</p>
<p>Neither one is "better" in the abstract. The right choice depends on your budget, how fast you need to move, and how much your website needs to do beyond looking good.</p>

<h3>Is WordPress cheaper than a custom website in the long run?</h3>
<p>There is no universal price order. Compare the same editing, integration, hosting, support and acceptance requirements. Plugin licences and custom development can both create recurring obligations. The appropriate choice depends on what the team can operate and maintain, not an assumed cost advantage from the platform name.</p>

<h3>Is a custom website more secure than WordPress?</h3>
<p>Neither platform name establishes a smaller attack surface. Plugins, custom dependencies, administrative tools, access rules and configuration all affect exposure. Review the actual implementation and update responsibilities. A custom build can contain vulnerabilities just as a CMS can, and no plugin count alone proves the security of the complete system.</p>

<h3>Will a custom website rank better on Google than WordPress?</h3>
<p>Not by default — rankings come down to site speed, structure, and content quality either way. A custom site can make it easier to hit strong Core Web Vitals scores, but a lean, well-optimized WordPress site can rank just as well.</p>

<h2>Evaluate an editor-led publishing requirement</h2>
<p>WordPress is a solid, sensible choice for a lot of small businesses, especially when:</p>
<ul>
  <li>A limited CMS implementation may fit a short schedule when content, configuration and approval are ready. Confirm the proposed dates against the actual pages, integrations and checks. This is a planning possibility, not a standard delivery commitment for every CMS site.</li>
  <li>Your needs are fairly standard: an About page, services, a contact form, maybe a blog.</li>
  <li>You want to be able to update text, images, and blog posts yourself without calling a developer every time.</li>
  <li>Your budget is tighter and you''d rather put more of it toward marketing or ads once the site is live.</li>
</ul>
<p>A well-built WordPress site — done properly, not just a default theme with stock images dropped in — can absolutely look and perform like a custom one. The catch is that it depends heavily on <em>how</em> it''s built. A rushed WordPress site loaded with unnecessary plugins is often the reason business owners come to us later complaining about slow load times or a site that "feels cheap."</p>

<h2>Identify genuinely custom workflow constraints</h2>
<p>A custom-built website usually makes more sense once your business has needs a template can''t comfortably handle — for example:</p>
<ul>
  <li>You run an e-commerce store with specific inventory, pricing logic, or checkout requirements a standard plugin can''t cleanly support.</li>
  <li>You need a booking system, customer portal, or dashboard that''s genuinely built for your workflow, not bolted on.</li>
  <li>Page speed and Core Web Vitals matter a lot to you — custom-built sites tend to load faster since there''s no bloated plugin stack running in the background.</li>
  <li>You want full ownership over the codebase and design, with no dependency on a plugin ecosystem that might stop being maintained down the line.</li>
</ul>
<p>We''ve built custom sites for businesses across <a href="https://sitenova.dev/location/mulund">Mulund</a> and nearby areas that needed exactly this — a restaurant that wanted a live table-booking system tied to actual seating capacity, and a <a href="https://sitenova.dev/websites-for-real-estate">real estate</a> firm that needed listings pulling live from their internal database. Neither of those was realistic on an off-the-shelf WordPress plugin without a lot of custom work anyway — at which point you''re paying custom-development rates for a WordPress site regardless.</p>

<h3>Can I switch from WordPress to a custom website later?</h3>
<p>Yes, and it''s a common path — start on WordPress to launch quickly and validate your business online, then move to a custom build once you know exactly what features you actually need.</p>

<h3>How do I know if my business actually needs a custom website?</h3>
<p>If you can list your requirements and a standard WordPress theme plus a couple of plugins covers all of them, WordPress is fine. If you keep hitting "well, we''d also need it to..." with something a plugin can''t cleanly do, that''s your sign to look at custom.</p>

<h2>Budget delivery, integrations and maintenance</h2>
<p>This is usually the deciding factor, so let''s be direct about it.</p>
<table>
  <tbody><tr>
    <th>Factor</th>
    <th>WordPress</th>
    <th>Custom Website</th>
  </tr>
  <tr>
    <td>Typical starting cost</td>
    <td>Lower — good for standard business sites</td>
    <td>Higher — reflects bespoke design and development</td>
  </tr>
  <tr>
    <td>Typical timeline</td>
    <td>Illustrative schedule only; confirm scope, content readiness, integrations and approval responsibilities before agreeing a date.</td>
    <td>Illustrative schedule only; custom development is estimated against the actual workflow and review process.</td>
  </tr>
  <tr>
    <td>Ongoing maintenance</td>
    <td>Plugin and core updates needed regularly</td>
    <td>Lower long-term maintenance overhead</td>
  </tr>
  <tr>
    <td>Flexibility for unusual features</td>
    <td>Limited by available plugins</td>
    <td>Built exactly to your workflow</td>
  </tr>
  <tr>
    <td>Site speed potential</td>
    <td>Good, if built lean</td>
    <td>Generally faster out of the box</td>
  </tr>
</tbody></table>
<p>If exact numbers would help you plan your budget, it''s worth reading through our breakdown of <a href="https://sitenova.dev/quote">how much a website actually costs in Mumbai</a> before you commit either way.</p>

<h2>Decide against a sample of the real content</h2>
<p>Choose against the actual content and transaction requirements. A CMS can support complex workflows with suitable implementation, and a custom system can still provide an editor. Either can be appropriate or unnecessarily expensive. Compare a representative task, support arrangement and estimate rather than assume that one architecture pays for itself through flexibility or performance.</p>
<p>Either approach can become difficult to maintain when extensions, integrations or custom code lack clear ownership. Review a concrete limitation before recommending a rebuild. A well-configured CMS may meet the requirement, while a custom system may create work the business is not equipped to maintain. The decision needs evidence about the actual site.</p>

<h2>Prototype the hard content change</h2><p>Ask the intended editor to update a representative page, add a long record and withdraw an item in the proposed system. Check the public result and the route for recovering an error. For plugins or custom integrations, identify who reviews updates and compatibility. A platform comparison should describe the actual implementation and team, rather than use one poor example as proof that every site built on that platform will behave the same way.</p>
', updated_at=now() where id='c4f5fbe8-97d4-4df7-87d4-39d139eaaa70'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='ea355dcc-f7ee-4bde-b1b4-97843610103f'::uuid and slug='google-business-profile-vs-website-do-you-need-both' and title='Google Business Profile vs Website: Do You Need Both?' and status='published' and md5(content)='8c335752d0fb26d44de64f502f097e36' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: google-business-profile-vs-website-do-you-need-both'; end if;
 update public.blog_posts set title='Business Profile and Website: Give Each Customer Task a Home', excerpt='A profile can answer a quick local question while the website explains a service in more depth. Assign each part of the journey a useful job instead of duplicating the same promotional parag', content='<p>A profile can answer a quick local question while the website explains a service in more depth. Assign each part of the journey a useful job instead of duplicating the same promotional paragraph across both destinations.</p>

<h2>Use the profile for accurate local facts</h2>
<p>An eligible, verified Google Business Profile can present information in Search and Maps, including contact and website options supported for the account. Verification, visibility and available features vary. It is not accurate to promise instant discovery or claim that a profile always outperforms every other source. First establish eligibility and ownership, then maintain truthful public details.</p>
<p>But a GBP listing is a fixed format. You can''t control the layout, you can''t add detailed service pages, and you''re standing right next to two or three competitors on the same results page — sometimes literally between them. It''s a storefront sign, not a shop.</p>

<h3>Does having a website actually improve my Google Business Profile ranking?</h3>
<p>Google describes local results through relevance, distance and prominence. Accurate business information and useful website content can support discovery, but a website alone does not guarantee an improved profile ranking. Investigate an observed result rather than assume a missing website explains it.</p>

<h3>Can I just put all my content on my Google Business Profile instead of building a website?</h3>
<p>Not really — GBP has strict limits on post length, layout, and what you can showcase. Detailed service explanations, pricing tables, and case studies simply don''t fit the format.</p>

<h3>How do I make sure my Google Business Profile and website are properly linked?</h3>
<p>Link the profile to the correct maintained website URL and keep its real business information consistent. Applicable structured data should describe visible facts. A link and JSON-LD do not establish automatic synchronisation, a complete profile audit or a guaranteed ranking change. Verify the actual public result after a business fact changes.</p>

<h2>Use the website for the service decision</h2>
<p>An independent website can organise substantive articles and service explanations under maintained URLs. Other public sources can also appear in search and support discovery. Useful content and accessible implementation matter more than asserting that a single channel is the only source of lasting value.</p>
<p>A domain and website give the business a maintained destination, subject to registrar, hosting, software and account dependencies. Establish who controls those accounts and how access is recovered. A website complements a profile without becoming independent of every external service.</p>

<h2>Connect the two without inventing extra locations</h2>
<p>Help customers identify the same real business across the profile and website. Correct conflicting addresses, telephone numbers and hours. Do not claim that every punctuation or abbreviation variation produces a ranking penalty; the practical goal is recognisable, accurate information.</p>
<p>A profile and a website can support different information tasks. Their relative value depends on the business, the query and the customer''s next action. There is no evidence here that lacking one removes a fixed fraction of potential visibility.</p>

<h2>Identify the limits of a profile-only approach</h2>
<p>To be fair, there''s a narrow case where a GBP listing alone might hold you over for a while — a very early-stage business testing demand with zero budget, or a purely walk-in trade where almost nobody researches before visiting. Even then, it''s a temporary stopgap, not a real strategy. The moment you want to run ads, explain a more complex service, or simply look as credible as a competitor who has both, the gap starts costing you.</p>

<h3>Which one should I set up first if I can only do one right now?</h3>
<p>Check profile eligibility and verification first. Keep information accurate and decide which website content would answer questions the profile does not address. Neither verification nor website publication guarantees immediate indexing or customer enquiries.</p>

<h3>My competitor only has a Google Business Profile and seems to be doing fine — why should I bother with a website?</h3>
<p>A competitor''s profile alone does not reveal its enquiry volume or customers lost. Identify which questions your own customers need answered and where they seek that information. A website may help a complex decision, but the value needs to be assessed against the actual information gap and maintained workflow rather than inferred from the competitor''s page count.</p>

<h2>Check one branch-specific question</h2><p>For a worked example, compare how a visitor finds today''s session hours and how they understand what a consultation includes. The profile and website should agree on the underlying facts, while the website may provide the fuller explanation. A website is not itself a guarantee of local ranking, and profile ownership issues need the provider''s account process. Test the destination links and verify that a request reaches the intended branch rather than infer success from a contact click.</p><p>If a branch changes its opening session, review every maintained destination that publishes that fact. The website editor and profile account may have different owners and approval processes. Record both changes rather than assume one update propagates automatically. Afterward, open the actual public pages and confirm the intended information is visible.</p>
<p>Make the cross-channel check practical. Ask a staff member to change a sample session time in a controlled copy of the maintained information, identify every public destination affected and explain who updates each one. Review whether any cached snippet, download or booking option could continue displaying the old time. Keep profile account access separate from website deployment access, with recovery ownership for both. Do not treat a website editor invitation as proof of profile ownership. A business can then correct a fact without creating contradictory hours or waiting for the wrong supplier to regain access. Document the real process rather than promise that linking two URLs automatically synchronises them.</p><p>Reference: <a href="https://support.google.com/business/answer/7091">Google local-ranking guidance</a>. Check the current provider guidance for the actual implementation.</p>', updated_at=now() where id='ea355dcc-f7ee-4bde-b1b4-97843610103f'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='552d16dd-25ae-45b0-b5ff-84bd301ac11d'::uuid and slug='how-to-choose-web-designer-mumbai' and title='Best Web Designer in Mumbai: 7 Things to Look For Before You Hire' and status='published' and md5(content)='6e039c80678447ca0beaddfd201cc24f' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: how-to-choose-web-designer-mumbai'; end if;
 update public.blog_posts set title='Choosing a Mumbai Web Developer: Evidence, Scope and Support', excerpt='When comparing a Mumbai web developer, ask for evidence of relevant work, a clear scope and a workable handover. This checklist proposes questions to ask; it is not a census or ranking of lo', content='<p>When comparing a Mumbai web developer, ask for evidence of relevant work, a clear scope and a workable handover. This checklist proposes questions to ask; it is not a census or ranking of local suppliers.</p>

<h2>1. They Show You Real, Live Work — Not Mockups</h2>
<p>Ask to distinguish live client work, prototypes and design concepts. Each can show a different capability, but a concept should not be presented as a commissioned live build. Where a live site is unavailable, request an approved demonstration and clarify what the supplier actually delivered.</p>

<h2>2. Their Own Website Loads Fast and Looks Premium</h2>
<p>A supplier''s own site is one example to inspect, not proof that every delivered project will behave the same way. Review relevant live work and ask which defects or limitations affect the proposed scope. A single PageSpeed run should not be treated as a complete quality verdict.</p>

<h2>3. They Understand Local SEO, Not Just Design</h2>
<p>Ask which content and technical search tasks are included and how their implementation will be checked. A responsible developer should distinguish those deliverables from ranking outcomes outside their control. A guarantee of a search position is not a stronger answer than an honest account of the work and its limits.</p>

<h2>4. They Communicate Clearly and Promptly</h2>
<p>Agree response expectations, escalation and cover explicitly. An early response can inform your questions, but one delayed message does not establish the quality of future support. Ask for the actual support terms and recovery ownership.</p>

<h2>5. They Give You a Clear, Written Scope</h2>
<p>Before any money changes hands, you should have a written document listing: number of pages, features included, number of revisions, timeline, and what happens after delivery. Verbal promises are not enough.</p>

<h2>6. You Own Your Website After Delivery</h2>
<p>Some agencies build your site on their own hosting infrastructure and charge you monthly to "keep it live." You should own your domain, your hosting account, and your code. Clarify this before signing anything.</p>

<h2>7. They Have Real Client Reviews</h2>
<p>Independent profiles and reviews can provide useful context, but verification methods vary by platform and listing. A profile alone does not establish that every testimonial or claim was independently checked. Review the specific evidence and permissions rather than describe all directory content as verified.</p>

<h2>Why Local Matters in Mumbai</h2>
<p>Working with a web designer who knows Mumbai is an advantage. They understand the hyper-local SEO landscape — the difference between targeting Andheri East vs Andheri West, or why a business in Powai needs different keywords than one in Dadar. SiteNova is based in Mulund and serves clients across all of Mumbai.</p>
<p><a href="/free-audit">Get a free website audit</a> and see exactly where your current site stands — no strings attached.</p>', updated_at=now() where id='552d16dd-25ae-45b0-b5ff-84bd301ac11d'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='8e6953dc-5bf8-46b8-9b1a-7b33857f6caf'::uuid and slug='what-a-website-project-looks-like-start-to-finish' and title='What a Website Project Actually Looks Like (Start to Finish)' and status='published' and md5(content)='a3d18c56c13bca2008164ed5ab888f16' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: what-a-website-project-looks-like-start-to-finish'; end if;
 update public.blog_posts set title='What a Website Project Actually Looks Like (Start to Finish)', excerpt='Most business owners hire a web designer without knowing what actually happens next. That gap is where miscommunication, missed deadlines, and disappointing final websites come from. Here''s ', content='<p>Most business owners hire a web designer without knowing what actually happens next. That gap is where miscommunication, missed deadlines, and disappointing final websites come from. Here''s what a proper website project looks like, from the first call to launch day.</p>

<h2>Step 1: Discovery, Not Just a Design Brief</h2>
<p>A rushed project starts with "just send me your logo and colors." A good one starts with questions: who are your customers, what do you want them to do on the site, who are you competing with locally, and what''s actually working (or not) on your current site if you have one. This step should take real conversation, not a form.</p>

<h2>Step 2: Structure Before Style</h2>
<p>Structure and visual design both affect how a visitor understands the page, alongside content, performance and the offer itself. Neither alone determines whether a visitor becomes a customer. Test the specific task instead of assigning every outcome to the layout.</p>

<h2>Step 3: Build in Rounds, Not One Big Reveal</h2>
<p>A project that disappears for three weeks and then shows you a "finished" site is a red flag. Reviews should happen at set checkpoints — homepage first, then inner pages, then mobile view — so changes are cheap early and rare late. If you''re not seeing progress until the very end, something''s off.</p>

<h2>Step 4: Testing Before Launch, Not After Complaints</h2>
<p>Before going live, the site should be checked on actual phones (not just a browser resize), tested for load speed, and run through basic SEO setup — page titles, meta descriptions, and a sitemap submitted to Google. A launch that skips this step usually means the business owner finds the problems, not the designer.</p>

<h2>Step 5: What Happens After Launch</h2>
<p>Define ownership for content changes, access, renewals and integration checks after handover. There is no universal one-year point at which an unsupported site becomes stale. Its condition needs direct inspection and responsibility for correcting confirmed problems.</p>

<p>Use this process as a review framework, not a diagnosis of an unknown previous project. Identify the specific gap and evidence before recommending a repair or rebuild. SiteNova''s agreed scope and support arrangements determine the work included in a particular engagement.</p>', updated_at=now() where id='8e6953dc-5bf8-46b8-9b1a-7b33857f6caf'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='2ad400b0-7b8f-4cb6-961d-8ddd7fd4427f'::uuid and slug='website-redesign-seo-checklist-mumbai' and title='Website Redesign SEO Checklist for Mumbai Businesses: How to Keep Your Rankings' and status='published' and md5(content)='729bdf14aff0ffc6a21483b9e957f693' and updated_at is not distinct from '2026-10-05 11:50:20.848+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: website-redesign-seo-checklist-mumbai'; end if;
 update public.blog_posts set title='Website Redesign SEO Checks: URL Mapping and Migration Monitoring', excerpt='', content='<p></p><p>Picture this: you open your company website on your phone between meetings and wince. The layout looks dated, the team photos show people who left years ago, and the buttons are hard to tap on a moving train. It is time to <strong>redesign your Mumbai business website</strong>.</p><p>

</p><p>But the old site has been collecting search visibility for years. It may rank for searches like <em>"custom packaging manufacturers in Bhiwandi"</em> or <em>"tax consultants near Nariman Point,"</em> and enquiries may reach you without any ad spend. Can you rebuild the site without losing that?</p><p>

</p><p>Treat the redesign as a migration with an explicit URL and content plan. Google documents that visibility can fluctuate during a move. Planning reduces avoidable technical errors but cannot guarantee unchanged rankings or that every effect will be small. Record the baseline and monitor the actual transition.</p><p>

</p><h2>Why Redesigns Hurt Search Visibility</h2><p>

</p><p>Search engines do not see your colour palette. They see URLs, text, links, status codes and page speed. Redesigns usually go wrong in a few predictable ways:</p><p>

</p><ul><li><p>An old page returning 404 without a relevant replacement can disrupt users and search discovery. Map genuinely equivalent or consolidated content to the appropriate destination; do not describe every URL change as erasing all historical signals.</p></li><li><p><strong>Useful content gets cut.</strong> A detailed service page is replaced by two lines and a photo, so the page no longer answers what people searched for.</p></li><li><p>A noindex directive requests exclusion from indexing when crawled; a robots.txt Disallow rule blocks crawling and does not itself guarantee removal of an already known URL. Inspect both separately and confirm that intended public pages are accessible and indexable after launch.</p></li><li><p><strong>The staging site gets indexed.</strong> A test copy on something like <code>test.yourdomain.com</code> is left open to search engines. Google does not usually "penalise" duplicate content, but two copies of the same pages can split signals and confuse which version should appear. Use <code>noindex</code> or password protection on staging.</p></li><li><p><strong>Speed gets worse.</strong> Heavy images and scripts make the new design slower than the old one on mobile.</p></li></ul><p>

</p><p>Think of it as shifting your office from Kanjurmarg to Powai. If you move without telling the post office, your clients, or your suppliers, people turn up at an empty shutter.</p><p>

</p><h2>Change One Thing at a Time</h2><p>

</p><p>Google recommends not changing everything at once. If you are changing your domain, your CMS and your layout, do them in separate steps. If your budget allows only one big move, at least avoid combining a redesign with a domain change and a complete content rewrite.</p><p>

</p><h2>Phase 1: Audit What Already Works</h2><p>

</p><p>Before any design work starts, list what is currently earning visibility and enquiries.</p><p>

</p><ul><li><p>In <strong>Google Search Console</strong>, export the pages that get the most clicks and impressions over the last 12 months, along with the queries behind them.</p></li><li><p>Check your analytics for the pages that lead to contact forms, calls and WhatsApp clicks.</p></li><li><p>Use the Links report in Search Console to see which pages have internal and external links pointing to them.</p></li><li><p>Crawl the live site with a tool such as Screaming Frog. Record every URL, title, meta description, heading, image and internal link.</p></li><li><p>Include images, PDFs and downloads. These can attract traffic and links too, and they need a new location just like pages do.</p></li></ul><p>

</p><p>Mark your top performers clearly. If a proposed design removes or merges one of them, ask why, and decide whether to keep it, improve it or redirect it deliberately.</p><p>

</p><h2>Phase 2: Map Your 301 Redirects</h2><p>

</p><p>A 301 is a permanent server-side redirect from an old URL to a new one. Google confirms that 301 and other permanent redirects do not cause a loss in PageRank. This is the single most important file in your migration.</p><p>

</p><p>Build a spreadsheet with the old URL in one column and the closest equivalent new URL in the next:</p><p>

</p><ul><li><p><code>/industrial-pumps.html</code> → <code>/services/industrial-water-pumps</code> (a direct topical match: good)</p></li><li><p><code>/about-director.php</code> → <code>/about-us</code> (the closest equivalent: good)</p></li><li><p><code>/thane-warehouse-facility.html</code> → <code>/</code> (<strong>risky:</strong> a specific page sent to the homepage)</p></li></ul><p>

</p><p>Google advises against redirecting many old URLs to one irrelevant destination such as the homepage, because this can confuse users and may be treated as a soft 404. The exception is content you have genuinely merged into one new page: redirecting the old pages to that page is fine. If a page has no sensible replacement, let it return a proper 404 or 410 instead.</p><p>

</p><p>A few more rules:</p><p>

</p><ul><li><p>Use server-side 301 or 308 redirects where possible.</p></li><li><p>Send each old URL straight to its final destination. Avoid chains such as Page 1 → Page 2 → Page 3.</p></li><li><p>Keep the redirects in place for as long as possible, generally at least one year.</p></li><li><p>Test old URLs exactly as they appear in your analytics and in links from other sites, including capitalised paths and URLs with tracking parameters.</p></li></ul><p>

</p><p>Not sure your list is complete? SiteNova offers a <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/free-audit">free website audit</a> that can help you spot broken links and metadata gaps before launch.</p><p>

</p><h2>Phase 3: Keep Content That Answers the Search</h2><p>

</p><p>Designers like short copy and generous whitespace, and a cleaner layout is a good goal. But if a page ranks because it explains something properly, cutting it down to a slogan can remove the reason it ranked. When moving content to the new layout:</p><p>

</p><ul><li><p><strong>Keep the substance.</strong> Preserve the explanations, specifications, FAQs and local details that make a page useful. Rework the layout around the content, not the other way round.</p></li><li><p><strong>Keep a clear heading structure.</strong> Use one descriptive main heading per page, with h2 and h3 subheadings that break the topic into sections.</p></li><li><p><strong>Keep the language your customers use.</strong> If a page matched searches like <em>"B2B industrial fabrication in Thane,"</em> keep those natural phrases in the body copy.</p></li><li><p><strong>Add answers where the page is thin.</strong> Real questions such as turnaround time during the monsoon, GST invoicing and delivery areas are good candidates.</p></li><li><p><strong>Rebuild internal links.</strong> Related pages should still link to each other, and every internal link should point to the new URL, not an old one that redirects.</p></li></ul><p>

</p><p>Our guide to <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/blog/local-seo-mumbai-businesses-guide-2026">local SEO for Mumbai businesses</a> covers location pages and Google Business Profile in more depth. If you also want help with on-page structure and structured data, see our <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/services/seo-optimization">SEO optimization service</a>.</p><p>

</p><h2>Phase 4: Don''t Let the New Design Be Slower</h2><p>

</p><p>Many of your visitors will arrive on a phone, on mobile data, often while travelling. Google recommends good Core Web Vitals and says they align with what its core ranking systems seek to reward. They are one signal among many, not a guarantee of rankings. Google''s current "good" targets are:</p><p>

</p><ul><li><p><strong>Largest Contentful Paint (LCP):</strong> within 2.5 seconds, for loading performance.</p></li><li><p><strong>Interaction to Next Paint (INP):</strong> under 200 milliseconds, for responsiveness when people tap or type.</p></li><li><p><strong>Cumulative Layout Shift (CLS):</strong> below 0.1, so content doesn''t jump around as the page loads.</p></li></ul><p>

</p><p>Practical steps that usually help:</p><p>

</p><ul><li><p>Compress images and serve modern formats such as WebP or AVIF where they suit your audience.</p></li><li><p>Set image dimensions so the layout doesn''t shift while loading.</p></li><li><p>Defer scripts that are not needed for the first screen, such as chat widgets and extra trackers.</p></li><li><p>Choose hosting with a CDN, and test on a real mid-range phone as well as on your office Wi-Fi.</p></li></ul><p>

</p><p>Run your key pages through PageSpeed Insights before and after the redesign, so you can see whether the new design actually improved things. For realistic budgets, see our guide to <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/blog/website-cost-mumbai-2026">website cost in Mumbai</a>.</p><p>

</p><h2>Phase 5: Launch Checklist and Monitoring</h2><p>

</p><p>If your traffic has a quiet period, such as certain weekdays or off-season weeks, launching then means fewer visitors are affected by any hiccups. Check your own analytics before choosing a date, and avoid launching during your busiest festive weeks.</p><p>

</p><ul><li><p><strong>Remove temporary blocks.</strong> Take out any <code>Disallow: /</code> rule in robots.txt and any <code>noindex</code> tags that were only there for development.</p></li><li><p>Original indexable pages should normally identify their preferred final URL. Intentionally syndicated or duplicate content may instead point to the supported original. Check canonical targets against the actual consolidation plan rather than force every page to self-reference.</p></li><li><p><strong>Submit a new XML sitemap</strong> that lists only the live, indexable URLs, in Search Console.</p></li><li><p>Test the planned redirects against exact old URLs, including relevant path variants. Inspect status, destination and loops rather than assume that generating a mapping file proves the deployed behaviour.</p></li><li><p><strong>Update internal links</strong> to the new URLs, and update your Google Business Profile, social profiles, email signatures and ad landing pages too.</p></li><li><p><strong>Check structured data.</strong> If you use LocalBusiness markup, confirm your name, address, phone number and opening hours are still correct and error-free.</p></li><li><p>Test accepted website submissions and notification recovery. Check telephone and WhatsApp destinations separately: opening an app or clicking a contact link is not proof that an enquiry was sent. Conversion definitions should preserve those distinctions rather than count every test click as a confirmed lead.</p></li><li><p><strong>Check server capacity.</strong> Google may crawl more heavily right after a migration, so make sure your hosting can cope.</p></li></ul><p>

</p><p>After launch, watch Search Console closely for crawl errors, "Not found" spikes and indexing problems. Expect some temporary movement in rankings. For a small or medium site, Google says it can take a few weeks for most pages to move across, and longer for large sites. If you see a sharp, sustained drop, check redirects, canonicals and robots rules first.</p><p>

</p><h2>Redesign With a Plan, Not a Gamble</h2><p>

</p><p>A redesign should make your business look better and convert better without throwing away what search engines already know about you. Audit first, map every important URL, keep the content that earns its place, protect speed, and test before and after launch.</p><p>

</p><p>Planning a redesign and want a second pair of eyes on the migration plan? Start with the <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/free-audit">free website audit</a>, or <a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline underline-offset-2" href="https://sitenova.dev/quote">request a quote</a> for the project.</p><p>Reference: <a href="https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes">Google site-move guidance</a>. Check the current provider guidance for the actual implementation.</p>', updated_at=now() where id='2ad400b0-7b8f-4cb6-961d-8ddd7fd4427f'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='564d1ac5-3528-45f8-8751-72316d554841'::uuid and slug='beyond-aesthetics-building-lightning-fast-experiences-with-sitenova' and title='Beyond Aesthetics: Building Lightning-Fast Experiences with SiteNova' and status='published' and md5(content)='9eff8e899cab00b0de43b0703f889f52' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: beyond-aesthetics-building-lightning-fast-experiences-with-sitenova'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/pagespeed-score-95-mumbai-case-study', updated_at=now() where id='564d1ac5-3528-45f8-8751-72316d554841'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='1915a357-bbd1-4660-8c91-c6edff86530e'::uuid and slug='why-mumbai-businesses-need-fast-mobile-websites' and title='Why Mumbai Businesses Need a Fast, Mobile-First Website in 2026' and status='published' and md5(content)='fefb74cf01c84125af66a9debc9b335b' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-mumbai-businesses-need-fast-mobile-websites'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/pagespeed-score-95-mumbai-case-study', updated_at=now() where id='1915a357-bbd1-4660-8c91-c6edff86530e'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='43d63ba4-52a7-4d49-944e-04771021dda8'::uuid and slug='why-ultra-fast-websites-win-local-seo' and title='Why Ultra-Fast Websites Are the Secret to Dominating Local Search' and status='published' and md5(content)='03311e71cf78e4846fa1e4ab7e972fe6' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-ultra-fast-websites-win-local-seo'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/pagespeed-score-95-mumbai-case-study', updated_at=now() where id='43d63ba4-52a7-4d49-944e-04771021dda8'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='8a4348e0-c1d3-4b66-b10e-3a065ffd3eb6'::uuid and slug='how-local-seo-doubles-foot-traffic-mulund' and title='How Local SEO Can Double Foot Traffic for Your Store in Mulund & Thane' and status='published' and md5(content)='7904eb52729ab8d20f67003ed4d849a1' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: how-local-seo-doubles-foot-traffic-mulund'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/local-seo-mumbai-businesses-guide-2026', updated_at=now() where id='8a4348e0-c1d3-4b66-b10e-3a065ffd3eb6'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='0c08cbda-043e-4474-8566-a33b87c61c44'::uuid and slug='5-signs-your-website-is-losing-customers' and title='5 Signs It''s Time to Redesign Your Business Website' and status='published' and md5(content)='5560aa68caad19f4a5de588836b2a0b2' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: 5-signs-your-website-is-losing-customers'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/small-business-website-mistakes-losing-customers', updated_at=now() where id='0c08cbda-043e-4474-8566-a33b87c61c44'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='387fbe5e-f916-402c-8786-d8236806a4b6'::uuid and slug='how-much-does-a-website-cost-in-india-2026' and title='How Much Does a Website Cost in India? (2026 Guide)' and status='published' and md5(content)='f1617068b298317746830c3b925f2d93' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: how-much-does-a-website-cost-in-india-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/website-cost-mumbai-2026', updated_at=now() where id='387fbe5e-f916-402c-8786-d8236806a4b6'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='b92d2f36-914c-4b1a-965b-650a4f4798b7'::uuid and slug='ecommerce-website-cost-mumbai-2026' and title='How Much Does an E-Commerce Website Cost in Mumbai in 2026?' and status='published' and md5(content)='5db89fbd576ae5182a95b435a7926436' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: ecommerce-website-cost-mumbai-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/ecommerce-website-cost-mumbai', updated_at=now() where id='b92d2f36-914c-4b1a-965b-650a4f4798b7'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='208b56b1-92bd-4a6d-ad80-fc3c05f88177'::uuid and slug='is-your-website-ready-for-diwali-2026-checklist' and title='Is Your Website Ready for Diwali 2026? A Pre-Festive Checklist' and status='published' and md5(content)='e9444dac59343faebae52ee0fe46b3f5' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: is-your-website-ready-for-diwali-2026-checklist'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/website-ready-navratri-diwali-2026-mumbai', updated_at=now() where id='208b56b1-92bd-4a6d-ad80-fc3c05f88177'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='85df142a-104b-4943-861a-6fd52249f0ff'::uuid and slug='why-business-needs-a-website-2026' and title='Why Does Your Business Need a Website in 2026?' and status='published' and md5(content)='7281ead4f5fd4c350fb8f3f14b53c15f' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-business-needs-a-website-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/google-business-profile-vs-website-do-you-need-both', updated_at=now() where id='85df142a-104b-4943-861a-6fd52249f0ff'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='34e47e45-bc13-4964-860f-54220d065b77'::uuid and slug='why-diy-website-builders-cost-you-customers' and title='Why Your DIY Website Builder Is Costing You Customers' and status='published' and md5(content)='74fb2c47fff88d98521a6ee545aca375' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-diy-website-builders-cost-you-customers'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/wordpress-vs-custom-website-mumbai-business', updated_at=now() where id='34e47e45-bc13-4964-860f-54220d065b77'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='ba77a771-4df9-4bd4-a29e-c6e6b62935f2'::uuid and slug='web-design-company-in-thane-2026' and title='Web Design Company in Thane: What to Look For in 2026' and status='published' and md5(content)='f9f1c617f9a3e970d78a365e52229de1' and updated_at is not distinct from '2026-09-25 07:19:16.722+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: web-design-company-in-thane-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/location/thane', updated_at=now() where id='ba77a771-4df9-4bd4-a29e-c6e6b62935f2'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='5b4685e7-ef9f-4979-ae0f-66f93a3691a5'::uuid and slug='web-design-company-in-andheri-2026' and title='Web Design Company in Andheri: What to Look For in 2026' and status='published' and md5(content)='d112ac3cc63cae1be1f1921bd6dde254' and updated_at is not distinct from '2026-09-25 07:18:41.929+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: web-design-company-in-andheri-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/location/andheri', updated_at=now() where id='5b4685e7-ef9f-4979-ae0f-66f93a3691a5'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='9dbd3a9b-d8b8-4f51-8445-bdc6fe914c23'::uuid and slug='web-design-company-in-powai-2026' and title='Web Design Company in Powai: What to Look For in 2026' and status='published' and md5(content)='963338f1e2c613fca06ac951538874f6' and updated_at is not distinct from '2026-09-21 05:53:22.814+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: web-design-company-in-powai-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/location/powai', updated_at=now() where id='9dbd3a9b-d8b8-4f51-8445-bdc6fe914c23'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='af42715e-4a5c-4e2c-803e-06fb4338d198'::uuid and slug='wix-vs-real-website-bhandup-businesses' and title='Wix vs a Real Website: What Bhandup Businesses Should Know' and status='published' and md5(content)='928e1ae9d5a5c7bf814f1dbb87c9fbee' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: wix-vs-real-website-bhandup-businesses'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/location/bhandup', updated_at=now() where id='af42715e-4a5c-4e2c-803e-06fb4338d198'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='1207960f-9ed7-4251-88c3-a2ddc78cfc8f'::uuid and slug='why-small-business-mulund-needs-website' and title='Why Every Small Business in Mulund Needs a Website in 2026' and status='published' and md5(content)='79fa235c29dfd59bf0744811f195f690' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: why-small-business-mulund-needs-website'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/location/mulund', updated_at=now() where id='1207960f-9ed7-4251-88c3-a2ddc78cfc8f'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='3b96fbc0-ba9a-47d2-9c63-45f837bdfee9'::uuid and slug='optimize-google-business-profile-2026-update' and title='How to Optimize Your Google Business Profile After Google''s 2026 Update' and status='published' and md5(content)='57667ade53e56e8af13bc2d13faf8e37' and updated_at is not distinct from '2026-09-16 09:50:57.335868+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: optimize-google-business-profile-2026-update'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/local-seo-mumbai-businesses-guide-2026', updated_at=now() where id='3b96fbc0-ba9a-47d2-9c63-45f837bdfee9'::uuid;
end $repair$;
do $repair$ begin
 if not exists(select 1 from public.blog_posts where id='62b2be5d-1d53-43d5-b977-2813a58590f7'::uuid and slug='google-business-profile-verification-harder-2026' and title='Google Business Profile Verification Just Got Harder in 2026' and status='published' and md5(content)='faa40725588cfc1267d4f28c50a36368' and updated_at is not distinct from '2026-09-19 05:14:21.143+00'::timestamptz and canonical_url is not distinct from null for update) then raise exception 'Archive source changed: google-business-profile-verification-harder-2026'; end if;
 update public.blog_posts set canonical_url='https://sitenova.dev/blog/local-seo-mumbai-businesses-guide-2026', updated_at=now() where id='62b2be5d-1d53-43d5-b977-2813a58590f7'::uuid;
end $repair$;
commit;
