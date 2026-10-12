import {afterEach,it,expect,vi} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import PaymentReceiptLink from "./PaymentReceiptLink";
vi.mock("@/lib/supabaseClient",()=>({supabase:{auth:{getSession:async()=>({data:{session:null}})}}}));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it("adds a durable receipt link separately from checkout and verification",async()=>{
 const url=`https://sitenova.dev/receipt#00000000-0000-4000-8000-000000000001.${"a".repeat(64)}`;
 const fetcher=vi.fn(async()=>Response.json({url}));vi.stubGlobal("fetch",fetcher);render(<PaymentReceiptLink token="signed-payment-token"/>);
 expect((await screen.findByRole("link")).getAttribute("href")).toBe(url);expect(fetcher).toHaveBeenCalledWith("/api/payments/receipt-link",expect.objectContaining({method:"POST",body:JSON.stringify({token:"signed-payment-token"})}));
});
