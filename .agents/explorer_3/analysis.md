# SiteNova Deep Growth Audit: Content Strategy, Keyword Research & CRO/UX

**Author**: Explorer 3 (Content Strategy, Keyword Research & CRO/UX Specialist)  
**Date**: 2026-08-30  
**Scope**: Content Architecture, High-Intent Keyword Mapping, Dead-Click Diagnosis, Quick-Back/Bounce Analysis, and Paid Landing Page Funnel Health.

---

## Executive Summary

SiteNova possesses a modern tech foundation (React Router v7, Vite, Tailwind CSS, Supabase) and strong local positioning ("Web design in Mulund, Mumbai from ₹10,000"). However, the site suffers from **three critical growth bottlenecks**:

1. **Content Architecture & Topical Thinness**: 14 location pages are ~80% identical boilerplate; the blog has only 3 short articles with no topical clustering; the main navigation completely hides the 3 core service pages (`/services/*`) from the "Services" dropdown.
2. **42.86% Dead-Click Crisis**: Over 10 key UI components use `.interactive-card` and `.hover-glow` (hover lift `translateY(-4px)` + glow box-shadow) on non-interactive `<div>`s (hero badges, dashboard preview image, 6 feature cards, price pills, review stats, pillar cards). Users perceive these as clickable links, click repeatedly with zero feedback, and bounce.
3. **42.86% Quick-Back & Conversion Blockers**:
   - **Hero Friction**: A keyword-stuffed H1, 3 competing CTA buttons, and pricing buried below the fold trigger rapid bounces.
   - **Mobile Overload**: Sticky bottom audit bar + floating WhatsApp/Call widget overlap on mobile screens, obscuring ~30% of the viewport.
   - **WhatsApp Barrier**: A 2-step qualification modal on the WhatsApp widget adds unnecessary friction to India's #1 lead channel.
   - **Paid Ad Funnel Leaks**: `/lp/web-design` QuoteWizard disables the "Next" button until 10+ characters are typed without clear inline validation; `/lp/thank-you-quote` fails to fire the Google Ads conversion tag (`trackGoogleAdsConversion`), blinding Google Ads smart bidding algorithms.

---

## 1. Content Strategy & Page Architecture Potential

### 1.1 Content Inventory & Structural Analysis

| Page / Directory | Total Word Count | Content Depth & Status | Uniqueness & Value | Ranking Potential & Missed Opportunities |
|---|---|---|---|---|
| **Homepage (`/`)** `app/pages/Index.tsx` | ~950 words | Medium | High (LocalAgencySection, GEO block, FAQ, Portfolio) | **High**: Needs clearer H1 hook, 1 primary hero CTA, and links from static price chips. |
| **7 Niche Pages (`/websites-for-*`)** `app/pages/niche/*` | 563 – 1,147 words (Avg: ~810w) | Medium-Low | High concept, but uneven execution | **Very High**: Lawyers (1,147w) & Consultants (1,080w) are solid. Restaurants (563w) & Startups (583w) are too thin. Need industry-specific ROI calculators and client proof. |
| **3 Service Pages (`/services/*`)** `app/pages/services/*` | 602 – 1,171 words | Medium-Low | Moderate | **High**: `SeoSpeed.tsx` (1,171w) is strong. `WebApps.tsx` (602w) & `Ecommerce.tsx` (798w) lack technical depth (Razorpay/Stripe, auth, security). **Critical**: Not listed in Navbar dropdown! |
| **14 Location Pages (`/location/*`)** `app/pages/locations/*` | ~800 words (Rendered via template) | Low (Boilerplate) | ~15-20% unique per page (150–250 words) | **High with Risk**: 75–80% duplicate content across 14 pages (`LocationPageTemplate.tsx`). Needs local landmarks, client quotes, localized pricing, and embedded GMB maps to avoid Google thin/doorway page penalties. |
| **Blog (`/blog`)** `app/pages/blog/*` | 3 Seed Posts (~700w each) | Very Low | High relevance, but zero volume | **Massive Long-Tail Potential**: 3 posts cannot build topical authority. Zero pillar-cluster architecture. Needs 12–15 structured cluster guides. |
| **Why Us / About / Process** `app/pages/*.tsx` | 800 – 1,200 words | High | High E-E-A-T (Founder story, direct developer access) | **Moderate**: Great trust content; needs stronger internal cross-links into QuoteWizard and Niche landing pages. |

