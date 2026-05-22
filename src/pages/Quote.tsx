import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  Monitor,
  Globe,
  ShoppingCart,
  Code2,
  RefreshCw,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import { setPageSeo } from "@/lib/seo";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const projectTypes: ProjectTypeOption[] = [
  {
    id: "Landing Page",
    title: "Landing Page",
    description: "One-page site built for conversion, single product, or event.",
    icon: Monitor,
  },
  {
    id: "Business Website",
    title: "Business Website",
    description: "Multi-page site showcasing services, team, and building authority.",
    icon: Globe,
  },
  {
    id: "E-commerce Store",
    title: "E-commerce Store",
    description: "Online shop equipped with checkout, products, and payments.",
    icon: ShoppingCart,
  },
  {
    id: "Custom Web App",
    title: "Custom Web App",
    description: "Advanced application with custom dashboard, logic, and database.",
    icon: Code2,
  },
  {
    id: "Website Redesign",
    title: "Website Redesign",
    description: "Modernize styling, improve SEO, and speed up your existing website.",
    icon: RefreshCw,
  },
];

const budgetOptions = [
  "Rs. 5,000 - 15,000",
  "Rs. 15,000 - 30,000",
  "Rs. 30,000+",
  "Flexible / Custom",
];

const timelineOptions = [
  "Urgent (< 2 weeks)",
  "Normal (2-4 weeks)",
  "Flexible (1+ months)",
];

