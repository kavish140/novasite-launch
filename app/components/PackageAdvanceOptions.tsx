import { Link } from "react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { usePackagePricing } from "@/lib/package-pricing";
import { formatINR } from "@/lib/payments";

export default function PackageAdvanceOptions() {
  const { packages, paymentsEnabled, available, checkoutOrigin } = usePackagePricing();
  return <div className="studio-packages grid gap-5 sm:grid-cols-2">{(["starter", "business"] as const).map(key => {
    const pack = packages[key];
    return <article key={key} className="flex min-w-0 flex-col border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-heading font-semibold">{pack.name}</h3><span className="text-xs text-muted-foreground">{key === "starter" ? "One focused page" : "Room to tell your story"}</span></div>
      <p className="mt-3 text-sm text-muted-foreground">{pack.description}</p>
      <p className="mt-7 text-xs text-muted-foreground">Project starting price</p>
      <p className="studio-package-price mt-2">{available ? formatINR(pack.startingPrice) : "Quote on request"}</p>
      <ul className="studio-package-inclusions">{["Custom design for your business", "Mobile-friendly implementation", "Scope and price agreed before work"].map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
      <Link to="/quote" state={{ packageName: pack.name, projectType: key === "starter" ? "Landing Page" : "Business Website" }} className="studio-button studio-package-quote">Discuss this package<ArrowUpRight size={17} aria-hidden="true" /></Link>
      {paymentsEnabled && <><Link reloadDocument to={`${checkoutOrigin}/pay?package=${key}`} className="studio-package-advance">Pay {formatINR(pack.advance)} advance<ArrowUpRight size={14} aria-hidden="true" /></Link><p className="mt-3 text-center text-xs text-muted-foreground">Advance counts toward your agreed project total.</p><p className="mt-2 text-center text-xs text-muted-foreground">Share your project details before secure Razorpay checkout.</p></>}
    </article>;
  })}</div>;
}