---

### 1.2 In-Depth Page Architecture Findings

#### A. The Hidden Service Pages Disaster
In `app/components/Navbar.tsx` (lines 14–57), the desktop and mobile dropdown is labeled **"Services"**, but it **only contains the 7 niche vertical pages** (`/websites-for-doctors`, `/websites-for-finance`, etc.).
- The 3 core technical services (`/services/ecommerce`, `/services/seo-optimization`, `/services/web-applications`) have **zero links in the primary navigation menu**!
- Search crawlers and visitors looking for general e-commerce development or custom web app engineering cannot navigate to these services from the header.

#### B. 14 Location Pages & Duplicate Content Threat
All 14 location pages (`Mulund`, `Thane`, `Bhandup`, `Nahur`, `Bandra`, `Andheri`, `Ghatkopar`, `Vikhroli`, `Kurla`, `Dadar`, `Lower Parel`, `Mahalakshmi`, `Pedder Road`, `Powai`) import `LocationPageTemplate.tsx`.
- **Boilerplate**: The 3 core benefit cards ("Fast Mobile First Indexing", "Mobile-First Schema Markup", "Hyper-Targeted Local Pages"), the FAQ questions & answers, the cross-linking grid, the PortfolioSection, TestimonialsSection, and CTA banner are 100% identical.
- **Unique Content**: Only `subTitle`, `description`, `regionalFocusText`, and `nearbySuburbs` (approx 150 words).
- **Risk**: Google's Helpful Content System and spam algorithms flag doorway/template pages when 80%+ of text is boilerplate.
- **Solution**: Differentiate each location with:
  1. Specific local commercial zones (e.g., Bandra: Linking Road/Pali Hill retail; Andheri: MIDC/Oshiwara corporate; Mulund: LBS Road/R-Mall).
  2. Local client quote or localized case study snippet.
  3. Tailored FAQs addressing local business needs in that specific suburb.
  4. Local schema with exact geo-coordinates and service radius.

#### C. Blog & Topical Authority Void
The blog currently has only 3 seeded articles (`scripts/seed-blog-posts.mjs`). To win AI engine citations (GEO) and Google organic search in Mumbai, SiteNova requires **Topical Authority Clusters**:
- **Cluster 1: Mumbai Small Business Web Economics**
  - *Pillar*: "How Much Does a Website Cost in Mumbai? (2026 Complete Price Breakdown)"
  - *Cluster articles*: Freelancer vs Agency vs DIY in Mumbai; Hidden costs of cheap ₹3,000 websites; E-commerce store launch budget in India (Razorpay, GST, Hosting).
- **Cluster 2: Modern Web Performance & Tech Stacks**
  - *Pillar*: "Why React & Next.js Outperform WordPress for Local Business Lead Generation"
  - *Cluster articles*: How PageSpeed 90+ cuts Google Ads CPC; Solving Core Web Vitals (INP < 200ms); Why Cloudflare Workers edge rendering is the fastest host for Indian users.
- **Cluster 3: Vertical Business Growth Blueprints**
  - *Pillar*: "The Complete Guide to Clinic Websites & Patient Booking in Mumbai"
  - *Cluster articles*: Real Estate Lead Generation Funnels (Beyond MagicBricks); CA Firm Compliance & Client Portal Architecture.

---

## 2. High-Intent Keyword Map (20 Targets)

Below is a prioritized keyword map tailored for Mumbai and Indian SMEs, mapped to existing and recommended URLs with on-page optimization specifications.

