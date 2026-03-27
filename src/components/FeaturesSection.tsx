import { motion } from "framer-motion";
import { Zap, Paintbrush, Globe, Shield, Smartphone, HeadphonesIcon } from "lucide-react";

const features = [
	{
		icon: Zap,
		title: "Lightning Fast Delivery",
		description:
			"Get your professional website up and running in days. We work fast without compromising quality.",
	},
	{
		icon: Paintbrush,
		title: "Custom Design",
		description:
			"Every website is tailor-made for your brand. No cookie-cutter templates — only unique, stunning designs.",
	},
	{
		icon: Smartphone,
		title: "Mobile Responsive",
		description:
			"Your site looks perfect on every device — phones, tablets, and desktops. Every pixel optimized.",
	},
	{
		icon: Globe,
		title: "SEO Optimized",
		description:
			"Built with search engines in mind. Get found by your customers with clean code and fast load times.",
	},
	{
		icon: Shield,
		title: "Secure & Reliable",
		description:
			"SSL encryption, regular backups, and enterprise-grade hosting. Your website stays safe 24/7.",
	},
	{
		icon: HeadphonesIcon,
		title: "Ongoing Support",
		description:
			"We don't disappear after launch. Get dedicated support, updates, and maintenance whenever you need.",
	},
];

const container = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
	return (
		<section id="features" className="section-padding relative">
			<div className="mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.5 }}
					className="text-center mb-16"
				>
					<span className="text-sm font-medium text-primary uppercase tracking-widest">
						Our Services
					</span>
					<h2 id="features-title" className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
						Web Development Services your business needs to{" "}
						<span className="gradient-text">stand out online</span>
					</h2>
					<p className="max-w-xl mx-auto text-muted-foreground text-lg">
						From design to deployment, we handle it all so you can focus on
						running your business.
					</p>
				</motion.div>

				<motion.div
					variants={container}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{features.map((feature) => (
						<motion.div
							key={feature.title}
							variants={item}
							className="glass-card p-8 group hover:border-primary/30 transition-colors duration-300 interactive-card hover-glow"
						>
							<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
								<feature.icon size={22} className="text-primary" />
							</div>
							<h3 className="font-heading text-lg font-semibold mb-2">
								{feature.title}
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default FeaturesSection;
