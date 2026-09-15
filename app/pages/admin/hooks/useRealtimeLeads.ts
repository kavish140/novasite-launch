import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { AuditRequest, QuoteRequest, AdsInquiry } from "../AdminDashboard";

const WEB3FORMS_KEY = "671591b9-2925-44ba-ba00-12e0e092bb34";
const ADMIN_EMAIL = "kavishganatra5@gmail.com";

async function sendLeadEmail(subject: string, body: string) {
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: "SiteNova Admin Alerts",
        email: ADMIN_EMAIL,
        message: body,
      }),
    });
  } catch (e) {
    console.warn("[Realtime] Web3Forms notification failed:", e);
  }
}

interface UseRealtimeLeadsOptions {
  onNewAuditRequest: (record: AuditRequest) => void;
  onNewQuoteRequest: (record: QuoteRequest) => void;
  onNewAdsInquiry: (record: AdsInquiry) => void;
}

export function useRealtimeLeads({
  onNewAuditRequest,
  onNewQuoteRequest,
  onNewAdsInquiry,
}: UseRealtimeLeadsOptions) {
  // Store callbacks in a ref so the effect never needs to re-run when they change
  const cb = useRef({ onNewAuditRequest, onNewQuoteRequest, onNewAdsInquiry });
  cb.current = { onNewAuditRequest, onNewQuoteRequest, onNewAdsInquiry };

  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime-leads")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_requests" },
        (payload) => {
          const r = payload.new as AuditRequest;
          cb.current.onNewAuditRequest(r);
          const label = r.source === "paid_ad" ? "Ad Lead" : "Audit Request";
          sendLeadEmail(
            `🔔 New ${label} from ${r.name}`,
            `New ${label} received on SiteNova:\n\nName: ${r.name}\nEmail: ${r.email}\nMobile: ${r.mobile || "—"}\nWebsite: ${r.website_url || "—"}\n\nLogin at https://sitenova.dev/admin to respond.`
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quote_requests" },
        (payload) => {
          const r = payload.new as QuoteRequest;
          cb.current.onNewQuoteRequest(r);
          sendLeadEmail(
            `🔔 New Quote Request from ${r.name}`,
            `New Quote Request on SiteNova:\n\nName: ${r.name}\nEmail: ${r.email}\nMobile: ${r.mobile || "—"}\nProject: ${r.project_type || "—"}\nBudget: ${r.budget || "—"}\nTimeline: ${r.timeline || "—"}\n\nLogin at https://sitenova.dev/admin to respond.`
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ads_inquiries" },
        (payload) => {
          const r = payload.new as AdsInquiry;
          cb.current.onNewAdsInquiry(r);
          sendLeadEmail(
            `🔔 New Ads Inquiry from ${r.name}`,
            `New Ads Inquiry on SiteNova:\n\nName: ${r.name}\nPhone: ${r.phone}\nBusiness: ${r.business_name}\nPlatform: ${r.platform}\nBudget: ${r.monthly_budget}\n\nLogin at https://sitenova.dev/admin to respond.`
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.info("[Realtime] Admin lead subscriptions active.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // stable — callbacks accessed via ref
}
