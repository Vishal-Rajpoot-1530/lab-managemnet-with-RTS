import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Check,
  CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileCheck2, FileText,
  FlaskConical, LayoutDashboard, Menu, Microscope, Receipt, ShieldCheck,
  Users, X, Zap, BarChart3, TestTube2, ScanLine, CircleHelp
} from "lucide-react";
import "./landing.css";

const slides = [
  {
    eyebrow: "ONE CONNECTED WORKSPACE",
    title: "Your entire lab. In sync.",
    description: "Bring patient registration, billing, test processing and reporting together in one clear workflow.",
    icon: LayoutDashboard,
    label: "Lab overview",
    metric: "Today’s activity",
    value: "128",
    metricCaption: "cases registered",
    items: [
      ["Patient registration", "Ready", "green"],
      ["Tests in progress", "24 active", "blue"],
      ["Reports to review", "12 pending", "amber"],
    ],
  },
  {
    eyebrow: "FROM REGISTRATION TO REPORT",
    title: "Less paperwork. More progress.",
    description: "Keep patient details, investigations and report status organized as work moves through your lab.",
    icon: FileCheck2,
    label: "Report workflow",
    metric: "Reports completed",
    value: "86",
    metricCaption: "in the current workflow",
    items: [
      ["Sample collection", "Collected", "green"],
      ["Laboratory analysis", "In progress", "blue"],
      ["Report verification", "Review needed", "amber"],
    ],
  },
  {
    eyebrow: "A CLEARER VIEW OF YOUR BUSINESS",
    title: "Know what’s happening, at a glance.",
    description: "See billing activity, outstanding payments and daily operations without juggling multiple records.",
    icon: BarChart3,
    label: "Business insights",
    metric: "Daily collection",
    value: "₹24,850",
    metricCaption: "illustrative dashboard value",
    items: [
      ["Bills generated", "104", "green"],
      ["Payments received", "₹24,850", "blue"],
      ["Outstanding balance", "Needs review", "amber"],
    ],
  },
];

const features = [
  { icon: Users, title: "Patient management", text: "Keep patient records, registration details and visit information organized in one place." },
  { icon: TestTube2, title: "Laboratory operations", text: "Manage tests, categories, packages and the day-to-day flow of laboratory work." },
  { icon: FileText, title: "Reports and results", text: "Follow report progress and keep reporting tasks visible to the right team members." },
  { icon: Receipt, title: "Billing and payments", text: "Create bills, record payments and review daily business activity with less manual effort." },
  { icon: ScanLine, title: "Imaging workflows", text: "Access dedicated areas for ultrasound and digital X-ray case workflows." },
  { icon: ShieldCheck, title: "Team access and control", text: "Support a more structured workflow with employee access and security settings." },
];

const workflow = [
  { n: "01", title: "Register", text: "Add patient details and create a case with the information your team needs." },
  { n: "02", title: "Process", text: "Organize tests and follow laboratory or imaging work through its next steps." },
  { n: "03", title: "Report", text: "Track reporting and verification so pending work stays visible." },
  { n: "04", title: "Review", text: "Check billing and business activity from a connected workspace." },
];

function ProductPreview({ slide, onPrevious, onNext, index }) {
  const ActiveIcon = slide.icon;
  return (
    <div className="lp-product-wrap">
      <div className="lp-orbit lp-orbit-one" />
      <div className="lp-orbit lp-orbit-two" />
      <div className="lp-product-card">
        <aside className="lp-preview-sidebar">
          <div className="lp-preview-brand"><span className="lp-brand-mark"><FlaskConical size={17} /></span><b>LabLIMS</b></div>
          <span className="lp-sidebar-caption">WORKSPACE</span>
          <div className="lp-sidebar-link active"><LayoutDashboard size={15} /> Overview</div>
          <div className="lp-sidebar-link"><Users size={15} /> Patients</div>
          <div className="lp-sidebar-link"><TestTube2 size={15} /> Laboratory</div>
          <div className="lp-sidebar-link"><FileText size={15} /> Reports</div>
          <div className="lp-sidebar-link"><Receipt size={15} /> Billing</div>
          <div className="lp-sidebar-bottom"><ShieldCheck size={14} /> Secure workspace</div>
        </aside>
        <div className="lp-preview-main">
          <div className="lp-preview-topbar">
            <div><span className="lp-preview-kicker">WORKSPACE / OVERVIEW</span><h3>{slide.label}</h3></div>
            <div className="lp-preview-actions"><span className="lp-live-dot" /><span>Live workspace</span><Bell size={16} /></div>
          </div>
          <div className="lp-preview-welcome"><div><span>MONDAY, YOUR WORKSPACE</span><h4>Good work starts with a clear view.</h4><p>Here’s a snapshot of your laboratory operations.</p></div><div className="lp-preview-date"><Clock3 size={13} /> Today</div></div>
          <div className="lp-preview-metric-grid">
            <div className="lp-preview-metric"><span>{slide.metric}</span><div className="lp-metric-value">{slide.value}</div><small><span className="lp-trend"><ArrowUpRight size={12} /> Overview</span> {slide.metricCaption}</small></div>
            <div className="lp-preview-metric"><span>Workflow status</span><div className="lp-status-number">03 <small>stages</small></div><div className="lp-mini-bars"><i /><i /><i /></div></div>
          </div>
          <div className="lp-preview-list-head"><b>Work queue</b><span>Sample overview</span></div>
          <div className="lp-preview-list">
            {slide.items.map((item, i) => <div className="lp-preview-row" key={item[0]}><span className={`lp-row-icon ${item[2]}`}><CheckCircle2 size={14} /></span><span className="lp-row-name">{item[0]}</span><span className={`lp-row-status ${item[2]}`}>{item[1]}</span><ChevronRight size={14} className="lp-row-chevron" /></div>)}
          </div>
          <div className="lp-preview-foot"><span><ShieldCheck size={12} /> Designed for organized workflows</span><span>Preview only</span></div>
        </div>
      </div>
      <div className="lp-float-note lp-float-note-top"><span className="lp-float-icon"><Activity size={17} /></span><div><b>One connected workflow</b><small>From registration to reporting</small></div><Check size={15} className="lp-float-check" /></div>
      <div className="lp-float-note lp-float-note-bottom"><span className="lp-float-icon violet"><FileCheck2 size={17} /></span><div><b>Stay on top of your work</b><small>Clear status at every step</small></div></div>
      <div className="lp-carousel-controls"><button onClick={onPrevious} aria-label="Previous preview"><ChevronLeft size={17} /></button><div className="lp-carousel-dots">{slides.map((s, i) => <button key={s.title} aria-label={`Show slide ${i + 1}`} className={index === i ? "active" : ""} onClick={() => onNext(i)} />)}</div><button onClick={() => onNext((index + 1) % slides.length)} aria-label="Next preview"><ChevronRight size={17} /></button></div>
    </div>
  );
}

