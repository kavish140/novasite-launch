import { useMemo } from "react";
import { format, subDays } from "date-fns";
import { Eye, MousePointerClick, Percent, Megaphone, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import type { AuditRequest, PageView } from "../AdminDashboard";

interface AnalyticsTabProps {
  pageViews: PageView[];
  allAdLeads: AuditRequest[];
  loading: boolean;
}

export default function AnalyticsTab({ pageViews, allAdLeads, loading }: AnalyticsTabProps) {
  const totalLPVisits = pageViews.length;
  const totalAdLeads = allAdLeads.length;
  const conversionRate =
    totalLPVisits > 0 ? ((totalAdLeads / totalLPVisits) * 100).toFixed(1) : "0.0";

  const visitChartData = useMemo(() => {
    const days = Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(new Date(), 29 - i);
      return { date: format(d, "MMM dd"), visits: 0, leads: 0 };
    });
    pageViews.forEach((pv) => {
      const pvDate = format(new Date(pv.created_at), "MMM dd");
      const day = days.find((d) => d.date === pvDate);
      if (day) day.visits += 1;
    });
    allAdLeads.forEach((lead) => {
      const leadDate = format(new Date(lead.created_at), "MMM dd");
      const day = days.find((d) => d.date === leadDate);
      if (day) day.leads += 1;
    });
    return days;
  }, [pageViews, allAdLeads]);

  const referrerData = useMemo(() => {
    const counts: Record<string, number> = {};
    pageViews.forEach((pv) => {
      let ref = pv.referrer || "Direct";
      try {
        const url = new URL(ref);
        ref = url.hostname.replace("www.", "");
      } catch {
        ref = ref.startsWith("http") ? ref : "Direct";
      }
      counts[ref] = (counts[ref] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({
        source,
        count,
        pct: ((count / totalLPVisits) * 100).toFixed(1),
      }));
  }, [pageViews, totalLPVisits]);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    borderColor: "hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
    fontSize: "12px",
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Info banner */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
          <TrendingUp className="w-4 h-4 flex-shrink-0" />
          <span>
            Showing visit and conversion data for <strong>/lp/web-design</strong> — your paid ads
            landing page.
          </span>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger}
      >
        <motion.div variants={item}>
          <KpiCard
            title="Total Visits"
            value={totalLPVisits}
            subtitle="All-time page views"
            icon={Eye}
            iconColor="text-primary"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Total Conversions"
            value={totalAdLeads}
            subtitle="Form submissions (ad leads)"
            icon={MousePointerClick}
            iconColor="text-emerald-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            subtitle="Visits → form submissions"
            icon={Percent}
            iconColor="text-accent"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Pending Follow-up"
            value={allAdLeads.filter((r) => r.status !== "completed").length}
            subtitle="Ad leads awaiting action"
            icon={Megaphone}
            iconColor="text-purple-500"
          />
        </motion.div>
      </motion.div>

      {/* Area chart: Visits & Conversions */}
      <motion.div variants={item}>
        <ChartCard
          title="Visits & Conversions — Last 30 Days"
          description="Daily page visits (blue) vs form submissions / conversions (green)."
        >
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Loading…
            </div>
          ) : totalLPVisits === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
              <Eye className="w-8 h-8 opacity-30" />
              <p>
                No visit data yet. Make sure the{" "}
                <code className="text-xs bg-secondary px-1 py-0.5 rounded">page_views</code> table
                exists in Supabase.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  tickFormatter={(v, i) => (i % 5 === 0 ? v : "")}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  dx={-10}
                />
                <RechartsTooltip
                  cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Visits"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#visitsGrad)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Conversions"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  fill="url(#leadsGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </motion.div>

      {/* Traffic Sources */}
      <motion.div variants={item}>
        <ChartCard
          title="Traffic Sources"
          description="Where your landing page visitors are coming from."
          contentClassName="p-6"
        >
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">Loading…</div>
          ) : referrerData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No referrer data yet.
            </div>
          ) : (
            <div className="space-y-3">
              {referrerData.map(({ source, count, pct }) => (
                <div key={source} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-muted-foreground truncate flex-shrink-0">
                    {source}
                  </div>
                  <div className="flex-1 h-2 bg-secondary/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-sm font-semibold w-10 text-right">{count}</div>
                  <div className="text-xs text-muted-foreground w-12 text-right">{pct}%</div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}
