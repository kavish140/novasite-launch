import {afterEach,it,expect} from "vitest";
import {render,screen,cleanup,fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router";
import PackageAdvanceOptions from "./PackageAdvanceOptions";
import {PackagePricingContext} from "@/lib/package-pricing";
import {PAYMENT_PACKAGES} from "../../supabase/functions/_shared/catalog";
import {pricesFromMatches} from "@/lib/package-pricing-meta";
import {LazyMotion,domAnimation} from "framer-motion";
import CtaSection from "./CtaSection";
import BlogCTA from "./BlogCTA";
import {renderToStaticMarkup} from "react-dom/server";
const packages={...PAYMENT_PACKAGES,starter:{...PAYMENT_PACKAGES.starter,startingPrice:1200055,advance:420025},business:{...PAYMENT_PACKAGES.business,startingPrice:2000000,advance:600000}};
afterEach(cleanup);
function show(enabled=true,available=true){render(<MemoryRouter><PackagePricingContext.Provider value={{packages,enabled,available}}><PackageAdvanceOptions/></PackagePricingContext.Provider></MemoryRouter>);}
it("shows separately configured advances with full-document package links and preserves quote options",()=>{
 show();expect(screen.getByText("₹12,000.55")).toBeTruthy();
 expect(screen.getByRole("link",{name:"Pay ₹4,200.25 advance"}).getAttribute("href")).toBe("/pay?package=starter");
 expect(screen.getByRole("link",{name:"Pay ₹6,000.00 advance"}).getAttribute("href")).toBe("/pay?package=business");
 expect(screen.getAllByRole("link",{name:"Prefer a quote first?"})).toHaveLength(2);
 expect(screen.getAllByText(/Share your project details/)).toHaveLength(2);
 // Observe React's handling before cancelling native navigation in jsdom.
 // A SPA payment link would already have prevented the default at the root.
 let spaNavigation=true;const stop=(event:MouseEvent)=>{spaNavigation=event.defaultPrevented;event.preventDefault();};
 window.addEventListener("click",stop,{once:true});fireEvent.click(screen.getByRole("link",{name:"Pay ₹4,200.25 advance"}));expect(spaNavigation).toBe(false);
});
it.each([[false,true],[true,false],[false,false]])("hides collection links when enabled=%s and pricing available=%s",(enabled,available)=>{
 show(enabled,available);expect(screen.queryByRole("link",{name:/Pay .* advance/})).toBeNull();expect(screen.getAllByRole("link",{name:"Get a project quote"})).toHaveLength(2);
 if(!available){expect(screen.getAllByText("Quote on request")).toHaveLength(2);expect(screen.queryByText("₹12,000.55")).toBeNull();}
});
it("uses the same current catalog in SSR metadata and drops numbers when unavailable",()=>{
 expect(pricesFromMatches([{id:"root",data:{pricing:{packages,available:true}}}])).toEqual({starter:"₹12,000.55",business:"₹20,000"});
 expect(pricesFromMatches([{id:"root",data:{pricing:{packages,available:false}}}])).toEqual({starter:null,business:null});
 expect(pricesFromMatches([{id:"root",data:{pricing:{packages:{},available:true}}}])).toEqual({starter:null,business:null});
});
it("keeps secondary homepage and blog price labels current after an admin edit",()=>{
 const html=renderToStaticMarkup(<LazyMotion features={domAnimation}><MemoryRouter><PackagePricingContext.Provider value={{packages,available:true}}><CtaSection/><BlogCTA/></PackagePricingContext.Provider></MemoryRouter></LazyMotion>);
 expect(html).toContain("Projects starting from ₹12,000.55");expect(html).toContain("from ₹12,000.55");expect(html).not.toContain("Rs. 10,000");
});
