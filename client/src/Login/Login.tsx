/* Green Ledger direction: the login surface prioritizes operational clarity, calm trust, and restrained Myanmar-inspired detail. */
import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles, X, Chrome, Github, Globe } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { beginAuth, beginEmailRecovery, beginSocialAuth } from "@/Auth/auth";

const suppliedLogo = "/assets/mmnext-pos-logo.png";

type Language = "my" | "en";
const copy = {
  my: {
    languageLabel: "ဘာသာစကား",
    brandStyle: "Myanmar Business Style",
    sloganLine1: "အရောင်းတစ်ချက်၊ စာရင်းတစ်ချက် —",
    sloganLine2: "လုပ်ငန်းတစ်ခုလုံးကို MMNext-POS နဲ့ ထိန်းချုပ်",
    docs: "အသုံးပြုလမ်းညွှန်",
    secure: "လုံခြုံသော workspace",
    welcome: "ပြန်လည်ကြိုဆိုပါတယ်",
    signInTitle: "သင့် workspace သို့ ဝင်ရောက်ပါ",
    signInDescription: "သင့်လုပ်ငန်း၏ အရောင်း၊ စာရင်းနှင့် နေ့စဉ်လုပ်ငန်းများကို MMNext POS ဖြင့် ဆက်လက်စီမံပါ။",
    email: "အီးမေးလ်လိပ်စာ",
    password: "စကားဝှက်",
    forgotPassword: "စကားဝှက်မေ့နေပါသလား?",
    keepSignedIn: "ဤစက်တွင် ဆက်လက်ဝင်ထားမည်",
    connecting: "ချိတ်ဆက်နေသည်…",
    continue: "POS သို့ ဆက်သွားမည်",
    protected: "MMNext Auth ဖြင့် ကာကွယ်ထားသည်",
    needAccount: "အကောင့်မရှိသေးပါသလား?",
    contactAdmin: "အကောင့်ဖန်တီးမည်",
    privacy: "ကိုယ်ရေးအချက်အလက်",
    terms: "စည်းမျဉ်းများ",
    accountRecovery: "အကောင့်ပြန်လည်ရယူခြင်း",
    recoveryTitle: "ဝင်ရောက်ရန် code အသစ်ရယူပါ",
    recoveryDescription: "MMNext Auth သည် သိမ်းဆည်းထားသော စကားဝှက်အစား လုံခြုံသော အီးမေးလ်အတည်ပြု code ကို အသုံးပြုပါသည်။ ဆက်လက်လုပ်ဆောင်ရန် အကောင့်အီးမေးလ်ကို ထည့်ပါ။",
    openingRecovery: "လုံခြုံသော recovery ကို ဖွင့်နေသည်…",
    emailCode: "ဝင်ရောက်ရန် code ကို အီးမေးလ်ပို့မည်",
    recoveryNote: "အီးမေးလ်မရရှိပါက spam folder ကို စစ်ဆေးပါ သို့မဟုတ် workspace စီမံခန့်ခွဲသူထံ ဆက်သွယ်ပါ။",
    validEmail: "မှန်ကန်သော အီးမေးလ်လိပ်စာကို ထည့်ပါ။",
    emailPassword: "အီးမေးလ်နှင့် စကားဝှက်ကို ထည့်ပါ။",
    recoveryError: "အီးမေးလ် recovery စတင်၍ မရပါ။ ထပ်မံကြိုးစားပါ။",
    signInError: "ဝင်ရောက်၍ မရပါ။ Auth Server URL ကို စစ်ဆေးပါ။",
    askAdmin: "သင့်လုပ်ငန်းစီမံခန့်ခွဲသူထံမှ invite တောင်းပါ။",
  },
  en: {
    languageLabel: "Language",
    brandStyle: "Myanmar Business Style",
    sloganLine1: "One sale, one record —",
    sloganLine2: "control your whole business with MMNext-POS",
    docs: "Docs",
    secure: "Secure workspace",
    welcome: "Welcome back",
    signInTitle: "Sign in to your workspace",
    signInDescription: "Keep sales, records, and everyday business decisions in rhythm with MMNext POS.",
    email: "Email address",
    password: "Password",
    forgotPassword: "Forgot password?",
    keepSignedIn: "Keep me signed in on this device",
    connecting: "Connecting…",
    continue: "Continue to POS",
    protected: "Protected by MMNext Auth",
    needAccount: "Need an account?",
    contactAdmin: "Register",
    privacy: "Privacy",
    terms: "Terms",
    accountRecovery: "Account recovery",
    recoveryTitle: "Get a new sign-in code",
    recoveryDescription: "MMNext Auth uses a secure email verification code instead of a stored password. Enter your account email and we’ll continue the recovery flow.",
    openingRecovery: "Opening secure recovery…",
    emailCode: "Email me a sign-in code",
    recoveryNote: "If you don’t receive the email, check your spam folder or contact your workspace administrator.",
    validEmail: "Please enter a valid email address.",
    emailPassword: "Please enter your email and password.",
    recoveryError: "We could not start email recovery. Please try again.",
    signInError: "We could not start sign in. Please check your Auth Server URL.",
    askAdmin: "Ask your business administrator to invite you.",
        or: "or",
        continueWith: "Continue with",
  },
} as const;

    type AuthProvider = "google" | "github" | "microsoft";

    const socialProviders: { id: AuthProvider; label: string; icon: React.ReactNode }[] = [
      { id: "google", label: "Google", icon: <Chrome size={18} /> },
      { id: "github", label: "GitHub", icon: <Github size={18} /> },
          { id: "microsoft", label: "Microsoft", icon: <Globe size={18} /> },
    ];

