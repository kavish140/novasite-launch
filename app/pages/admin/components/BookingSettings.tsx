import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabaseClient";
import { validBookingUrl } from "@/lib/booking";
import { Button } from "@/components/ui/button";
const schema = z
  .object({ enabled: z.boolean(), booking_url: z.string().trim() })
  .refine(
    (v) => (!v.enabled && !v.booking_url) || validBookingUrl(v.booking_url),
    {
      path: ["booking_url"],
      message:
        "Use the full https://calendar.google.com/calendar/appointments/schedules/… URL. Open short links first and copy their destination.",
    },
  );

export default function BookingSettings() {
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { enabled: false, booking_url: "" },
  });
  useEffect(() => {
    let active = true;
    supabase
      .from("booking_settings")
      .select("enabled,booking_url")
      .eq("id", true)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error)
          setMessage(
            "Booking settings could not load. Run the booking migration and check your admin access.",
          );
        else {
          reset(data);
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
  }, [reset]);
  return (
    <section className="glass-card p-6 space-y-4">
      <h2 className="font-heading font-semibold text-xl">
        Google Meet booking
      </h2>
      <p className="text-sm text-muted-foreground">
        Use a 15-minute Google Calendar appointment schedule titled “SiteNova
        Website Consultation”, with Google Meet conferencing. Configure
        availability in Google Calendar.
      </p>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setMessage("");
          const { data, error } = await supabase
            .from("booking_settings")
            .update(values)
            .eq("id", true)
            .select("id");
          if (error || !data?.length)
            setMessage(
              "Couldn't save booking settings. Check your admin access.",
            );
          else {
            setMessage("Booking settings saved.");
            window.dispatchEvent(new Event("booking-settings-changed"));
          }
        })}
      >
        <div>
          <label
            htmlFor="booking-url"
            className="block text-sm font-medium mb-2"
          >
            Full Google Calendar booking URL
          </label>
          <input
            id="booking-url"
            type="url"
            {...register("booking_url")}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm"
            placeholder="https://calendar.google.com/calendar/appointments/schedules/…"
          />
          {errors.booking_url && (
            <p role="alert" className="text-sm text-red-500 mt-2">
              {errors.booking_url.message}
            </p>
          )}
        </div>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" {...register("enabled")} />
          Show booking links on the website
        </label>
        <Button disabled={!loaded || isSubmitting} type="submit">
          {isSubmitting ? "Saving…" : "Save booking settings"}
        </Button>
      </form>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </section>
  );
}
