import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Jupiter Fast Finance",
		role: "Client Review",
		content:
			"Truly impressed with the fantastic work done by Site Nova’s team on JupiterFinance.com. The website is exceptionally well-designed — modern, sleek, and highly professional in appearance. Every element feels thoughtfully placed, creating a smooth and engaging user experience. Their attention to detail and design aesthetics really stand out. Highly appreciative of the quality and finesse they bring to their work!",
		rating: 5,
	},
	{
		name: "Dr. Dipti Ganatra",
		role: "Client Review",
		content:
			"Absolutely thrilled with my website www.drdiptiganatra.com! Site Nova’s team built it beautifully in a very short span of time, with complete database integration and seamless functionality. The design is clean, professional, and perfectly reflects my practice. Since its launch, I’ve seen improved patient engagement and steady growth in my business. Highly recommend their team for anyone looking for a powerful and well-executed website!",
		rating: 5,
	},
];

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
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{testimonials.map((t, i) => (
						<motion.div
							key={t.name}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="glass-card p-8 flex flex-col interactive-card hover-glow"
						>
							<div className="flex gap-1 mb-4">
								{Array.from({ length: t.rating }).map((_, idx) => (
									<Star
										key={idx}
										size={16}
										className="fill-accent text-accent"
									/>
								))}
							</div>
							<p className="text-foreground/90 leading-relaxed mb-6 flex-1">
								"{t.content}"
							</p>
							<div>
								<p className="font-heading font-semibold text-sm">
									{t.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{t.role}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