| # | Target Keyword | Search Intent | Est. Monthly Volume (IN/MUM) | KD (0-100) | Target URL | Primary On-Page & Schema Guidance |
|---|---|---|---|---|---|---|
| **1** | `website designer in mulund` | Transactional | 250 | 12 | `/location/mulund` | **H1**: "Top-Rated Website Designer in Mulund, Mumbai"<br>**Meta**: "Fast, SEO-ready custom websites for Mulund businesses. 7–14 day delivery, starting ₹10,000. Book a free consultation."<br>**Schema**: `LocalBusiness` with Mulund geo-coordinates. |
| **2** | `web design company in mulund` | Commercial | 180 | 15 | `/location/mulund` | **H2**: "Full-Service Web Design & Local SEO Company in Mulund West & East"<br>**Content**: Mention LBS Road, Johnson & Johnson, Mulund Station, Nahur commercial belt. |
| **3** | `website designer in thane` | Transactional | 720 | 28 | `/location/thane` | **H1**: "Custom Website Design & Development in Thane"<br>**Meta**: "Grow your Thane business with high-speed websites. Serving Ghodbunder Road, Wagle Estate & Majiwada. From ₹10,000."<br>**Schema**: `LocalBusiness` with Thane postal coverage. |
| **4** | `web design agency mumbai` | Commercial / Trans | 2,400 | 45 | `/` | **H1**: "Custom Web Design & Development Agency in Mumbai — SiteNova"<br>**Title**: "Website Design Agency in Mumbai \| Fast, Modern Websites from ₹10,000 \| SiteNova"<br>**Content**: Core differentiators: Next.js/React, PageSpeed 90+, direct developer communication. |
| **5** | `affordable web design mumbai` | Transactional | 880 | 26 | `/pricing` | **H1**: "Affordable Website Design Packages in Mumbai (From ₹10,000)"<br>**Content**: Transparent pricing tiers, feature comparison table, no hidden maintenance fees. |
| **6** | `ecommerce website development mumbai` | Transactional | 1,300 | 38 | `/services/ecommerce` | **H1**: "E-Commerce Website Development in Mumbai (Razorpay & UPI Ready)"<br>**Meta**: "Custom online stores built with Next.js, Stripe, and Razorpay. Lightning-fast checkouts with 0% bloat. From ₹18,000." |
| **7** | `react js web development company mumbai` | Commercial | 450 | 22 | `/services/web-applications` | **H1**: "React.js & Next.js Web Application Development in Mumbai"<br>**Content**: Full-stack SPA/SSR, Supabase database architecture, custom dashboards, API integrations. |
| **8** | `website for doctors mumbai` | Transactional | 390 | 18 | `/websites-for-doctors` | **H1**: "Custom Website Design for Doctors, Clinics & Hospitals in Mumbai"<br>**Content**: 24/7 online appointment booking, patient SEO, HIPAA/data privacy compliance, Dr. Dipti Ganatra case study. |
| **9** | `clinic website design mumbai` | Transactional | 210 | 14 | `/websites-for-doctors` | **H2**: "Mobile-First Clinic Websites with WhatsApp Booking Integration"<br>**Content**: Showcase dental, orthopedic, pediatric clinic layouts. |
| **10** | `website design for chartered accountants` | Transactional | 480 | 19 | `/websites-for-finance` | **H1**: "Professional Website Design for CA Firms & Financial Advisors in Mumbai"<br>**Content**: Client enquiry forms, secure document upload, ICAI guidelines compliance, Jupiter Fast Finance case study. |
| **11** | `real estate website development mumbai` | Transactional | 590 | 31 | `/websites-for-real-estate` | **H1**: "High-Converting Real Estate Websites for Agents & Builders in Mumbai"<br>**Content**: Property listing showcases, WhatsApp lead capture, RERA badge integration, fast mobile virtual tours. |
| **12** | `lawyer website design mumbai` | Transactional | 320 | 16 | `/websites-for-lawyers` | **H1**: "Website Design for Advocates, Law Firms & Legal Consultants in Mumbai"<br>**Content**: Practice area showcases, Bar Council compliance disclaimers, confidential consultation booking. |
| **13** | `restaurant website design mumbai` | Transactional | 260 | 14 | `/websites-for-restaurants` | **H1**: "Website Design for Mumbai Restaurants, Cafes & Cloud Kitchens"<br>**Content**: Digital menu integration (no PDF lag), direct WhatsApp table & delivery ordering, Zomato/Swiggy commission reduction. |
| **14** | `startup landing page design india` | Commercial / Trans | 720 | 29 | `/websites-for-startups` | **H1**: "High-Converting Landing Page Design for Tech Startups & SaaS in India"<br>**Content**: Micro-interactions, Figma-to-React precision, PageSpeed 95+, product demo previews. |
| **15** | `consultant website builder mumbai` | Transactional | 210 | 15 | `/websites-for-consultants` | **H1**: "Personal Brand & Website Design for Business Consultants & Coaches"<br>**Content**: Lead magnet capture, Calendly/booking integration, client case study carousels. |
| **16** | `core web vitals audit service india` | Commercial | 350 | 24 | `/services/seo-optimization` | **H1**: "Core Web Vitals & PageSpeed Optimization Services (90+ Guaranteed)"<br>**Content**: INP, LCP, CLS remediation; Edge CDN caching, image optimization, bundle tree-shaking. |
| **17** | `website designer in andheri` | Transactional | 650 | 30 | `/location/andheri` | **H1**: "Website Design & Development in Andheri East & West, Mumbai"<br>**Content**: Target Andheri MIDC, Lokhandwala, DN Nagar commercial hubs. |
| **18** | `website designer in powai` | Transactional | 380 | 21 | `/location/powai` | **H1**: "Website Design Services in Powai & Hiranandani, Mumbai"<br>**Content**: Target tech startups, consulting firms, and upscale retail in Powai. |
| **19** | `website design cost in mumbai` | Commercial Inv | 590 | 20 | `/website-cost-calculator` | **H1**: "Interactive Website Cost Calculator — Instant Estimate for Mumbai Businesses"<br>**Content**: Real-time cost estimator by pages, features, and timeline; dynamic quote submission. |
| **20** | `small business website package mumbai` | Transactional | 420 | 17 | `/pricing` | **H2**: "All-Inclusive Small Business Website Packages from ₹10,000"<br>**Content**: Clear deliverables: Domain/Hosting setup, 5 pages, Mobile SEO, WhatsApp integration, 7-day guarantee. |

