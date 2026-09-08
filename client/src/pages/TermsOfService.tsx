/* Green Ledger direction: terms content is direct, readable, and operationally clear without overwhelming the sign-in experience. */
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const logo = "https://cloud.kaungthant.shop/mmnext-auth/mmnext-pos-logo.png?v=4x-20260908";

export default function TermsOfService() {
  const [language, setLanguage] = useState<"my" | "en">("my");
  const my = language === "my";
  const sections = my ? [
    ["၁။ သင့် workspace", "MMNext POS ကို လုပ်ငန်းများနှင့် ခွင့်ပြုထားသော team member များအတွက် ပေးထားပါသည်။ အကောင့်ခွင့်ပြုချက်၊ workspace အချက်အလက်မှန်ကန်မှုနှင့် POS data ကို အသုံးပြုနိုင်သူများကို သင့်အဖွဲ့အစည်းက စီမံရန် တာဝန်ရှိပါသည်။"],
    ["၂။ အကောင့်တာဝန်များ", "မိမိအကောင့်ကိုသာ အသုံးပြုပါ၊ login အချက်အလက်များကို လျှို့ဝှက်ထားပါ၊ သံသယဖြစ်ဖွယ်လုပ်ဆောင်မှုရှိပါက စီမံခန့်ခွဲသူထံ အကြောင်းကြားပါ။ လုပ်ဆောင်ချက်ပြုလုပ်သူကို အဖွဲ့အစည်းက သိရှိနိုင်ရန် တားဆီးသည့်ပုံစံဖြင့် access မျှဝေခြင်း မပြုရပါ။"],
    ["၃။ လက်ခံနိုင်သောအသုံးပြုမှု", "MMNext POS ကို တရားဝင်လုပ်ငန်းဆောင်တာများအတွက်သာ အသုံးပြုရပါမည်။ Authentication ကျော်လွှားရန်ကြိုးစားခြင်း၊ service availability ထိခိုက်စေခြင်း၊ malicious code တင်ခြင်း၊ ခွင့်ပြုချက်မရှိဘဲ အခြား workspace ကို ဝင်ရောက်ခြင်း သို့မဟုတ် အခြားသူ၏အခွင့်အရေးကို ချိုးဖောက်ခြင်း မပြုရပါ။"],
    ["၄။ လုပ်ငန်းမှတ်တမ်းများ", "Workspace ထဲသို့ ထည့်သွင်းသော ကုန်ပစ္စည်း၊ အရောင်း၊ customer၊ employee နှင့် financial record များ၏ မှန်ကန်မှု၊ ပြည့်စုံမှု၊ backup နှင့် တရားဝင်အသုံးပြုမှုအတွက် သင့်အဖွဲ့အစည်းက တာဝန်ယူပါသည်။"],
    ["၅။ Service ရရှိနိုင်မှု", "Service ကို ယုံကြည်စိတ်ချရအောင် ထိန်းသိမ်းရန် ကြိုးစားသော်လည်း maintenance၊ network condition၊ provider incident သို့မဟုတ် ထိန်းချုပ်၍မရသော အခြေအနေများကြောင့် ယာယီရပ်တန့်နိုင်ပါသည်။ အရေးကြီးမှတ်တမ်းများအတွက် သင့် operator က သင့်လျော်သော backup ထားရှိသင့်ပါသည်။"],
    ["၆။ ပြောင်းလဲခြင်းနှင့် ရပ်ဆိုင်းခြင်း", "Service operator သည် terms၊ feature သို့မဟုတ် integration များကို အခါအားလျော်စွာ ပြောင်းလဲနိုင်ပါသည်။ User များကို ကာကွယ်ရန်၊ misuse စစ်ဆေးရန် သို့မဟုတ် အဖွဲ့အစည်း၏ account direction ကို လိုက်နာရန် လိုအပ်ပါက access ကို ယာယီရပ်ဆိုင်းနိုင်ပါသည်။"],
    ["၇။ ဆက်သွယ်ရန်နှင့် တရားဝင်အချက်အလက်", "အကောင့်၊ billing arrangement သို့မဟုတ် workspace access မေးမြန်းချက်များအတွက် သင့်အဖွဲ့အစည်း၏ MMNext POS administrator ထံ ဆက်သွယ်ပါ။ ထုတ်ပြန်ခြင်းမပြုမီ operator ၏ တရားဝင်အဖွဲ့အစည်း၊ governing law၊ dispute process နှင့် official contact များကို ဖြည့်စွက်သင့်ပါသည်။"],
  ] : [
    ["1. Your workspace", "MMNext POS is provided to businesses and their authorized team members. Your organization is responsible for account permissions, accurate workspace information, and managing who may access its POS data."],
    ["2. Account responsibilities", "Use your own account, keep credentials confidential, and notify your administrator if you notice suspicious activity. Do not share access in a way that prevents the organization from knowing who performed an action."],
    ["3. Acceptable use", "You may use MMNext POS only for lawful business operations. Do not bypass authentication, interfere with service availability, upload malicious code, access another workspace without permission, or violate another person’s rights."],
    ["4. Business records", "Your organization is responsible for the accuracy, completeness, backups, and lawful use of product, sales, customer, employee, and financial records entered into the workspace."],
    ["5. Service availability", "We aim to keep the service reliable, but maintenance, network conditions, provider incidents, or events outside reasonable control may temporarily affect availability. Maintain appropriate backups for critical records."],
    ["6. Changes and termination", "The service operator may update these terms, features, or supported integrations. Access may be suspended when necessary to protect users, investigate misuse, or follow the organization’s account direction."],
    ["7. Contact and governing details", "For account, billing, or workspace access questions, contact your organization’s MMNext POS administrator. Add the operator’s legal entity, governing law, dispute process, and official contact details before publication."],
  ];
  return <main className="policy-shell">
    <header className="policy-header">
      <Link href="/" className="policy-back"><ArrowLeft size={16} /> {my ? "ဝင်ရောက်ရန် ပြန်သွားမည်" : "Back to sign in"}</Link>
      <div className="policy-header-actions"><div className="policy-brand"><img src={logo} alt="MMNext POS" /> <span>MMNext <b>POS</b></span></div><div className="language-switch" role="group" aria-label={my ? "ဘာသာစကား" : "Language"}><button type="button" className={my ? "active" : ""} aria-pressed={my} onClick={() => setLanguage("my")}>မြန်မာ</button><button type="button" className={!my ? "active" : ""} aria-pressed={!my} onClick={() => setLanguage("en")}>EN</button></div></div>
    </header>
    <article className="policy-content">
      <div className="policy-kicker"><BriefcaseBusiness size={15} /> MMNext POS · {my ? "စည်းမျဉ်းများ" : "Terms"}</div>
      <h1>{my ? "ဝန်ဆောင်မှု စည်းမျဉ်းများ" : "Terms of Service"}</h1>
      <p className="policy-lead">{my ? "ဤစည်းမျဉ်းများသည် MMNext POS workspace အသုံးပြုရန် အခြေခံစည်းကမ်းများကို ဖော်ပြထားပါသည်။ သင့်အဖွဲ့အစည်းမှတစ်ဆင့် service ကို အသုံးပြုခြင်းဖြင့် တာဝန်ရှိစွာအသုံးပြုပြီး အဖွဲ့အစည်း၏ညွှန်ကြားချက်များကို လိုက်နာရန် သဘောတူပါသည်။" : "These terms describe the basic rules for using the MMNext POS workspace. By accessing the service through your organization, you agree to use it responsibly and follow your organization’s instructions."}</p>
      <p className="policy-updated">{my ? "စတင်အကျိုးသက်ရောက်သည့်နေ့: ၅ စက်တင်ဘာ ၂၀၂၆" : "Effective date: 5 September 2026"}</p>
      {sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
      <aside className="policy-note">{my ? "ဤစာမျက်နှာသည် product draft ဖြစ်ပါသည်။ တရားဝင်အသုံးပြုရန် မထုတ်ပြန်မီ qualified attorney ဖြင့် ပြန်လည်စစ်ဆေးပြီး operator ၏ legal entity၊ jurisdiction၊ liability၊ warranty နှင့် dispute provision များ ဖြည့်စွက်ပါ။" : "This page is a working product draft. Have a qualified attorney review it and add the operator’s legal entity, jurisdiction, liability, warranty, and dispute provisions before publishing for legal reliance."}</aside>
    </article>
  </main>;
}
