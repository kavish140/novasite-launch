import { describe, expect, it } from "vitest";
import { defaultPortfolio, parsePortfolio, projectSchema } from "./portfolio";
describe("portfolio content",()=>{
  it("removes AI SmartKit from the catalog",()=>expect(defaultPortfolio.some(row=>row.project.liveUrl.includes("aismartkit.tech"))).toBe(false));
  it("keeps a deliberately empty catalog empty",()=>expect(parsePortfolio([])).toEqual([]));
  it("rejects executable URLs and external case-study redirects",()=>{
    const project=defaultPortfolio[0].project;
    expect(projectSchema.safeParse({...project,liveUrl:"javascript:alert(1)"}).success).toBe(false);
    expect(projectSchema.safeParse({...project,image:"//evil.test/a.png"}).success).toBe(false);
    expect(projectSchema.safeParse({...project,caseStudyPath:"https://evil.test"}).success).toBe(false);
  });
  it("orders by position and slug without reintroducing deleted defaults",()=>{
    const rows=defaultPortfolio.slice(0,2).map((row,i)=>({...row,position:10-i}));
    expect(parsePortfolio(rows).map(r=>r.slug)).toEqual(rows.reverse().map(r=>r.slug));
  });
});
