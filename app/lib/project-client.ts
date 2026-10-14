export const PROJECT_STAGES={queued:"Queued",discovery:"Discovery",design:"Design",development:"Development",review:"Your review",ready:"Ready to launch",launched:"Launched",on_hold:"On hold"};
export type ProjectSummary={title:string;stage:string;update:string;updatedAt:string;total:number|null;advancePaid:number;balancePaid:number;remaining:number|null;balanceStatus:string;needsReview:boolean;canPay:boolean;retryId?:string|null};
export async function projectRequest<T>(action:"view"|"refresh"|"checkout"|"verify",token:string,details:Record<string,string>={}):Promise<T>{
 const response=await fetch(`/api/project/${action}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,...details}),signal:AbortSignal.timeout(40000)});
 const result=await response.json();if(!response.ok)throw new Error(result.error??"Unable to check project; contact SiteNova");return result;
}
