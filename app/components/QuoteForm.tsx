import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { quoteSchema } from "@/lib/quote";
import { submitQuote, captureAttribution } from "@/lib/quote-client";

const formSchema = quoteSchema.omit({
  submissionId: true,
  source: true,
  attribution: true,
});
type FormValues = z.input<typeof formSchema>;
const choices = [
  ["Landing Page", "From ₹10,000"],
  ["Business Website", "From ₹15,000"],
  ["E-commerce Store", "From ₹18,000"],
  ["Custom Web App", "From ₹30,000"],
  ["Website Redesign", "Quoted after review"],
] as const;
const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function QuoteForm({
  source = "website",
}: {
  source?: "website" | "paid_ad";
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const submission = useRef<{ body: string; id: string }>();
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      businessName: "",
      requirements: "",
      timeline: "Normal (2-4 weeks)",
    },
  });
  useEffect(() => {
    const state = location.state as {
      projectType?: string;
      requirements?: string;
      budget?: string;
      timeline?: string;
      estimateMin?: number;
      estimateMax?: number;
      addOns?: string[];
      packageName?: string;
    } | null;
    if (!state) return;
    const aliases: Record<string, FormValues["projectType"]> = {
      "Large Website": "Business Website",
      "E-Commerce Store": "E-commerce Store",
      Ecommerce: "E-commerce Store",
      "Web Application": "Custom Web App",
      "Web App": "Custom Web App",
    };
    const type = aliases[state.projectType || ""] || state.projectType;
    if (choices.some(([id]) => id === type)) {
      setValue("projectType", type as FormValues["projectType"]);
      setStep(2);
    }
    if (state.packageName) setValue("packageName", state.packageName);
    if (state.requirements)
      setValue(
        "requirements",
        state.requirements
          .replace(/^Client located near:[^.]+\.\s*/i, "")
          .replace(/Interested in building a local business website\.?\s*/i, "")
          .trim(),
      );
    const times: Record<string, FormValues["timeline"]> = {
      "Rush (3–5 days)": "Urgent (< 2 weeks)",
      "Standard (7–14 days)": "Normal (2-4 weeks)",
      "Flexible (3–4 weeks)": "Flexible (1+ months)",
    };
    const time = times[state.timeline || ""] || state.timeline;
    if (quoteSchema.shape.timeline.safeParse(time).success)
      setValue("timeline", time as FormValues["timeline"]);
    if (state.estimateMin !== undefined)
      setValue(
        "requirements",
        `Calculator estimate: ₹${state.estimateMin}–₹${state.estimateMax ?? state.estimateMin}. Selected add-ons: ${state.addOns?.join(", ") || "None"}.`,
      );
  }, [location.state, setValue]);
  const onSubmit = async (values: FormValues) => {
    setError("");
    const payload = { ...values, source, attribution: captureAttribution() };
    const body = JSON.stringify(payload);
    if (submission.current?.body !== body)
      submission.current = { body, id: crypto.randomUUID() };
    try {
      const submissionId = await submitQuote({
        ...payload,
        submissionId: submission.current!.id,
      });
      navigate(source === "paid_ad" ? "/lp/thank-you-quote" : "/thank-you", {
        state: {
          submissionId,
          name: values.name,
          email: values.email,
          projectType: values.projectType,
        },
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't save your quote. Please try again.",
      );
    }
  };
  const input = (
    name: "name" | "email" | "phone" | "businessName",
    label: string,
    type = "text",
    autoComplete?: string,
  ) => (
    <div>
      <label
        htmlFor={`${source}-${name}`}
        className="block text-sm font-semibold mb-2"
      >
        {label}
      </label>
      <input
        id={`${source}-${name}`}
        type={type}
        autoComplete={autoComplete}
        {...register(name)}
        className={fieldClass}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${source}-${name}-error` : undefined}
      />
      {errors[name] && (
        <p
          id={`${source}-${name}-error`}
          role="alert"
          className="text-sm text-red-500 mt-1"
        >
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
  return (
    <form
      id="website-quote-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass-card p-5 sm:p-8 space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl font-bold">
          Get My Website Quote
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          A clear quote within 24 hours. No obligation.
        </p>
        <p
          className="text-xs font-semibold text-primary mt-3"
          aria-live="polite"
        >
          Step {step} of 3 —{" "}
          {step === 1
            ? "Your website"
            : step === 2
              ? "Budget and timing"
              : "Contact details"}
        </p>
      </div>
      {step === 1 && (
        <fieldset>
          <legend className="font-semibold mb-3">
            What type of website do you need?
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choices.map(([type, price]) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setValue("projectType", type);
                  setStep(2);
                }}
                className="text-left border border-border hover:border-primary rounded-xl p-4"
              >
                <span className="block font-semibold">{type}</span>
                <span className="text-sm text-muted-foreground">{price}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm font-semibold">
            {watch("projectType")}
            {watch("packageName") ? ` · ${watch("packageName")} package` : ""}
          </p>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor={`${source}-budget`}
            >
              Project budget
            </label>
            <select
              id={`${source}-budget`}
              {...register("budget")}
              className={fieldClass}
              defaultValue=""
              aria-invalid={!!errors.budget}
            >
              <option value="" disabled>
                Select your budget
              </option>
              {quoteSchema.shape.budget.options.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            {errors.budget && (
              <p role="alert" className="text-sm text-red-500 mt-1">
                {errors.budget.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor={`${source}-timeline`}
            >
              When do you want to launch?
            </label>
            <select
              id={`${source}-timeline`}
              {...register("timeline")}
              className={fieldClass}
            >
              {quoteSchema.shape.timeline.options.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              htmlFor={`${source}-requirements`}
            >
              Anything else?{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id={`${source}-requirements`}
              {...register("requirements")}
              rows={3}
              maxLength={5000}
              className={fieldClass}
              placeholder="Tell us about the pages or features you have in mind."
            />
          </div>
          <button
            type="button"
            onClick={async () => {
              if (await trigger(["budget", "timeline", "requirements"]))
                setStep(3);
            }}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold inline-flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          {input("businessName", "Business name", "text", "organization")}
          {input("name", "Your name", "text", "name")}
          {input("email", "Email", "email", "email")}
          {input("phone", "Phone / WhatsApp", "tel", "tel")}
          <p className="text-xs text-muted-foreground">
            We'll use these details to respond to your project inquiry.
          </p>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 p-3 text-sm text-red-500"
            >
              {error}
            </p>
          )}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold inline-flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {isSubmitting ? "Saving your request…" : "Get My Website Quote"}
          </button>
        </div>
      )}
      {step > 1 && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setStep((s) => s - 1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}
    </form>
  );
}
