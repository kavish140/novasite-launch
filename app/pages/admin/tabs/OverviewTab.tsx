import { useMemo } from "react";
import { format, subDays } from "date-fns";
import {
  CalendarDays,
  Users,
  FileSignature,
  Clock,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  FileText,
  Bot,
  ListChecks,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import type { AuditRequest, BlogPost, QuoteRequest } from "../AdminDashboard";
import type { AdminTab } from "../components/AdminSidebar";
interface Props {
  upcomingCalls: number | null;
  requests: AuditRequest[];
  posts: BlogPost[];
  allAdLeads: AuditRequest[];
  quoteRequests: QuoteRequest[];
  aiDraftsPending: number;
  topicsInQueue: number;
  loading: boolean;
  onTabChange: (tab: AdminTab) => void;
}
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: 12,
  color: "hsl(var(--foreground))",
  fontSize: 12,
};
export default function OverviewTab({
  upcomingCalls,
  requests,
  posts,
  allAdLeads,
  quoteRequests,
  aiDraftsPending,
  topicsInQueue,
  loading,
  onTabChange,
}: Props) {
  const organic = requests.filter((r) => r.source !== "paid_ad");
  const pending = requests.filter((r) => r.status !== "completed");
  const newQuotes = quoteRequests.filter((r) => r.status === "new");
  const published = posts.filter((p) => p.status === "published").length;
  const total = requests.length + quoteRequests.length;
  const chartData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
        const sameDay = (r: { created_at: string }) =>
          format(new Date(r.created_at), "yyyy-MM-dd") === date;
        return {
          date: format(subDays(new Date(), 6 - i), "EEE"),
          audits: requests.filter(sameDay).length,
          quotes: quoteRequests.filter(sameDay).length,
        };
      }),
    [requests, quoteRequests],
  );
  const recent = useMemo(
    () =>
      [
        ...requests.map((r) => ({
          id: r.id,
          name: r.name,
          detail: r.source === "paid_ad" ? "Paid ad lead" : "Website audit",
          date: r.created_at,
          pending: r.status !== "completed",
          tab: (r.source === "paid_ad" ? "ad_leads" : "leads") as AdminTab,
        })),
        ...quoteRequests.map((r) => ({
          id: r.id,
          name: r.name,
          detail: r.business_name || r.project_type || "Quote request",
          date: r.created_at,
          pending: r.status === "new",
          tab: "quote_requests" as AdminTab,
        })),
      ]
        .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        .slice(0, 5),
    [requests, quoteRequests],
  );
  const sourceData = [
    { name: "Organic audits", value: organic.length, color: "#818cf8" },
    { name: "Paid ad leads", value: allAdLeads.length, color: "#2dd4bf" },
    { name: "Quote requests", value: quoteRequests.length, color: "#fbbf24" },
  ];
  const value = (n: number) => (loading ? "—" : n);
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <div
          className="absolute -right-12 -top-16 h-52 w-52 rounded-full border-[32px] border-primary/5"
          aria-hidden="true"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Your daily overview
            </span>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Good to have you back.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {loading
                ? "Loading your latest inquiries…"
                : pending.length + newQuotes.length > 0
                  ? `${pending.length + newQuotes.length} inquiries need your attention. Pick up the next conversation and keep things moving.`
                  : "Your inquiry queue is clear. Check your upcoming calls or plan your next article."}
            </p>
          </div>
          <Button
            onClick={() =>
              onTabChange(newQuotes.length ? "quote_requests" : "leads")
            }
            className="gap-2"
          >
            Review inquiries
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      <section
        aria-label="Workspace metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          title="Total inquiries"
          value={value(total)}
          subtitle="Audits and quote requests · all time"
          icon={Users}
          sparkData={chartData.map((d) => d.audits + d.quotes)}
        />
        <KpiCard
          title="New quote requests"
          value={value(newQuotes.length)}
          subtitle="Ready for your first response"
          icon={FileSignature}
          iconColor="text-amber-500"
        />
        <KpiCard
          title="Audits to follow up"
          value={value(pending.length)}
          subtitle="Organic and paid ad requests"
          icon={Clock}
          iconColor="text-teal-500"
        />
        <KpiCard
          title="Upcoming calls"
          value={upcomingCalls ?? "Unavailable"}
          subtitle="Confirmed Calendar appointments"
          icon={CalendarDays}
          iconColor="text-indigo-400"
        />
      </section>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <ChartCard
          title="Inquiry activity"
          description="New audits and quotes over the last 7 days."
          contentClassName="h-72 w-full pb-6 pr-6"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 12, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="adminAuditFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adminQuoteFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="hsl(var(--border))"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="audits"
                name="Audits"
                stroke="#818cf8"
                strokeWidth={2.5}
                fill="url(#adminAuditFill)"
              />
              <Area
                isAnimationActive={false}
                type="monotone"
                dataKey="quotes"
                name="Quotes"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fill="url(#adminQuoteFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <section className="admin-panel p-6">
          <h2 className="text-base font-semibold">Inquiry sources</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Where your conversations start.
          </p>
          <div className="relative h-44">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    isAnimationActive={false}
                    data={sourceData.filter((s) => s.value > 0)}
                    dataKey="value"
                    innerRadius={54}
                    outerRadius={72}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {sourceData
                      .filter((s) => s.value > 0)
                      .map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-[18px] border-muted" />
            )}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold tabular-nums">
                {value(total)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Inquiries
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {sourceData.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium tabular-nums">
                  {value(s.value)}
                </span>
                <span className="w-9 text-right text-muted-foreground">
                  {total ? Math.round((s.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className="admin-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border p-6">
            <div>
              <h2 className="font-semibold">Recent inquiries</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Your latest opportunities, all in one place.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange("quote_requests")}
              aria-label="View quote requests"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          {loading ? (
            <p className="p-8 text-sm text-muted-foreground" role="status">
              Loading inquiries…
            </p>
          ) : recent.length ? (
            <div className="divide-y divide-border">
              {recent.map((r) => (
                <button
                  key={`${r.tab}-${r.id}`}
                  onClick={() => onTabChange(r.tab)}
                  className="flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {r.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {r.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.detail}
                    </span>
                  </span>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    {format(new Date(r.date), "dd MMM")}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium">
                    {r.pending ? "Needs attention" : "In progress / resolved"}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 py-12 text-center">
              <Users className="mb-3 h-7 w-7 text-muted-foreground/50" />
              <p className="text-sm font-medium">
                Your next opportunity starts here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New audit and quote requests will appear in this list.
              </p>
            </div>
          )}
        </section>
        <section className="admin-panel p-6">
          <h2 className="font-semibold">Content studio</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Keep your publishing pipeline moving.
          </p>
          <div className="mt-5 space-y-2">
            {[
              {
                label: "Published articles",
                count: published,
                icon: FileText,
                tab: "blogs",
              },
              {
                label: "AI drafts to review",
                count: aiDraftsPending,
                icon: Bot,
                tab: "drafts",
              },
              {
                label: "Topics in the queue",
                count: topicsInQueue,
                icon: ListChecks,
                tab: "topics",
              },
            ].map(({ label, count, icon: Icon, tab }) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab as AdminTab)}
                className="flex w-full items-center gap-3 rounded-xl bg-muted/40 p-4 text-left hover:bg-muted"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="flex-1 text-xs">{label}</span>
                <span className="text-lg font-semibold tabular-nums">
                  {value(count)}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
            Publish and manage articles from Blog posts.
          </p>
        </section>
      </div>
    </div>
  );
}
