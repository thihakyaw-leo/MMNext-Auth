import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { beginRegistration } from "@/lib/auth";

const R2_ASSET_BASE = "https://cloud.kaungthant.shop/mmnext-auth";
const suppliedLogo = `${R2_ASSET_BASE}/mmnext-pos-logo.png?v=4x-20260908`;

type Language = "my" | "en";
const copy = {
  my: {
    chip: "Myanmar Business Style", title: "လုပ်ငန်းအကောင့် ဖန်တီးပါ", intro: "MMNext POS ဖြင့် အရောင်း၊ စာရင်းနှင့် သင့်လုပ်ငန်းတစ်ခုလုံးကို တစ်နေရာတည်းမှ စီမံပါ။", fullName: "အမည်အပြည့်အစုံ", business: "လုပ်ငန်းအမည်", email: "အီးမေးလ်လိပ်စာ", password: "စကားဝှက်", confirm: "စကားဝှက် ထပ်မံထည့်ပါ", create: "အကောင့်ဖန်တီးမည်", creating: "အကောင့်ဖန်တီးရန် ချိတ်ဆက်နေသည်…", haveAccount: "အကောင့်ရှိပြီးသားလား?", signIn: "ဝင်ရောက်မည်", agree: "MMNext POS ၏", terms: "စည်းမျဉ်းများ", privacy: "ကိုယ်ရေးအချက်အလက်မူဝါဒ", and: "နှင့်", language: "ဘာသာစကား", required: "လိုအပ်သောအချက်အလက်များကို ဖြည့်ပါ။", mismatch: "စကားဝှက်နှစ်ခု တူညီရပါမည်။", short: "စကားဝှက်သည် အနည်းဆုံး ၈ လုံး ရှိရပါမည်။", consent: "ဆက်လက်လုပ်ဆောင်ရန် စည်းမျဉ်းများကို သဘောတူပါ။", failed: "အကောင့်ဖန်တီးမှု မစတင်နိုင်ပါ။ ထပ်မံကြိုးစားပါ။", secure: "လုံခြုံသော signup flow ဖြင့် ကာကွယ်ထားသည်" },
  en: {
    chip: "Myanmar Business Style", title: "Create your business account", intro: "Bring sales, records, and your whole business together in one calm workspace with MMNext POS.", fullName: "Full name", business: "Business name", email: "Email address", password: "Password", confirm: "Confirm password", create: "Create account", creating: "Opening secure signup…", haveAccount: "Already have an account?", signIn: "Sign in", agree: "I agree to the MMNext POS", terms: "Terms of Service", privacy: "Privacy Policy", and: "and", language: "Language", required: "Please complete all required fields.", mismatch: "The passwords must match.", short: "Password must be at least 8 characters.", consent: "Please accept the terms to continue.", failed: "We could not start registration. Please try again.", secure: "Protected by a secure signup flow" },
} as const;

export default function Register() {
  const [language, setLanguage] = useState<Language>("my");
  const t = copy[language];
  const [fullName, setFullName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !business.trim() || !email.trim() || !password || !confirm) return toast.error(t.required);
    if (password.length < 8) return toast.error(t.short);
    if (password !== confirm) return toast.error(t.mismatch);
    if (!accepted) return toast.error(t.consent);
    setIsSubmitting(true);
    try {
      await beginRegistration({ email, fullName, businessName: business });
    } catch {
      setIsSubmitting(false);
      toast.error(t.failed);
    }
  };

  return <main className="register-shell">
    <section className="register-brand-panel" aria-label="MMNext POS introduction">
      <div className="brand-panel__texture" />
      <div className="register-brand-lockup">
        <div className="brand-chip"><span className="brand-chip__dot" /> {t.chip}</div>
        <div className="brand-panel__identity"><img className="brand-panel__logo" src={suppliedLogo} alt="MMNext POS logo" /><div className="brand-panel__wordmark"><span>MMNext</span><strong>POS</strong></div></div>
        <div className="brand-panel__rule" />
        <p className="brand-panel__slogan">{language === "my" ? "အရောင်းတစ်ချက်၊ စာရင်းတစ်ချက် —" : "One sale, one record —"}<br />{language === "my" ? "လုပ်ငန်းတစ်ခုလုံးကို MMNext-POS နဲ့ ထိန်းချုပ်" : "control your whole business with MMNext-POS"}</p>
        <p className="brand-panel__english">SIMPLE · RELIABLE · TRUSTED</p>
      </div>
      <div className="brand-panel__footer"><span>MMNext POS</span><span className="footer-divider" /><span>Built for business</span></div>
    </section>
    <section className="register-form-panel" aria-label={t.title}>
      <div className="register-topbar"><Link href="/" className="register-back"><ArrowLeft size={15} /> {language === "my" ? "ဝင်ရောက်ရန်" : "Back to sign in"}</Link><div className="language-switch" role="group" aria-label={t.language}><button type="button" className={language === "my" ? "active" : ""} aria-pressed={language === "my"} onClick={() => setLanguage("my")}>မြန်မာ</button><button type="button" className={language === "en" ? "active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button></div></div>
      <div className="register-column">
        <div className="register-header"><div className="register-eyebrow"><ShieldCheck size={14} /> {t.secure}</div><h1>{t.title}</h1><p>{t.intro}</p></div>
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="register-name">{t.fullName}</label><div className="field-shell"><UserRound size={18} aria-hidden="true" /><input id="register-name" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} /></div>
          <label className="field-label register-field-gap" htmlFor="register-business">{t.business}</label><div className="field-shell"><Building2 size={18} aria-hidden="true" /><input id="register-business" autoComplete="organization" value={business} onChange={(event) => setBusiness(event.target.value)} /></div>
          <label className="field-label register-field-gap" htmlFor="register-email">{t.email}</label><div className="field-shell"><Mail size={18} aria-hidden="true" /><input id="register-email" type="email" autoComplete="email" placeholder="you@business.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <label className="field-label register-field-gap" htmlFor="register-password">{t.password}</label><div className="field-shell"><LockKeyhole size={18} aria-hidden="true" /><input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="icon-action" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          <label className="field-label register-field-gap" htmlFor="register-confirm">{t.confirm}</label><div className="field-shell"><LockKeyhole size={18} aria-hidden="true" /><input id="register-confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></div>
          <label className="register-consent"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>{t.agree} <Link href="/terms">{t.terms}</Link> {t.and} <Link href="/privacy">{t.privacy}</Link>.</span></label>
          <button className="submit-button" type="submit" disabled={isSubmitting}><span>{isSubmitting ? t.creating : t.create}</span>{isSubmitting ? <span className="button-spinner" /> : <ArrowRight size={18} />}</button>
        </form>
        <p className="register-signin">{t.haveAccount} <Link href="/">{t.signIn}</Link></p>
      </div>
      <div className="form-panel__bottom"><span>© 2026 MMNext POS</span><span>MMNext Auth</span></div>
    </section>
  </main>;
}
