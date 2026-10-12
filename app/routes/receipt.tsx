import {buildMeta} from "@/lib/meta";
export {default} from "@/pages/Receipt";
export function headers(){return {"Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"};}
export function meta(){return buildMeta({title:"Payment receipt | SiteNova",description:"Your SiteNova payment summary.",canonicalPath:"/receipt",noindex:true});}
