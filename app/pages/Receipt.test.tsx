import {afterEach,it,expect,vi} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import Receipt from "./Receipt";
afterEach(()=>{cleanup();vi.unstubAllGlobals();window.location.hash="";});
it("reads a fragment token without session storage and displays only package, amount and status on revisits",async()=>{
 window.location.hash="opaque-signed-token";const fetcher=vi.fn(async()=>Response.json({package:"starter",amount:500000,status:"paid"}));vi.stubGlobal("fetch",fetcher);
 const view=render(<Receipt/>);expect(await screen.findByText("paid")).toBeTruthy();view.unmount();render(<Receipt/>);expect(await screen.findByText("paid")).toBeTruthy();
 expect(fetcher.mock.calls).toHaveLength(2);expect(fetcher).toHaveBeenCalledWith("/api/payments/receipt",expect.objectContaining({method:"POST",body:JSON.stringify({token:"opaque-signed-token"})}));
});
