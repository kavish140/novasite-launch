import { z } from "zod";
import {PaymentConflictError} from "./payment-conflict.ts";
import { paymentStore, type PaymentRecord } from "./payment-store.ts";
import { paymentDetailsSchema,paymentBookingSchema, type PaymentStatus } from "./payments.ts";
import {operationsStore} from "./payment-operations.ts";
import {pricingStore} from "./package-pricing.ts";
import {LEGACY_PRICING_VERSION} from "./pricing-schema.ts";

// Paise amounts are owned exclusively by the backend; client requests cannot override them.
export { PAYMENT_PACKAGES } from "./catalog.ts";
import { PAYMENT_PACKAGES } from "./catalog.ts";
const BACKEND_PACKAGES = { ...PAYMENT_PACKAGES, test: { name: "Test", advance: 100 } };
export type VerifiedTestAdmin = { id: string; email: string };
export type PaymentEnv = { PAYMENT_RECEIPT_SECRET?:string;PAYMENT_RECEIPT_PREVIOUS_SECRET?:string;SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; RAZORPAY_WEBHOOK_SECRET?: string; RAZORPAY_ENABLED?: string; RAZORPAY_KEY_ID?: string; RAZORPAY_KEY_SECRET?: string; PAYMENT_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> } };
export function paymentEnv(context: unknown): PaymentEnv {
  return (context as { env?: PaymentEnv })?.env ?? {};
}
function paymentBackendConfigured(env: PaymentEnv) {
  return /^rzp_(test|live)_[A-Za-z0-9]+$/.test(env.RAZORPAY_KEY_ID ?? "") && !!env.RAZORPAY_KEY_SECRET && !!env.SUPABASE_URL && !!env.SUPABASE_SERVICE_ROLE_KEY && !!env.RAZORPAY_WEBHOOK_SECRET;
}
export function paymentsEnabled(env: PaymentEnv) {
  return env.RAZORPAY_ENABLED === "true" && !!env.PAYMENT_RATE_LIMITER && paymentBackendConfigured(env);
}
class PaymentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const encoder = new TextEncoder();
async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
async function sign(value: string, secret: string) {
  const digest = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
async function verify(value: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/.test(signature)) return false;
  const bytes = new Uint8Array(signature.match(/../g)!.map(b => parseInt(b, 16)));
  return crypto.subtle.verify("HMAC", await hmacKey(secret), bytes, encoder.encode(value));
}
const claimsSchema = z.object({
  orderId: z.string().regex(/^order_[A-Za-z0-9]+$/),
  package: z.enum(["starter", "business", "test"]),
  amount: z.number().int().positive(),
  keyId: z.string(),
  issuedAt: z.number().int().positive(),
}).strict();
export async function createPaymentToken(claims: z.infer<typeof claimsSchema>, secret: string) {
  const payload = btoa(JSON.stringify(claims));
  return `${payload}.${await sign(`sitenova-payment-v1:${payload}`, secret)}`;
}
export async function readToken(token: string, env: PaymentEnv) {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !await verify(`sitenova-payment-v1:${payload}`, signature, env.RAZORPAY_KEY_SECRET!))
    throw new PaymentError("Invalid payment session. Please contact SiteNova.", 403);
  let claims;
  try { claims = claimsSchema.parse(JSON.parse(atob(payload))); }
  catch { throw new PaymentError("Invalid payment session", 403); }
  // A price edit must not invalidate an earlier signed order. trustedOrder still
  // compares its immutable ledger snapshot and fresh provider amount/currency.
  if (claims.keyId !== env.RAZORPAY_KEY_ID || (claims.package === "test" && claims.amount !== 100))
    throw new PaymentError("This checkout is no longer valid. Please contact SiteNova.", 403);
  return claims;
}
async function api(env: PaymentEnv, path: string, body?: unknown) {
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new PaymentError("Payment service is temporarily unavailable. Please retry or contact SiteNova.", 503);
  return response.json();
}
const orderSchema = z.object({ id: z.string(), amount: z.number(), currency: z.string(), status: z.string(), notes: z.object({ package: z.string() }) });
const paymentSchema = z.object({ id: z.string(), order_id: z.string(), amount: z.number(), currency: z.string(), status: z.string(), amount_refunded: z.number().default(0), error_reason: z.string().nullable().optional() });
async function trustedOrder(env: PaymentEnv, claims: z.infer<typeof claimsSchema>, admin?: VerifiedTestAdmin) {
  const stored = await paymentStore(env).find(claims.orderId);
  if (!stored || stored.amount !== claims.amount || stored.package !== claims.package || stored.key_id !== claims.keyId) throw new PaymentError("Invalid stored payment session", 403);
  if (admin && stored.customer?.admin_id !== admin.id) throw new PaymentError("Invalid test payment owner", 403);
  const order = orderSchema.parse(await api(env, `orders/${claims.orderId}`));
  if (order.id !== claims.orderId || order.amount !== claims.amount || order.currency !== "INR" || order.notes.package !== claims.package)
    throw new PaymentError("Payment details do not match this order", 403);
  return { ...order, ledgerSettled: stored.status === "paid" || stored.status === "refunded", ledgerRetired: !!stored.retry_reserved_at, retryParent: stored.retry_parent };
}
function statusOf(payment: z.infer<typeof paymentSchema>, claims: z.infer<typeof claimsSchema>): PaymentStatus {
  if (payment.order_id !== claims.orderId || payment.amount !== claims.amount || payment.currency !== "INR")
    throw new PaymentError("Payment details do not match this order", 403);
  if (payment.amount_refunded > 0 || payment.status === "refunded")
    return { status: "refunded", paymentId: payment.id, refundedAmount: payment.amount_refunded };
  return payment.status === "captured" ? { status: "paid", paymentId: payment.id } : { status: "pending" };
}
export function paymentJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff" } });
}
export async function paymentAction(request: Request, context: unknown, action: "order" | "retry" | "verify" | "status" | "checkout", admin?: VerifiedTestAdmin) {
  if (request.method !== "POST") return paymentJson({ error: "Method not allowed" }, 405);
  if (request.headers.get("origin") !== new URL(request.url).origin) return paymentJson({ error: "Invalid origin" }, 403);
  const env = paymentEnv(context);
  const opening = action === "order" || action === "retry" || action === "checkout";
  // Live keys must never open checkout on an unregistered local/preview website.
  // Existing signed sessions may still reconcile there without collecting money.
  if (opening && env.RAZORPAY_KEY_ID?.startsWith("rzp_live_") && new URL(request.url).origin !== "https://sitenova.dev")
    return paymentJson({ error: "Live payments are available only on https://sitenova.dev. Use Test Mode keys for local testing." }, 403);
  if (!(admin || !opening ? paymentBackendConfigured(env) && !!env.PAYMENT_RATE_LIMITER : paymentsEnabled(env))) return paymentJson({ error: "Online payments are not available yet. Please contact SiteNova." }, 503);
  try {
    if (!env.PAYMENT_RATE_LIMITER) throw new PaymentError("Payment service is not configured yet", 503);
    const limit = await env.PAYMENT_RATE_LIMITER.limit({ key: `${action === "order" || action === "retry" ? "create" : "check"}:${request.headers.get("cf-connecting-ip") ?? "local"}` });
    if (!limit.success) return paymentJson({ error: "Too many payment requests. Please wait a minute and try again." }, 429);
    const raw = await request.text();
    if (raw.length > 6000) return paymentJson({ error: "Request too large" }, 413);
    let body = JSON.parse(raw);
    if (action === "order" || action === "retry") {
      let parent: PaymentRecord | null = null;
      if(action === "retry") {
        if(admin) throw new PaymentError("Invalid payment channel",403);
        const retry=z.object({token:z.string().max(3000),requestId:z.string().uuid()}).strict().parse(body);
        const claims=await readToken(retry.token,env);
        if(claims.package==="test") throw new PaymentError("Invalid payment channel",403);
        parent=await paymentStore(env).find(claims.orderId);
        if(!parent) throw new PaymentError("Invalid payment session",403);
        const store=paymentStore(env),run=await store.startRun("retry");
        let checked;
        try { checked=await fetchStoredPaymentStatus(env,parent); }
        catch {
          await store.recordReconciliation(run,parent,{status:"pending"},"Retry verification failed; owner review required.");
          await store.finishRun(run,1,1,"Retry verification failed; owner review required.");
          throw new PaymentError("Previous payment is uncertain. Reconciliation is required before paying again.",409);
        }
        await store.recordReconciliation(run,parent,checked,null);
        await store.finishRun(run,1,0,null);
        if(!["failed","expired"].includes(checked.status)) throw new PaymentError("Previous payment is not confirmed failed or expired. Check status before paying again.",409);
        body={...paymentDetailsSchema.parse(parent.customer),requestId:retry.requestId};
      }
      const input = admin ? z.object({ requestId: z.string().uuid() }).strict().parse(body) : (parent?paymentDetailsSchema:paymentBookingSchema).extend({ requestId: z.string().uuid(),pricingVersion:z.string().uuid().optional() }).parse(body);
      const { requestId } = input;
      const details = admin ? { package: "test" as const, name: "Test", email: admin.email, phone: "", business: "Test", accepted: true, admin_id: admin.id } : paymentDetailsSchema.parse(Object.fromEntries(Object.entries(input).filter(([key]) => !["requestId","pricingVersion"].includes(key))));
      const prices=admin||parent?null:await pricingStore(env).current();
      if(prices && ((input as {pricingVersion?:string}).pricingVersion??LEGACY_PRICING_VERSION)!==prices.version)throw new PaymentError("Package pricing changed. Reload this page to review the current advance before paying.",409);
      const pack = admin ? BACKEND_PACKAGES.test : parent ? {...BACKEND_PACKAGES[details.package],advance:parent.amount} : prices!.packages[details.package as "starter"|"business"];
      const store = paymentStore(env);
      const termsVersion=parent?(parent.terms_version??"2026-10-10"):admin?"2026-10-10":"2026-10-14";
      const reservation={ request_id: requestId, payload_hash: await sign(JSON.stringify(details), env.RAZORPAY_KEY_SECRET!), dedupe_hash: await sign(JSON.stringify([env.RAZORPAY_KEY_ID,details.package,details.email.toLowerCase(),details.phone,details.business.trim().toLowerCase(),...(parent ? [parent.request_id] : admin ? [admin.id,requestId] : [])]),env.RAZORPAY_KEY_SECRET!), package: details.package, amount: pack.advance, key_id: env.RAZORPAY_KEY_ID, customer: details, terms_version: termsVersion,...(prices?{pricing_version:prices.version}:{}) };
      const reserved = parent ? await store.reserveRetry(parent.request_id,reservation) : await store.reserve(reservation);
      if (!reserved.created) {
        const existing = reserved.record;
        if (!existing.order_id) throw new PaymentError("Payment request is being checked. Contact SiteNova before creating another checkout.", 409);
        return paymentJson({ orderId: existing.order_id, package: details.package, token: await createPaymentToken({ orderId: existing.order_id, package: details.package, amount: existing.amount, keyId: existing.key_id, issuedAt: Date.parse(existing.created_at) },env.RAZORPAY_KEY_SECRET!) });
      }
      const order = orderSchema.parse(await api(env, "orders", {
        amount: pack.advance, currency: "INR", receipt: requestId, partial_payment: false,
        notes: { package: details.package, service: pack.name, name: details.name, email: details.email, phone: details.phone, business: details.business, purpose: admin ? "Admin ₹1 integration test" : "Package advance credited toward the agreed project total", terms_version: termsVersion },
      }));
      if (!/^order_[A-Za-z0-9]+$/.test(order.id) || order.amount !== pack.advance || order.currency !== "INR" || order.notes.package !== details.package)
        throw new PaymentError("Unable to prepare checkout", 503);
      await store.attach(requestId, order.id);
      const claims = { orderId: order.id, package: details.package, amount: pack.advance, keyId: env.RAZORPAY_KEY_ID!, issuedAt: Date.parse(reserved.record.created_at) };
      const session = { orderId: order.id, package: details.package, token: await createPaymentToken(claims, env.RAZORPAY_KEY_SECRET!) };
      return paymentJson(session);
    }
    const input = z.object({ token: z.string().max(3000), razorpay_payment_id: z.string().regex(/^pay_[A-Za-z0-9]+$/).optional(), razorpay_order_id: z.string().optional(), razorpay_signature: z.string().optional() }).strict().parse(body);
    const claims = await readToken(input.token, env);
    if ((claims.package === "test") !== !!admin) throw new PaymentError("Invalid payment channel",403);
    // Verification remains possible after session age limits: money may settle after a browser closes.
    const order = await trustedOrder(env, claims, admin);
    if (action === "verify") {
      if (!input.razorpay_payment_id || input.razorpay_order_id !== order.id || !input.razorpay_signature || !await verify(`${order.id}|${input.razorpay_payment_id}`, input.razorpay_signature, env.RAZORPAY_KEY_SECRET!))
        throw new PaymentError("Payment verification failed. Please contact SiteNova before retrying.", 403);
      const payment = paymentSchema.parse(await api(env, `payments/${input.razorpay_payment_id}`));
      if (payment.id !== input.razorpay_payment_id) throw new PaymentError("Payment verification failed", 403);
      return paymentJson(await recordStatus(env, statusOf(payment, claims), order.id));
    }
    const collection = z.object({ items: z.array(paymentSchema) }).parse(await api(env, `orders/${order.id}/payments`));
    const settled = collection.items.find(p => p.status === "captured" || p.status === "refunded" || p.amount_refunded > 0);
    if (settled) return paymentJson(await recordStatus(env, statusOf(settled, claims), order.id));
    // A previous attempt may change after a retry was reserved. Check its whole
    // lineage again before releasing new checkout options, never during callbacks.
    if(action === "checkout" && order.retryParent) {
      const store=paymentStore(env),run=await store.startRun("retry");
      let parentId:string|null|undefined=order.retryParent,checked=0;
      const deadline=Date.now()+25000;
      try {
        while(parentId) {
          if(checked>=10 || Date.now()>deadline) throw new Error("Retry lineage needs owner review");
          const ancestor=await store.byRequest(parentId);
          if(!ancestor) throw new Error("Retry parent unavailable");
          const state=await fetchStoredPaymentStatus(env,ancestor);
          await store.recordReconciliation(run,ancestor,state,null);checked++;
          if(!["failed","expired"].includes(state.status)) throw new Error("Previous attempt no longer safe to retry");
          parentId=ancestor.retry_parent;
        }
        await store.finishRun(run,checked,0,null);
      } catch {
        await store.recordReconciliation(run,(await store.find(order.id))!,{status:"pending"},"Previous attempt changed or could not be verified. New checkout blocked.");
        await store.finishRun(run,checked,1,"Retry lineage requires owner review.");
        throw new PaymentError("An earlier payment needs reconciliation. This checkout is blocked; contact SiteNova before paying again.",409);
      }
    }
    const age = Date.now() - claims.issuedAt;
    // A failed attempt can be authorised later. Never reopen attempted orders,
    // even when the current payment list is empty or the issuer reports failure.
    const attempted = collection.items.length > 0 || order.status !== "created" || order.ledgerSettled || order.ledgerRetired;
    if (action === "checkout" && attempted)
      throw new PaymentError("This order already has a payment attempt. Check its status and contact SiteNova before paying again, even if Razorpay reports failure.", 409);
    const canPay = !attempted && age >= 0 && age < 24 * 60 * 60 * 1000;
    // Only the backend releases checkout options. Status responses never authorize payment.
    if (action === "checkout" && canPay) {
      return paymentJson({ status: "pending", checkout: { token: input.token, orderId: order.id, package: claims.package, amount: order.amount, keyId: env.RAZORPAY_KEY_ID!, testMode: env.RAZORPAY_KEY_ID!.startsWith("rzp_test_") } });
    }
    return paymentJson({ status: "pending" });
  } catch (error) {
    if (error instanceof PaymentConflictError) return paymentJson({error:error.message,code:"checkout_conflict"},409);
    if (error instanceof PaymentError) return paymentJson({ error: error.message }, error.status);
    if (error instanceof SyntaxError || error instanceof z.ZodError) return paymentJson({ error: "Invalid payment request. Check your details and try again." }, 400);
    return paymentJson({ error: "Unable to confirm payment right now. Check payment status before trying again." }, 503);
  }
}

