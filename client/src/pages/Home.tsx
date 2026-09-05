/* Green Ledger direction: the login surface prioritizes operational clarity, calm trust, and restrained Myanmar-inspired detail. */
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { beginAuth, beginEmailRecovery } from "@/lib/auth";

const suppliedLogo = "/manus-storage/mmnext-supplied-logo_4f4e03b5.webp";
const generatedMark = "/manus-storage/mmnext-mark_dba1f31e.png";
const panelArt = "/manus-storage/mmnext-login-panel-art_e9d498db.png";
const motif = "/manus-storage/mmnext-brand-motif_e8d3fa56.png";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsResetting(true);
    try {
      await beginEmailRecovery(resetEmail.trim());
    } catch {
      setIsResetting(false);
      toast.error("We could not start email recovery. Please try again.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    setIsSubmitting(true);
    try {
      await beginAuth({ email, password });
    } catch {
      setIsSubmitting(false);
      toast.error("We could not start sign in. Please check your Auth Server URL.");
    }
  };

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="MMNext POS introduction">
        <div className="brand-panel__texture" />
        <img className="brand-panel__art" src={panelArt} alt="" aria-hidden="true" />
        <div className="brand-panel__content">
          <div className="brand-chip"><span className="brand-chip__dot" /> Myanmar Business Software</div>
          <div className="brand-mark-wrap">
            <img className="brand-mark" src={suppliedLogo} alt="MMNext POS logo" />
          </div>
          <p className="brand-kicker">Simple · Reliable · Trusted</p>
          <h1>Your counter, ready<br /><em>when you are.</em></h1>
          <p className="brand-copy">A focused workspace for sales, stock, and the everyday decisions that keep your business moving.</p>
          <div className="brand-rule"><span /> <img src={motif} alt="" aria-hidden="true" /> <span /></div>
        </div>
        <div className="brand-panel__footer">
          <span>MMNext POS</span>
          <span className="footer-divider" />
          <span>Built for business</span>
        </div>
      </section>

      <section className="form-panel" aria-label="Sign in to MMNext POS">
        <div className="form-panel__topbar">
          <div className="compact-brand">
            <img src={generatedMark} alt="" aria-hidden="true" />
            <span>MMNext <b>POS</b></span>
          </div>
          <span className="secure-label"><ShieldCheck size={15} /> Secure workspace</span>
        </div>

        <div className="form-column">
          <div className="form-intro">
            <div className="form-eyebrow"><Sparkles size={14} /> Welcome back</div>
            <h2>Sign in to your workspace</h2>
            <p>Continue to your MMNext POS dashboard and keep your business in rhythm.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">Email address</label>
            <div className="field-shell">
              <Mail size={18} aria-hidden="true" />
              <input id="email" type="email" autoComplete="email" placeholder="you@business.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">Password</label>
              <button type="button" className="text-action" onClick={() => { setResetEmail(email); setShowReset(true); }}>Forgot password?</button>
            </div>
            <div className="field-shell">
              <LockKeyhole size={18} aria-hidden="true" />
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="icon-action" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="remember-row"><input type="checkbox" defaultChecked /> <span>Keep me signed in on this device</span></label>
            <button className="submit-button" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? "Connecting…" : "Continue to POS"}</span>
              {isSubmitting ? <span className="button-spinner" /> : <ArrowRight size={18} />}
            </button>
          </form>

          <div className="form-divider"><span>Protected by MMNext Auth</span></div>
          <p className="help-copy">Need an account? <button type="button" className="text-action" onClick={() => toast.info("Ask your business administrator to invite you.")}>Contact your administrator</button></p>
        </div>

        <div className="form-panel__bottom">
          <span>© 2026 MMNext POS</span>
          <span><Link href="/privacy" className="footer-link">Privacy</Link><span className="footer-dot">·</span><Link href="/terms" className="footer-link">Terms</Link></span>
        </div>
      </section>

      {showReset && (
        <div className="reset-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowReset(false); }}>
          <section className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <button className="reset-close" type="button" aria-label="Close password recovery" onClick={() => setShowReset(false)}><X size={18} /></button>
            <div className="form-eyebrow"><ShieldCheck size={14} /> Account recovery</div>
            <h2 id="reset-title">Get a new sign-in code</h2>
            <p>MMNext Auth uses a secure email verification code instead of a stored password. Enter your account email and we’ll continue the recovery flow.</p>
            <form className="reset-form" onSubmit={handleReset}>
              <label className="field-label" htmlFor="reset-email">Email address</label>
              <div className="field-shell"><Mail size={18} aria-hidden="true" /><input id="reset-email" type="email" autoComplete="email" placeholder="you@business.com" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} autoFocus /></div>
              <button className="submit-button" type="submit" disabled={isResetting}><span>{isResetting ? "Opening secure recovery…" : "Email me a sign-in code"}</span>{isResetting ? <span className="button-spinner" /> : <ArrowRight size={18} />}</button>
            </form>
            <p className="reset-note">If you don’t receive the email, check your spam folder or contact your workspace administrator.</p>
          </section>
        </div>
      )}
    </main>
  );
}
