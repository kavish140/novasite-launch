import {afterEach,it,expect,vi} from "vitest";
import {cleanup,render,screen,fireEvent} from "@testing-library/react";
import {MemoryRouter} from "react-router";
import QuoteForm from "./QuoteForm";
import {PackagePricingContext} from "@/lib/package-pricing";
import {PAYMENT_PACKAGES} from "../../supabase/functions/_shared/catalog";
vi.mock("@/lib/quote-client",()=>({submitQuote:vi.fn(),captureAttribution:vi.fn(()=>({}))}));
afterEach(cleanup);
const updated={...PAYMENT_PACKAGES,starter:{...PAYMENT_PACKAGES.starter,startingPrice:1200055},business:{...PAYMENT_PACKAGES.business,startingPrice:2000000}};
it("keeps quote package choices consistent with current public starting prices",()=>{
 render(<MemoryRouter><PackagePricingContext.Provider value={{packages:updated,available:true}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>);
 expect(screen.getByRole("button",{name:"Landing Page From ₹12,000.55"})).toBeTruthy();expect(screen.getByRole("button",{name:"Business Website From ₹20,000"})).toBeTruthy();
});
it("preserves valid package prefill and unsaved project text when displayed prices change",async()=>{
 const page=(packages:typeof PAYMENT_PACKAGES)=><MemoryRouter initialEntries={[{pathname:"/quote",state:{projectType:"Large Website",requirements:"Original proposal details",packageName:"Business"}}]}><PackagePricingContext.Provider value={{packages,available:true}}><QuoteForm/></PackagePricingContext.Provider></MemoryRouter>;
 const view=render(page(PAYMENT_PACKAGES));expect(await screen.findByText("Business Website · Business package")).toBeTruthy();
 fireEvent.change(screen.getByLabelText(/Anything else/),{target:{value:"Updated customer requirements that must remain here"}});
 view.rerender(page(updated));expect((screen.getByLabelText(/Anything else/) as HTMLTextAreaElement).value).toBe("Updated customer requirements that must remain here");
});