async function recordStatus(env: PaymentEnv, status: PaymentStatus, orderId: string) {
  if (status.status !== "pending" && status.paymentId) await paymentStore(env).settle(orderId, status.paymentId, status.status, status.refundedAmount ?? 0);
  return status;
}
// Read-only provider reconciliation: this function cannot create/capture/refund payments.
export async function fetchStoredPaymentStatus(env: PaymentEnv, record: PaymentRecord): Promise<PaymentStatus | {status:"failed"|"expired"|"unattempted"}> {
  if (!record.order_id || record.key_id!==env.RAZORPAY_KEY_ID) throw new Error("Order requires owner reconciliation");
  const claims=claimsSchema.parse({orderId:record.order_id,amount:record.amount,package:record.package,keyId:record.key_id,issuedAt:Date.parse(record.created_at)});
  if(!Number.isSafeInteger(claims.amount)||claims.amount<100||claims.amount>100000000||(claims.package==="test"&&claims.amount!==100)) throw new Error("Invalid stored amount");
  const order=await trustedOrder(env,claims);
  const collection=z.object({items:z.array(paymentSchema)}).parse(await api(env,`orders/${record.order_id}/payments`));
  // Validate every payment before deciding what the order means.
  for(const payment of collection.items) statusOf(payment,claims);
  const settled=collection.items.find(p=>p.status==="captured"||p.status==="refunded"||p.amount_refunded>0);
  if(settled) return statusOf(settled,claims);
  if(order.ledgerSettled) throw new Error("Stored settlement requires owner review");
  // Technical failures and business mismatches can be late-authorized. Only
  // explicit customer/issuer declines permit another order, after a fresh GET.
  const declines=new Set(["incorrect_pin","incorrect_atm_pin","incorrect_otp","incorrect_cvv","insufficient_funds","incorrect_card_details","incorrect_card_expiry_date"]);
  if(collection.items.length && collection.items.every(p=>p.status==="failed" && declines.has(p.error_reason??""))) return {status:"failed"};
  // Razorpay Orders normally do not expire. Never infer expiry from browser age.
  if(order.status==="expired" && collection.items.length===0) return {status:"expired"};
  // A provider-confirmed untouched checkout is unpaid, not an uncertain debit.
  // This classification never authorizes a new order or changes checkout rules.
  if(order.status==="created" && collection.items.length===0) return {status:"unattempted"};
  return {status:"pending"};
}
export async function paymentWebhook(request: Request, context: unknown) {
  if (request.method !== "POST") return paymentJson({ error: "Method not allowed" },405);
  const env = paymentEnv(context);
  // Reconcile existing payments even when new checkout payments are switched off.
  if (!paymentBackendConfigured(env)) return paymentJson({ error: "Payments unavailable" },503);
  try {
    const raw = await request.text();
    if (raw.length > 100000) return paymentJson({ error: "Request too large" },413);
    if (!await verify(raw,request.headers.get("x-razorpay-signature") ?? "",env.RAZORPAY_WEBHOOK_SECRET!)) return paymentJson({ error: "Invalid signature" },403);
    const eventId=request.headers.get("x-razorpay-event-id") ?? "";
    if (!/^[A-Za-z0-9_-]{1,200}$/.test(eventId)) return paymentJson({error:"Missing or invalid event ID"},400);
    const store=paymentStore(env);
    if (await store.hasEvent(eventId)) return paymentJson({received:true,alreadyProcessed:true});
    const event = JSON.parse(raw);
    // Record-only branch: no provider mutations, settlement or ledger writes.
    // Preserve unknown dispute event names/payment references for owner review.
    if(typeof event.event==="string"&&event.event.startsWith("payment.dispute.")){
      const entity=event.payload?.dispute?.entity??{},payment=event.payload?.payment?.entity??{};
      const text=(value:unknown)=>typeof value==="string"?value.slice(0,200):null;
      const timestamp=(value:unknown)=>typeof value==="number"&&Number.isSafeInteger(value)&&value>0&&value<253402300800?new Date(value*1000).toISOString():null;
      const inserted=await store.recordDispute(eventId,event.event.slice(0,200),{
        id:text(entity.id)??eventId,event:event.event.slice(0,200),status:text(entity.status)??"unknown",
        paymentId:text(entity.payment_id)??text(payment.id),orderId:text(payment.order_id),
        amount:typeof entity.amount==="number"&&Number.isSafeInteger(entity.amount)&&entity.amount>=0?entity.amount:null,
        currency:text(entity.currency),responseDueAt:timestamp(entity.respond_by),occurredAt:timestamp(event.created_at),
      });
      return paymentJson({received:true,...(!inserted?{alreadyProcessed:true}:{})});
    }
    let orderId = event.payload?.payment?.entity?.order_id;
    const refundPaymentId = event.payload?.refund?.entity?.payment_id;
    if (!orderId && typeof refundPaymentId === "string" && /^pay_[A-Za-z0-9]+$/.test(refundPaymentId)) {
      const payment = paymentSchema.parse(await api(env, `payments/${refundPaymentId}`));
      if (payment.id !== refundPaymentId) throw new Error("Invalid refund payment");
      orderId = payment.order_id;
    }
    if (typeof orderId !== "string" || !/^order_[A-Za-z0-9]+$/.test(orderId)) {
      const unknownPayment=event.payload?.payment?.entity;
      if(typeof unknownPayment?.id==="string"&&/^pay_[A-Za-z0-9]+$/.test(unknownPayment.id)){
        const inserted=await recordUnknownPayment(env,eventId,event.event,null,unknownPayment);
        return paymentJson({received:true,...(!inserted?{alreadyProcessed:true}:{})});
      }
      const inserted=await store.completeWebhook(eventId,null,null,null);
      return paymentJson({received:true,...(!inserted?{alreadyProcessed:true}:{})});
    }
    const record = await store.find(orderId);
    if (!record || record.key_id !== env.RAZORPAY_KEY_ID) {
      const inserted=await recordUnknownPayment(env,eventId,event.event,orderId,event.payload?.payment?.entity??{id:refundPaymentId});
      return paymentJson({received:true,...(!inserted?{alreadyProcessed:true}:{})});
    }
    const claims = claimsSchema.parse({ orderId, amount: record.amount, package: record.package, keyId: record.key_id, issuedAt: Date.parse(record.created_at) });
    await trustedOrder(env,claims);
    // Current provider state plus monotonic database writes tolerate repeated/out-of-order events.
    const collection = z.object({ items: z.array(paymentSchema) }).parse(await api(env,`orders/${orderId}/payments`));
    const settled = collection.items.find(p => p.status === "captured" || p.status === "refunded" || p.amount_refunded > 0);
    const status=settled?statusOf(settled,claims):null;
    const inserted=await store.completeWebhook(eventId,orderId,status?.paymentId??null,status?.status??null,status?.refundedAmount??0);
    return paymentJson({ received: true,...(!inserted?{alreadyProcessed:true}:{}) });
  } catch { return paymentJson({ error: "Unable to store payment event" },503); }
}
async function recordUnknownPayment(env:PaymentEnv,eventId:string,eventType:unknown,orderId:string|null,payment:Record<string,unknown>){
 return operationsStore(env).recordInvestigation({kind:"unknown_payment",orderId,paymentId:typeof payment.id==="string"&&/^pay_[A-Za-z0-9]+$/.test(payment.id)?payment.id:null,amount:typeof payment.amount==="number"&&Number.isSafeInteger(payment.amount)&&payment.amount>=0?payment.amount:null,currency:typeof payment.currency==="string"?payment.currency.slice(0,20):null,status:typeof payment.status==="string"?payment.status.slice(0,200):null},eventId,typeof eventType==="string"?eventType.slice(0,200):"unknown");
}
