import { motion } from "framer-motion";

const steps = [
	{
		number: "01",
		title: "Get in Touch",
		description:
			"Call us or send an email with your requirements. We'll discuss your vision, goals, and timeline.",
	},
	{
		number: "02",
		title: "We Design & Build",
		description:
			"Our team crafts a custom website tailored to your brand — stunning visuals, fast performance, fully responsive.",
	},
	{
		number: "03",
		title: "Launch & Support",
		description:
			"We deploy your site and provide ongoing support. Your website goes live and starts growing your business.",
	},
];

const HowItWorksSection = () => {
	return (
		<section
			id="how-it-works"
			className="section-padding relative overflow-hidden"
		>
			{/* Subtle grid */}
			<div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

			<div className="relative mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<span className="text-sm font-medium text-primary uppercase tracking-widest">
						How It Works
					</span>
					<h2
						id="how-it-works-title"
						className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5"
					>
						Three steps to your{" "}
						<span className="gradient-text">dream site</span>
					</h2>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
					{steps.map((step, i) => (
						<motion.div
							key={step.number}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: i * 0.15 }}
							className="relative text-center md:text-left"
						>
							<span className="font-heading text-6xl font-bold gradient-text opacity-30 block mb-4">
								{step.number}
							</span>
							<h3 className="font-heading text-xl font-semibold mb-3">
								{step.title}
							</h3>
							<p className="text-muted-foreground leading-relaxed">
								{step.description}
							</p>

							{/* Connector line on desktop */}
							{i < steps.length - 1 && (
								<div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-12 h-px bg-gradient-to-r from-primary/40 to-transparent" />
							)}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HowItWorksSection;