---

## 3. 42.86% Dead-Click Diagnosis: Component-by-Component Audit

Analytics show a **42.86% dead-click rate** across user sessions. Inspection of UI components revealed that `.interactive-card` and `.hover-glow` CSS classes are systematically applied to static, unclickable HTML elements.

```css
/* app/index.css */
.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow-sm);
}
.hover-glow:hover {
  box-shadow: var(--shadow-glow-sm);
}
```

When users hover over an element that lifts up (`translateY(-4px)`) and emits a glowing shadow, **affordance theory dictates that users will believe it is an actionable button or link**. When clicked, nothing happens.

### Detailed Dead-Click Inventory:

| Component | File & Line | Element Description | Why Users Click It | Dead-Click Impact & Recommended Fix |
|---|---|---|---|---|
| **Hero Badge** | `app/components/HeroSection.tsx:42-47` | `<div className="... interactive-card hover-glow">` with Sparkles icon: "Website design for Mulund, Mumbai, and nearby suburbs" | Looks like a location selector pill or service area modal trigger. | **Severe**: Convert into a dropdown link to `/location/mulund` or smooth scroll to `#service-areas-title`, or remove `.interactive-card`. |
| **Hero Dashboard Preview** | `app/components/HeroSection.tsx:120-134` | `<div className="... interactive-card hover-glow">` wrapping the huge `dashboardPreview` image | Large screenshot with glowing border lifts on hover. Users expect a live demo, lightbox zoom, or case study. | **Severe**: Wrap in an anchor tag opening the live portfolio showcase or add an interactive "Click to view live demos" overlay. |
| **Hero Trust Stats** | `app/components/HeroSection.tsx:94-104` | "5-Star Rated on Google", "Trusted by Doctors & Finance Firms" | Users click to read Google reviews or see client proofs. | **High**: Link "5-Star Rated on Google" to SiteNova's Google Business Profile review URL (`https://share.google/Y6mq6VLzTQj9zN4kr`). |
| **6 Service Feature Cards** | `app/components/FeaturesSection.tsx:98` | 6 cards ("Lightning Fast Delivery", "Custom Design", "Mobile Responsive", "SEO Optimized", "Secure & Reliable", "Ongoing Support") | Large bento cards with hover lift, glowing borders, and icons. | **Critical**: Users click expecting dedicated service pages. Link "SEO Optimized" -> `/services/seo-optimization`, "Custom Design" -> `/services/web-applications`, "Lightning Fast" -> `/pricing`. |
| **Performance Score Badge** | `app/components/FeaturesSection.tsx:123-134` | Green "99 Performance Score" widget inside the hero feature card | Looks like a clickable Google PageSpeed test report link. | **High**: Link directly to Google PageSpeed Insights live test for `sitenova.dev` or an audit modal. |
| **Homepage Price Chips** | `app/pages/Index.tsx:149-157` | "Starter websites", "Business websites", "Custom quotes" static boxes | Styled exactly like selectable pricing tier tabs. | **High**: Convert into direct links to `/pricing` or pre-fill `/quote` state. |
| **Local Agency Pillars** | `app/components/LocalAgencySection.tsx:119` | 4 cards ("We're in Mumbai", "Talk directly to developer", "Hindi/Marathi...", "Fixed price") | Hover glow makes them look like expandable FAQ/info cards. | **Moderate**: Remove `.hover-glow` or add expandable details. |
| **How It Works Step 01** | `app/components/HowItWorksSection.tsx:8` | "Get in Touch — Call us or send an email..." | Plain text mentions calling/emailing without clickable links. | **Moderate**: Turn "Call us" into `tel:+919326060621` link and "send an email" into `mailto:` link. |
| **Marquee Tech Badges** | `app/components/TechMarquee.tsx:28` | React, TypeScript, Tailwind, Figma, Node, Supabase tags | Users tap tech names expecting stack explanations or tech-filtered portfolio items. | **Low-Mod**: Add hover tooltips or link to `/services/web-applications`. |
| **Niche Page Feature & Problem Grids** | `app/pages/niche/*.tsx` (All 7 niche files) | 6 feature cards & 3 problem cards per niche have `.interactive-card` and `.hover-glow` | Users click cards to see mockups or read full details. | **High**: Remove `.interactive-card` from non-clickable cards, or link to relevant portfolio case studies. |
| **Free Audit Step Cards** | `app/pages/FreeAudit.tsx:186, 201, 211, 221` | Step 1, 2, 3 process icons have `.interactive-card` | Numbered step circles lift on hover without action. | **Moderate**: Remove `.interactive-card`. |

