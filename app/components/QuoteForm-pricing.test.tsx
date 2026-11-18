import {afterEach,beforeEach,it,expect,vi} from "vitest";
import {cleanup,render,screen,fireEvent,waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router";
import QuoteForm from "./QuoteForm";
import {PackagePricingContext} from "@/lib/package-pricing";
import {PAYMENT_PACKAGES} from "../../supabase/functions/_shared/catalog";
vi.mock("@/lib/quote-client",()=>({submitQuote:vi.fn(),captureAttribution:vi.fn(()=>({})),isPreviewSubmission:vi.fn(()=>false)}));
beforeEach(()=>vi.stubGlobal("matchMedia",vi.fn(()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}))));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
const updated={...PAYMENT_PACKAGES,starter:{...PAYMENT_PACKAGES.starter,startingPrice:1200055},business:{...PAYMENT_PACKAGES.business,startingPrice:2000000}};
it("keeps quote package choices consistent with current public starting prices",()=>{
 render(<MemoryRouter><PackagePricingContext.Provider value={{packages:updated,available:true}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>);
 expect(screen.getByRole("button",{name:"Landing Page From ₹12,000.55"})).toBeTruthy();expect(screen.getByRole("button",{name:"Business Website From ₹20,000"})).toBeTruthy();
});
it("preserves valid package prefill and unsaved project text when displayed prices change",async()=>{
 const page=(packages:typeof PAYMENT_PACKAGES)=><MemoryRouter initialEntries={[{pathname:"/quote",state:{projectType:"Large Website",requirements:"Original proposal details",packageName:"Business"}}]}><PackagePricingContext.Provider value={{packages,available:true}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>;
 const view=render(page(PAYMENT_PACKAGES));expect(await screen.findByText("Business Website · Business package")).toBeTruthy();
 fireEvent.change(screen.getByLabelText(/Anything else/),{target:{value:"Updated customer requirements that must remain here"}});
 fireEvent.change(screen.getByLabelText("Project budget"),{target:{value:"Rs. 30,000+"}});
 view.rerender(page(updated));expect((screen.getByLabelText(/Anything else/) as HTMLTextAreaElement).value).toBe("Updated customer requirements that must remain here");
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("Rs. 30,000+");
});

it.each([
 [{projectType:"Landing Page",packageName:"Starter"}, "Rs. 10,000 - 15,000"],
 [{projectType:"Business Website",packageName:"Business"}, "Rs. 15,000 - 30,000"],
 [{projectType:"Business Website",requirements:"Clinic website"}, "Rs. 15,000 - 30,000"],
 [{projectType:"E-commerce Store",estimateTotal:22300}, "Rs. 15,000 - 30,000"],
 [{projectType:"E-commerce Store",estimateTotal:46300}, "Rs. 30,000+"],
 [{projectType:"Web Application",estimateTotal:50000}, "Rs. 30,000+"],
 [{projectType:"Business Website",estimateTotal:15000,estimateMin:13500,estimateMax:16500}, "Rs. 15,000 - 30,000"],
 [{projectType:"Large Website",estimateMin:35000}, "Rs. 30,000+"],
 [{projectType:"Custom Web App",budget:"Flexible / Custom"}, "Flexible / Custom"],
 [{projectType:"Business Website",budget:"invalid budget"}, "Rs. 15,000 - 30,000"],
])("prefills a valid editable budget for enquiry %j",async(state,expected)=>{
 render(<MemoryRouter initialEntries={[{pathname:"/quote",state}]}><QuoteForm/></MemoryRouter>);
 expect((await screen.findByLabelText("Project budget") as HTMLSelectElement).value).toBe(expected);
});

it("uses the current package price rather than the original starting price",async()=>{
 const packages={...PAYMENT_PACKAGES,business:{...PAYMENT_PACKAGES.business,startingPrice:3500000}};
 render(<MemoryRouter initialEntries={[{pathname:"/quote",state:{projectType:"Business Website",packageName:"Business"}}]}><PackagePricingContext.Provider value={{packages,available:true}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>);
 expect((await screen.findByLabelText("Project budget") as HTMLSelectElement).value).toBe("Rs. 30,000+");
});

it("keeps Premium enquiries on a custom budget after choosing the website type",()=>{
 render(<MemoryRouter initialEntries={[{pathname:"/quote",state:{packageName:"Premium"}}]}><QuoteForm/></MemoryRouter>);
 fireEvent.click(screen.getByRole("button",{name:/Custom Web App From/}));
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("Flexible / Custom");
 expect(screen.getByText("Custom Web App · Premium package")).toBeTruthy();
});

it("updates automatic suggestions when the website type changes, preserving a visitor's budget",async()=>{
 render(<MemoryRouter><QuoteForm/></MemoryRouter>);
 fireEvent.click(screen.getByRole("button",{name:/Landing Page From/}));
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("Rs. 10,000 - 15,000");
 fireEvent.click(screen.getByRole("button",{name:"Back"}));
 fireEvent.click(screen.getByRole("button",{name:/Business Website From/}));
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("Rs. 15,000 - 30,000");
 fireEvent.change(screen.getByLabelText("Project budget"),{target:{value:"Flexible / Custom"}});
 fireEvent.click(screen.getByRole("button",{name:"Back"}));
 fireEvent.click(screen.getByRole("button",{name:/Custom Web App From/}));
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("Flexible / Custom");
});

it.each([true,false])("requires an explicit budget where no matching price is known (pricing available: %s)",async available=>{
 render(<MemoryRouter><PackagePricingContext.Provider value={{packages:PAYMENT_PACKAGES,available}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>);
 fireEvent.click(screen.getByRole("button",{name:available?/Website Redesign/:/Business Website/}));
 expect((screen.getByLabelText("Project budget") as HTMLSelectElement).value).toBe("");
 fireEvent.click(screen.getByRole("button",{name:"Continue"}));
 await waitFor(()=>expect(screen.getByRole("alert").textContent).toContain("select your budget"));
});
