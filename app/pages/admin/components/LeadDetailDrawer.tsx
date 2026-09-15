import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StickyNote, Send, Clock, Loader2, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import QuickActions from "./QuickActions";
import StatusBadge from "./StatusBadge";
import type { AuditRequest, QuoteRequest, AdsInquiry } from "../AdminDashboard";

// ── Types ──────────────────────────────────────────────────────────────────
export type LeadNote = {
  id: string;
  lead_type: string;
  lead_id: string;
  note: string;
  created_at: string;
};

export type DrawerLead =
  | { type: "audit_request"; lead: AuditRequest }
  | { type: "quote_request"; lead: QuoteRequest }
  | { type: "ad_inquiry";    lead: AdsInquiry };

interface LeadDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrawerLead | null;
}

// ── Helper: labelled field ─────────────────────────────────────────────────
function Field({
  label, value, span = false,
}: { label: string; value: React.ReactNode; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <div className="text-sm font-medium text-foreground/90 leading-snug">
        {value || <span className="text-muted-foreground/50">—</span>}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function LeadDetailDrawer({ open, onOpenChange, data }: LeadDetailDrawerProps) {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [noteText, setNoteText] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const leadId = data?.lead.id;

  useEffect(() => {
    if (!open || !data || !leadId) return;
    setNoteText("");
    fetchNotes(leadId, data.type);
  }, [open, leadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotes = async (id: string, type: string) => {
    setLoadingNotes(true);
    const { data: rows } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", id)
      .eq("lead_type", type)
      .order("created_at", { ascending: false });
    setNotes(rows ?? []);
    setLoadingNotes(false);
  };

  const handleAddNote = async () => {
    if (!data || !noteText.trim()) return;
    setSavingNote(true);
    const { data: newNote, error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: data.lead.id, lead_type: data.type, note: noteText.trim() })
      .select()
      .single();
    if (!error && newNote) {
      setNotes((prev) => [newNote as LeadNote, ...prev]);
      setNoteText("");
    }
    setSavingNote(false);
  };

  if (!data) return null;

  const { lead, type } = data;

  // Derive contact info for QuickActions
  const phone = type === "ad_inquiry"
    ? (lead as AdsInquiry).phone
    : (lead as AuditRequest | QuoteRequest).mobile ?? "";
  const email = type !== "ad_inquiry"
    ? (lead as AuditRequest | QuoteRequest).email
    : undefined;

  const typeLabel =
    type === "audit_request" ? "Audit Request"
    : type === "quote_request" ? "Quote Request"
    : "Ad Inquiry";

  // ── Render lead-type-specific fields ──────────────────────────────────────
  const renderFields = () => {
    if (type === "audit_request") {
      const r = lead as AuditRequest;
      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Email" value={r.email} />
          <Field label="Mobile" value={r.mobile} />
          <Field label="Website" value={
            r.website_url
              ? <a href={r.website_url.startsWith("http") ? r.website_url : `https://${r.website_url}`}
                   target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:underline text-sm">{r.website_url}</a>
              : null
          } />
          <Field label="Source" value={
            <Badge variant="outline" className="text-xs">
              {r.source === "paid_ad" ? "Paid Ad" : "Organic"}
            </Badge>
          } />
          <Field label="Status" value={<StatusBadge status={r.status} />} />
          <Field label="Received" value={format(new Date(r.created_at), "MMM d, yyyy h:mm a")} />
        </div>
      );
    }

    if (type === "quote_request") {
      const r = lead as QuoteRequest;
      return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Email" value={r.email} />
          <Field label="Mobile" value={r.mobile} />
          <Field label="Project Type" value={r.project_type} />
          <Field label="Budget" value={r.budget} />
          <Field label="Timeline" value={r.timeline} />
          <Field label="Status" value={<StatusBadge status={`quote_${r.status}`} />} />
          {r.requirements && (
            <Field label="Requirements" value={
              <span className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-xs">{r.requirements}</span>
            } span />
          )}
          <Field label="Received" value={format(new Date(r.created_at), "MMM d, yyyy h:mm a")} />
        </div>
      );
    }

    // ad_inquiry
    const r = lead as AdsInquiry;
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Phone" value={r.phone} />
        <Field label="Business" value={r.business_name} />
        <Field label="Platform" value={
          <Badge variant="secondary" className="capitalize text-xs">{r.platform.replace("_", " ")}</Badge>
        } />
        <Field label="Monthly Budget" value={r.monthly_budget} />
        <Field label="Industry" value={r.industry} />
        <Field label="Status" value={<StatusBadge status={r.status} />} />
        {r.goals && (
          <Field label="Goals" value={
            <span className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-xs">{r.goals}</span>
          } span />
        )}
        <Field label="Received" value={format(new Date(r.created_at), "MMM d, yyyy h:mm a")} />
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border/60 flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/30 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base leading-tight">{lead.name}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">{typeLabel}</SheetDescription>
              </div>
            </div>
            <QuickActions name={lead.name} phone={phone} email={email} />
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 py-5 space-y-6">
            {/* Details */}
            <section className="space-y-3">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Details</h4>
              <div className="bg-background/40 rounded-xl p-4 border border-border/30">
                {renderFields()}
              </div>
            </section>

            <Separator className="bg-border/30" />

            {/* Add note */}
            <section className="space-y-3">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" /> Notes
              </h4>
              <Textarea
                placeholder="Add a follow-up note… (Ctrl+Enter to save)"
                className="bg-background/50 border-border/40 text-sm resize-none"
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleAddNote();
                }}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  className="gap-2 h-8 text-xs"
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || savingNote}
                >
                  {savingNote
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Send className="w-3.5 h-3.5" />}
                  Add Note
                </Button>
              </div>
            </section>

            {/* Notes timeline */}
            <section>
              {loadingNotes ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground text-sm gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading notes…
                </div>
              ) : notes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No notes yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className="bg-background/30 rounded-xl p-3.5 border border-border/20 space-y-1.5"
                    >
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {n.note}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(n.created_at), "MMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