---

## 4. 42.86% Quick-Back / Rapid Bounce Diagnosis

Session analytics show **42.86% of incoming traffic bounces back to search results within 5 seconds**. The root causes span messaging resonance, sensory overload, mobile viewport friction, and pricing anxiety:

### 4.1 Above-The-Fold Messaging Resonance
- **Problem**: The H1 in `HeroSection.tsx` ("Best Website Designer in Mulund, Mumbai & Nearby Areas SiteNova") reads like a robotic SEO meta tag rather than a compelling human value proposition.
- **Cognitive Friction**: A prospect landing on the site immediately asks: *"Can this person solve my business problem?"* The current headline gives a geographical list rather than a promise of business growth, speed, and conversion.
- **Solution**: Upgrade H1 to:
  > **"Websites That Turn Mumbai Searchers Into Paying Customers"**  
  > *Custom-built, ultra-fast websites for businesses in Mulund, Thane & Mumbai — delivered in 7–14 days from ₹10,000.*

### 4.2 Hero CTA Paralysis (Hick's Law Violation)
- In `HeroSection.tsx` (lines 64–86), the hero presents **three equally large, competing buttons**:
  1. `Get a Free Quote` (Primary solid blue with pulse animation)
  2. `Check Your Website Score` (Outlined blue)
  3. `View Our Work` (Outlined gray)
- Having 3 disparate options causes choice fatigue. Visitors hesitate, scroll without clicking, or hit the browser back button.
- **Solution**: Reduce to **1 Primary CTA** ("Get a Free Quote") + **1 Secondary CTA** ("View Portfolio" / smooth-scroll). Move "Check Website Score" to the dedicated audit section.