export default function Home() {
  const [language, setLanguage] = useState<Language>("my");
  const t = copy[language];
  useEffect(() => { document.title = "Login"; }, []);
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
      toast.error(t.validEmail);
      return;
    }
    setIsResetting(true);
    try {
      await beginEmailRecovery(resetEmail.trim());
    } catch {
      setIsResetting(false);
      toast.error(t.recoveryError);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error(t.emailPassword);
      return;
    }
    setIsSubmitting(true);
    try {
      await beginAuth({ email, password });
    } catch {
      setIsSubmitting(false);
      toast.error(t.signInError);
    }
  };

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="MMNext POS introduction">
        <div className="brand-panel__texture" />
        <div className="brand-panel__lockup">
          <div className="brand-chip"><span className="brand-chip__dot" /> {t.brandStyle}</div>
          <div className="brand-panel__identity">
            <img className="brand-panel__logo" src={suppliedLogo} alt="MMNext POS logo" />
            <div className="brand-panel__wordmark" aria-label="MMNext POS">
              <span><i className="brand-mm">MM</i>Next</span>
              <strong>POS</strong>
            </div>
          </div>
          <div className="brand-panel__rule" aria-hidden="true" />
          <p className="brand-panel__slogan">{t.sloganLine1}<br />{t.sloganLine2}</p>
          <p className="brand-panel__english">SIMPLE · RELIABLE · TRUSTED</p>
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
            <img src={suppliedLogo} alt="MMNext POS" />
            <span>MMNext <b>POS</b></span>
          </div>
          <div className="form-panel__top-actions"><Link href="/docs" className="storage-nav-link">{t.docs}</Link><span className="secure-label"><ShieldCheck size={15} /> {t.secure}</span><div className="language-switch" role="group" aria-label={t.languageLabel}><button type="button" className={language === "my" ? "active" : ""} aria-pressed={language === "my"} onClick={() => setLanguage("my")}>မြန်မာ</button><button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button></div></div>
        </div>

        <div className="form-column">
          <div className="form-intro">
            <div className="form-eyebrow"><Sparkles size={14} /> {t.welcome}</div>
            <h2>{t.signInTitle}</h2>
            <p>{t.signInDescription}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">{t.email}</label>
            <div className="field-shell">
              <Mail size={18} aria-hidden="true" />
              <input id="email" type="email" autoComplete="email" placeholder="you@business.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">{t.password}</label>
              <button type="button" className="text-action" onClick={() => { setResetEmail(email); setShowReset(true); }}>{t.forgotPassword}</button>
            </div>
            <div className="field-shell">
              <LockKeyhole size={18} aria-hidden="true" />
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="icon-action" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="remember-row"><input type="checkbox" defaultChecked /> <span>{t.keepSignedIn}</span></label>
            <button className="submit-button" type="submit" disabled={isSubmitting}>
              <span>{isSubmitting ? t.connecting : t.continue}</span>
              {isSubmitting ? <span className="button-spinner" /> : <ArrowRight size={18} />}
            </button>

                        <div className="social-divider"><span>{t.or}</span></div>
                        <div className="social-buttons" role="group" aria-label={t.continueWith}>
                          {socialProviders.map((provider) => (
                            <button
                              key={provider.id}
                              type="button"
                              className="social-button"
                              onClick={() => beginSocialAuth(provider.id, email || undefined)}
                              disabled={isSubmitting}
                            >
                              {provider.icon}
                              <span>{provider.label}</span>
                            </button>
                          ))}
                        </div>
          </form>

          <div className="form-divider"><span>{t.protected}</span></div>
          <p className="help-copy">{t.needAccount} <Link href="/register" className="text-action">{t.contactAdmin}</Link></p>
        </div>

        <div className="form-panel__bottom">
          <span>© 2026 MMNext POS</span>
          <span><Link href="/privacy" className="footer-link">{t.privacy}</Link><span className="footer-dot">·</span><Link href="/terms" className="footer-link">{t.terms}</Link></span>
        </div>
      </section>

      {showReset && (
        <div className="reset-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowReset(false); }}>
          <section className="reset-dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
            <button className="reset-close" type="button" aria-label={t.accountRecovery} onClick={() => setShowReset(false)}><X size={18} /></button>
            <div className="form-eyebrow"><ShieldCheck size={14} /> {t.accountRecovery}</div>
            <h2 id="reset-title">{t.recoveryTitle}</h2>
            <p>{t.recoveryDescription}</p>
            <form className="reset-form" onSubmit={handleReset}>
              <label className="field-label" htmlFor="reset-email">{t.email}</label>
              <div className="field-shell"><Mail size={18} aria-hidden="true" /><input id="reset-email" type="email" autoComplete="email" placeholder="you@business.com" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} autoFocus /></div>
              <button className="submit-button" type="submit" disabled={isResetting}><span>{isResetting ? t.openingRecovery : t.emailCode}</span>{isResetting ? <span className="button-spinner" /> : <ArrowRight size={18} />}</button>
            </form>
            <p className="reset-note">{t.recoveryNote}</p>
          </section>
        </div>
      )}
    </main>
  );
}
