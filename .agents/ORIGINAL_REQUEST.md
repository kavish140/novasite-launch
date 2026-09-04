# Original User Request

## Initial Request — 2026-08-30T14:11:55Z

You are the Project Orchestrator for the SiteNova Growth Audit project.

Your Working Directory: P:\Websites\Personal\novasite-launch-main\.agents\orchestrator
Codebase Root: P:\Websites\Personal\novasite-launch-main
Original Request File: P:\Websites\Personal\novasite-launch-main\.agents\ORIGINAL_REQUEST.md

Mission:
Perform a comprehensive growth audit across SEO, GEO (AI visibility), content, local presence, and conversion for SiteNova (sitenova.dev), and produce a prioritised, actionable 90-day roadmap that the solo founder can execute step by step.

Requirements to fulfill:
- R1: Full SEO Audit — Technical, On-Page, and Off-Page (addressing crawlability, sitemap, indexation, internal links, INP 310ms issue, mobile usability, meta tags, heading hierarchy, keywords with search volume, authority/citations, NAP consistency, local SEO across 14 location pages).
- R2: GEO Audit — AI Citation and Generative Engine Visibility (0 citations root causes, Speakable/Schema in app/lib/seo.ts, E-E-A-T signals, AI content formats, geo-entity-blocks, competitor comparison with 3 real Mumbai agencies).
- R3: Content Strategy Audit (high ranking potential pages, 15-25 specific target keywords with search volume / difficulty, blog quality and topical clusters, niche/location/service architecture analysis).
- R4: Conversion Audit (42.86% dead-click diagnosis with page-level specifics, 42.86% quick-back diagnosis, paid LP /lp/web-design funnel health and lead capture improvements).
- R5: Prioritised 90-Day Roadmap (week-by-week: Week 1-2 quick wins with >=5 zero budget, Week 3-6 medium effort, Week 7-12 sustained effort, with impact/effort/cost).

Please maintain your plan.md, progress.md, and BRIEFING.md in your working directory.
Dispatch specialist subagents as needed for research, code inspection, technical auditing, and strategy synthesis.
Deliver the final comprehensive audit report and roadmap once complete. Report completion when done.

## Follow-up — 2026-09-02T06:07:49Z

Analyze current SEO performance for sitenova.dev and develop a breakthrough strategy to maximize search clicks, capitalizing on the recent growth in impressions. Use the provided Google Search Console data export to identify exact queries and pages to target.

Working directory: p:\Websites\Personal\novasite-launch-main
Integrity mode: development

## Requirements

### R1. Analyze GSC Data
Analyze the provided Google Search Console data export to identify high-impression, low-click opportunities (e.g., pages stuck on page 2/3, or high-ranking pages with poor CTR). 

### R2. Develop Strategy & Implementation Plan
Generate a comprehensive SEO strategy document (`seo_strategy.md`) and a step-by-step technical implementation plan (`seo_implementation_plan.md`). The implementation plan must detail exact codebase changes (meta tags, structured data, headings, routing) required to execute the strategy within the React Router v7 and Cloudflare Workers architecture. Do NOT implement the code changes yet.

## Acceptance Criteria

### Data Analysis
- [ ] The strategy explicitly identifies at least 5 high-priority queries/pages based on the GSC data.
- [ ] For each priority page, the root cause of low clicks (e.g., low position, poor title snippet, missing schema) is hypothesized.

### Technical Viability (Agent-as-Judge)
- [ ] An independent reviewer agent must confirm that all proposed code changes in the implementation plan are compatible with React Router v7's `meta()` exports and the Cloudflare Workers edge SSR architecture.
- [ ] The independent reviewer agent must confirm that no proposed changes conflict with the rules established in `AGENTS.md`.

## Verification Resources
Here is the Google Search Console data export to analyze:

