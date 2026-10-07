import { m as motion } from "framer-motion";
import { Star, ExternalLink, PencilLine } from "lucide-react";
import { Link } from "react-router";
import { clientReviews, type ClientReview } from "@/lib/client-reviews";
import { Button } from "@/components/ui/button";

const testimonials = Object.values(clientReviews);

const TestimonialCard = ({ t }: { t: ClientReview }) => (
	<div className="glass-card p-6 md:p-8 flex flex-col min-w-0 h-full">
		<div className="flex gap-1 mb-4" role="img" aria-label={`${t.rating} out of 5 stars${t.source ? ` on ${t.source}` : ""}`}>
			{Array.from({ length: t.rating }).map((_, idx) => (
				<Star key={idx} size={16} className="fill-accent text-accent" aria-hidden="true" />
			))}
		</div>
		{t.content ? (
			<blockquote className="text-foreground/90 leading-relaxed mb-6 flex-1 text-sm md:text-base">
				<p>“{t.content}”</p>
			</blockquote>
		) : (
			<div className="mb-6 flex-1">
				<p className="font-heading text-xl font-semibold">5-star Google rating</p>
				<p className="mt-2 text-sm text-muted-foreground">Rating only — no written review.</p>
			</div>
		)}
		<div className="mt-auto">
			<a
				href={t.website}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1.5 font-heading font-semibold text-sm hover:text-primary transition-colors"
			>
				{t.name}
				<ExternalLink size={12} className="text-muted-foreground" />
			</a>
			<p className="mt-1 text-xs text-muted-foreground">{t.role}</p>
			<Link to={t.caseStudyPath} className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
				View case study<span className="sr-only"> for {t.name}</span>
			</Link>
		</div>
	</div>
);

const TestimonialsSection = () => {
	return (
		<section id="testimonials" className="section-padding">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<span className="text-sm font-medium text-primary uppercase tracking-widest">
						Client reviews
					</span>
					<h2
						id="testimonials-title"
						className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5"
					>
						Trusted by{" "}
						<span className="gradient-text">our clients</span>
					</h2>
					<div className="mt-2 mb-4">
						<Button asChild variant="secondary" className="rounded-full">
							<a href="https://share.google/oVC1Tao0mO4WiGiOt" target="_blank" rel="noopener noreferrer">
								<PencilLine className="w-4 h-4 mr-2" />
								Write a Review
							</a>
						</Button>
					</div>
				</motion.div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((t) => <TestimonialCard key={t.name} t={t} />)}
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
