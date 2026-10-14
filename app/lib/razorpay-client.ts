import type { PaymentSession } from "./payments";
export type CheckoutResult = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type Options = {
  key: string; order_id: string; amount: number; currency: "INR"; name: string; description: string;
  prefill?: { name: string; email: string; contact: string };
  handler: (result: CheckoutResult) => void;
  retry?: { enabled: boolean };
  modal: { ondismiss: () => void }; theme: { color: string };
};
type Checkout = { open(): void; on(event: "payment.failed", handler: () => void): void };
declare global { interface Window { Razorpay?: new (options: Options) => Checkout } }
let scriptPromise: Promise<void> | undefined;
export async function loadRazorpay() {
  if (window.Razorpay) return;
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      const timeout = window.setTimeout(() => fail(), 15000);
      const fail = () => { window.clearTimeout(timeout); script.remove(); scriptPromise = undefined; reject(new Error("Checkout could not load. Please try again.")); };
      script.onerror = fail;
      script.onload = () => { window.clearTimeout(timeout); if (window.Razorpay) resolve(); else fail(); };
      document.head.appendChild(script);
    });
  }
  await scriptPromise;
}
export async function paymentRequest<T>(action: "order" | "retry" | "status" | "verify" | "checkout", body: unknown): Promise<T> {
  if(action==="retry") {
    const input=body as {token:string;orderId:string};
    const key=`sitenova-payment-retry-${input.orderId}`;
    let requestId=readRecoveryValue(key);
    if(!requestId){requestId=crypto.randomUUID();}
    writeRecoveryValue(key,requestId);
    body={token:input.token,requestId};
  }
  if (action === "order") {
    const details = body as Record<string, unknown>;
    const storageKey = `sitenova-payment-request-${details.package}`;
    let requestId = readRecoveryValue(storageKey);
    if (!requestId) requestId = crypto.randomUUID();
    // Save before POST so a tab closing during the response cannot lose the UUID.
    writeRecoveryValue(storageKey,requestId);
    body = { ...details, requestId };
  }
  const response = await fetch(`/api/payments/${action}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    signal: AbortSignal.timeout(40000),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to check payment. Please contact SiteNova.");
  return result as T;
}
export function restorePayment(packageId: string): PaymentSession | null {
  try {
    const session = JSON.parse(readRecoveryValue(`sitenova-payment-${packageId}`) ?? "null");
    return session?.package === packageId && typeof session.token === "string" && session.token.length<=4096 && typeof session.orderId === "string" && /^order_[A-Za-z0-9]+$/.test(session.orderId) ? {package:session.package,token:session.token,orderId:session.orderId} : null;
  } catch { return null; }
}
export function savePayment(session: PaymentSession) {
  writeRecoveryValue(`sitenova-payment-${session.package}`,JSON.stringify({package:session.package,orderId:session.orderId,token:session.token}));
}
function readRecoveryValue(key:string):string|null{
  try{const value=sessionStorage.getItem(key);if(value)return value;}catch{/* Fall back to durable recovery. */}
  try{return localStorage.getItem(key);}catch{return null;}
}
function writeRecoveryValue(key:string,value:string){
  try{localStorage.setItem(key,value);}catch{/* Do not discard the current session. */}
  try{sessionStorage.setItem(key,value);}catch{/* In-memory checkout remains available. */}
}
// Owner-shared recovery capabilities use fragments, never query parameters.
// Reading claims here gives routing information only; the server verifies HMAC/state.
export function restoreSharedPayment(packageId:string):PaymentSession|null{
  try{const token=new URLSearchParams(window.location.hash.slice(1)).get("resume");if(!token||token.length>4096)return null;const [payload,signature,...rest]=token.split(".");if(rest.length||!/^[a-f0-9]{64}$/.test(signature))return null;const claims=JSON.parse(atob(payload));if(claims.package!==packageId||!/^order_[A-Za-z0-9]+$/.test(claims.orderId))return null;return {token,orderId:claims.orderId,package:claims.package};}catch{return null;}
}
