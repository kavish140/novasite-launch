/**
 * Blog Post Seeder — Run once to publish the 3 niche blog posts to Supabase.
 *
 * Usage:
 *   1. Make sure your .env has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set
 *   2. Run: node scripts/seed-blog-posts.mjs
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Try reading from .env file
  const fs = await import("fs");
  const path = await import("path");
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");
    for (const line of lines) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      if (key?.trim() === "VITE_SUPABASE_URL") process.env.VITE_SUPABASE_URL = value;
      if (key?.trim() === "VITE_SUPABASE_ANON_KEY") process.env.VITE_SUPABASE_ANON_KEY = value;
    }
  }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file.");
  process.exit(1);
}

const posts = [
  {
    title: "Why Every Doctor in Mumbai Needs a Website in 2026",
    slug: "why-every-doctor-in-mumbai-needs-a-website",
    excerpt:
      "8 out of 10 patients Google a doctor before booking. If you don't have a website, you're losing patients to the clinic down the road that does. Here's why a professional website is no longer optional for healthcare professionals in Mumbai.",
    content: `
<h2>The Reality: Your Patients Are Online</h2>
<p>Think about the last time you searched for a restaurant, a plumber, or even a new doctor. What did you do? You Googled it. Your patients do the exact same thing.</p>
<p>In 2026, <strong>over 80% of patients in India search online before choosing a healthcare provider</strong>. They look for reviews, check credentials, compare services, and most importantly — they look at your website. If you don't have one, or yours looks like it was built in 2010, you're invisible.</p>

<h2>What Happens Without a Website</h2>
<p>Let's be honest about what's happening right now if you don't have a professional website:</p>
<ul>
<li><strong>You're losing patients to competitors who DO have websites</strong> — even if your care is better</li>
<li><strong>Patients can't find your services, timings, or location easily</strong> — they move on</li>
<li><strong>You're missing out on 24/7 appointment bookings</strong> — your receptionist goes home, but the internet never sleeps</li>
<li><strong>Your reputation is uncontrolled</strong> — without your own platform, random review sites define your image</li>
</ul>

<h2>What a Professional Clinic Website Should Include</h2>
<p>A good healthcare website isn't just a digital brochure. It's a patient acquisition machine. Here's what yours should have:</p>

<h3>1. Online Appointment Booking</h3>
<p>Let patients book appointments 24/7 without calling. This alone can increase your bookings by 30-40%, because many patients prefer booking online over phone calls — especially younger demographics.</p>

<h3>2. Service & Treatment Pages</h3>
<p>Dedicated pages for each service you offer — from dental implants to physiotherapy. This helps patients find exactly what they need AND helps Google rank you for specific treatments.</p>

<h3>3. Patient Testimonials</h3>
<p>Social proof is the #1 factor in choosing a doctor online. Display real patient reviews prominently on your site. They build trust instantly.</p>

<h3>4. Google Maps Integration</h3>
<p>Help patients find your clinic with embedded maps, directions, and your exact address. When paired with a Google Business Profile, this dramatically improves your local search visibility.</p>

<h3>5. WhatsApp Quick Contact</h3>
<p>A one-tap WhatsApp button lets patients reach you instantly. Perfect for quick queries and follow-ups. In India, WhatsApp is the preferred communication channel for most patients.</p>

<h3>6. Mobile-First Design</h3>
<p>Over 80% of your patients will visit your website from their phone. If your site isn't mobile-friendly, you're losing most of your traffic before they even see your services.</p>

<h2>Real Example: Dr. Dipti Ganatra</h2>
<p>We recently built a website for <a href="https://drdiptiganatra.com" target="_blank" rel="noopener">Dr. Dipti Ganatra</a>, a dental surgeon in Mumbai. The result? A clean, professional website with database integration, online appointment flows, and SEO optimization.</p>
<p>In her own words: <em>"Since its launch, I've seen improved patient engagement and steady growth in my business."</em></p>

<h2>How Much Does a Clinic Website Cost?</h2>
<p>You might think a professional website costs lakhs. It doesn't. At SiteNova, we build clinic websites <strong>starting from just ₹5,000</strong> — and that includes SEO optimization, mobile-first design, and WhatsApp integration.</p>
<p>Plus, we offer a <strong>7-day money-back guarantee</strong>. If you're not happy with the result, you pay nothing.</p>

<h2>Ready to Get Started?</h2>
<p>If you're a doctor, dentist, or healthcare professional in Mumbai, it's time to take your practice online. <a href="/websites-for-doctors">See what we can build for you</a> or <a href="/quote">get a free mockup</a> of what your clinic website could look like.</p>
<p>No commitment. No upfront payment. Just a genuine preview of your practice's online future.</p>
`,
  },
  {
    title: "5 Things Every CA Firm Website Must Have to Win Clients",
    slug: "5-things-every-ca-firm-website-must-have",
    excerpt:
      "Your clients Google you before they call. A professional website for your CA firm or financial advisory isn't a luxury — it's your most powerful client acquisition tool. Here are the 5 non-negotiable features.",
    content: `
<h2>Your Clients Are Researching You Online</h2>
<p>Here's a number that should make every CA and financial advisor pay attention: <strong>87% of people Google a financial professional before making contact</strong>. They're checking your credentials, reading reviews, and comparing your services to competitors.</p>
<p>If they find nothing — or worse, find an outdated website — they move on. In finance, <strong>perception IS everything</strong>. A missing or dated website signals a lack of professionalism, and that's a massive red flag for someone entrusting you with their money.</p>

<h2>The 5 Non-Negotiable Features</h2>

<h3>1. Service & Expertise Pages</h3>
<p>Your website needs dedicated pages for each service you offer — tax filing, GST consultation, audit services, financial planning, insurance advisory. Why? Two reasons:</p>
<ul>
<li><strong>Clients find exactly what they need</strong> — a business looking for GST help can land directly on your GST page</li>
<li><strong>Google ranks you for specific services</strong> — "CA for GST filing in Mumbai" becomes a keyword you own</li>
</ul>
<p>Don't lump everything into one page. Separate, detailed service pages build authority and capture more search traffic.</p>

<h3>2. Client Testimonials & Trust Signals</h3>
<p>In finance, trust is everything. Your website should prominently display:</p>
<ul>
<li>Client testimonials (even anonymous ones with industry mentioned)</li>
<li>Professional certifications (ICAI membership, certifications)</li>
<li>Years of experience and client count</li>
<li>Any awards or recognitions</li>
</ul>
<p>These trust signals reduce the mental barrier for a potential client to reach out.</p>

<h3>3. Contact Forms & Lead Capture</h3>
<p>A phone number alone isn't enough. Many clients prefer to send an inquiry first before calling. Your website needs:</p>
<ul>
<li>A smart inquiry form that captures name, service interest, and preferred contact method</li>
<li>A WhatsApp quick-contact button (one-tap access — no friction)</li>
<li>An email link that opens a compose window with a pre-filled subject line</li>
</ul>
<p>Every additional contact method increases your conversion rate. Make it effortless for clients to reach you.</p>

<h3>4. Blog / Knowledge Center</h3>
<p>This is where most CA firms miss a massive opportunity. A blog that publishes tax tips, regulatory updates, and financial guides does three powerful things:</p>
<ul>
<li><strong>Positions you as the go-to expert</strong> — potential clients see your knowledge firsthand</li>
<li><strong>Drives free Google traffic</strong> — people searching "how to file ITR for freelancers" land on your blog, then see your services</li>
<li><strong>Builds email lists</strong> — offer a free downloadable guide in exchange for an email address</li>
</ul>
<p>You don't need to write every week. Even one article per month compounds over time.</p>

<h3>5. Mobile-First, SEO-Optimized Design</h3>
<p>This is non-negotiable. Over 70% of website visits in India come from mobile devices. Your site needs to:</p>
<ul>
<li>Load in under 3 seconds</li>
<li>Look perfect on phones and tablets</li>
<li>Have structured data (schema markup) so Google displays your firm info correctly</li>
<li>Be optimized for local search ("CA near me", "financial advisor in Mumbai")</li>
</ul>

<h2>Real Example: Jupiter Fast Finance</h2>
<p>We built a website for <a href="https://jupiterfastfinance.com" target="_blank" rel="noopener">Jupiter Fast Finance</a> — a sleek, modern finance landing page with clear call-to-actions and responsive design. The client's feedback: <em>"Every element feels thoughtfully placed, creating a smooth and engaging user experience."</em></p>

<h2>What Does It Cost?</h2>
<p>A professional finance website at SiteNova starts from <strong>just ₹5,000</strong>. That includes all 5 features listed above, plus a 7-day money-back guarantee.</p>
<p><a href="/websites-for-finance">See what we can build for your firm</a> or <a href="/quote">request a free mockup</a> — no commitment required.</p>
`,
  },
  {
    title: "Why Real Estate Agents Need Their Own Website (Not Just MagicBricks)",
    slug: "why-real-estate-agents-need-their-own-website",
    excerpt:
      "Posting listings on MagicBricks and 99acres isn't enough anymore. A professional property website sets you apart, generates leads 24/7, and builds your personal brand. Here's why every real estate agent in Mumbai needs one.",
    content: `
<h2>The Problem with Portal-Only Marketing</h2>
<p>Most real estate agents in Mumbai rely on three things: WhatsApp forwards, MagicBricks listings, and word of mouth. And while those channels work, they have a critical problem — <strong>you don't own them</strong>.</p>
<ul>
<li><strong>MagicBricks/99acres</strong> — your listings compete with hundreds of other agents. You pay for visibility but don't build a brand.</li>
<li><strong>WhatsApp forwards</strong> — effective for warm leads, but you can't capture new leads from people who don't already know you.</li>
<li><strong>Word of mouth</strong> — the best channel, but it doesn't scale. You need new lead sources.</li>
</ul>
<p>A professional website solves all three problems. It's <strong>your platform, your brand, your lead engine</strong> — and it works while you sleep.</p>

<h2>90% of Home Buyers Start Their Search Online</h2>
<p>This isn't a guess — it's a well-documented fact. The vast majority of property buyers begin their search on Google, not on a portal. They search for things like:</p>
<ul>
<li>"2BHK flats in Mulund under 1 crore"</li>
<li>"New projects in Thane 2026"</li>
<li>"Real estate agent near me"</li>
</ul>
<p>If you have a website that targets these keywords, you capture leads that portals would otherwise take. You become the destination, not the listing.</p>

<h2>What Your Property Website Should Include</h2>

<h3>1. Property Listing Pages</h3>
<p>Each property gets its own page with complete details — area, price, amenities, floor plans, and high-quality images. This is far more professional than a WhatsApp PDF and ranks on Google for specific property searches.</p>

<h3>2. High-Quality Image Galleries</h3>
<p>Properties sell visually. Your website should have professional image galleries that showcase properties in the best light. This immediately sets you apart from agents who send blurry phone photos.</p>

<h3>3. Lead Capture Forms</h3>
<p>Every property page should have a "Schedule Visit" or "Get Details" form that captures the buyer's name, phone, and budget range. These leads come to you directly — no portal commission, no competition.</p>

<h3>4. Area/Location Pages</h3>
<p>Create dedicated pages for each area you serve — "Properties in Mulund", "Flats in Thane", etc. These pages rank on Google for location-specific searches and establish you as the area expert.</p>

<h3>5. WhatsApp Integration</h3>
<p>A one-tap WhatsApp button on every listing lets interested buyers contact you instantly. In Indian real estate, WhatsApp is the primary communication channel — make it effortless.</p>

<h3>6. Mobile-Optimized Design</h3>
<p>Most property searches happen on mobile — during commutes, lunch breaks, and late at night. Your website must load fast and look perfect on phones.</p>

<h2>Build Your Personal Brand</h2>
<p>Here's what separates successful agents from the rest: <strong>a personal brand</strong>. When someone searches for "best real estate agent in Thane" and finds YOUR website with professional listings, client testimonials, and area expertise — you've already won their trust before the first call.</p>
<p>Portals don't build your brand. They build theirs. Your website builds yours.</p>

<h2>Get Started for ₹5,000</h2>
<p>We're currently offering an introductory rate for real estate professionals. Your property website — complete with listing pages, lead forms, and SEO setup — starts from <strong>just ₹5,000</strong>.</p>
<p>Plus, we offer a <strong>7-day money-back guarantee</strong>. If you're not happy, you pay nothing.</p>
<p><a href="/websites-for-real-estate">See what we can build for you</a> or <a href="/quote">request a free mockup</a> of your property website. No commitment, no upfront payment.</p>
`,
  },
];

async function seedPosts() {
  console.log("🚀 Seeding blog posts to Supabase...\n");

  for (const post of posts) {
    console.log(`  Publishing: "${post.title}"`);

    const res = await fetch(`${url}/rest/v1/blog_posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ...post,
        published_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`  ❌ Failed: ${res.status} — ${body}`);
    } else {
      console.log(`  ✅ Published!`);
    }
  }

  console.log("\n🎉 Done! Visit /blog on your site to see the posts.");
}

seedPosts();
