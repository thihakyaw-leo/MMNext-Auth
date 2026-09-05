/* Green Ledger direction: terms content is direct, readable, and operationally clear without overwhelming the sign-in experience. */
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <main className="policy-shell">
      <header className="policy-header">
        <Link href="/" className="policy-back"><ArrowLeft size={16} /> Back to sign in</Link>
        <div className="policy-brand"><span className="policy-brand-mark">M</span> MMNext <b>POS</b></div>
      </header>
      <article className="policy-content">
        <div className="policy-kicker"><BriefcaseBusiness size={15} /> MMNext POS · Terms</div>
        <h1>Terms of Service</h1>
        <p className="policy-lead">These terms describe the basic rules for using the MMNext POS workspace. By accessing the service through your organization, you agree to use it responsibly and follow your organization’s instructions.</p>
        <p className="policy-updated">Effective date: 5 September 2026</p>

        <section><h2>1. Your workspace</h2><p>MMNext POS is provided to businesses and their authorized team members. Your organization is responsible for choosing account permissions, keeping workspace information accurate, and managing who may access its POS data.</p></section>
        <section><h2>2. Account responsibilities</h2><p>Use your own account, keep credentials confidential, and notify your administrator if you notice suspicious activity. You must not share access in a way that prevents the organization from understanding who performed an action.</p></section>
        <section><h2>3. Acceptable use</h2><p>You may use MMNext POS only for lawful business operations. Do not attempt to bypass authentication, interfere with service availability, upload malicious code, access another workspace without permission, or use the service to violate another person’s rights.</p></section>
        <section><h2>4. Business records</h2><p>Your organization retains responsibility for the accuracy, completeness, backups, and lawful use of products, sales, customer, employee, and financial records entered into the workspace.</p></section>
        <section><h2>5. Service availability</h2><p>We aim to keep the service reliable, but maintenance, network conditions, provider incidents, or events outside reasonable control may temporarily affect availability. The operator should maintain appropriate operational backups for critical records.</p></section>
        <section><h2>6. Changes and termination</h2><p>The service operator may update these terms, features, or supported integrations from time to time. Access may be suspended when necessary to protect users, investigate misuse, or follow the organization’s account direction.</p></section>
        <section><h2>7. Contact and governing details</h2><p>For account questions, billing arrangements, or workspace access requests, contact your organization’s MMNext POS administrator. The operator should add its legal entity, governing law, dispute process, and official contact details before publication.</p></section>
        <aside className="policy-note">This page is a working product draft. Have a qualified attorney review it and add the operator’s legal entity, jurisdiction, liability, warranty, and dispute provisions before publishing for legal reliance.</aside>
      </article>
    </main>
  );
}
