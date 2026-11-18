import {afterEach,describe,expect,it,vi} from "vitest";
vi.mock("./analytics",()=>({trackQuoteSubmit:vi.fn(),trackGoogleAdsConversion:vi.fn()}));
import {submitQuote,isPreviewSubmission} from "./quote-client";
import {trackQuoteSubmit} from "./analytics";
const quote={submissionId:"13fa6805-108f-4820-a7f1-cab879d545f5",name:"Preview Buyer",email:"preview@example.test",phone:"9999999999",businessName:"Preview Business",projectType:"Landing Page" as const,budget:"Flexible / Custom" as const,timeline:"Normal (2-4 weeks)" as const,source:"website" as const};
afterEach(()=>{vi.unstubAllGlobals();vi.clearAllMocks();});
describe("local quote preview",()=>{
  it("allows a flagged local simulation without recording a conversion",async()=>{
    vi.stubGlobal("window",{location:{hostname:"127.0.0.1"}});
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(Response.json({saved:true,submissionId:quote.submissionId,preview:true})));
    const id=await submitQuote(quote);
    expect(isPreviewSubmission(id)).toBe(true);
    expect(trackQuoteSubmit).not.toHaveBeenCalled();
  });
  it("rejects preview responses on the production host",async()=>{
    vi.stubGlobal("window",{location:{hostname:"sitenova.dev"}});
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(Response.json({saved:true,submissionId:quote.submissionId,preview:true})));
    await expect(submitQuote(quote)).rejects.toThrow("only available in the local preview");
    expect(trackQuoteSubmit).not.toHaveBeenCalled();
  });
  it("never accepts a mismatched submission ID",async()=>{
    vi.stubGlobal("window",{location:{hostname:"127.0.0.1"}});
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(Response.json({saved:true,submissionId:"wrong",preview:true})));
    await expect(submitQuote(quote)).rejects.toThrow("couldn't confirm");
  });
});
