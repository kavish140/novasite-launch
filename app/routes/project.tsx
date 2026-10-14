import {buildMeta} from "@/lib/meta";
export {default} from "@/pages/Project";
export function headers(){return {"Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"};}
export function meta(){return buildMeta({title:"Your project | SiteNova",description:"Your private project and payment summary.",canonicalPath:"/project",noindex:true});}
