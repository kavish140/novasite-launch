import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const TermsAndConditions = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-20 sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-8">
              Terms & Conditions
            </h1>
            <div className="prose prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and SiteNova ("we," "us" or "our"), concerning your access to and use of the sitenova.dev website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>

              <h2>2. Services Offered</h2>
              <p>
                SiteNova provides web design, development, and digital marketing services. The specific scope, deliverables, timeline, and pricing for each project will be outlined in a separate Statement of Work (SOW) or proposal agreed upon by both parties before the commencement of any work.
              </p>

              <h2>3. Payment Terms</h2>
              <p>
                Payment terms, including deposit requirements and milestone payments, will be specified in the project proposal or invoice. Unless otherwise stated, a deposit is required before work begins. Final payment is due upon project completion or before the website is launched on the client's domain.
              </p>

              <h2>4. Intellectual Property Rights</h2>
              <p>
                Upon full payment of all fees associated with a project, the client will retain ownership of the final website design and custom code developed specifically for them. SiteNova retains the right to use the completed project in our portfolio, marketing materials, and case studies unless a Non-Disclosure Agreement (NDA) is signed.
              </p>

              <h2>5. Client Responsibilities</h2>
              <p>
                The client agrees to provide all necessary content, assets, and access to accounts required for the successful completion of the project in a timely manner. Delays in providing required materials may result in project timeline extensions.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                In no event shall SiteNova, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2>7. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of India, specifically the jurisdiction of Mumbai, Maharashtra, without regard to its conflict of law provisions.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br/>
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

export default TermsAndConditions;
