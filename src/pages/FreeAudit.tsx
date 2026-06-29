import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { m as motion } from "framer-motion";
import { Search, Smartphone, Zap, ArrowRight, CheckCircle2, ShieldCheck, Lock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export default function FreeAudit() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const countryCode = formData.get("countryCode") as string;
    let rawMobile = formData.get("mobile") as string;
    let website = formData.get("website") as string;
    
    // Validate mobile number
    rawMobile = rawMobile.replace(/\D/g, "");
    if (rawMobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter exactly 10 digits.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const mobile = `${countryCode} ${rawMobile}`;
    
    // Format and validate the website URL
    website = website.trim();
    if (!/^https?:\/\//i.test(website)) {
      website = `https://${website}`;
    }
    
    try {
      // Basic check for a valid domain structure (has a dot, no spaces)
      const domainWithoutProtocol = website.replace(/^https?:\/\//i, '');
      if (!/^[^\s]+\.[^\s]+$/.test(domainWithoutProtocol)) {
        throw new Error("Please enter a valid website address (e.g. example.com).");
      }

      const { error } = await supabase
        .from("audit_requests")
        .insert([{ name, email, mobile, website_url: website }]);

      if (error) throw error;
      
      toast({
        title: "Audit Request Received! 🎉",
        description: "While we analyze your site, get a custom quote for an upgrade below.",
      });
      
      navigate("/quote");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit request. Please try again later.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEO 
        title="Free Website Audit for Mumbai Businesses | SiteNova"
        description="Get a 100% free, no-obligation website audit. SiteNova analyses your site's performance, SEO health, and mobile responsiveness to show you exactly what's holding you back on Google."
        canonicalUrl="/free-audit"
        keywords={["free website audit Mumbai", "website SEO audit", "website performance check", "free site audit India", "website review Mumbai"]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Free Website Audit",
            "provider": { "@type": "ProfessionalService", "name": "SiteNova", "url": "https://sitenova.dev" },
            "areaServed": { "@type": "City", "name": "Mumbai" },
            "description": "Free website audit covering PageSpeed scores, Core Web Vitals, on-page SEO, mobile responsiveness, and local SEO signals for Mumbai businesses.",
            "url": "https://sitenova.dev/free-audit",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
              "name": "Free Website SEO & Performance Audit"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sitenova.dev/" },
              { "@type": "ListItem", "position": 2, "name": "Free Website Audit", "item": "https://sitenova.dev/free-audit" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What does SiteNova's free website audit include?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our free audit covers Google PageSpeed scores, Core Web Vitals analysis, on-page SEO check (title tags, meta descriptions, headings, schema markup), mobile responsiveness testing, and local SEO signal review including Google Business Profile optimization tips."
                }
              },
              {
                "@type": "Question",
                "name": "How long does the free audit take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We typically deliver your audit report within 24–48 hours of submission. You'll receive a detailed PDF or video walkthrough via email and WhatsApp."
                }
              },
              {
                "@type": "Question",
                "name": "Is the website audit really free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, 100% free with no obligation. We provide the audit as a way to demonstrate our expertise. If you'd like us to implement the improvements, we can discuss a project — but there's zero pressure."
                }
              }
            ]
          }
        ]}
      />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header>
          <Navbar />
        </header>
      
      <main className="relative flex-1 flex items-center justify-center pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col w-full">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="relative z-10 mx-auto max-w-md px-6 w-full mb-10 text-center lg:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-semibold text-primary">Limited Time: 5 Free Audits Remaining This Week</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
              Stop Losing Customers. Get Your <span className="gradient-text animated-gradient">Free Audit</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Discover exactly what's holding your website back on Google. We'll analyze your performance, SEO, and design, and give you a step-by-step plan to fix it.
            </p>
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            
            {/* Left Side: Value Prop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 order-2 lg:order-1"
            >
            <div className="hidden lg:inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 interactive-card">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-primary">Limited Time: 5 Free Audits Remaining This Week</span>
            </div>
            
            <h1 className="hidden lg:block text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Stop Losing Customers. Get Your <span className="gradient-text animated-gradient">Free Audit</span>
            </h1>
            
            <p className="hidden lg:block text-lg text-muted-foreground leading-relaxed max-w-lg">
              Discover exactly what's holding your website back on Google. We'll analyze your performance, SEO, and design, and give you a step-by-step plan to fix it.
            </p>
            
            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 text-foreground interactive-card">
                  <Zap size={20} className="text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Performance Analysis</h3>
                  <p className="text-sm text-muted-foreground mt-1">We check loading speeds and Core Web Vitals to ensure you don't lose impatient visitors.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 text-foreground interactive-card">
                  <Search size={20} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">SEO Health Check</h3>
                  <p className="text-sm text-muted-foreground mt-1">Discover technical SEO errors and missed opportunities holding you back on Google.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 text-foreground interactive-card">
                  <Smartphone size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">Mobile Responsiveness</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ensure a flawless experience for the 60%+ of users browsing on their phones.</p>
                </div>
              </div>
            </div>

            {/* What Your Audit Includes Checklist */}
            <div className="pt-6 border-t border-border/30">
              <h3 className="font-heading text-base font-semibold mb-4">What Your Audit Includes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Google PageSpeed score analysis",
                  "Core Web Vitals check",
                  "On-page SEO review",
                  "Mobile responsiveness test",
                  "Local SEO signal check",
                  "Actionable improvement tips",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="pt-6 mt-6 border-t border-border/30">
              <div className="flex items-center gap-1 mb-2 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm italic text-muted-foreground">
                "The free audit from SiteNova showed us exactly why our competitors were ranking above us. Implementing their suggestions increased our leads by 40% in two months."
              </p>
              <p className="text-xs font-semibold mt-2">— Rahul D., Local Business Owner</p>
            </div>
          </motion.div>

          {/* Right Side: Form & Upsell */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0 relative flex flex-col gap-8 order-1 lg:order-2"
          >
            {/* Highly Prominent Quote Banner */}
            <div 
              onClick={() => navigate("/quote")}
              className="group relative overflow-hidden rounded-3xl p-[2px] cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
              <div className="relative bg-card rounded-[22px] p-7 text-center h-full flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500 fill-current" />
                  Ready to build?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">Skip the free audit. Tell us what you need and get a custom quote instantly.</p>
                <Button className="w-full font-bold shadow-lg text-base h-14" size="lg">
                  Get A Free Quote <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur opacity-50" />
            
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/60 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold font-heading mb-2">Claim Your Audit</h2>
                <p className="text-sm text-muted-foreground">Fill out the details below and we'll get to work immediately.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="John Doe" className="bg-background/50 focus:bg-background transition-colors" />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" required placeholder="john@example.com" className="bg-background/50 focus:bg-background transition-colors" />
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex gap-2">
                    <Select name="countryCode" defaultValue="+91">
                      <SelectTrigger className="w-[120px] bg-background/50 focus:bg-background transition-colors">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">IN (+91)</SelectItem>
                        <SelectItem value="+1">US (+1)</SelectItem>
                        <SelectItem value="+44">UK (+44)</SelectItem>
                        <SelectItem value="+61">AU (+61)</SelectItem>
                        <SelectItem value="+971">AE (+971)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      id="mobile" 
                      name="mobile" 
                      type="tel" 
                      required 
                      placeholder="9876543210" 
                      pattern="[0-9]{10}"
                      title="Please enter exactly 10 digits"
                      maxLength={10}
                      className="flex-1 bg-background/50 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" type="text" required placeholder="example.com" className="bg-background/50 focus:bg-background transition-colors" />
                </div>
                
                <Button type="submit" className="w-full group mt-6 button-shimmer shadow-lg shadow-primary/20" size="lg" disabled={loading}>
                  {loading ? "Submitting Request..." : "Get My Free Audit"}
                  {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Lock className="w-4 h-4 text-primary" />
                  <span>Secure & Private</span>
                </div>
              </div>

              </div>
            </div>
          </motion.div>
          
        </div>
        </div>
      </main>
      
      <Footer />
      </div>
    </PageTransition>
  );
}
