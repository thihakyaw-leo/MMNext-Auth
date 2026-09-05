/* Green Ledger direction: policy content uses the same quiet cream surface, readable hierarchy, and green trust cues as the login page. */
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <main className="policy-shell">
      <header className="policy-header">
        <Link href="/" className="policy-back"><ArrowLeft size={16} /> Back to sign in</Link>
        <div className="policy-brand"><span className="policy-brand-mark">M</span> MMNext <b>POS</b></div>
      </header>
      <article className="policy-content">
        <div className="policy-kicker"><ShieldCheck size={15} /> MMNext POS · Privacy</div>
        <h1>Privacy Policy</h1>
        <p className="policy-lead">We designed MMNext POS to help businesses work with confidence. This policy explains what information we collect, why we use it, and the choices available to you when you use the MMNext POS workspace.</p>
        <p className="policy-updated">Effective date: 5 September 2026</p>

        <section><h2>1. Information we collect</h2><p>When you sign in, we may receive your email address, name, account identifier, and authentication details from MMNext Auth. When you use POS features, the application may process business records such as products, sales, stock movements, receipts, and workspace settings.</p></section>
        <section><h2>2. How we use information</h2><p>We use account information to authenticate users, maintain secure sessions, provide POS functionality, communicate important service messages, prevent misuse, and improve reliability. We do not use your business records for unrelated advertising.</p></section>
        <section><h2>3. Authentication and security</h2><p>Authentication is handled through MMNext Auth. The login flow may use authorization codes, PKCE, and short-lived session data. Keep your password private and contact your administrator promptly if you believe your account has been accessed improperly.</p></section>
        <section><h2>4. Sharing and service providers</h2><p>We may share information with infrastructure and authentication providers that process data on our behalf, including Cloudflare Workers, D1, KV, and email delivery services configured by the MMNext POS operator. We do not sell personal information.</p></section>
        <section><h2>5. Retention and deletion</h2><p>We retain information for as long as needed to provide the service, meet legitimate operational requirements, or comply with applicable obligations. Ask your business administrator to request correction or deletion of workspace information.</p></section>
        <section><h2>6. Cookies and local storage</h2><p>The login experience may use browser session storage for OAuth state, PKCE verification data, and the returned authentication session. These values support sign-in security and are not intended to be a permanent profile.</p></section>
        <section><h2>7. Contact</h2><p>For questions about this policy or your workspace data, contact your MMNext POS administrator or the service operator using the contact channel provided by your organization.</p></section>
        <aside className="policy-note">This page is a working product draft. Have a qualified attorney review it and replace the contact, retention, and jurisdiction details before publishing for legal reliance.</aside>
      </article>
    </main>
  );
}
