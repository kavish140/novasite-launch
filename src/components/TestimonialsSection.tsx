import { m as motion } from "framer-motion";
import { Star, ExternalLink, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Jupiter Fast Finance",
		role: "Client Review",
		website: "https://jupiterfastfinance.com",
		content:
			"Truly impressed with the fantastic work done by Site Nova’s team on JupiterFinance.com. The website is exceptionally well-designed — modern, sleek, and highly professional in appearance. Every element feels thoughtfully placed, creating a smooth and engaging user experience. Their attention to detail and design aesthetics really stand out. Highly appreciative of the quality and finesse they bring to their work!",
		rating: 5,
	},
	{
		name: "Dr. Dipti Ganatra",
		role: "Client Review",
		website: "https://drdiptiganatra.com",
		content:
			"Absolutely thrilled with my website www.drdiptiganatra.com! Site Nova’s team built it beautifully in a very short span of time, with complete database integration and seamless functionality. The design is clean, professional, and perfectly reflects my practice. Since its launch, I’ve seen improved patient engagement and steady growth in my business. Highly recommend their team for anyone looking for a powerful and well-executed website!",
		rating: 5,
	},
];

const MarqueeRow = ({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) => {
	// Duplicate items to ensure smooth infinite scroll
	const duplicatedItems = [...items, ...items, ...items];
	
	const RowContent = () => (
		<div
			className={`flex shrink-0 gap-6 items-stretch animate-marquee ${
				reverse ? "[animation-direction:reverse]" : ""
			} group-hover:[animation-play-state:paused]`}
		>
			{duplicatedItems.map((t, i) => (
				<div
					key={`${t.name}-${i}`}
					className="glass-card p-6 md:p-8 flex flex-col w-[320px] md:w-[450px] shrink-0 interactive-card hover-glow"
				>
					<div className="flex gap-1 mb-4">
						{Array.from({ length: t.rating }).map((_, idx) => (
							<Star key={idx} size={16} className="fill-accent text-accent" />
						))}
					</div>
					<p className="text-foreground/90 leading-relaxed mb-6 flex-1 text-sm md:text-base line-clamp-[7]">
						"{t.content}"
					</p>
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
						<p className="text-xs text-muted-foreground">{t.role}</p>
					</div>
				</div>
			))}
		</div>
	);

	return (
		<div className="flex overflow-hidden group gap-6 w-full mb-6 last:mb-0">
			<RowContent />
			<RowContent />
		</div>
	);
};

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
						Testimonials
					</span>
					<h2
						id="testimonials-title"
						className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5"
					>
						Loved by{" "}
						<span className="gradient-text">builders</span>
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

				<div className="relative w-full max-w-[100vw] overflow-hidden -mx-6 px-6 sm:mx-0 sm:px-0">
					{/* Gradient Masks for smooth fade out on edges */}
					<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 hidden md:block" />
					<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 hidden md:block" />
					
					<div className="flex flex-col gap-6 py-4">
						<MarqueeRow items={testimonials} />
						<MarqueeRow items={[...testimonials].reverse()} reverse={true} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
