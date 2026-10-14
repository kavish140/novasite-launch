import {afterEach,it,expect,vi} from "vitest";
import React, {startTransition} from "react";
import {act} from "@testing-library/react";
vi.mock("react-dom/server",async()=>{const moduleName="react-dom/server.browser";return await import(moduleName) as typeof import("react-dom/server");});
import {renderToString} from "react-dom/server";
import {hydrateRoot,type Root} from "react-dom/client";
vi.mock("react-router",()=>({useLocation:()=>({pathname:"/project"}),Meta:()=> <title>Hydration regression</title>,Links:()=>null,Outlet:()=>null,Scripts:()=>null,ScrollRestoration:()=>null,ServerRouter:()=> <html><head><title>Server stream</title></head><body><main>Streaming response</main></body></html>}));
vi.mock("@/components/BookingProvider",()=>({BookingProvider:({children}:{children:React.ReactNode})=>children}));
import {Layout} from "../root";
import handleRequest from "../entry.server";
import type {EntryContext} from "react-router";
let root:Root|undefined;
afterEach(async()=>{if(root)await act(async()=>root?.unmount());root=undefined;});
it("hydrates the browser-parsed document shell without replacing server markup",async()=>{
 const page=<Layout><main>Hydration content</main></Layout>;
 const html=renderToString(page);document.open();document.write("<!DOCTYPE html>"+html);document.close();
 const errors:{message:string;stack:string|null|undefined}[]=[];
 await act(async()=>{root=hydrateRoot(document,page,{onRecoverableError:(error,info)=>errors.push({message:String(error),stack:info.componentStack})});});
 expect(errors).toEqual([]);expect(document.querySelector("main")?.textContent).toBe("Hydration content");
});

it("streams React's full document with exactly one doctype and preserves response headers",async()=>{
 const response=await handleRequest(new Request("http://localhost/project"),200,new Headers({"X-Test":"retained"}),{} as EntryContext);
 const html=await response.text();expect((html.match(/<!doctype html>/gi)||[]).length).toBe(1);expect(html).toContain("Streaming response");expect(response.headers.get("Content-Type")).toBe("text/html");expect(response.headers.get("X-Test")).toBe("retained");expect(response.status).toBe(200);
});

it("preserves externally injected document UI while hydrating the server shell without errors",async()=>{
 const page=<Layout><main>Hydration content</main></Layout>;document.open();document.write("<!DOCTYPE html>"+renderToString(page));document.close();
 const overlay=document.createElement("div"),button=document.createElement("button"),clicked=vi.fn();overlay.id="external-browser-overlay";overlay.style.position="fixed";button.textContent="Extension action";button.addEventListener("click",clicked);overlay.appendChild(button);document.documentElement.appendChild(overlay);
 const errors:unknown[]=[];await act(async()=>{root=hydrateRoot(document,page,{onRecoverableError:error=>errors.push(error)});});
 expect(errors).toEqual([]);expect(document.getElementById(overlay.id)).toBe(overlay);button.click();expect(clicked).toHaveBeenCalledOnce();expect(document.querySelector("main")?.textContent).toBe("Hydration content");
});

it("preserves an extension injected while streamed Router startup is suspended",async()=>{
 const page=<Layout><main>Late overlay</main></Layout>;document.open();document.write("<!DOCTYPE html>"+renderToString(page));document.close();
 const overlay=document.createElement("div");overlay.id="late-extension-overlay";const errors:unknown[]=[];
 let ready=false;let resolve!:()=>void;const bootstrap=new Promise<void>(done=>{resolve=done;});
 function DeferredRouter(){if(!ready)throw bootstrap;return page;}

   await act(async()=>{startTransition(()=>{root=hydrateRoot(document,<DeferredRouter />,{onRecoverableError:error=>errors.push(error)});});});
  document.documentElement.appendChild(overlay);
  await act(async()=>{ready=true;resolve();await bootstrap;});
  expect(errors).toEqual([]);expect(document.querySelector("main")?.textContent).toBe("Late overlay");expect(document.getElementById(overlay.id)).toBe(overlay);expect(overlay.parentElement).toBe(document.documentElement);
  await act(async()=>{root?.render(<DeferredRouter />);});
  expect(overlay.parentElement).toBe(document.documentElement);expect(errors).toEqual([]);
});

it("still reports genuine application markup mismatches instead of suppressing errors",async()=>{
 const page=<Layout><main>Expected content</main></Layout>;document.open();document.write("<!DOCTYPE html>"+renderToString(page));document.close();
 document.querySelector("main")!.textContent="Wrong server content";
 const errors:unknown[]=[];await act(async()=>{root=hydrateRoot(document,page,{onRecoverableError:error=>errors.push(error)});});
 expect(errors.length).toBeGreaterThan(0);expect(document.querySelector("main")?.textContent).toBe("Expected content");
});