export default function Landing() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[slideIndex];

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const changeSlide = (next) => setSlideIndex((next + slides.length) % slides.length);
  const faqs = [
    ["What is LabLIMS?", "LabLIMS is a laboratory management workspace designed to bring patient records, laboratory operations, reports and billing into a more organized workflow."],
    ["Can different teams use the same workspace?", "The project includes areas for laboratory operations, billing, reports and imaging workflows, helping teams work from a shared application."],
    ["Does the landing page change my existing login or dashboard?", "No. This is a public-facing introduction page. Your existing login and application routes remain separate."],
    ["How do I get started?", "Choose Log in to open the existing LabLIMS login page. Access to the application depends on your configured account and environment."],
  ];

  return (
    <main className="lab-landing">
      <header className="lp-header">
        <div className="lp-header-inner">
          <Link to="/" className="lp-brand" aria-label="LabLIMS home"><span className="lp-brand-mark"><FlaskConical size={21} strokeWidth={2.1} /></span><span>Lab<span>LIMS</span><small>LABORATORY MANAGEMENT</small></span></Link>
          <button className="lp-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? "lp-nav open" : "lp-nav"}>
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#workflow" onClick={() => setMenuOpen(false)}>How it works</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
            <Link className="lp-nav-login" to="/login">Log in <ArrowRight size={15} /></Link>
          </nav>
        </div>
      </header>

      <section className="lp-hero" id="platform">
        <div className="lp-hero-grid" aria-hidden="true" />
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <div className="lp-eyebrow"><span className="lp-eyebrow-pulse" /> A BETTER WAY TO RUN YOUR LAB</div>
            <h1>Good science deserves <span>better systems.</span></h1>
            <p className="lp-hero-description">Bring patient management, laboratory workflows, reports and billing into one thoughtfully connected workspace.</p>
            <div className="lp-hero-buttons"><Link to="/login" className="lp-button-primary">Explore your workspace <ArrowRight size={17} /></Link><a href="#features" className="lp-button-secondary">See what’s included <ArrowDownRight size={17} /></a></div>
            <div className="lp-trust-line"><span className="lp-trust-icon"><Check size={13} /></span><span>Built around real laboratory workflows</span><span className="lp-trust-separator">·</span><span>Clear, practical, connected</span></div>
            <div className="lp-hero-rule" />
            <div className="lp-hero-proof"><div className="lp-proof-item"><span className="lp-proof-icon"><Users size={17} /></span><div><b>Patient-first</b><small>Organized records</small></div></div><div className="lp-proof-item"><span className="lp-proof-icon"><FileCheck2 size={17} /></span><div><b>Workflow-ready</b><small>Visible next steps</small></div></div><div className="lp-proof-item"><span className="lp-proof-icon"><ShieldCheck size={17} /></span><div><b>Team-focused</b><small>Structured access</small></div></div></div>
          </div>
          <div className="lp-hero-visual" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
            <ProductPreview slide={slide} index={slideIndex} onPrevious={() => changeSlide(slideIndex - 1)} onNext={changeSlide} />
          </div>
        </div>
        <div className="lp-hero-bottom"><span>ONE WORKSPACE, MULTIPLE WORKFLOWS</span><div><span /><span /><span /></div><span>SCROLL TO EXPLORE <ChevronRight size={13} /></span></div>
      </section>

      <section className="lp-feature-strip" aria-label="LabLIMS modules"><div><FlaskConical /><span>Laboratory</span></div><i /><div><Users /><span>Patients</span></div><i /><div><FileText /><span>Reporting</span></div><i /><div><Receipt /><span>Billing</span></div><i /><div><ScanLine /><span>Imaging</span></div><i /><div><BarChart3 /><span>Business insights</span></div></section>

      <section className="lp-section lp-features" id="features">
        <div className="lp-section-heading"><div><span className="lp-section-kicker">THE WORKSPACE</span><h2>Everything connected.<br /><span>Nothing overcomplicated.</span></h2></div><p>Less time switching between tasks. More clarity about what needs to happen next.</p></div>
        <div className="lp-feature-grid">{features.map((feature, i) => { const Icon = feature.icon; return <article className="lp-feature-card" key={feature.title}><div className="lp-feature-icon"><Icon size={21} /></div><span className="lp-feature-number">0{i + 1}</span><h3>{feature.title}</h3><p>{feature.text}</p><a href="#workflow" aria-label={`Learn about ${feature.title}`}><ArrowUpRight size={17} /></a></article>; })}</div>
      </section>

      <section className="lp-workflow-section" id="workflow"><div className="lp-workflow-inner"><div className="lp-workflow-intro"><span className="lp-section-kicker">A CLEARER WAY TO WORK</span><h2>From the first entry<br />to the final report.</h2><p>Keep everyday work moving with a practical flow that helps your team understand where each case stands.</p><Link to="/login" className="lp-text-link">Go to LabLIMS <ArrowRight size={16} /></Link><div className="lp-workflow-decoration"><div className="lp-workflow-ring"><Microscope size={36} /></div><span /><span /></div></div><div className="lp-workflow-steps">{workflow.map((item, i) => <article className="lp-step" key={item.n}><div className="lp-step-number">{item.n}</div><div className="lp-step-content"><h3>{item.title}</h3><p>{item.text}</p></div><div className="lp-step-check"><Check size={16} /></div></article>)}</div></div></section>

      <section className="lp-section lp-clarity-section"><div className="lp-clarity-card"><div className="lp-clarity-copy"><span className="lp-section-kicker">MADE FOR THE DAY-TO-DAY</span><h2>Make the busy days<br /><span>feel more manageable.</span></h2><p>When your information is organized and the next steps are visible, your team can spend less energy chasing updates.</p><Link to="/login" className="lp-button-primary">Open LabLIMS <ArrowRight size={17} /></Link></div><div className="lp-clarity-visual"><div className="lp-clarity-ring ring-a" /><div className="lp-clarity-ring ring-b" /><div className="lp-clarity-center"><FlaskConical size={33} /></div><div className="lp-clarity-chip chip-a"><CheckCircle2 size={15} /><span>Clear case status</span></div><div className="lp-clarity-chip chip-b"><FileText size={15} /><span>Reports in view</span></div><div className="lp-clarity-chip chip-c"><Receipt size={15} /><span>Billing organized</span></div></div></div></section>

      <section className="lp-faq-section" id="faq"><div className="lp-faq-inner"><div className="lp-faq-intro"><span className="lp-section-kicker">GOOD TO KNOW</span><h2>Questions, answered.</h2><p>A few quick details about the LabLIMS workspace.</p><div className="lp-faq-help"><CircleHelp size={19} /><span>Need access? Use the login page or contact your system administrator.</span></div></div><div className="lp-faq-list">{faqs.map(([question, answer], i) => <article className={`lp-faq-item ${openFaq === i ? "expanded" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{question}</span><span className="lp-faq-toggle">{openFaq === i ? <X size={15} /> : <ArrowRight size={15} />}</span></button>{openFaq === i && <p>{answer}</p>}</article>)}</div></div></section>

      <section className="lp-final-cta"><div className="lp-final-cta-inner"><div className="lp-final-icon"><FlaskConical size={24} /></div><div><span className="lp-section-kicker">YOUR LAB, MORE ORGANIZED</span><h2>Ready to get to work?</h2><p>Head to your LabLIMS workspace and pick up where your team needs you.</p></div><Link to="/login" className="lp-button-light">Go to login <ArrowRight size={17} /></Link><div className="lp-cta-decoration" /></div></section>

      <footer className="lp-footer"><div className="lp-footer-main"><Link to="/" className="lp-brand"><span className="lp-brand-mark"><FlaskConical size={19} /></span><span>Lab<span>LIMS</span><small>LABORATORY MANAGEMENT</small></span></Link><p>A clearer workspace for laboratory operations.</p><nav><a href="#platform">Platform</a><a href="#features">Features</a><a href="#workflow">Workflow</a><Link to="/login">Log in</Link></nav></div><div className="lp-footer-bottom"><span>© {new Date().getFullYear()} LabLIMS. All rights reserved.</span><span><ShieldCheck size={14} /> Built for organized laboratory workflows</span></div></footer>
    </main>
  );
}
