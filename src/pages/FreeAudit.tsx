import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    const website = formData.get("website") as string;
    
    try {
      const { error } = await supabase
        .from("audit_requests")
        .insert([{ name, email, website_url: website }]);

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
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Get a Free Expert Review of Your Website
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Find out exactly why your current website is losing customers. We'll analyze your performance, SEO, mobile responsiveness, and provide actionable conversion tips.
          </p>
        </div>

        <div className="w-full max-w-md mt-12 bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" name="website" type="url" required placeholder="https://example.com" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Get My Free Audit"}
            </Button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
