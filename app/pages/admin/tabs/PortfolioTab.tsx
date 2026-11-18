import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { parsePortfolio, projectSchema, type PortfolioRow } from "@/lib/portfolio";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../components/ConfirmDialog";

const schema = projectSchema.extend({category:z.enum(["client","showcase"]),position:z.coerce.number().int().min(0).max(100000),is_visible:z.boolean()});
type Values = z.infer<typeof schema>;
const empty:Values = {slug:"",title:"",description:"",image:"",liveUrl:"",category:"client",position:0,is_visible:true,useIframePreview:false,isSpecialHighlight:false,localFocus:"",caseStudyPath:""};
const caseStudies:Record<string,string>={"dr-dipti-ganatra":"/portfolio/dr-dipti-ganatra","jupiter-finance":"/portfolio/jupiter-fast-finance","corporate-zone":"/portfolio/corporate-zone"};
async function verifyAdmin() {
  const {data,error} = await supabase.auth.getUser();
  if(error || !data.user) throw new Error("Please sign in again.");
  const membership = await supabase.rpc("is_site_admin");
  if(membership.error || membership.data!==true) throw new Error("Only SiteNova administrators can manage projects.");
}
export default function PortfolioTab() {
  const [rows,setRows]=useState<PortfolioRow[]>([]);
  const [editing,setEditing]=useState<PortfolioRow|null>(null);
  const [deleting,setDeleting]=useState<PortfolioRow|null>(null);
  const [ready,setReady]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [search,setSearch]=useState("");
  const {register,handleSubmit,reset,formState:{errors}}=useForm<Values>({resolver:zodResolver(schema),defaultValues:empty});
  async function load() {
    setReady(false); setMessage("");
    try {
      await verifyAdmin();
      const {data,error}=await supabase.from("portfolio_projects").select("*").order("position").order("slug");
      if(error) throw new Error("Could not load projects. The portfolio database migration must be installed before editing.");
      setRows(parsePortfolio(data)); setReady(true);
    } catch(error) {setMessage(error instanceof Error?error.message:"Unable to load projects.");}
  }
  useEffect(()=>{ void load(); },[]);
  function edit(row:PortfolioRow|null) {
    setEditing(row);
    reset(row?{...empty,caseStudyPath:caseStudies[row.slug]??"",...row.project,category:row.category,position:row.position,is_visible:row.is_visible}:empty);
    setMessage("");
  }
  const save=handleSubmit(async values=>{
    setBusy(true);setMessage("");
    try {
      await verifyAdmin();
      const project=projectSchema.parse({...values,slug:editing?.slug??values.slug});
      const row={slug:project.slug,project,category:values.category,position:values.position,is_visible:values.is_visible,revision:editing?editing.revision+1:1};
      const query=editing
        ?supabase.from("portfolio_projects").update(row).eq("slug",editing.slug).eq("revision",editing.revision).select()
        :supabase.from("portfolio_projects").insert(row).select();
      const {data,error}=await query;
      if(error) throw new Error(error.code==="23505"?"That project slug already exists. Choose another.":"Could not save the project. Your changes are still in the form.");
      if(!data?.length) throw new Error("This project changed in another tab. Reload projects before editing again.");
      const saved=parsePortfolio(data)[0];
      setRows(current=>parsePortfolio([...current.filter(r=>r.slug!==saved.slug),saved]));
      setEditing(saved);setMessage("Project saved. Public portfolio updates on the next page load.");
    } catch(error){setMessage(error instanceof Error?error.message:"Could not save project.");}
    finally {setBusy(false);}
  });
  async function remove() {
    if(!deleting)return;
    setBusy(true);
    try {
      await verifyAdmin();
      const {data,error}=await supabase.from("portfolio_projects").delete().eq("slug",deleting.slug).eq("revision",deleting.revision).select("slug");
      if(error||!data?.length)throw new Error("Delete failed or this project changed. Reload projects and try again.");
      setRows(current=>current.filter(row=>row.slug!==deleting.slug));
      if(editing?.slug===deleting.slug)edit(null);
      setMessage("Project deleted from the portfolio listing. Any existing case-study page remains separate.");
    }catch(error){setMessage(error instanceof Error?error.message:"Could not delete project.");}
    finally {setBusy(false);setDeleting(null);}
  }
  const input="w-full rounded-lg border border-border bg-background px-3 py-2 text-base";
  function field(name:keyof Values,label:string,type="text") {
    return <label key={name} className="grid gap-2 text-sm">{label}<input type={type} className={input} {...register(name)} disabled={busy||(name==="slug"&&editing!==null)} />{errors[name]&&<span role="alert" className="text-destructive">{errors[name]?.message}</span>}</label>;
  }
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={()=>void load()}>Reload projects</Button><Button disabled={!ready||busy} onClick={()=>edit(null)}>Add project</Button><a href="/portfolio" target="_blank" rel="noreferrer" className="self-center text-sm underline">View portfolio</a></div>
    {message&&<p role="status" className="rounded-lg border border-border p-3 text-sm">{message}</p>}
    {ready&&<div className="grid gap-6 lg:grid-cols-[minmax(240px,1fr)_minmax(0,2fr)]">
      <div className="space-y-3"><label className="grid gap-2 text-sm">Search projects<input className={input} value={search} onChange={e=>setSearch(e.target.value)} /></label>
        {rows.filter(row=>row.project.title.toLowerCase().includes(search.toLowerCase())).map(row=><article key={row.slug} className="rounded-xl border border-border bg-card p-4"><h3 className="font-semibold">{row.project.title}</h3><p className="my-2 text-xs text-muted-foreground">{row.category} · {row.is_visible?"Published":"Hidden"} · Order {row.position}</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={()=>edit(row)}>Edit</Button><Button size="sm" variant="destructive" disabled={busy} onClick={()=>setDeleting(row)}>Delete</Button></div></article>)}
        {!rows.length&&<p>No projects yet. Add your first project.</p>}
      </div>
      <form onSubmit={save} className="space-y-4 rounded-xl border border-border bg-card p-5">
        <h2 className="text-xl font-semibold">{editing?"Edit project":"Add project"}</h2>
        <p className="text-xs text-muted-foreground">Changes update the portfolio listing. Slugs stay fixed after creation. Case-study content is managed separately.</p>
        {field("slug","Project slug")}{field("title","Title")}
        <label className="grid gap-2 text-sm">Description<textarea className={input} rows={3} {...register("description")} />{errors.description&&<span role="alert" className="text-destructive">{errors.description.message}</span>}</label>
        {field("liveUrl","Live website URL","url")}{field("image","Screenshot image URL or site path")}
        <p className="text-xs text-muted-foreground">Use an HTTPS image URL or an existing site image, such as /portfolio-images/design.webp.</p>
        {field("localFocus","Project context")}{field("caseStudyPath","Case-study path (optional)")}
        <label className="grid gap-2 text-sm">Category<select className={input} {...register("category")}><option value="client">Client project</option><option value="showcase">Showcase / SiteNova product</option></select></label>
        {field("position","Display order (lowest first)","number")}
        {(["is_visible","useIframePreview","isSpecialHighlight"] as const).map((name,i)=><label key={name} className="flex items-center gap-3 text-sm"><input type="checkbox" {...register(name)} />{["Published on the portfolio","Show live website preview instead of image","Highlight as a SiteNova product"][i]}</label>)}
        <div className="flex gap-3"><Button type="submit" disabled={busy}>{busy?"Saving…":"Save project"}</Button><Button type="button" variant="outline" disabled={busy} onClick={()=>edit(null)}>Clear / new</Button></div>
      </form>
    </div>}
    <ConfirmDialog open={!!deleting} onOpenChange={open=>{if(!busy&&!open)setDeleting(null);}} title={`Delete ${deleting?.project.title??"project"}?`} description="This permanently removes the project from the portfolio listing. Its case-study route, if any, is not deleted." confirmLabel="Delete project" onConfirm={()=>{if(!busy)void remove();}} />
  </div>;
}
