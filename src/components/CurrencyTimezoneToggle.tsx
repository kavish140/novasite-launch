import { useEffect, useMemo, useState } from "react";

type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

type GlobalPreference = {
  currency: CurrencyCode;
  timezone: string;
};

const STORAGE_KEY = "novasite-global-preferences";

const currencies: CurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

const timezones = [
  "Asia/Kolkata",
  "UTC",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Singapore",
];

const defaultPreferences: GlobalPreference = {
  currency: "INR",
  timezone: "Asia/Kolkata",
};

const safeJsonParse = (value: string | null): GlobalPreference | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as GlobalPreference;
    if (!parsed.currency || !parsed.timezone) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const CurrencyTimezoneToggle = () => {
  const [preferences, setPreferences] = useState<GlobalPreference>(defaultPreferences);

  useEffect(() => {
    const stored = safeJsonParse(localStorage.getItem(STORAGE_KEY));
    if (stored) {
      setPreferences(stored);
      return;
    }

    const resolvedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setPreferences((prev) => ({ ...prev, timezone: resolvedTimezone || prev.timezone }));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const preview = useMemo(() => {
    const money = new Intl.NumberFormat("en", {
      style: "currency",
      currency: preferences.currency,
      maximumFractionDigits: 0,
    }).format(1200);

    const time = new Intl.DateTimeFormat("en", {
      timeZone: preferences.timezone,
      timeStyle: "short",
      dateStyle: "medium",
    }).format(new Date());

    return { money, time };
  }, [preferences]);

  return (
    <aside aria-label="Global preferences" className="mx-auto mt-8 max-w-5xl rounded-xl border border-border/50 bg-card/70 p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Global-ready mode</p>
          <h2 className="font-heading text-lg font-semibold">Currency & timezone preview</h2>
          <p className="text-sm text-muted-foreground">Show international clients pricing and schedule context instantly.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Currency</span>
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              value={preferences.currency}
              onChange={(event) => {
                setPreferences((prev) => ({ ...prev, currency: event.target.value as CurrencyCode }));
              }}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-muted-foreground">Timezone</span>
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2"
              value={preferences.timezone}
              onChange={(event) => {
                setPreferences((prev) => ({ ...prev, timezone: event.target.value }));
              }}
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Estimation preview: <strong className="text-foreground">{preview.money}</strong> | Local time preview: <strong className="text-foreground">{preview.time}</strong>
      </p>
    </aside>
  );
};

export default CurrencyTimezoneToggle;