const Quote = () => {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [requirements, setRequirements] = useState("");
  const [budget, setBudget] = useState("Rs. 15,000 - 30,000");
  const [timeline, setTimeline] = useState("Normal (2-4 weeks)");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setPageSeo({
      title: "Website Quotes Starting from Rs. 5,000 | SiteNova",
      description:
        "Get a website quote starting from Rs. 5,000. Contact Kavish Ganatra via call, WhatsApp, or email to discuss your custom web development project in Mulund, Mumbai, and nearby areas.",
      canonicalPath: "/quote",
      keywords: [
        "website quote Mulund",
        "website designer Mumbai",
        "web development quote",
        "website starting price",
      ],
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Website Quotes Starting from Rs. 5,000 | SiteNova",
        url: "https://sitenova.dev/quote",
        description:
          "Contact SiteNova to get a website quote starting from Rs. 5,000 for custom web development and design services in Mulund, Mumbai, and nearby areas.",
      },
    });
  }, []);

  const isStep3Valid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      name.trim().length > 0 &&
      emailRegex.test(email) &&
      phone.trim().replace(/\D/g, "").length >= 10
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep3Valid()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "671591b9-2925-44ba-ba00-12e0e092bb34",
          subject: `New Lead - ${name} (${projectType})`,
          from_name: "SiteNova Web Intake",
          project_type: projectType,
          requirements: requirements,
          budget: budget,
          timeline: timeline,
          name: name,
          email: email,
          phone: phone,
          business_name: businessName || "Not specified",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(4);
      } else {
        setSubmitError(data.message || "Failed to submit request. Please try again.");
      }
    } catch (err) {
      setSubmitError(
        "Could not connect to submission server. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pre-filled WhatsApp message URL
  const whatsappMessage = encodeURIComponent(
    `Hi Kavish, I just filled out the intake form on SiteNova for my project! Here are my details:
- Project: ${projectType}
- Budget: ${budget}
- Timeline: ${timeline}
- Name: ${name}
- Email: ${email}
Looking forward to discussing further!`
  );
  const whatsappUrl = `https://wa.me/919326060621?text=${whatsappMessage}`;

  const stepsInfo = [
    { label: "Project Type" },
    { label: "Requirements" },
    { label: "Contact Details" },
  ];

  const linePercent = step === 1 ? "0%" : step === 2 ? "50%" : "100%";

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 md:py-16 relative overflow-hidden flex flex-col justify-center">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-3xl z-10 flex-1 flex flex-col justify-center">
        {step < 4 && (
          <div className="mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border/80 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        )}

        {/* Stepper Progress bar */}
        {step <= 3 && (
          <div className="mb-8 relative max-w-md mx-auto w-full px-4">
            <div className="flex items-center justify-between">
              {stepsInfo.map((s, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                return (
                  <div key={idx} className="flex flex-col items-center z-10 relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/10"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs mt-2 font-medium transition-colors ${
                        isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Background connecting line */}
            <div className="absolute top-4.5 left-10 right-10 h-[2px] bg-border/40 -z-10" />
            <div
              className="absolute top-4.5 left-10 h-[2px] bg-gradient-to-r from-primary to-accent -z-10 transition-all duration-500"
              style={{
                width: `calc(${linePercent} - ${step === 1 ? "0px" : step === 2 ? "20px" : "40px"})`,
              }}
            />
          </div>
        )}

        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-border/60 bg-card/30 shadow-xl backdrop-blur-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    What type of website do you need?
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Select the option that best matches your project goals. You can change this later.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = projectType === type.id;
                    return (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => {
                          setProjectType(type.id);
                          setStep(2);
                        }}
                        className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 group hover:translate-y-[-2px] ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                            : "border-border/60 bg-card/40 hover:border-primary/50 hover:bg-card/75"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                          }`}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-0.5">
                            {type.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center max-w-xl mx-auto mb-6">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    Share your requirements
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Briefly describe your business, product, or features you require on the website.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="requirements" className="text-sm font-semibold text-foreground">
                    Project Description (min. 10 characters)
                  </label>
                  <textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g., We need a professional website for our dental clinic in Mulund. We need a hero banner, a section listing services, testimonial slides, and an enquiry form."
                    className="w-full h-36 bg-secondary/20 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none transition-all"
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {requirements.trim().length}/10 chars minimum
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-foreground block">
                    Estimated Budget Target
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setBudget(opt)}
                        className={`py-3 px-2 text-center text-xs font-semibold rounded-xl border transition-all duration-200 ${
                          budget === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/40 border-border/60 hover:bg-secondary/70 hover:border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-sm font-semibold text-foreground block">
                    Desired Timeline
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {timelineOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setTimeline(opt)}
                        className={`py-3 px-2 text-center text-xs font-semibold rounded-xl border transition-all duration-200 ${
                          timeline === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/40 border-border/60 hover:bg-secondary/70 hover:border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={requirements.trim().length < 10}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Next Step
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    Let's stay in touch
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter your contact details so we can deliver a clear quote and timeline scope.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-secondary/20 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-secondary/20 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                        Phone / WhatsApp <span className="text-primary">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-secondary/20 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="businessName"
                        className="text-xs font-semibold text-muted-foreground"
                      >
                        Business Name <span className="text-muted-foreground/60">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Building
                          size={16}
                          className="absolute left-3 top-3.5 text-muted-foreground/60"
                        />
                        <input
                          id="businessName"
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Acme Corp"
                          className="w-full bg-secondary/20 border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold">
                      {submitError}
                    </div>
                  )}

                  <div className="pt-6 flex items-center justify-between border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isStep3Valid()}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:pointer-events-none glow-effect-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Quote Request
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-4 space-y-6"
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-ping" />
                    <CheckCircle2 size={64} className="text-[#25D366] relative z-10" />
                  </div>
                </div>

                <div className="max-w-xl mx-auto space-y-2">
                  <h1 className="font-heading text-3xl font-bold tracking-tight">
                    Inquiry Submitted!
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Thank you, <span className="text-foreground font-semibold">{name}</span>! We have
                    received your scoping details for a <span className="text-foreground font-semibold">{projectType}</span>. 
                    A quote summary is being sent to <span className="text-foreground font-semibold">{email}</span>.
                  </p>
                  <p className="text-muted-foreground text-xs">
                    We typically respond within 24 hours. For the fastest booking, choose an option below:
                  </p>
                </div>

                {/* Follow-up Action Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                  <a
                    href="https://calendly.com/kavishganatra5/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/95 transition-all glow-effect button-shimmer"
                  >
                    <Calendar size={18} />
                    Book Free Strategy Call
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1ebe57] transition-all"
                  >
                    <MessageCircle size={18} />
                    Chat on WhatsApp
                  </a>
                </div>

                <div className="pt-6 border-t border-border/40 max-w-md mx-auto">
                  <Link
                    to="/"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Return to Home Page
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default Quote;
