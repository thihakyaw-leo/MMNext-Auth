/* Green Ledger direction: policy content uses the same quiet cream surface, readable hierarchy, and green trust cues as the login page. */
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const logo = "https://cloud.kaungthant.shop/mmnext-auth/mmnext-pos-logo.png?v=4x-20260908";

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<"my" | "en">("my");
  const my = language === "my";
  const sections = my ? [
    ["၁။ စုဆောင်းသည့်အချက်အလက်များ", "ဝင်ရောက်အသုံးပြုသည့်အခါ MMNext Auth မှ အီးမေးလ်လိပ်စာ၊ အမည်၊ အကောင့်အမှတ်နှင့် authentication အချက်အလက်များကို ရရှိနိုင်ပါသည်။ POS feature များအသုံးပြုသည့်အခါ ကုန်ပစ္စည်း၊ အရောင်း၊ စတော့အပြောင်းအလဲ၊ receipt နှင့် workspace setting များကို စီမံဆောင်ရွက်နိုင်ပါသည်။"],
    ["၂။ အချက်အလက်အသုံးပြုပုံ", "အကောင့်ဝင်ရောက်မှု၊ လုံခြုံသော session၊ POS လုပ်ဆောင်ချက်များ၊ အရေးကြီးသော service message များနှင့် service ယုံကြည်စိတ်ချရမှုအတွက် အချက်အလက်များကို အသုံးပြုပါသည်။ သင့်လုပ်ငန်းမှတ်တမ်းများကို မသက်ဆိုင်သော ကြော်ငြာများအတွက် အသုံးမပြုပါ။"],
    ["၃။ Authentication နှင့် လုံခြုံရေး", "Authentication ကို MMNext Auth မှ စီမံပါသည်။ Login flow တွင် authorization code၊ PKCE နှင့် သက်တမ်းတို session data များ ပါဝင်နိုင်ပါသည်။ စကားဝှက်ကို လျှို့ဝှက်ထားပြီး မသင်္ကာဖွယ်အသုံးပြုမှုရှိပါက စီမံခန့်ခွဲသူထံ ချက်ချင်းအကြောင်းကြားပါ။"],
    ["၄။ မျှဝေခြင်းနှင့် service provider များ", "Cloudflare Workers၊ D1၊ KV နှင့် email delivery service များအပါအဝင် MMNext POS operator ကိုယ်စား data စီမံပေးသော infrastructure နှင့် authentication provider များနှင့် လိုအပ်သည့်အချက်အလက်များကို မျှဝေနိုင်ပါသည်။ ကိုယ်ရေးအချက်အလက်များကို ရောင်းချမည်မဟုတ်ပါ။"],
    ["၅။ သိမ်းဆည်းခြင်းနှင့် ဖျက်ခြင်း", "Service ပေးရန်၊ လုပ်ငန်းဆိုင်ရာလိုအပ်ချက်များ ဖြည့်ဆည်းရန် သို့မဟုတ် သက်ဆိုင်ရာတာဝန်များ လိုက်နာရန် လိုအပ်သလောက် အချက်အလက်များကို သိမ်းဆည်းပါသည်။ Workspace အချက်အလက် ပြင်ဆင်ခြင်း သို့မဟုတ် ဖျက်ခြင်းအတွက် သင့်လုပ်ငန်းစီမံခန့်ခွဲသူထံ တောင်းဆိုပါ။"],
    ["၆။ Cookies နှင့် local storage", "Login experience သည် OAuth state၊ PKCE verification data နှင့် authentication session အတွက် browser session storage ကို အသုံးပြုနိုင်ပါသည်။ ဤတန်ဖိုးများသည် login လုံခြုံရေးအတွက် ဖြစ်ပြီး အမြဲတမ်း profile မဟုတ်ပါ။"],
    ["၇။ ဆက်သွယ်ရန်", "ဤ policy သို့မဟုတ် workspace data အကြောင်း မေးမြန်းလိုပါက သင့် MMNext POS administrator သို့မဟုတ် အဖွဲ့အစည်းမှ ပေးထားသော service operator ဆက်သွယ်ရန်လမ်းကြောင်းကို အသုံးပြုပါ။"],
  ] : [
    ["1. Information we collect", "When you sign in, MMNext Auth may receive your email address, name, account identifier, and authentication details. POS features may process products, sales, stock movements, receipts, and workspace settings."],
    ["2. How we use information", "We use account information to authenticate users, maintain secure sessions, provide POS functionality, communicate important service messages, prevent misuse, and improve reliability. We do not use business records for unrelated advertising."],
    ["3. Authentication and security", "Authentication is handled through MMNext Auth. The login flow may use authorization codes, PKCE, and short-lived session data. Keep your password private and contact your administrator if you believe your account was accessed improperly."],
    ["4. Sharing and service providers", "We may share information with infrastructure and authentication providers that process data on behalf of the MMNext POS operator, including Cloudflare Workers, D1, KV, and email delivery services. We do not sell personal information."],
    ["5. Retention and deletion", "We retain information as needed to provide the service, meet operational requirements, or comply with applicable obligations. Ask your business administrator to request correction or deletion of workspace information."],
    ["6. Cookies and local storage", "The login experience may use browser session storage for OAuth state, PKCE verification data, and the returned authentication session. These values support sign-in security and are not intended to be a permanent profile."],
    ["7. Contact", "For questions about this policy or your workspace data, contact your MMNext POS administrator or the service operator using your organization’s contact channel."],
  ];
  return <main className="policy-shell">
    <header className="policy-header">
      <Link href="/" className="policy-back"><ArrowLeft size={16} /> {my ? "ဝင်ရောက်ရန် ပြန်သွားမည်" : "Back to sign in"}</Link>
      <div className="policy-header-actions"><div className="policy-brand"><img src={logo} alt="MMNext POS" /> <span>MMNext <b>POS</b></span></div><div className="language-switch" role="group" aria-label={my ? "ဘာသာစကား" : "Language"}><button type="button" className={my ? "active" : ""} aria-pressed={my} onClick={() => setLanguage("my")}>မြန်မာ</button><button type="button" className={!my ? "active" : ""} aria-pressed={!my} onClick={() => setLanguage("en")}>EN</button></div></div>
    </header>
    <article className="policy-content">
      <div className="policy-kicker"><ShieldCheck size={15} /> MMNext POS · {my ? "ကိုယ်ရေးအချက်အလက်" : "Privacy"}</div>
      <h1>{my ? "ကိုယ်ရေးအချက်အလက် မူဝါဒ" : "Privacy Policy"}</h1>
      <p className="policy-lead">{my ? "MMNext POS သည် လုပ်ငန်းများကို ယုံကြည်စိတ်ချစွာ လုပ်ကိုင်နိုင်ရန် ရည်ရွယ်ထားပါသည်။ ဤမူဝါဒတွင် စုဆောင်းသည့်အချက်အလက်၊ အသုံးပြုပုံနှင့် သင့်ရွေးချယ်ခွင့်များကို ရှင်းပြထားပါသည်။" : "We designed MMNext POS to help businesses work with confidence. This policy explains what information we collect, why we use it, and the choices available to you."}</p>
      <p className="policy-updated">{my ? "စတင်အကျိုးသက်ရောက်သည့်နေ့: ၅ စက်တင်ဘာ ၂၀၂၆" : "Effective date: 5 September 2026"}</p>
      {sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
      <aside className="policy-note">{my ? "ဤစာမျက်နှာသည် product draft ဖြစ်ပါသည်။ တရားဝင်အသုံးပြုရန် မထုတ်ပြန်မီ qualified attorney ဖြင့် ပြန်လည်စစ်ဆေးပြီး contact၊ retention နှင့် jurisdiction အချက်အလက်များ ဖြည့်စွက်ပါ။" : "This page is a working product draft. Have a qualified attorney review it and replace the contact, retention, and jurisdiction details before publishing for legal reliance."}</aside>
    </article>
  </main>;
}
