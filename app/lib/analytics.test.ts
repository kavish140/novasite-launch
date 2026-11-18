import {afterEach,describe,expect,it,vi} from "vitest";
import {trackEvent,trackGoogleAdsConversion} from "./analytics";
afterEach(()=>vi.unstubAllGlobals());
describe("Google tag command queue",()=>{
  it("queues the documented Arguments object and preserves event payloads",()=>{
    const fakeWindow:{dataLayer:unknown[];gtag?:(...args:unknown[])=>void}={dataLayer:[]};
    vi.stubGlobal("window",fakeWindow);
    const payload={project_type:"Business Website"};
    trackEvent("submit_quote_form",payload);
    const queued=fakeWindow.dataLayer[0] as IArguments;
    expect(Object.prototype.toString.call(queued)).toBe("[object Arguments]");
    expect(Array.isArray(queued)).toBe(false);
    expect(Array.from(queued)).toEqual(["event","submit_quote_form",payload]);
    trackGoogleAdsConversion("example-label","example-id");
    expect(Array.from(fakeWindow.dataLayer[1] as IArguments)).toEqual(["event","conversion",{send_to:"AW-18182593308/example-label",transaction_id:"example-id"}]);
  });
  it("does not replace an initialized Google tag or its data layer",()=>{
    const gtag=vi.fn(),dataLayer=[{event:"existing"}];
    vi.stubGlobal("window",{gtag,dataLayer});
    trackEvent("click_book_call",{page:"/quote"});
    expect(gtag).toHaveBeenCalledWith("event","click_book_call",{page:"/quote"});
    expect(window.gtag).toBe(gtag);expect(window.dataLayer).toBe(dataLayer);
    expect(dataLayer).toHaveLength(1);
  });
  it("does not access browser globals during SSR",()=>{
    vi.stubGlobal("window",undefined);
    expect(()=>trackEvent("submit_quote_form",{})).not.toThrow();
  });
});
