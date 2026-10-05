import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sparkline from "./Sparkline";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
  // Phase 4 additions
  sparkData?: number[];         // 7-day array for the mini sparkline
  trend?: number;               // % change vs previous period, e.g. 12 or -5
  sparkColor?: string;          // override sparkline color
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  accentColor = "",
  sparkData,
  trend,
  sparkColor,
}: KpiCardProps) {
  const hasTrend = trend !== undefined && trend !== null;
  const trendUp = (trend ?? 0) > 0;
  const trendFlat = (trend ?? 0) === 0;
  const trendLabel = hasTrend
    ? `${trendUp ? "+" : ""}${Math.round(trend!)}% vs last 7d`
    : undefined;

  return (
    <Card
      className={cn("admin-panel h-full", accentColor)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg bg-muted/60", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-end justify-between">
          <div className="text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
          {sparkData && (
            <Sparkline
              data={sparkData}
              height={32}
              width={72}
              color={sparkColor ?? "hsl(var(--primary))"}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 min-h-[16px]">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {hasTrend && (
            <span
              className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                trendFlat
                  ? "bg-muted/40 text-muted-foreground"
                  : trendUp
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {trendFlat ? (
                <Minus className="w-2.5 h-2.5" />
              ) : trendUp ? (
                <TrendingUp className="w-2.5 h-2.5" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" />
              )}
              {trendLabel}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