### 4.3 Mobile Viewport Crowding & Overlapping Interstitials
On mobile devices (which account for 75%+ of Indian SME web traffic):
1. **BookCallWidget** (`app/components/BookCallWidget.tsx`) is fixed at `bottom-6 right-6 z-50` with a pulsating radar ring.
2. **MobileAuditBar** (`app/components/MobileAuditBar.tsx`) pops up at 4 seconds at `bottom-0 left-0 right-0 z-40`.
3. **ExitIntentPopup** (`app/components/ExitIntentPopup.tsx`) opens automatically at 45 seconds on mobile.
- **The Issue**: On screens with heights of 667px–844px, the sticky audit bar and floating call widget stack on top of each other, covering ~30% of the screen. Users attempting to scroll accidentally trigger the audit bar or call widget, causing frustration and immediate site exit.

### 4.4 The WhatsApp Qualification Barrier
- When a user clicks the WhatsApp button in `BookCallWidget.tsx`, instead of opening WhatsApp directly, a modal dialog appears (`showQualifier` state):
  > *"Before we connect on WhatsApp... Are you a business owner looking to get a professional website built? [Yes, I am] [No, thanks]"*
- In India, WhatsApp is favored specifically because it is zero-friction. Adding a qualification modal stops hot prospects in their tracks. Furthermore, `window.open()` invoked inside a secondary React state callback is frequently blocked by mobile Safari and Chrome popup blockers.
- **Solution**: Remove the qualifier modal. Make WhatsApp links direct `href={WHATSAPP_URL}` opening the native app immediately with pre-filled text.

### 4.5 Sensory Overload & Client-Side Jank
- The site renders 3 animated pulsing glow orbs (`animate-pulse-glow`), marquee animations, gradient text transitions, Framer Motion parallax transforms, and a `CustomCursor` with confetti particle physics (`CustomCursor.tsx`).
- On budget Android devices (Redmi, Realme, Samsung M-series), heavy CSS backdrop-blur and particle loops cause noticeable frame drops and scroll stutter, which users interpret as a sluggish site.

---

## 5. Paid LP & Lead Funnel Health Audit (`/lp/web-design`)

Paid ad traffic from Google Search and Meta Ads arrives on `/lp/web-design` (`app/pages/lp/WebDesignLP.tsx`). The landing page structure was analyzed end-to-end:

### 5.1 Critical Conversion Blocker in QuoteWizard Step 2
In `app/pages/lp/WebDesignLP.tsx` (lines 355–365):
```tsx
<button
  type="button"
  onClick={() => setStep(3)}
  disabled={requirements.trim().length < 10}
  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all disabled:opacity-40 disabled:pointer-events-none"
>
  Next: Contact Details
  <ArrowRight size={14} />
</button>
```
- **The Bug / Blocker**: The "Next" button is strictly disabled (`disabled:pointer-events-none`) until the user types at least 10 characters into the requirements textarea.
- **Impact**: Paid ad visitors tap "Landing Page" (Step 1), pick budget & timeline chips (Step 2), and then tap "Next: Contact Details". **Nothing happens.** The button is completely unresponsive because there is no inline error message explaining why. Users perceive the form as broken, abandon the page, and waste paid ad spend!
- **Solution**: Make the textarea optional OR remove the disabled attribute and show clear inline validation if required upon clicking Next.

### 5.2 Critical Tracking Failure: Missing Google Ads Conversion on Paid LP
- In `app/pages/lp/LpThankYouQuote.tsx` (the thank-you page for `/lp/web-design`), the code executes:
  ```tsx
  useEffect(() => {
    if (state) {
      trackQuoteSubmit(); // GA4 event only!
    }
  }, []);
  ```
- **The Issue**: `ThankYou.tsx` (the organic site quote confirmation) calls `trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D")`. But `LpThankYouQuote.tsx` **never calls `trackGoogleAdsConversion`**!
- **Impact**: When paid ads drive conversions on `/lp/web-design`, Google Ads **never receives the conversion signal**. Google Ads smart bidding cannot optimize toward converting audiences, causing high cost-per-click and poor campaign learning.

