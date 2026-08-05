import { m as motion } from "framer-motion";
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
					className="grid grid-cols-1 md:grid-cols-3 gap-4"
				>
					{features.map((feature, i) => {
						const isHero = i === 0;
						const isTall = i === 1;
						const isWide = i === 5;
						
						let spanClasses = "md:col-span-1";
						if (isHero) spanClasses = "md:col-span-2 md:row-span-2";
						else if (isTall) spanClasses = "md:col-span-1 md:row-span-2";
						else if (isWide) spanClasses = "md:col-span-3";

						return (
							<motion.div
								key={feature.title}
								variants={item}
								className={`glass-card p-6 md:p-8 group hover:border-primary/30 transition-all duration-300 interactive-card hover-glow flex flex-col justify-between ${spanClasses} overflow-hidden relative`}
							>
								<div className="relative z-10">
									<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
										<feature.icon size={22} className="text-primary" />
									</div>
									<h3 className={`font-heading ${isHero ? 'text-2xl mb-3' : 'text-lg mb-2'} font-semibold`}>
										{feature.title}
									</h3>
									<p className={`text-muted-foreground leading-relaxed ${isHero ? 'text-base max-w-md' : 'text-sm'}`}>
										{feature.description}
									</p>
								</div>
								
								{/* Decorative backgrounds for bento effect */}
								<feature.icon 
									size={isHero ? 160 : isTall ? 120 : 80} 
									className={`absolute text-primary/[0.03] group-hover:text-primary/[0.05] transition-colors duration-500 pointer-events-none
										${isHero ? '-bottom-10 -right-10' : 
										  isTall ? '-bottom-10 -right-4' : 
										  isWide ? 'bottom-0 right-10' : 
										  '-bottom-6 -right-6'}`} 
								/>
								
								{isHero && (
									<div className="mt-8 relative z-10 flex-1 w-full bg-secondary/30 rounded-xl border border-border/50 overflow-hidden flex items-center justify-center min-h-[160px]">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
										<div className="flex items-center gap-4 w-3/4 bg-background p-4 rounded-xl shadow-sm border border-border/50">
											<div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
												<span className="text-green-500 font-bold text-lg">99</span>
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-semibold text-foreground">Performance Score</span>
												<span className="text-xs text-muted-foreground">Lightning fast loading</span>
											</div>
										</div>
									</div>
								)}
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
};

export default FeaturesSection;
