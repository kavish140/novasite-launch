import { useEffect, useRef, useState } from "react";
import { FlaskConical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { loadRazorpay, type CheckoutResult } from "@/lib/razorpay-client";
import type { PaymentStatus } from "@/lib/payments";
import { useToast } from "@/hooks/use-toast";
import PaymentReceiptLink from "@/components/PaymentReceiptLink";

type Session = { requestId: string; token?: string; orderId?: string; complete?: boolean };
type Authorization = PaymentStatus & { checkout?: { keyId: string; orderId: string; amount: number } };

export default function TestPaymentButton() {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [receiptSession,setReceiptSession]=useState("");
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      try {
        const stored = data.session && JSON.parse(sessionStorage.getItem(`sitenova-admin-test-${data.session.user.id}`) ?? "null");
        if (active) setHasSession(!!stored?.token);
      } catch { /* Stored sessions are validated again on explicit interaction. */ }
    });
    return () => { active = false; };
  }, []);

  async function run(checkOnly = false) {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    let opened = false;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) throw new Error("Sign in again before testing payments.");
      const sessionKey = `sitenova-admin-test-${data.session.user.id}`;
      async function request<T>(action: string, body: unknown): Promise<T> {
        const refreshed = await supabase.auth.getSession();
        if (!refreshed.data.session) throw new Error("Sign in again to check this payment.");
        const response = await fetch(`/api/admin/payments/${action}`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshed.data.session.access_token}` }, body: JSON.stringify(body), signal: AbortSignal.timeout(40000) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to check test payment.");
        return result as T;
      }
      let session: Session;
      try { session = JSON.parse(sessionStorage.getItem(sessionKey) ?? "null") ?? { requestId: crypto.randomUUID() }; }
      catch { throw new Error("Stored test session is invalid. Check Razorpay before starting another test."); }
      if (session.complete && !checkOnly) session = { requestId: crypto.randomUUID() };
      const save = () => { sessionStorage.setItem(sessionKey, JSON.stringify(session)); setHasSession(!!session.token); };
      const report = (status: PaymentStatus) => {
        if(status.status!=="pending"&&session.token)setReceiptSession(session.token);
        if (status.status !== "pending") { session.complete = true; save(); }
        toast({ title: status.status === "paid" ? "₹1 Test payment verified" : status.status === "refunded" ? "Test payment refunded" : "Payment is pending", description: status.status === "pending" ? "Check status before starting another payment." : status.paymentId });
      };
      save(); // Persist the retry ID before creating an order; uncertain requests reuse it.
      if (checkOnly) {
        if (!session.token) throw new Error("No test payment to check in this browser session.");
        report(await request<PaymentStatus>("status", { token: session.token }));
        return;
      }
      await loadRazorpay();
      if (!session.token) {
        const created = await request<{ token: string; orderId: string }>("order", { requestId: session.requestId });
        session.token = created.token; session.orderId = created.orderId; save();
      }
      const authorization = await request<Authorization>("checkout", { token: session.token });
      if (!authorization.checkout) { report(authorization); return; }
      const checkout = authorization.checkout;
      if (checkout.amount !== 100 || checkout.orderId !== session.orderId) throw new Error("Unexpected test checkout details. Payment stopped.");
      const finish = () => { lock.current = false; setBusy(false); };
      const verify = async (result: CheckoutResult) => {
        try { report(await request<PaymentStatus>("verify", { token: session.token, ...result })); }
        catch (error) { toast({ title: "Check test payment status", description: error instanceof Error ? error.message : "Verification unavailable", variant: "destructive" }); }
        finally { finish(); }
      };
      const razorpay = new window.Razorpay!({ key: checkout.keyId, order_id: checkout.orderId, amount: checkout.amount, currency: "INR", name: "SiteNova", description: "Test", retry: { enabled: false }, handler: verify, modal: { ondismiss: () => { finish(); toast({ title: "Checkout closed", description: "Your test order is saved. Check status before continuing; reconcile any debit before paying again." }); } }, theme: { color: "#2563eb" } });
      razorpay.on("payment.failed", () => toast({ title: "Test payment needs checking", description: "Razorpay reported failure. Your order is saved; check status and reconcile any debit before paying again.", variant: "destructive" }));
      razorpay.open(); opened = true;
    } catch (error) {
      toast({ title: "Test payment unavailable", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    } finally { if (!opened) { lock.current = false; setBusy(false); } }
  }
  return <div className="flex items-center gap-1">
    <Button variant="outline" size="sm" onClick={() => run()} disabled={busy} title="Opens Razorpay for service Test. Live keys charge a real ₹1.">
      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-2 h-4 w-4" />}Test ₹1 payment
    </Button>
    {hasSession && <Button variant="ghost" size="sm" disabled={busy} onClick={() => run(true)}>Check status</Button>}
    {receiptSession&&<PaymentReceiptLink token={receiptSession} admin/>}
  </div>;
}
