import {afterEach,it,expect,vi} from "vitest";
import {render,screen,cleanup,fireEvent} from "@testing-library/react";
import Receipt from "./Receipt";
afterEach(()=>{cleanup();vi.unstubAllGlobals();window.location.hash="";});
it("reads a fragment token without session storage and displays only package, amount and status on revisits",async()=>{
 window.location.hash="opaque-signed-token";const fetcher=vi.fn(async()=>Response.json({package:"starter",amount:500000,status:"paid"}));vi.stubGlobal("fetch",fetcher);
 const view=render(<Receipt/>);expect(await screen.findByText("paid")).toBeTruthy();view.unmount();render(<Receipt/>);expect(await screen.findByText("paid")).toBeTruthy();
 expect(fetcher.mock.calls).toHaveLength(2);expect(fetcher).toHaveBeenCalledWith("/api/payments/receipt",expect.objectContaining({method:"POST",body:JSON.stringify({token:"opaque-signed-token"})}));
});
it("prints a test receipt without claiming a website advance or exposing extra response fields",async()=>{
 window.location.hash="opaque-signed-token";vi.stubGlobal("fetch",vi.fn(async()=>Response.json({package:"test",amount:100,status:"paid",customer:"private-customer",paymentId:"private-payment"})));
 const print=vi.spyOn(window,"print").mockImplementation(()=>{});render(<Receipt/>);
 expect(await screen.findByText("Test payment")).toBeTruthy();expect(screen.getByText("₹1.00")).toBeTruthy();
 expect(screen.queryByText(/private-customer|private-payment|agreed proposal/)).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:"Print / save PDF"}));expect(print).toHaveBeenCalledTimes(1);print.mockRestore();
});
it("shows a recorded refund without claiming the full original amount was refunded",async()=>{
 window.location.hash="opaque-signed-token";vi.stubGlobal("fetch",vi.fn(async()=>Response.json({package:"business",amount:750000,status:"refunded"})));
 render(<Receipt/>);expect(await screen.findByRole("heading",{name:"Refund recorded"})).toBeTruthy();
 expect(screen.getByText("Original payment amount")).toBeTruthy();expect(screen.getByText("₹7,500.00")).toBeTruthy();
 expect(screen.getByText(/Contact us for the refund amount/)).toBeTruthy();expect(screen.queryByText(/fully refunded/i)).toBeNull();
});
it("does not fetch or offer printing when the complete receipt link is missing",async()=>{
 const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);render(<Receipt/>);
 expect(await screen.findByRole("alert")).toBeTruthy();expect(screen.getByText("Open your complete receipt link.")).toBeTruthy();
 expect(fetcher).not.toHaveBeenCalled();expect(screen.queryByRole("button",{name:"Print / save PDF"})).toBeNull();
});