Date,Clicks,Impressions,CTR,Position
2026-05-31,0,7,0%,13.9
2026-06-01,3,15,20%,2.4
2026-06-02,4,12,33.33%,3.3
2026-06-03,0,6,0%,2
2026-06-04,0,11,0%,10.7
2026-06-05,0,4,0%,26.8
2026-06-06,0,10,0%,7.8
2026-06-07,0,17,0%,60.4
2026-06-08,0,14,0%,76.8
2026-06-09,0,14,0%,17.1
2026-06-10,1,6,16.67%,4.2
2026-06-11,0,11,0%,13.5
2026-06-12,1,9,11.11%,4.6
2026-06-13,1,6,16.67%,5.3
2026-06-14,2,15,13.33%,21.1
2026-06-15,2,21,9.52%,25.1
2026-06-16,2,11,18.18%,13.8
2026-06-17,0,15,0%,15.5
2026-06-18,0,24,0%,8.2
2026-06-19,1,8,12.5%,4
2026-06-20,1,7,14.29%,7
2026-06-21,3,12,25%,12
2026-06-22,0,7,0%,8.1
2026-06-23,2,12,16.67%,3.2
2026-06-24,0,13,0%,5.3
2026-06-25,0,5,0%,3.8
2026-06-26,3,9,33.33%,7.6
2026-06-27,0,4,0%,6.5
2026-06-28,0,10,0%,5.4
2026-06-29,1,18,5.56%,7.6
2026-06-30,0,3,0%,7
2026-07-01,0,13,0%,18.4
2026-07-02,0,7,0%,7.4
2026-07-03,0,14,0%,10.1
2026-07-04,0,4,0%,4
2026-07-05,1,4,25%,5
2026-07-06,0,15,0%,15.3
2026-07-07,0,1,0%,79
2026-07-08,0,1,0%,2
2026-07-09,1,14,7.14%,45
2026-07-10,0,22,0%,12.2
2026-07-11,0,18,0%,37
2026-07-12,0,21,0%,27.6
2026-07-13,1,10,10%,14.1
2026-07-14,0,6,0%,18.8
2026-07-15,1,7,14.29%,4
2026-07-16,1,8,12.5%,29.5
2026-07-17,0,2,0%,9
2026-07-18,0,6,0%,26.3
2026-07-19,0,7,0%,15
2026-07-20,2,21,9.52%,12.2
2026-07-21,0,4,0%,14.2
2026-07-22,0,6,0%,6.7
2026-07-23,0,9,0%,22.3
2026-07-24,1,4,25%,9.2
2026-07-25,0,5,0%,8.6
2026-07-26,0,7,0%,9
2026-07-27,0,14,0%,23.6
2026-07-28,0,8,0%,16.8
2026-07-29,0,7,0%,11
2026-07-30,0,9,0%,4.3
2026-07-31,0,14,0%,14.4
2026-08-01,0,6,0%,12.5
2026-08-02,0,11,0%,21.1
2026-08-03,1,16,6.25%,20.1
2026-08-04,0,11,0%,22.5
2026-08-05,3,19,15.79%,8.3
2026-08-06,0,5,0%,27.8
2026-08-07,0,7,0%,25.1
2026-08-08,2,19,10.53%,20.9
2026-08-09,0,37,0%,26.1
2026-08-10,0,32,0%,34.1
2026-08-11,1,14,7.14%,33
2026-08-12,0,18,0%,34.2
2026-08-13,0,18,0%,42.6
2026-08-14,0,10,0%,42.4
2026-08-15,3,21,14.29%,34.5
2026-08-16,0,20,0%,37.5
2026-08-17,0,21,0%,33.6
2026-08-18,0,26,0%,20
2026-08-19,1,26,3.85%,41.2
2026-08-20,2,35,5.71%,42
2026-08-21,0,10,0%,41.9
2026-08-22,1,17,5.88%,48.1
2026-08-23,0,11,0%,50.5
2026-08-24,3,34,8.82%,37.9
2026-08-25,1,22,4.55%,28.9
2026-08-26,0,22,0%,35.5
2026-08-27,0,30,0%,30
2026-08-28,1,20,5%,34.1
2026-08-29,0,15,0%,50.2
2026-08-30,0,26,0%,41.5
Country,Clicks,Impressions,CTR,Position
India,48,891,5.39%,24.55
Netherlands,3,15,20%,11.53
Croatia,2,2,100%,2.5
Morocco,1,6,16.67%,64.33
United States,0,127,0%,24.17
France,0,25,0%,38.2
United Kingdom,0,13,0%,50
Australia,0,11,0%,6.82
Nigeria,0,8,0%,11.38
Bulgaria,0,7,0%,8.29
Brazil,0,7,0%,21.14
Turkey,0,7,0%,22.14
Vietnam,0,7,0%,32.43
Pakistan,0,6,0%,10.83
Philippines,0,6,0%,64
Iran,0,5,0%,11.8
Canada,0,4,0%,4
Indonesia,0,4,0%,22.75
Malaysia,0,4,0%,23.5
Russia,0,4,0%,23.75
Thailand,0,4,0%,28.25
Ukraine,0,4,0%,29.25
Mexico,0,4,0%,32.5
United Arab Emirates,0,4,0%,62.25
Portugal,0,3,0%,5
Germany,0,3,0%,8
Spain,0,3,0%,23
Uganda,0,2,0%,3.5
Romania,0,2,0%,5
Japan,0,2,0%,5.5
Poland,0,2,0%,5.5
Switzerland,0,1,0%,1
Egypt,0,1,0%,1
Cambodia,0,1,0%,1
Dominican Republic,0,1,0%,3
Singapore,0,1,0%,3
Sri Lanka,0,1,0%,8
Serbia,0,1,0%,8
Tajikistan,0,1,0%,9
Ireland,0,1,0%,36
Bangladesh,0,1,0%,54
Senegal,0,1,0%,90
Device,Clicks,Impressions,CTR,Position
Desktop,27,947,2.85%,28.32
Mobile,24,246,9.76%,11.33
Tablet,3,10,30%,3.6
Filter,Value
Search type,Web
Date,Last 3 months
Top pages,Clicks,Impressions,CTR,Position
https://sitenova.dev/,39,581,6.71%,7.1
https://sitenova.dev/location/bhandup,3,65,4.62%,13.57
https://mail.sitenova.dev/,3,23,13.04%,44.13
https://sitenova.dev/websites-for-startups,2,35,5.71%,9.06
https://sitenova.dev/websites-for-consultants,2,25,8%,5.68
https://sitenova.dev/websites-for-lawyers,2,19,10.53%,7.11
https://sitenova.dev/websites-for-real-estate,2,13,15.38%,25.31
https://sitenova.dev/location/thane/,1,36,2.78%,45.89
https://sitenova.dev/about,1,33,3.03%,3.73
https://design.sitenova.dev/,1,29,3.45%,7.66
https://sitenova.dev/quote,1,24,4.17%,11.46
https://sitenova.dev/location/pedder-road/,1,12,8.33%,7
https://sitenova.dev/blog,1,9,11.11%,4.22
https://sitenova.dev/blog/beyond-aesthetics-building-lightning-fast-experiences-with-sitenova,1,2,50%,4.5
https://sitenova.dev/location/bandra,0,74,0%,30.68
https://sitenova.dev/website-cost-calculator,0,62,0%,84.87
https://sitenova.dev/location/thane,0,44,0%,41.59
https://sitenova.dev/location/powai,0,43,0%,34.37
https://sitenova.dev/location/mulund,0,37,0%,35.3
https://mail.sitenova.dev/signup/,0,37,0%,53.76
https://sitenova.dev/location/bhandup/,0,35,0%,17
https://sitenova.dev/websites-for-restaurants,0,31,0%,19.81
https://sitenova.dev/our-process,0,23,0%,10.04
https://sitenova.dev/why-us,0,22,0%,9.23
https://sitenova.dev/location/kurla/,0,21,0%,9.86
https://sitenova.dev/services/ecommerce,0,21,0%,52.33
https://buisness-showcase.sitenova.dev/,0,20,0%,46.45
https://sitenova.dev/location/dadar,0,18,0%,11.44
https://sitenova.dev/location/vikhroli/,0,14,0%,32.07
https://sitenova.dev/location/ghatkopar,0,13,0%,19
https://sitenova.dev/blog/website-cost-mumbai-2026,0,13,0%,26.15
https://sitenova.dev/services/web-applications,0,12,0%,2.75
https://sitenova.dev/blog/how-real-estate-agents-in-mumbai-can-get-leads-online,0,11,0%,72.18
https://sitenova.dev/location/dadar/,0,10,0%,15.1
https://sitenova.dev/location/ghatkopar/,0,9,0%,47.67
https://sitenova.dev/websites-for-finance/,0,8,0%,6.75
https://sitenova.dev/location/nahur/,0,6,0%,4.83
https://sitenova.dev/blog/local-seo-mumbai-businesses-guide-2026,0,6,0%,53.67
https://sitenova.dev/blog/5-things-every-ca-firm-website-must-have,0,5,0%,12.2
https://sitenova.dev/location/kurla,0,5,0%,16.6
https://sitenova.dev/location/vikhroli,0,5,0%,37.4
https://sitenova.dev/blog/wordpress-vs-custom-website-mumbai-business,0,5,0%,84
https://sitenova.dev/blog/why-business-needs-a-website-2026,0,4,0%,6.75
https://sitenova.dev/location/lower-parel,0,4,0%,8
https://sitenova.dev/location/nahur,0,4,0%,31
https://sitenova.dev/location/lower-parel/,0,4,0%,48.75
https://sitenova.dev/blog/why-small-business-mulund-needs-website,0,3,0%,7
https://sitenova.dev/blog/how-long-does-it-take-to-build-a-website,0,3,0%,31
https://sitenova.dev/pricing,0,2,0%,2.5
https://sitenova.dev/websites-for-finance,0,2,0%,4
https://sitenova.dev/location/mahalakshmi,0,2,0%,4.5
https://sitenova.dev/websites-for-doctors,0,2,0%,6.5
https://sitenova.dev/blog/5-things-every-salon-spa-website-needs,0,2,0%,7
https://sitenova.dev/services/seo-optimization,0,2,0%,9
https://sitenova.dev/location/mahalakshmi/,0,2,0%,51.5
https://ecommerce.sitenova.dev/,0,2,0%,60
https://sitenova.dev/blog/how-much-does-a-website-cost-in-india-2026,0,1,0%,8
https://sitenova.dev/blog/why-mumbai-businesses-need-fast-mobile-websites,0,1,0%,10
https://sitenova.dev/blog/why-every-doctor-in-mumbai-needs-a-website-in-2026,0,1,0%,53
Top queries,Clicks,Impressions,CTR,Position
sitenova,19,91,20.88%,4.2
website designer near me,1,4,25%,5
magicbricks,1,2,50%,94.5
official website,1,1,100%,1
their pricing?,1,1,100%,1
where can i contact him,1,1,100%,1
web development,0,97,0%,4.61
novamail,0,30,0%,44.4
website developer in mulund,0,24,0%,18.21
business webdesign,0,23,0%,2.96
website design,0,13,0%,3.85
website designer bhandup,0,13,0%,18
website design company in bhandup,0,13,0%,42.46
website cost calculator,0,12,0%,92.58
website price calculator,0,11,0%,93.82
website design in bandra,0,10,0%,19.2
website design cost in mumbai,0,9,0%,34.33
bizpulse,0,9,0%,47.33
online store development mumbai,0,8,0%,96
sitenova ai,0,7,0%,6
"website design company near bandra west, mumbai",0,7,0%,28
web design,0,6,0%,5
website designer,0,5,0%,2.8
website cost calculator mumbai,0,5,0%,34.4
website design in charkop,0,5,0%,63.2
bizpulse pricing,0,5,0%,81.2
website designer in thane,0,5,0%,88.8
website price,0,5,0%,97.4
web development company,0,4,0%,1
website development,0,3,0%,2.33
restaurants websites,0,3,0%,9.33
mumbai restaurants,0,3,0%,38.67
design companies in powai,0,3,0%,44.33
"seo freelancer near bandra west, mumbai",0,3,0%,75
ecommerce website design mumbai,0,3,0%,81.67
website development powai mumbai,0,3,0%,83.67
website development near me,0,2,0%,1
site maintenance,0,2,0%,2
web design website,0,2,0%,2
website developer,0,2,0%,3.5
web host design,0,2,0%,9.5
web design company in hiranandani estate thane,0,2,0%,16
restaurants website,0,2,0%,17.5
web development company in mumbai,0,2,0%,31
website development company in powai,0,2,0%,33.5
web design development agencies in bhandup,0,2,0%,42.5
"top rated website design companies near bandra west, mumbai",0,2,0%,52.5
local citation building mumbai,0,2,0%,66.5
"outsource seo services near bandra west, mumbai",0,2,0%,72
nova mail,0,2,0%,74
nova emails,0,2,0%,74.5
"online business website near mumbai,india",0,2,0%,78
website designer thane,0,2,0%,86.5
portfolio website for professionals vikhroli,0,2,0%,92
website developer in thane,0,2,0%,93
"how can real estate developers in mumbai handle thousands of property 
inquiries without hiring more telecallers?",0,2,0%,96.5
website design company in thane,0,2,0%,97.5
"search engine marketing company near bandra west, mumbai",0,2,0%,98.5
"best affordable platforms for automating property lead calls in mumbai real 
estate market",0,2,0%,100
"small business seo service near bandra west, mumbai",0,2,0%,100
his age?,0,1,0%,1
on their official site,0,1,0%,1
photoes,0,1,0%,1
web development agency,0,1,0%,1
web hosting,0,1,0%,1
website design services,0,1,0%,1
website designer in mumbai,0,1,0%,1
website designing mumbai,0,1,0%,1
who is the founder,0,1,0%,1
it web design,0,1,0%,2
website development and design,0,1,0%,2
site development,0,1,0%,3
website developer near me,0,1,0%,3
web designer,0,1,0%,4
website,0,1,0%,5
design website,0,1,0%,7
great web design,0,1,0%,9
website near me,0,1,0%,9
website designer mumbai,0,1,0%,10
web design company in ghodbunder road thane,0,1,0%,12
"web design and seo agency near bandra west, mumbai",0,1,0%,24
hetvam graphics,0,1,0%,32
web designers thane,0,1,0%,42
nova e mail,0,1,0%,46
site now,0,1,0%,57
web development in thane,0,1,0%,57
graphic design agencies in vikhroli,0,1,0%,60
"""web designer"" ""contact"" ""book a call"" ""gmail.com""",0,1,0%,61
web design development agencies in ghatkopar,0,1,0%,62
web design development agencies in kurla,0,1,0%,64
web design development agencies in vikhroli,0,1,0%,64
how to make a nova account,0,1,0%,66
web design development agencies in dadar,0,1,0%,70
logo design agencies in vikhroli,0,1,0%,78
web design maldon,0,1,0%,78
website for law firm,0,1,0%,79
mailnova,0,1,0%,81
real estate lead generation in mumbai,0,1,0%,84
local seo strategies for mumbai restaurants,0,1,0%,85
web design development agencies in lower parel,0,1,0%,86
website designing in thane,0,1,0%,86
website designers in mumbai charges,0,1,0%,87
website designing company in thane,0,1,0%,88
website design cost calculator in india,0,1,0%,90
website estimate calculator,0,1,0%,91
wordpress or custom website,0,1,0%,91
wordpress vs custom website,0,1,0%,91
devseo-pro.vercel.app,0,1,0%,92
website development prices in mumbai,0,1,0%,92
free website cost calculator,0,1,0%,94
estimate website cost,0,1,0%,95
website cost estimator,0,1,0%,95
seo agencies in vikhroli,0,1,0%,96
site price calculator,0,1,0%,96
website design cost calculator,0,1,0%,97
website development company in thane,0,1,0%,97
ui ux agencies in bhandup,0,1,0%,98
web design development agencies in mahalaxmi,0,1,0%,98
"search engine marketing companies near bandra west, mumbai",0,1,0%,99
ui ux agencies in vikhroli,0,1,0%,99