### 5.3 Form Cannibalization & Page Redundancy
- `/lp/web-design` contains **two separate multi-field lead forms**:
  1. The 3-step `QuoteWizard` at the top hero.
  2. The 4-field `LeadForm` (Free Website Audit) at the bottom.
- Having two different forms with different promises ("Quote in 24h" vs "Free Website Audit") splits intent and creates confusion.
- **Solution**: Focus 100% of the LP on the Quote Wizard. Replace the bottom audit form with an emergency WhatsApp / Call CTA banner.

### 5.4 Mobile Form Layout Cramping
- In Step 3 of `QuoteWizard`, Full Name and Phone are rendered in a 2-column grid (`grid grid-cols-2 gap-2.5`).
- On devices with screen width ≤ 375px (iPhone SE, Galaxy A-series), the placeholder "9876543210" and input text are horizontally clipped, making typing cumbersome.
- **Solution**: Stack inputs into a single column (`grid-cols-1`) on mobile screens (`sm:grid-cols-2`).

---

## 6. Actionable Recommendations & Implementation Roadmap

### Phase 1: Immediate CRO & Tracking Fixes (Week 1–2 / Zero Budget)
1. **Fix QuoteWizard Step 2 Blocker**: Remove `disabled={requirements.trim().length < 10}`. Allow users to proceed without mandatory 10-character typing.
2. **Add Google Ads Conversion Pixel to `LpThankYouQuote.tsx`**: Add `trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D")` inside `useEffect`.
3. **Eliminate Dead-Click Affordances**:
   - Remove `.interactive-card` and `.hover-glow` from static divs in `HeroSection.tsx`, `FeaturesSection.tsx`, `LocalAgencySection.tsx`, and `niche/*.tsx`.
   - Link the 6 Feature Cards in `FeaturesSection.tsx` directly to their matching service pages (`/services/ecommerce`, `/services/seo-optimization`, `/services/web-applications`).
   - Link "5-Star Rated on Google" to Google Business Profile.
4. **Fix Navbar Service Dropdown**: Add the 3 core service pages (`E-Commerce Development`, `SEO & Speed Optimization`, `Custom Web Applications`) to `Navbar.tsx` alongside the niche vertical links.
5. **Streamline Mobile Overlays**: Suppress `MobileAuditBar` if `BookCallWidget` is active, or adjust stacking so they never overlap. Remove the WhatsApp qualification modal in `BookCallWidget.tsx`.

### Phase 2: Content Enrichment & Differentiation (Weeks 3–6)
1. **Differentiate 14 Location Pages**: Replace generic template paragraphs with suburb-specific commercial hubs, landmark references, localized FAQs, and local client quotes.
2. **Enrich Thin Niche & Service Pages**:
   - Expand `WebApps.tsx` (currently 602 words) with architecture diagrams, tech stacks (Next.js, Supabase, Cloudflare Workers), and security standards.
   - Expand `Restaurants.tsx` (currently 563 words) and `Startups.tsx` (583 words) to 1,000+ words with interactive feature breakdowns.
3. **Deploy Top 5 High-Intent Blog Pillar Articles**:
   - Article 1: "Website Design Cost in Mumbai (2026 Price Guide for Small Businesses)"
   - Article 2: "React/Next.js vs WordPress: Which Is Better for Mumbai Local Businesses?"
   - Article 3: "Why Clinic & Doctor Websites in Mumbai Must Have Direct WhatsApp Booking"
   - Article 4: "E-Commerce Launch Checklist for Indian Brands (Razorpay, GST, Mobile-First)"
   - Article 5: "Core Web Vitals Optimization: How to Achieve 90+ PageSpeed on Cloudflare Workers"

### Phase 3: Authority & Topical Dominance (Weeks 7–12)
1. **Execute 20 High-Intent Keyword Optimization**: Implement targeted H1, meta tags, Schema.org LocalBusiness, and localized FAQs across all 20 mapped URLs.
2. **Interactive Cost Calculator Upgrades**: Connect `/website-cost-calculator` results directly to one-click WhatsApp pre-filled quotes.
3. **Structured E-E-A-T & Case Study Hub**: Build rich case studies with before/after PageSpeed scores, client video/quotes, and verified Clutch/Google links for all 7 niches.
