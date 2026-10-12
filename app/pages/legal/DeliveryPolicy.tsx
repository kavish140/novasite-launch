import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EMAIL, SITE_NAME } from "@/lib/constants";
export default function DeliveryPolicy() {
  return <div className="min-h-screen bg-background text-foreground flex flex-col"><Navbar /><main className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-24"><div className="mx-auto max-w-3xl px-6"><h1 className="font-heading text-4xl sm:text-5xl font-bold mb-8">Digital Delivery Policy</h1><div className="prose max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
    <p>Last updated: 10 October 2026</p>
    <h2>Services delivered online</h2><p>{SITE_NAME} provides custom website design, development, SEO and digital marketing services. We do not ship physical products. Deliverables are shared digitally through preview links, agreed file transfers or deployment to the agreed hosting account.</p>
    <h2>Project schedule</h2><p>Your proposal or statement of work sets out the deliverables, milestones and estimated delivery schedule. Work begins after the agreed advance is received and the required content, approvals and account access are available. Content delays, additional requirements or delayed approvals may change the schedule; we discuss changes with you.</p>
    <h2>Review and handover</h2><p>You receive the agreed previews and review opportunities. Final launch, source-code handover and account access follow the payment and acceptance terms in your proposal. Third-party services such as domains and hosting are included only when stated in the proposal.</p>
    <h2>Delivery questions</h2><p>For delivery updates or access issues, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with your project or payment reference.</p>
  </div></div></main><Footer /></div>;
}
