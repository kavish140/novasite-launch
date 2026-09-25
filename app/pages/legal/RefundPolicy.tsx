import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const RefundPolicy = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              Refund & Cancellation Policy
            </h1>
            <div className="prose prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Cancellation Policy</h2>
              <p>
                We understand that circumstances may change. If you wish to cancel a project, please notify us in writing as soon as possible.
              </p>
              <ul>
                <li><strong>Before Work Commences:</strong> If a project is cancelled before any design or development work has begun, a full refund of any deposit paid will be issued, minus any transaction fees or costs already incurred (e.g., purchasing domain names or hosting on your behalf).</li>
                <li><strong>After Work Commences:</strong> If a project is cancelled after work has begun, we will evaluate the amount of work completed up to the date of cancellation. You will be billed for the hours worked or milestones completed. If the deposit paid exceeds the value of the work completed, the difference will be refunded. If the value of the work completed exceeds the deposit paid, you will be invoiced for the remaining balance.</li>
              </ul>

              <h2>2. Refund Policy</h2>
              <p>
                Due to the custom nature of web design and development services, we generally do not offer full refunds once a project is well underway or completed. 
              </p>
              <ul>
                <li><strong>Web Design & Development:</strong> Refunds are not provided for completed milestones that have been approved by the client. If you are dissatisfied with the direction of the design during the initial mockup phase, you may request a cancellation and partial refund based on the work completed to that point.</li>
                <li><strong>Digital Marketing & SEO:</strong> Services such as SEO and Ads management are typically billed on a monthly retainer. These services can be cancelled with a 30-day notice, but refunds are not provided for past months of service rendered.</li>
                <li><strong>Digital Products/Templates:</strong> If we offer any digital downloads or templates, they are non-refundable once downloaded.</li>
              </ul>

              <h2>3. Processing Refunds</h2>
              <p>
                Approved refunds will be processed within 7-14 business days. The refund will be issued to the original method of payment used during the transaction.
              </p>

              <h2>4. Contact Us</h2>
              <p>
                If you have any questions about our Cancellation and Refund Policy, please contact us at:<br/>
                Email: kavishganatra5@gmail.com
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default RefundPolicy;
