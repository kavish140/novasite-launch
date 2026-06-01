import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Smartphone, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        title: "Request Received",
        description: "We'll review your website and get back to you shortly!",
      });
      
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header>
        <Navbar />
      </header>
      
      <main className="relative flex-1 flex items-center justify-center pt-32 pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Value Prop */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 interactive-card">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-primary">100% Free & No Obligation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Unlock Your Website's <span className="gradient-text animated-gradient">True Potential</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Find out exactly why your current website is losing customers. Our expert team will analyze your site and provide actionable tips to increase conversions.
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
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0 relative"
          >
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
            </div>
          </motion.div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
