import {afterEach,beforeEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,cleanup,waitFor,act} from "@testing-library/react";
import ClientProjects from "./ClientProjects";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
beforeEach(()=>{vi.clearAllMocks();vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="projects"?{projects:[]}:action==="paid"?{orders:[{request_id:"advance-id",payment_intents:{package:"starter",amount:500000,customer:{business:"Client website"}}}]}:{id:"project-id"});});
afterEach(cleanup);
it("creates a project from a recorded advance with a paise total, not a browser payment status",async()=>{
 render(<ClientProjects/>);fireEvent.click(screen.getByRole("button",{name:"Create client project"}));await screen.findByRole("option",{name:/starter/});
 fireEvent.change(screen.getByLabelText("Verified advance"),{target:{value:"advance-id"}});fireEvent.change(screen.getByLabelText(/Agreed final total/),{target:{value:"10000"}});fireEvent.change(screen.getByLabelText("Website progress"),{target:{value:"development"}});fireEvent.change(screen.getByLabelText("Update visible to the customer"),{target:{value:"Development underway"}});fireEvent.click(screen.getByRole("button",{name:"Save project"}));
 await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("project-save",{requestId:"advance-id",title:"Client website",stage:"development",update:"Development underway",total:1000000,enabled:false,linkEnabled:true,rotate:false,projectId:null,version:null}));
});

it("loads older projects, searches titles and loads older paid advances",async()=>{
 vi.mocked(adminPaymentRequest).mockImplementation(async(action,body)=>action==="projects"?{projects:[],nextOffset:(body as {offset:number}).offset===0?25:null}:action==="paid"?{orders:[{request_id:(body as {offset:number}).offset===0?"new-advance":"old-advance",payment_intents:{package:"starter",amount:500000,customer:{business:(body as {offset:number}).offset===0?"New client":"Older client"}}}],nextOffset:(body as {offset:number}).offset===0?50:null}:{});
 render(<ClientProjects/>);await waitFor(()=>expect((screen.getByRole("button",{name:"Next projects"}) as HTMLButtonElement).disabled).toBe(false));fireEvent.click(screen.getByRole("button",{name:"Next projects"}));await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("projects",{offset:25,search:""}));
 fireEvent.change(screen.getByLabelText("Search project titles"),{target:{value:"Older"}});fireEvent.click(screen.getByRole("button",{name:"Search projects"}));await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("projects",{offset:0,search:"Older"}));
 fireEvent.click(screen.getByRole("button",{name:"Create client project"}));fireEvent.click(await screen.findByRole("button",{name:"Load older verified advances"}));await screen.findByRole("option",{name:/Older client/});expect(screen.getByRole("option",{name:/New client/})).toBeTruthy();expect(adminPaymentRequest).toHaveBeenCalledWith("paid",{offset:50});
});

it("ignores an older project response after a newer search completes",async()=>{
 let resolveOld!: (value:unknown)=>void;
 vi.mocked(adminPaymentRequest).mockImplementation(async(action,body)=>action==="paid"?{orders:[],nextOffset:null}:(body as {search:string}).search===""?new Promise(resolve=>{resolveOld=resolve;}):{projects:[],nextOffset:null});
 render(<ClientProjects/>);fireEvent.change(screen.getByLabelText("Search project titles"),{target:{value:"Latest"}});fireEvent.click(screen.getByRole("button",{name:"Search projects"}));await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("projects",{offset:0,search:"Latest"}));await act(async()=>{});
 await act(async()=>resolveOld({projects:[],nextOffset:25}));expect((screen.getByRole("button",{name:"Next projects"}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByText("Page 1")).toBeTruthy();
});

it("acknowledges the specific earlier captured attempt without acknowledging a newer payment",async()=>{
 const project={id:"project-id",advance_request:"advance",title:"Client website",stage:"design",customer_update:"",total_amount:1000000,balance_enabled:false,link_enabled:true,summary:{remaining:0,updatedAt:"2026-10-13T10:00:00Z",needsReview:true},balance:{id:"new-payment",status:"pending",order_id:"order_new"},attempts:[{id:"old-payment",status:"paid",order_id:"order_old",active:false,created_at:"2026-10-13T10:00:00Z"},{id:"new-payment",status:"pending",order_id:"order_new",active:true,created_at:"2026-10-13T10:10:00Z"}],history:[{order_id:"order_old",source:"cron",old_state:"pending",new_state:"paid",created_at:"2026-10-13T10:00:00Z"}]};
 vi.mocked(adminPaymentRequest).mockImplementation(async action=>action==="projects"?{projects:[project],nextOffset:null}:action==="paid"?{orders:[],nextOffset:null}:{});render(<ClientProjects/>);fireEvent.click(await screen.findByRole("button",{name:"Acknowledge balance payment"}));await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("project-acknowledge",{id:"project-id",balanceId:"old-payment"}));expect(adminPaymentRequest).not.toHaveBeenCalledWith("project-acknowledge",{id:"project-id",balanceId:"new-payment"});fireEvent.click(screen.getByText("Balance check history"));expect(screen.getByText(/IST · order_old · cron/)).toBeTruthy();
});
