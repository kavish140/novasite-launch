import PaymentReceiptLink from "@/components/PaymentReceiptLink";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, LockKeyhole, Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_NAME, EMAIL, PHONE_TEL_LINK, PHONE_NUMBER } from "@/lib/constants";
import { paymentDetailsSchema, formatINR, type PackageCatalog, type CheckoutAuthorization, type PaymentDetails, type PaymentPackage, type PaymentSession, type PaymentStatus } from "@/lib/payments";
import { loadRazorpay, paymentRequest, restorePayment, savePayment } from "@/lib/razorpay-client";

export default function Pay() {
  const { enabled, testMode, packages } = useLoaderData<{ enabled: boolean; testMode: boolean; packages: PackageCatalog }>();
  const [params] = useSearchParams();
  const selected = params.get("package");
  const packageId: PaymentPackage | null = selected === "starter" || selected === "business" ? selected : null;
  const pack = packageId ? packages[packageId] : null;
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const form = useForm<PaymentDetails>({ resolver: zodResolver(paymentDetailsSchema), defaultValues: { package: packageId ?? "starter", name: "", email: "", phone: "", business: "" } });

  useEffect(() => {
    if (!packageId || !enabled) return;
    let cancelled = false;
    const stored = restorePayment(packageId);
    setSession(stored); setStatus(null); setNotice(""); setError("");
    form.setValue("package", packageId);
    if (stored) {
      setBusy(true);
      paymentRequest<PaymentStatus>("status", { token: stored.token })
        .then(result => { if (!cancelled) setStatus(result); })
        .catch(() => { if (!cancelled) setError("We couldn't check your earlier payment. Check its status before paying again."); })
        .finally(() => { if (!cancelled) setBusy(false); });
    }
    return () => { cancelled = true; };
  }, [packageId, enabled, form]);

  async function refresh() {
    if (!session) return;
    setBusy(true); setError(""); setNotice("");
    try { const result = await paymentRequest<PaymentStatus>("status", { token: session.token }); setStatus(result); if (result.status === "pending") setNotice("Payment is not confirmed yet. If your account was debited, please contact us before paying again."); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to check payment"); }
    finally { setBusy(false); }
  }
  async function retry() {
    if(!session || busy || !enabled) return;
    setBusy(true);setError("");setNotice("");
    try {
      const next=await paymentRequest<PaymentSession>("retry",{token:session.token,orderId:session.orderId});
      savePayment(next);setSession(next);setStatus(null);
      setNotice("Your previous attempt was confirmed failed. A new checkout is ready; choose Continue checkout.");
    } catch(e){setError(e instanceof Error?e.message:"Unable to verify the previous payment.");}
    finally{setBusy(false);}
  }
  async function openCheckout(details?: PaymentDetails) {
    if (!pack || !packageId || !enabled || busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      let current = session;
      if (!current) {
        if (!details) throw new Error("Please enter your project details first.");
        current = await paymentRequest<PaymentSession>("order", details);
        savePayment(current); setSession(current);
      }
      const result = await paymentRequest<CheckoutAuthorization>("checkout", { token: current.token });
      setStatus(result);
      if (!result.checkout) {
        setBusy(false);
        if (result.status === "pending") setNotice("This payment is processing or the checkout session has expired. Contact us before starting another payment.");
        return;
      }
      await loadRazorpay();
      const active = result.checkout;
      let completing = false;
      const checkout = new window.Razorpay!({
        key: active.keyId, order_id: active.orderId, amount: active.amount, currency: "INR", name: SITE_NAME,
        description: `${pack.name} website — project advance`,
        retry: { enabled: false },
        prefill: details ? { name: details.name, email: details.email, contact: `+91${details.phone}` } : undefined,
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => { if (!completing) { setBusy(false); setNotice("Checkout closed. Check payment status before continuing. If your account was debited, contact us before paying again."); } } },
        handler: async response => {
          completing = true; setNotice("Confirming your payment…");
          try {
            const verified = await paymentRequest<PaymentStatus>("verify", { token: active.token, ...response });
            setStatus(verified);
            setNotice(verified.status === "pending" ? "Your payment is processing. Check its status before paying again." : "");
          } catch { setError("We couldn't confirm your payment. If you were debited, please check payment status or contact us. Don't start another payment."); }
          finally { setBusy(false); }
        },
      });
      checkout.on("payment.failed", () => { setNotice("Razorpay reported a failed attempt. Your order is saved. Check payment status and contact us before paying again, especially if your account was debited."); });
      checkout.open();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to open checkout"); setBusy(false); }
  }

  return <div className="min-h-screen bg-background text-foreground px-5 py-8 sm:py-14">
    <div className="mx-auto max-w-xl">
      <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft size={16} /> Back to pricing</Link>
      <div className="glass-card p-6 sm:p-9">
        <p className="text-primary font-semibold mb-2">{SITE_NAME}</p>
        <h1 className="font-heading text-3xl font-bold mb-3">Pay your project advance</h1>
        <p className="text-muted-foreground mb-6">Reserve the next step for your website project.</p>
        {testMode && enabled && <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm mb-5">Test checkout — no real money is collected. This does not confirm a paid project.</p>}
        {!pack ? <div className="space-y-3"><p className="text-muted-foreground">Choose your package to see its advance.</p>{Object.entries(packages).map(([id, item]) => <Link reloadDocument key={id} to={`/pay?package=${id}`} className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-secondary"><span>{item.name}</span><span>{formatINR(item.advance)} advance</span></Link>)}</div> : <>
          <div className="rounded-2xl border border-border bg-secondary/30 p-5 mb-5">
            <h2 className="font-semibold text-lg">{pack.name} website</h2><p className="text-sm text-muted-foreground mb-4">{pack.description}</p>
            <div className="flex flex-wrap justify-between gap-3 items-end"><span className="text-sm text-muted-foreground">Advance due now</span><strong className="font-heading text-3xl">{formatINR(pack.advance)}</strong></div>
            <p className="text-sm text-muted-foreground mt-3">50% of the {formatINR(pack.startingPrice)} starting price. This advance is credited against your final project invoice.</p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">The final price, scope and delivery schedule are agreed in your proposal. Additional requirements may cost more. Payment does not include domain, hosting or third-party costs unless included in your proposal.</p>
          {!enabled ? <div className="rounded-xl border border-border p-4"><h2 className="font-semibold mb-2">Online payments are coming soon</h2><p className="text-sm text-muted-foreground">Contact us to confirm your project and arrange the next steps.</p></div> : status?.status === "paid" ? <div role="status" className="rounded-xl border border-primary/30 p-5"><CheckCircle2 className="text-primary mb-3" /><h2 className="font-heading text-xl font-bold">{testMode ? "Test payment verified" : "Advance received"}</h2><p className="text-sm text-muted-foreground mt-2">{testMode ? "This was a simulated transaction." : "Thank you. Contact SiteNova with your payment reference to confirm your project scope and schedule."}</p><p className="break-all text-sm mt-3">Payment reference: {status.paymentId}</p>{session&&<PaymentReceiptLink token={session.token}/>}</div> : status?.status === "refunded" ? <div role="status" className="rounded-xl border border-border p-5"><h2 className="font-semibold">A refund has been recorded</h2><p className="text-sm text-muted-foreground mt-2">Refund amount: {formatINR(status.refundedAmount ?? 0)}. Contact us to confirm your project and refund details.</p><p className="break-all text-sm mt-3">Payment reference: {status.paymentId}</p>{session&&<PaymentReceiptLink token={session.token}/>}</div> : session ? <div className="space-y-3"><p className="text-sm text-muted-foreground break-all">Order reference: {session.orderId}</p><Button disabled={busy} className="w-full" onClick={() => openCheckout()}>{busy ? <Loader2 className="animate-spin mr-2" size={18} /> : <CreditCard className="mr-2" size={18} />}Continue checkout</Button><Button disabled={busy} variant="outline" className="w-full" onClick={refresh}>Check payment status</Button><Button disabled={busy} variant="outline" className="w-full" onClick={retry}>Check eligibility for a fresh checkout</Button></div> : <form onSubmit={form.handleSubmit(details => openCheckout(details))} className="space-y-4">
            {([ ["name", "Full name", "name"], ["business", "Business or project name", "organization"], ["email", "Email address", "email"], ["phone", "Mobile number", "tel-national"] ] as const).map(([field, label, autoComplete]) => <div key={field}><label htmlFor={`pay-${field}`} className="block text-sm font-medium mb-2">{label}</label><Input id={`pay-${field}`} autoComplete={autoComplete} type={field === "email" ? "email" : field === "phone" ? "tel" : "text"} inputMode={field === "phone" ? "numeric" : undefined} maxLength={field === "phone" ? 10 : field === "email" ? 254 : 100} {...form.register(field)} aria-invalid={!!form.formState.errors[field]} aria-describedby={form.formState.errors[field] ? `error-${field}` : undefined} />{form.formState.errors[field] && <p id={`error-${field}`} className="text-sm text-destructive mt-1">{form.formState.errors[field]?.message}</p>}</div>)}
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 shrink-0" {...form.register("accepted")} /><span>I understand this is a project advance and agree to the <Link className="text-primary underline" to="/terms-and-conditions" target="_blank" rel="noopener noreferrer">terms</Link>, <Link className="text-primary underline" to="/refund-policy" target="_blank" rel="noopener noreferrer">refund policy</Link> and <Link className="text-primary underline" to="/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</Link>.</span></label>
            {form.formState.errors.accepted && <p className="text-sm text-destructive">{form.formState.errors.accepted.message}</p>}
            <Button type="submit" disabled={busy} className="w-full">{busy ? <Loader2 size={18} className="animate-spin mr-2" /> : <LockKeyhole size={18} className="mr-2" />}Pay {formatINR(pack.advance)} advance</Button>
            <p className="text-xs text-muted-foreground">Razorpay handles payment details securely. Available payment methods appear in checkout.</p>
          </form>}
        </>}
        <div aria-live="polite" className="mt-4 space-y-2">{notice && <p className="text-sm text-muted-foreground">{notice}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>
        <div className="border-t border-border mt-7 pt-5 text-sm text-muted-foreground"><p className="font-medium text-foreground mb-2">Need help with a payment?</p><a href={`mailto:${EMAIL}`} className="text-primary underline break-all">{EMAIL}</a><span className="mx-2">·</span><a href={PHONE_TEL_LINK} className="text-primary underline">{PHONE_NUMBER}</a></div>
      </div>
      <nav aria-label="Payment policies" className="flex flex-wrap justify-center gap-5 text-xs text-muted-foreground mt-6"><Link to="/terms-and-conditions">Terms</Link><Link to="/refund-policy">Refunds & cancellation</Link><Link to="/delivery-policy">Digital delivery</Link><Link to="/privacy-policy">Privacy</Link></nav>
    </div>
  </div>;
}
