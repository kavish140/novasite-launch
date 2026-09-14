import { useMemo } from "react";
import { subDays, format } from "date-fns";
import { Users, Clock, Megaphone, CheckCircle2, FileText } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import KpiCard from "../components/KpiCard";
import ChartCard from "../components/ChartCard";
import type { AuditRequest, BlogPost } from "../AdminDashboard";

interface OverviewTabProps {
  requests: AuditRequest[];
  posts: BlogPost[];
  allAdLeads: AuditRequest[];
}

export default function OverviewTab({ requests, posts, allAdLeads }: OverviewTabProps) {
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

  const pendingCount = requests.filter(
    (r) => r.status !== "completed" && r.source !== "paid_ad"
  ).length;
  const completedCount = requests.filter((r) => r.status === "completed").length;
  const pendingAdLeads = allAdLeads.filter((r) => r.status !== "completed").length;

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
      {/* KPI Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
        variants={stagger}
      >
        <motion.div variants={item}>
          <KpiCard
            title="Total Leads"
            value={requests.length}
            subtitle="All-time requests"
            icon={Users}
            iconColor="text-primary"
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
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Completed"
            value={completedCount}
            subtitle="Successfully closed"
            icon={CheckCircle2}
            iconColor="text-emerald-500"
          />
        </motion.div>
        <motion.div variants={item}>
          <KpiCard
            title="Published Blogs"
            value={posts.length}
            subtitle="Active content pieces"
            icon={FileText}
            iconColor="text-blue-500"
          />
        </motion.div>
      </motion.div>

      {/* Chart */}
      <motion.div variants={item}>
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
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.4}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
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
              <Bar
                dataKey="leads"
                name="Leads"
                fill="url(#leadBarGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}
