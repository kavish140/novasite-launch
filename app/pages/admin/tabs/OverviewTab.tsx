import { useMemo } from "react";
import { subDays, format } from "date-fns";
import { Users, Clock, Megaphone, CheckCircle2, FileText, Bot, ListChecks } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import type { AuditRequest, BlogPost } from "../AdminDashboard";

interface OverviewTabProps {
  requests: AuditRequest[];
  posts: BlogPost[];
  allAdLeads: AuditRequest[];
  aiDraftsPending: number;
  topicsInQueue: number;
}

// Helper: count items per day for the last 7 days → number[]
function buildSparkData(items: { created_at: string }[]): number[] {
  return Array.from({ length: 7 }).map((_, i) => {
    const day = format(subDays(new Date(), 6 - i), "MMM dd");
    return items.filter((r) => format(new Date(r.created_at), "MMM dd") === day).length;
  });
}

// Trend: compare last 7 days vs the 7 days before that
function calcTrend(items: { created_at: string }[]): number {
  const now = new Date();
  const last7 = items.filter((r) => {
    const d = new Date(r.created_at);
    return d >= subDays(now, 7);
  }).length;
  const prev7 = items.filter((r) => {
    const d = new Date(r.created_at);
    return d >= subDays(now, 14) && d < subDays(now, 7);
  }).length;
  if (prev7 === 0) return last7 > 0 ? 100 : 0;
  return Math.round(((last7 - prev7) / prev7) * 100);
}

const DONUT_COLORS = {
  organic: "hsl(var(--primary))",
  ad: "#a855f7",
  quote: "#3b82f6",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function OverviewTab({ requests, posts, allAdLeads, aiDraftsPending, topicsInQueue }: OverviewTabProps) {
  const organicLeads = useMemo(
    () => requests.filter((r) => r.source !== "paid_ad"),
    [requests]
  );

  const pendingCount = organicLeads.filter((r) => r.status !== "completed").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const pendingAdLeads = allAdLeads.filter((r) => r.status !== "completed").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;

  // Sparklines
  const allLeadsSpark = useMemo(() => buildSparkData(requests), [requests]);
  const pendingSpark = useMemo(() => buildSparkData(organicLeads.filter((r) => r.status !== "completed")), [organicLeads]);
  const adLeadsSpark = useMemo(() => buildSparkData(allAdLeads), [allAdLeads]);
  const completedSpark = useMemo(() => buildSparkData(requests.filter((r) => r.status === "completed")), [requests]);

  // Trends
  const allLeadsTrend = useMemo(() => calcTrend(requests), [requests]);
  const adLeadsTrend = useMemo(() => calcTrend(allAdLeads), [allAdLeads]);
  const completedTrend = useMemo(() => calcTrend(requests.filter((r) => r.status === "completed")), [requests]);

  // Bar chart
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { date: format(d, "MMM dd"), leads: 0 };
    });
    requests.forEach((req) => {
      const reqDate = format(new Date(req.created_at), "MMM dd");
      const day = days.find((d) => d.date === reqDate);
      if (day) day.leads += 1;
    });
    return days;
  }, [requests]);

  // Lead source donut
  const sourceData = useMemo(() => {
    const organic = requests.filter((r) => r.source !== "paid_ad").length;
    const ad = allAdLeads.length;
    return [
      { name: "Organic", value: organic, color: DONUT_COLORS.organic },
      { name: "Paid Ads", value: ad, color: DONUT_COLORS.ad },
    ].filter((d) => d.value > 0);
  }, [requests, allAdLeads]);

  return (
    <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="show">
      {/* KPI Grid */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-4" variants={stagger}>
        <motion.div variants={item}>
          <KpiCard
            title="Total Leads"
            value={requests.length}
            subtitle="All-time requests"
            icon={Users}
            iconColor="text-primary"
            sparkData={allLeadsSpark}
            trend={allLeadsTrend}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Pending Action"
            value={pendingCount}
            subtitle="Organic leads pending"
            icon={Clock}
            iconColor="text-amber-500"
            accentColor="border-amber-500/20"
            sparkData={pendingSpark}
            sparkColor="hsl(245 100% 70%)"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Ad Leads"
            value={allAdLeads.length}
            subtitle={`${pendingAdLeads} pending follow-up`}
            icon={Megaphone}
            iconColor="text-purple-500"
            accentColor="border-purple-500/20"
            sparkData={adLeadsSpark}
            sparkColor="#a855f7"
            trend={adLeadsTrend}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully closed"
            icon={CheckCircle2}
            iconColor="text-emerald-500"
            sparkData={completedSpark}
            sparkColor="#10b981"
            trend={completedTrend}
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Published Blogs"
            value={publishedPosts}
            subtitle="Live content pieces"
            icon={FileText}
            iconColor="text-blue-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="AI Drafts"
            value={aiDraftsPending}
            subtitle="Awaiting your review"
            icon={Bot}
            iconColor="text-violet-500"
            accentColor="border-violet-500/20"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Topics Queue"
            value={topicsInQueue}
            subtitle="Pending AI topics"
            icon={ListChecks}
            iconColor="text-cyan-500"
            accentColor="border-cyan-500/20"
          />
        </motion.div>
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart — spans 2/3 */}
        <motion.div variants={item} className="lg:col-span-2">
          <ChartCard
            title="Lead Generation — Last 7 Days"
            description="Number of audit requests received per day."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                <RechartsTooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "hsl(var(--primary))" }}
                />
                <Bar dataKey="leads" name="Leads" fill="url(#leadBarGradient)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Donut chart — lead sources */}
        {sourceData.length > 0 && (
          <motion.div variants={item}>
            <ChartCard title="Lead Sources" description="Breakdown by acquisition channel.">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="45%"
                    innerRadius="52%"
                    outerRadius="72%"
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "11px" }}>{value}</span>
                    )}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
