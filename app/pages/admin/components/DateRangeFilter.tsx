import { useState } from "react";
import { subDays, startOfDay, isWithinInterval, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

export type DateRangePreset = "all" | "today" | "7d" | "30d" | "90d" | "custom";

interface DateRangeFilterProps {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset, range?: DateRange) => void;
  customRange?: DateRange;
}

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

export function filterByDateRange<T extends { created_at: string }>(
  items: T[],
  preset: DateRangePreset,
  customRange?: DateRange
): T[] {
  if (preset === "all") return items;

  const now = new Date();
  let from: Date;
  let to: Date = now;

  if (preset === "custom" && customRange?.from) {
    from = startOfDay(customRange.from);
    to = customRange.to ? customRange.to : now;
  } else {
    const daysMap: Record<string, number> = { today: 0, "7d": 6, "30d": 29, "90d": 89 };
    from = startOfDay(subDays(now, daysMap[preset] ?? 0));
  }

  return items.filter((item) => {
    const d = parseISO(item.created_at);
    return isWithinInterval(d, { start: from, end: to });
  });
}

export default function DateRangeFilter({ value, onChange, customRange }: DateRangeFilterProps) {
  const [calOpen, setCalOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PRESETS.map((preset) => (
        <Button
          key={preset.value}
          size="sm"
          variant={value === preset.value ? "default" : "outline"}
          className={`h-7 px-2.5 text-xs ${
            value === preset.value ? "" : "border-border/40 text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onChange(preset.value)}
        >
          {preset.label}
        </Button>
      ))}

      {/* Custom date range picker */}
      <Popover open={calOpen} onOpenChange={setCalOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant={value === "custom" ? "default" : "outline"}
            className={`h-7 px-2.5 text-xs gap-1.5 ${
              value === "custom" ? "" : "border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarIcon className="w-3 h-3" />
            Custom
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-card border-border/60"
          align="start"
        >
          <Calendar
            mode="range"
            selected={customRange}
            onSelect={(range) => {
              onChange("custom", range ?? undefined);
              if (range?.from && range?.to) setCalOpen(false);
            }}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
