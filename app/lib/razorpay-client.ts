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
    let requestId=sessionStorage.getItem(key);
    if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId);}
    body={token:input.token,requestId};
  }
  if (action === "order") {
    const details = body as Record<string, unknown>;
    const storageKey = `sitenova-payment-request-${details.package}`;
    let requestId = sessionStorage.getItem(storageKey);
    if (!requestId) { requestId = crypto.randomUUID(); sessionStorage.setItem(storageKey,requestId); }
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
    const session = JSON.parse(sessionStorage.getItem(`sitenova-payment-${packageId}`) ?? "null");
    return session?.package === packageId && typeof session.token === "string" && typeof session.orderId === "string" ? session : null;
  } catch { return null; }
}
export function savePayment(session: PaymentSession) {
  try { sessionStorage.setItem(`sitenova-payment-${session.package}`, JSON.stringify(session)); } catch { /* In-memory session still works. */ }
}
