import {afterEach,beforeEach,it,expect,vi} from "vitest";
import {cleanup,render,screen,fireEvent,waitFor} from "@testing-library/react";
import PackagePricing from "./PackagePricing";
import SettingsTab from "../tabs/SettingsTab";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {PAYMENT_PACKAGES} from "../../../../supabase/functions/_shared/catalog";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
vi.mock("./BookingSettings",()=>({default:()=>null}));
vi.mock("@/lib/supabaseClient",()=>({supabase:{from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:null,error:null})})})})}}));
const initial={version:"00000000-0000-4000-8000-000000000000",updatedAt:"2026-10-14T12:00:00Z",packages:PAYMENT_PACKAGES,history:[]};
beforeEach(()=>{vi.clearAllMocks();vi.mocked(adminPaymentRequest).mockResolvedValue(initial);});
afterEach(cleanup);
async function ready(){render(<PackagePricing/>);await screen.findByLabelText("Starter starting price (₹)");await waitFor(()=>expect(screen.getByRole("button",{name:"Save package prices"}).hasAttribute("disabled")).toBe(false));}
it("saves independent advances as exact paise with the version the admin reviewed",async()=>{
 await ready();fireEvent.change(screen.getByLabelText("Starter starting price (₹)"),{target:{value:"12000.55"}});fireEvent.change(screen.getByLabelText("Starter advance (₹)"),{target:{value:"4200.25"}});
 vi.mocked(adminPaymentRequest).mockResolvedValueOnce({...initial,version:"00000000-0000-4000-8000-000000000001",packages:{...PAYMENT_PACKAGES,starter:{...PAYMENT_PACKAGES.starter,startingPrice:1200055,advance:420025}}});
 fireEvent.click(screen.getByRole("button",{name:"Save package prices"}));await screen.findByText(/Package prices saved/);
 expect(adminPaymentRequest).toHaveBeenLastCalledWith("pricing-save",{version:initial.version,prices:{starter:{startingPrice:1200055,advance:420025},business:{startingPrice:1500000,advance:750000}}});
 expect((screen.getByLabelText("Starter advance (₹)") as HTMLInputElement).value).toBe("4200.25");
});
it.each(["10000.01","0","1.001","-1"])("blocks an invalid advance %s before the request",async value=>{
 await ready();fireEvent.change(screen.getByLabelText("Starter advance (₹)"),{target:{value}});fireEvent.click(screen.getByRole("button",{name:"Save package prices"}));await screen.findByRole("alert");expect(adminPaymentRequest).toHaveBeenCalledTimes(1);
});
it("retains edits after a stale-version failure and requires explicit reload",async()=>{
 await ready();fireEvent.change(screen.getByLabelText("Business advance (₹)"),{target:{value:"6000"}});vi.mocked(adminPaymentRequest).mockRejectedValueOnce(new Error("Prices changed in another session. Reload pricing before saving."));
 fireEvent.click(screen.getByRole("button",{name:"Save package prices"}));await screen.findByRole("alert");expect((screen.getByLabelText("Business advance (₹)") as HTMLInputElement).value).toBe("6000");expect(adminPaymentRequest).toHaveBeenCalledTimes(2);
 fireEvent.click(screen.getByRole("button",{name:"Reload prices"}));await waitFor(()=>expect((screen.getByLabelText("Business advance (₹)") as HTMLInputElement).value).toBe("7500"));expect(screen.queryByRole("alert")).toBeNull();
});
it("never mounts or requests the pricing editor for a non-admin settings screen",async()=>{
 render(<SettingsTab isPaymentAdmin={false}/>);await waitFor(()=>expect(screen.getByText("Announcement Banner")).toBeTruthy());expect(screen.queryByRole("region",{name:"Package pricing"})).toBeNull();expect(screen.queryByLabelText("Starter starting price (₹)")).toBeNull();expect(adminPaymentRequest).not.toHaveBeenCalled();
});
