import {fireEvent,render,screen,waitFor,cleanup} from "@testing-library/react";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {defaultPortfolio} from "@/lib/portfolio";
const state=vi.hoisted(()=>({admin:true,rows:[] as unknown[],writes:0,conflict:false}));
vi.mock("@/lib/supabaseClient",()=>({supabase:{
  auth:{getUser:async()=>({data:{user:{id:"admin"}},error:null})},
  rpc:async()=>({data:state.admin,error:null}),
  from:()=>{let action="read",payload:Record<string,unknown>|undefined;const filters:Record<string,unknown>={};
    const query={
      select:()=>query,order:()=>query,eq:(key:string,value:unknown)=>{filters[key]=value;return query;},
      insert:(value:Record<string,unknown>)=>{action="insert";payload=value;return query;},
      update:(value:Record<string,unknown>)=>{action="update";payload=value;return query;},
      delete:()=>{action="delete";return query;},
      then:(resolve:(value:unknown)=>unknown)=>{
        let data=state.rows as Record<string,unknown>[];
        if(action!=="read"){
          state.writes++;
          if(state.conflict)data=[];
          else if(action==="insert"){state.rows=[...state.rows,payload];data=[payload!];}
          else {data=data.filter(row=>Object.entries(filters).every(([key,value])=>row[key]===value));state.rows=state.rows.filter(row=>!data.includes(row as Record<string,unknown>));if(action==="update"){state.rows.push(payload);data=[payload!];}}
        }
        return Promise.resolve({data,error:null}).then(resolve);
      }
    };return query;
  }
}}));
import PortfolioTab from "./PortfolioTab";
afterEach(cleanup);
beforeEach(()=>{state.admin=true;state.rows=structuredClone(defaultPortfolio.slice(0,1));state.writes=0;state.conflict=false;});
describe("portfolio admin",()=>{
  it("saves an edited project and confirms before deletion",async()=>{
    render(<PortfolioTab/>);
    await screen.findByRole("button",{name:"Edit"});
    fireEvent.click(screen.getByRole("button",{name:"Edit"}));
    fireEvent.change(screen.getByLabelText("Title"),{target:{value:"Updated client"}});
    fireEvent.click(screen.getByRole("button",{name:"Save project"}));
    await screen.findByText("Project saved. Public portfolio updates on the next page load.");
    expect((state.rows[0] as {project:{title:string}}).project.title).toBe("Updated client");
    fireEvent.click(screen.getByRole("button",{name:"Delete"}));
    expect(state.rows.length).toBe(1);
    fireEvent.click(screen.getByRole("button",{name:"Delete project"}));
    await waitFor(()=>expect(state.rows.length).toBe(0));
  });
  it("denies non-admin users before reading or writing project data",async()=>{
    state.admin=false;render(<PortfolioTab/>);
    await screen.findByText("Only SiteNova administrators can manage projects.");
    expect(screen.queryByRole("button",{name:"Save project"})).toBeNull();
    expect(state.writes).toBe(0);
  });
  it("retains unsaved edits when another tab changed the project",async()=>{
    render(<PortfolioTab/>);fireEvent.click(await screen.findByRole("button",{name:"Edit"}));
    state.conflict=true;
    fireEvent.change(screen.getByLabelText("Title"),{target:{value:"Unsaved changes"}});
    fireEvent.click(screen.getByRole("button",{name:"Save project"}));
    await screen.findByText("This project changed in another tab. Reload projects before editing again.");
    expect((screen.getByLabelText("Title") as HTMLInputElement).value).toBe("Unsaved changes");
  });
});
