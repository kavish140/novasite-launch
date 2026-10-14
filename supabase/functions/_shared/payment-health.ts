export type Dispute = {id:string; event:string; status:string; paymentId:string|null; orderId:string|null; amount:number|null; currency:string|null; responseDueAt:string|null; occurredAt:string|null};
export type DisputeEvent = {event_id:string;processed_at:string;dispute:Dispute};
export type LostDispute=Dispute&{eventId:string};
// A later closed/won delivery must not silently erase a recorded financial loss.
export function lostDisputes(events:DisputeEvent[],acknowledged:Set<string>):LostDispute[]{
 const latest=new Map<string,DisputeEvent>();
 for(const row of events){if(row.dispute.status!=="lost")continue;const old=latest.get(row.dispute.id);if(!old||Date.parse(row.dispute.occurredAt??row.processed_at)>Date.parse(old.dispute.occurredAt??old.processed_at))latest.set(row.dispute.id,row);}
 return [...latest.values()].filter(row=>!acknowledged.has(row.dispute.id)).map(row=>({...row.dispute,eventId:row.event_id}));
}
const closed=new Set(["won","lost","closed"]);
// Event time, rather than delivery time, prevents late delivery reopening a dispute.
export function openDisputes(events:DisputeEvent[]):Dispute[]{
 const latest=new Map<string,DisputeEvent>();
 for(const row of events){
  const key=row.dispute.id||row.event_id,previous=latest.get(key);
  const at=Date.parse(row.dispute.occurredAt??row.processed_at),before=previous?Date.parse(previous.dispute.occurredAt??previous.processed_at):-Infinity;
  if(!previous||at>before||(at===before&&closed.has(row.dispute.status))) latest.set(key,row);
 }
 return [...latest.values()].map(row=>row.dispute).filter(dispute=>!closed.has(dispute.status)).sort((a,b)=>(a.responseDueAt??"9999").localeCompare(b.responseDueAt??"9999"));
}
export type PaymentHealth = {projectReview?:number;lostDisputes?:LostDispute[];investigations?:number;unacknowledgedPaid?:number;observedAt:string;latestRunFailed:boolean;lastCompletedAt:string|null;lastSuccessfulAt:string|null;needsReconciliation:number;overdue:number;refunded:number;disputes:Dispute[]};
export function staleCron(health:PaymentHealth,now=Date.now()){
 return !health.lastCompletedAt || now-Date.parse(health.lastCompletedAt)>30*60000;
}
export function paymentAlertCount(health:PaymentHealth,now=Date.now()){
 return (health.projectReview??0)+(health.lostDisputes?.length??0)+(health.investigations??0)+(health.unacknowledgedPaid??0)+Number(health.latestRunFailed)+Number(staleCron(health,now))+health.needsReconciliation+health.overdue+health.refunded+health.disputes.length;
}
