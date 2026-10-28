
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChartNoAxesCombined,
  ChevronDown,
  Clock3,
  CreditCard,
  FileCheck2,
  FileText,
  FlaskConical,
  Headphones,
  HeartPulse,
  LayoutDashboard,
  Menu,
  Microscope,
  Pause,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import "./landing.css";
import labLimsLogo from "../../assets/logo2.png";
import logo from "../../assets/logo2.png";

/* =====================================================
   SHARED COMPONENTS
===================================================== */

function LabLimsLogo({ className = "lp-brand", onClick }) {
  return (
    <Link
      to="/"
      className={className}
      onClick={onClick}
      aria-label="LabLIMS home"
    >
      <img
        src={labLimsLogo}
        alt="LabLIMS"
        className="lp-custom-logo"
      />
      <span className="lp-brand-text">
        LAB<span>LIMS</span>
      </span>
    </Link>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReduced(query.matches);

    const handler = (event) => setReduced(event.matches);

    query.addEventListener("change", handler);

    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) return undefined;

    if (
      reduced ||
      typeof IntersectionObserver === "undefined"
    ) {
      setSeen(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      className={`lp-reveal ${
        seen ? "is-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

/* =====================================================
   NAVBAR
===================================================== */

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Workflow", href: "#workflow" },
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#solutions" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="lp-header">
      <nav className="lp-navbar" aria-label="Main navigation">
        <LabLimsLogo onClick={closeMenu} />

        <div
          className={`lp-nav-links ${
            menuOpen ? "active" : ""
          }`}
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="lp-nav-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <div className="lp-mobile-actions">
            <Link
              to="/login"
              className="lp-login-link"
              onClick={closeMenu}
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="lp-btn lp-btn-primary"
              onClick={closeMenu}
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="lp-nav-actions">
          <Link to="/login" className="lp-login-link">
            Log in
          </Link>

          <Link
            to="/signup"
            className="lp-btn lp-btn-primary"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="lp-menu-toggle"
          aria-label={
            menuOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  );
}

/* =====================================================
   HERO DASHBOARD MOCKUP
===================================================== */

const STAGES = [
  { label: "Registered", tone: "blue" },
  { label: "In analysis", tone: "amber" },
  { label: "Under review", tone: "violet" },
  { label: "Released", tone: "green" },
];

const SAMPLES = [
  {
    id: "PT-1024",
    name: "Aarav Sharma",
    test: "Complete blood count",
    stage: 3,
  },
  {
    id: "PT-1025",
    name: "Ananya Verma",
    test: "Liver function test",
    stage: 1,
  },
  {
    id: "PT-1026",
    name: "Rohan Gupta",
    test: "Thyroid profile",
    stage: 2,
  },
  {
    id: "PT-1027",
    name: "Priya Singh",
    test: "Blood glucose",
    stage: 0,
  },
  {
    id: "PT-1028",
    name: "Kabir Mehta",
    test: "Lipid profile",
    stage: 1,
  },
  {
    id: "PT-1029",
    name: "Isha Nair",
    test: "HbA1c",
    stage: 0,
  },
];

function useSampleFlow() {
  const [samples, setSamples] = useState(SAMPLES);
  const [lastId, setLastId] = useState(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const cursor = useRef(0);

  const running = !paused && !hovered && !reduced;

  useEffect(() => {
    if (!running) return undefined;

    const timer = setInterval(() => {
      const index = cursor.current % SAMPLES.length;
      cursor.current += 1;

      setSamples((prev) =>
        prev.map((sample, i) =>
          i === index
            ? {
                ...sample,
                stage: (sample.stage + 1) % STAGES.length,
              }
            : sample
        )
      );

      setLastId(SAMPLES[index].id);
    }, 2200);

    return () => clearInterval(timer);
  }, [running]);

  return {
    samples,
    lastId,
    paused,
    setPaused,
    setHovered,
    running,
  };
}

function Spark({ points }) {
  const max = Math.max(...points);
  const min = Math.min(...points);

  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 84;
      const y =
        26 - ((point - min) / (max - min || 1)) * 22;

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      className="lp-spark"
      viewBox="0 0 84 30"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <polyline
        points={path}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AppMockup() {
  const {
    samples,
    lastId,
    paused,
    setPaused,
    setHovered,
    running,
  } = useSampleFlow();

  const menu = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Users, label: "Patients" },
    {
      icon: Microscope,
      label: "Investigations",
      active: true,
      count: 8,
    },
    { icon: FileText, label: "Reports" },
    { icon: CreditCard, label: "Billing" },
    { icon: ChartNoAxesCombined, label: "Analytics" },
  ];

  const kpis = [
    {
      label: "Total patients",
      value: "1,284",
      change: "+12.8%",
      icon: Users,
      tone: "blue",
      spark: [4, 6, 5, 8, 7, 10, 12],
    },
    {
      label: "Tests completed",
      value: "846",
      change: "+8.2%",
      icon: FlaskConical,
      tone: "violet",
      spark: [6, 5, 7, 6, 9, 8, 11],
    },
    {
      label: "Reports ready",
      value: "92",
      change: "+5.4%",
      icon: FileCheck2,
      tone: "green",
      spark: [3, 5, 4, 6, 6, 8, 9],
    },
  ];

  return (
    <div
      className="lp-app"
      aria-label="LabLIMS dashboard preview"
    >
      <aside className="lp-app-side">
        <div className="lp-app-workspace">
          <span className="lp-app-ws-icon">
            <HeartPulse size={16} />
          </span>

          <div>
            <strong>City Diagnostics</strong>
            <span>Laboratory workspace</span>
          </div>
        </div>

        <ul className="lp-app-menu">
          {menu.map(
            ({ icon: Icon, label, active, count }) => (
              <li
                key={label}
                className={active ? "active" : ""}
              >
                <Icon size={16} />
                {label}

                {count && (
                  <span className="lp-app-count">
                    {count}
                  </span>
                )}
              </li>
            )
          )}
        </ul>

        <ul className="lp-app-menu lp-app-menu-bottom">
          <li>
            <CalendarDays size={16} />
            Appointments
          </li>

          <li>
            <Settings size={16} />
            Settings
          </li>
        </ul>
      </aside>

      <div className="lp-app-main">
        <div className="lp-app-top">
          <div className="lp-app-search">
            <Search size={15} />
            Search patients, tests, reports
          </div>

          <span className="lp-app-bell">
            <Bell size={16} />
            <i />
          </span>

          <span className="lp-app-avatar">AK</span>
        </div>

        <div className="lp-app-body">
          <div className="lp-app-greeting">
            <div>
              <h3>Good morning, Admin</h3>
              <p>
                Here is what is happening in your laboratory
                today.
              </p>
            </div>

            <button
              type="button"
              className="lp-board-toggle"
              onClick={() => setPaused((value) => !value)}
              aria-label={
                paused ? "Resume live demo" : "Pause live demo"
              }
            >
              <span
                className="lp-live-dot"
                data-live={running}
              />

              {paused ? (
                <Play size={13} />
              ) : (
                <Pause size={13} />
              )}

              {paused ? "Resume" : "Live"}
            </button>
          </div>

          <div className="lp-kpis">
            {kpis.map(
              ({
                label,
                value,
                change,
                icon: Icon,
                tone,
                spark,
              }) => (
                <div
                  className={`lp-kpi ${tone}`}
                  key={label}
                >
                  <div className="lp-kpi-top">
                    <span>{label}</span>
                    <i>
                      <Icon size={15} />
                    </i>
                  </div>

                  <div className="lp-kpi-bottom">
                    <div>
                      <strong>{value}</strong>
                      <em>
                        <ArrowUpRight size={12} />
                        {change}
                      </em>
                    </div>

                    <Spark points={spark} />
                  </div>
                </div>
              )
            )}
          </div>

          <div
            className="lp-board-columns"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {STAGES.map((stage, stageIndex) => {
              const items = samples.filter(
                (sample) => sample.stage === stageIndex
              );

              return (
                <div
                  className="lp-board-column"
                  key={stage.label}
                >
                  <div className="lp-board-column-head">
                    <span
                      className={`lp-dot ${stage.tone}`}
                    />
                    <strong>{stage.label}</strong>
                    <span className="lp-board-count">
                      {items.length}
                    </span>
                  </div>

                  <div className="lp-board-cards">
                    {items.map((sample) => (
                      <div
                        key={sample.id}
                        className={`lp-sample ${
                          sample.id === lastId
                            ? "just-moved"
                            : ""
                        }`}
                      >
                        <div className="lp-sample-top">
                          <span
                            className={`lp-avatar ${stage.tone}`}
                          >
                            {initials(sample.name)}
                          </span>

                          <span className="lp-sample-id">
                            {sample.id}
                          </span>
                        </div>

                        <strong>{sample.name}</strong>
                        <span>{sample.test}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="lp-hero">
      <div className="lp-hero-bg" aria-hidden="true">
        <span className="lp-aurora lp-aurora-a" />
        <span className="lp-aurora lp-aurora-b" />
        <span className="lp-aurora lp-aurora-c" />
      </div>

      <div className="lp-container lp-hero-inner">
        <p className="lp-hero-badge">
          <FlaskConical size={15} />
          Laboratory management software
        </p>

        <h1>
          Every sample, tracked from front desk to final report.
        </h1>

        <p className="lp-hero-description">
          Register patients, order investigations, review results
          and release reports from one connected workspace built
          for diagnostic laboratories.
        </p>

        <div className="lp-hero-actions">
          <Link
            to="/signup"
            className="lp-btn lp-btn-primary lp-btn-large"
          >
            Get started free <ArrowRight size={17} />
          </Link>

          <a
            href="#workflow"
            className="lp-btn lp-btn-glass lp-btn-large"
          >
            See how it works
          </a>
        </div>

        <ul className="lp-hero-points">
          <li>
            <Check size={15} />
            Patients, tests and reports linked
          </li>
          <li>
            <Check size={15} />
            Live status for every investigation
          </li>
          <li>
            <Check size={15} />
            Role-aware team access
          </li>
        </ul>
      </div>

      <div className="lp-container lp-hero-stage">
        <div className="lp-float lp-float-left">
          <span className="lp-float-icon green">
            <Check size={16} />
          </span>
          <div>
            <strong>Report generated</strong>
            <span>Ready for review</span>
          </div>
        </div>

        <div className="lp-float lp-float-right">
          <span className="lp-float-icon blue">
            <ShieldCheck size={16} />
          </span>
          <div>
            <strong>Quality checks</strong>
            <span>98.6% on track</span>
          </div>
        </div>

        <AppMockup />

        <p className="lp-hero-note">
          Sample data. Samples move on their own.
        </p>
      </div>
    </section>
  );
}

/* =====================================================
   MARQUEE
===================================================== */

function Marquee() {
  const items = [
    { icon: Users, label: "Patient registration" },
    { icon: Search, label: "Searchable records" },
    { icon: Microscope, label: "Test organisation" },
    { icon: Activity, label: "Status tracking" },
    { icon: FileText, label: "Report preparation" },
    { icon: CreditCard, label: "Invoice tracking" },
    { icon: ChartNoAxesCombined, label: "Activity summaries" },
    { icon: ShieldCheck, label: "Role-aware access" },
  ];

  return (
    <section
      className="lp-marquee"
      aria-label="What LabLIMS covers"
    >
      <div className="lp-marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1}>
            {items.map(({ icon: Icon, label }) => (
              <li key={label}>
                <Icon size={18} />
                {label}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

/* =====================================================
   WORKFLOW
===================================================== */

const FLOW_INTERVAL = 6000;

const FLOW = [
  {
    title: "Register the patient",
    text: "Capture details once at the front desk. The record follows the patient through every test and report.",
    panel: "New patient",
    tag: { label: "Registered", tone: "blue" },
    rows: [
      ["Name", "Aarav Sharma"],
      ["Patient ID", "PT-1024"],
      ["Referred by", "Dr. Mehra"],
    ],
  },
  {
    title: "Order investigations",
    text: "Add one or more tests to the visit and send them to the people who will run them.",
    panel: "Investigations for PT-1024",
    tag: { label: "Ordered", tone: "blue" },
    rows: [
      ["Complete blood count", "Haematology"],
      ["Liver function test", "Biochemistry"],
      ["Thyroid profile", "Biochemistry"],
    ],
  },
  {
    title: "Track progress",
    text: "See what is waiting, what is being processed and what is done, without asking around.",
    panel: "Today's queue",
    tag: { label: "In analysis", tone: "amber" },
    rows: [
      ["Complete blood count", "Completed"],
      ["Liver function test", "Processing"],
      ["Thyroid profile", "Pending"],
    ],
  },
  {
    title: "Review and prepare the report",
    text: "Results sit next to the patient record, so reports are prepared from the same source.",
    panel: "Report draft",
    tag: { label: "Under review", tone: "violet" },
    rows: [
      ["Patient", "Aarav Sharma"],
      ["Results", "Attached"],
      ["Reviewer", "Awaiting sign-off"],
    ],
  },
  {
    title: "Release and bill",
    text: "Share the finished report and keep the invoice tied to the same visit.",
    panel: "Visit summary",
    tag: { label: "Released", tone: "green" },
    rows: [
      ["Report", "Ready for review"],
      ["Invoice", "Generated"],
      ["Payment", "Tracked"],
    ],
  },
];

function WorkflowSection() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  const running = !hovered && !reduced;

  useEffect(() => {
    if (!running) return undefined;

    const timer = setTimeout(
      () =>
        setActive((current) => (current + 1) % FLOW.length),
      FLOW_INTERVAL
    );

    return () => clearTimeout(timer);
  }, [active, running]);

  const step = FLOW[active];

  return (
    <section className="lp-section" id="workflow">
      <div className="lp-container">
        <Reveal className="lp-section-heading">
          <h2>From walk-in to released report in five steps.</h2>
          <p>
            LabLIMS follows the way a sample actually moves
            through your lab, so each person sees the next thing
            to do.
          </p>
        </Reveal>

        <Reveal className="lp-flow" delay={80}>
          <ol
            className="lp-flow-list"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
          >
            {FLOW.map((item, index) => (
              <li key={item.title}>
                <button
                  type="button"
                  className={`lp-flow-item ${
                    index === active ? "active" : ""
                  }`}
                  onClick={() => setActive(index)}
                  aria-current={
                    index === active ? "step" : undefined
                  }
                >
                  <span className="lp-flow-num">
                    {index + 1}
                  </span>

                  <span className="lp-flow-body">
                    <strong>{item.title}</strong>
                    <span className="lp-flow-text">
                      <span>{item.text}</span>
                    </span>
                  </span>

                  {index === active && !reduced && (
                    <span
                      key={`${active}-${running}`}
                      className="lp-flow-progress"
                      style={{
                        animationDuration: `${FLOW_INTERVAL}ms`,
                        animationPlayState: running
                          ? "running"
                          : "paused",
                      }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ol>

          <div className="lp-flow-stage" aria-live="polite">
            <div className="lp-panel" key={active}>
              <div className="lp-panel-head">
                <strong>{step.panel}</strong>

                <span className={`lp-chip ${step.tag.tone}`}>
                  <span className="lp-chip-dot" />
                  {step.tag.label}
                </span>
              </div>

              <ul className="lp-panel-rows">
                {step.rows.map(([label, value]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>

              <div
                className="lp-panel-steps"
                aria-hidden="true"
              >
                {FLOW.map((item, index) => (
                  <span
                    key={item.title}
                    className={index <= active ? "done" : ""}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =====================================================
   FEATURES
===================================================== */

function FeaturesSection() {
  return (
    <section
      className="lp-section lp-section-tint"
      id="features"
    >
      <div className="lp-container">
        <Reveal className="lp-section-heading">
          <h2>Everything your lab needs. Nothing it doesn't.</h2>
          <p>
            Six connected modules that share one record, so
            nobody re-enters the same details twice.
          </p>
        </Reveal>

        <div className="lp-bento">
          <Reveal
            as="article"
            className="lp-tile lp-tile-patients"
          >
            <div className="lp-tile-copy">
              <span className="lp-tile-icon blue">
                <Users size={20} />
              </span>
              <h3>Patient management</h3>
              <p>
                Register patients quickly, find any record in
                seconds and see their full history in one place.
              </p>
            </div>

            <div className="lp-mini">
              <div className="lp-mini-search">
                <Search size={15} />
                <span>Search by name or patient ID</span>
              </div>

              {[
                ["Aarav Sharma", "PT-1024"],
                ["Ananya Verma", "PT-1025"],
                ["Rohan Gupta", "PT-1026"],
              ].map(([name, id]) => (
                <div className="lp-mini-row" key={id}>
                  <span className="lp-avatar blue">
                    {initials(name)}
                  </span>
                  <strong>{name}</strong>
                  <span className="lp-sample-id">{id}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="lp-tile lp-tile-invest"
            delay={80}
          >
            <div className="lp-tile-copy">
              <span className="lp-tile-icon violet">
                <Microscope size={20} />
              </span>
              <h3>Investigation management</h3>
              <p>
                Organise test requests and watch each one move
                from pending to complete.
              </p>
            </div>

            <div className="lp-mini lp-mini-chips">
              {[
                ["Completed", "green"],
                ["Processing", "amber"],
                ["Pending", "blue"],
                ["Under review", "violet"],
              ].map(([label, tone]) => (
                <span className={`lp-chip ${tone}`} key={label}>
                  <span className="lp-chip-dot" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="lp-tile lp-tile-reports"
          >
            <div className="lp-mini lp-mini-doc">
              <div className="lp-doc-head">
                <FileText size={16} />
                <strong>Report</strong>
                <span className="lp-chip green">
                  <span className="lp-chip-dot" />
                  Ready
                </span>
              </div>

              <span className="lp-line w80" />
              <span className="lp-line w60" />
              <span className="lp-line w90" />
              <span className="lp-line w40" />
            </div>

            <div className="lp-tile-copy">
              <span className="lp-tile-icon green">
                <FileCheck2 size={20} />
              </span>
              <h3>Reports and results</h3>
              <p>
                Prepare clear reports from results already tied
                to the patient.
              </p>
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="lp-tile lp-tile-billing"
            delay={80}
          >
            <div className="lp-mini lp-mini-bill">
              {[
                ["INV-210", "Paid", "green"],
                ["INV-211", "Due", "amber"],
                ["INV-212", "Paid", "green"],
              ].map(([id, status, tone]) => (
                <div className="lp-mini-row" key={id}>
                  <strong>{id}</strong>
                  <span className={`lp-chip ${tone}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>

            <div className="lp-tile-copy">
              <span className="lp-tile-icon orange">
                <CreditCard size={20} />
              </span>
              <h3>Billing and payments</h3>
              <p>
                Keep invoices next to the work they belong to.
              </p>
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="lp-tile lp-tile-insights"
            delay={160}
          >
            <div
              className="lp-mini lp-mini-bars"
              aria-hidden="true"
            >
              {[38, 56, 44, 72, 60, 86, 68].map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="lp-tile-copy">
              <span className="lp-tile-icon cyan">
                <ChartNoAxesCombined size={20} />
              </span>
              <h3>Insights and analytics</h3>
              <p>
                A clear overview of daily activity and
                operational trends.
              </p>
            </div>
          </Reveal>

          <Reveal
            as="article"
            className="lp-tile lp-tile-access"
          >
            <div className="lp-tile-copy">
              <span className="lp-tile-icon glow">
                <ShieldCheck size={20} />
              </span>
              <h3>Controlled access</h3>
              <p>
                Give each team member the screens that match
                their responsibilities.
              </p>
            </div>

            <div className="lp-roles">
              {[
                "Front desk",
                "Technician",
                "Reviewer",
                "Admin",
              ].map((role) => (
                <span key={role}>
                  <Check size={14} />
                  {role}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   SOLUTIONS
===================================================== */

function SolutionsSection() {
  const solutions = [
    {
      icon: Stethoscope,
      tone: "blue",
      title: "Diagnostic laboratories",
      text: "Coordinate patient records, investigations, reporting and day-to-day administration.",
    },
    {
      icon: FlaskConical,
      tone: "violet",
      title: "Laboratory teams",
      text: "Keep tasks and investigation statuses visible so everyone can follow the workflow.",
    },
    {
      icon: HeartPulse,
      tone: "green",
      title: "Healthcare operations",
      text: "Connect administrative and diagnostic work in one shared, organised workspace.",
    },
  ];

  return (
    <section className="lp-section" id="solutions">
      <div className="lp-container">
        <Reveal className="lp-section-heading lp-heading-split">
          <h2>Built around the way laboratories work.</h2>

          <div>
            <p>
              LabLIMS brings key operational tasks into one
              place, so your team spends less time moving
              between disconnected processes.
            </p>

            <Link to="/signup" className="lp-text-link">
              Start with LabLIMS <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="lp-solutions">
          {solutions.map(
            ({ icon: Icon, tone, title, text }, index) => (
              <Reveal
                as="article"
                className="lp-solution"
                delay={index * 90}
                key={title}
              >
                <span className={`lp-solution-icon ${tone}`}>
                  <Icon size={24} />
                </span>

                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}

/* =====================================================
   WHY LABLIMS
===================================================== */

function WhyLabLimsSection() {
  const benefits = [
    {
      icon: Activity,
      title: "A clearer overview",
      text: "See key laboratory activity in one workspace instead of switching between screens.",
    },
    {
      icon: Clock3,
      title: "Streamlined daily work",
      text: "Bring recurring administrative and diagnostic tasks into one consistent flow.",
    },
    {
      icon: FileCheck2,
      title: "Connected information",
      text: "Patient, investigation and report details stay linked for easy follow-through.",
    },
    {
      icon: Users,
      title: "Team-friendly workflows",
      text: "Give staff one place to follow progress and coordinate the day.",
    },
  ];

  return (
    <section className="lp-why" id="why-lablims">
      <div className="lp-why-glow" aria-hidden="true" />

      <div className="lp-container lp-why-grid">
        <Reveal className="lp-why-copy">
          <h2>Less complexity. More clarity.</h2>
          <p>
            A practical approach to the everyday details that
            keep a laboratory running.
          </p>
        </Reveal>

        <ul className="lp-why-list">
          {benefits.map(
            ({ icon: Icon, title, text }, index) => (
              <Reveal as="li" delay={index * 80} key={title}>
                <span className="lp-why-icon">
                  <Icon size={20} />
                </span>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </Reveal>
            )
          )}
        </ul>
      </div>
    </section>
  );
}

/* =====================================================
   POPUP CONTENT
===================================================== */

const POPUP_CONTENT = {
  help: {
    eyebrow: "HELP CENTER",
    title: "How can we help?",
    description:
      "Find answers to common questions about using LabLIMS.",
  },
  contact: {
    eyebrow: "CUSTOMER SUPPORT",
    title: "Let's talk about your lab.",
    description:
      "Tell us what you need help with. Fill in the form below to get started.",
  },
  privacy: {
    eyebrow: "YOUR DATA",
    title: "Privacy policy",
    description:
      "Learn about privacy considerations for your laboratory workspace.",
  },
  terms: {
    eyebrow: "LEGAL INFORMATION",
    title: "Terms of service",
    description:
      "Guidelines for using the LabLIMS platform.",
  },
};

function SupportModal({ type, onClose, onOpenPopup }) {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const content = POPUP_CONTENT[type];

  useEffect(() => {
    if (!type) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [type, onClose]);

  useEffect(() => {
    setSearch("");
    setSubmitted(false);
    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }, [type]);

  if (!type || !content) return null;

  const helpTopics = [
    {
      title: "How do I register a patient?",
      text: "Open patient management, choose the new patient option, and complete the required details.",
    },
    {
      title: "How can I track investigations?",
      text: "Open investigations to review test details and their current workflow status.",
    },
    {
      title: "How do I prepare a report?",
      text: "Open the reports section to review available results and prepare the relevant report.",
    },
    {
      title: "How can I manage billing?",
      text: "Use the billing section to review invoices and payment information.",
    },
    {
      title: "How do team permissions work?",
      text: "Access depends on the roles and permissions configured for your workspace.",
    },
  ];

  const filteredTopics = helpTopics.filter((topic) =>
    `${topic.title} ${topic.text}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Frontend validation only.

      Connect this handler to your LabLIMS backend or email
      service before treating an enquiry as delivered.
    */

    setSubmitted(true);
  };

  return (
    <div
      className="lp-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="lp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lp-modal-title"
      >
        <div className="lp-modal-top">
          <span className="lp-modal-brand">
             <img
    src={logo}
    alt="LabLIMS logo"
    className="lp-modal-logo"
  />

            <span>
              LAB<span>LIMS</span>
            </span>
          </span>

          <button
            type="button"
            className="lp-modal-close"
            onClick={onClose}
            aria-label="Close popup"
          >
            <X size={21} />
          </button>
        </div>

        <div className="lp-modal-content">
          <span className="lp-modal-eyebrow">
            {content.eyebrow}
          </span>

          <h2 id="lp-modal-title">{content.title}</h2>

          <p className="lp-modal-description">
            {content.description}
          </p>

          {/* HELP CENTER */}

          {type === "help" && (
            <div className="lp-help-content">
              <label className="lp-modal-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search help topics..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  autoFocus
                />
              </label>

              <div className="lp-help-topics">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <details
                      className="lp-help-topic"
                      key={topic.title}
                    >
                      <summary>
                        {topic.title}
                        <ChevronDown size={17} />
                      </summary>

                      <p>{topic.text}</p>
                    </details>
                  ))
                ) : (
                  <p className="lp-modal-empty">
                    No matching topics. Try another search or
                    contact support.
                  </p>
                )}
              </div>

              <button
                type="button"
                className="lp-modal-primary"
                onClick={() => onOpenPopup("contact")}
              >
                Contact support
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* CONTACT SUPPORT */}

          {type === "contact" &&
            (submitted ? (
              <div className="lp-contact-success">
                <span>
                  <Check size={25} />
                </span>

                <h3>Form validated</h3>

                <p>
                  Your details passed the form validation.
                  The enquiry has not been sent yet. Connect
                  the form to your backend or email service
                  to deliver it to the support team.
                </p>

                <button
                  type="button"
                  className="lp-modal-primary"
                  onClick={onClose}
                >
                  Close
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <form
                className="lp-contact-form"
                onSubmit={handleSubmit}
              >
                <div className="lp-form-grid">
                  <label>
                    Full name

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label>
                    Email address

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <label>
                  Subject

                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        subject: event.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="General enquiry">
                      General enquiry
                    </option>
                    <option value="Technical support">
                      Technical support
                    </option>
                    <option value="Account access">
                      Account access
                    </option>
                    <option value="Billing">Billing</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </label>

                <label>
                  How can we help?

                  <textarea
                    name="message"
                    placeholder="Describe your question or issue..."
                    rows={4}
                    minLength={10}
                    required
                    value={form.message}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        message: event.target.value,
                      }))
                    }
                  />
                </label>

                <button
                  type="submit"
                  className="lp-modal-primary"
                >
                  Submit enquiry
                  <ArrowRight size={16} />
                </button>

                <p className="lp-form-note">
                  Please do not include patient-identifying or
                  other sensitive medical information.
                </p>
              </form>
            ))}

          {/* PRIVACY POLICY */}

          {type === "privacy" && (
            <div className="lp-legal-content">
              <h3>Information and data</h3>

              <p>
                LabLIMS is designed to support laboratory
                operations. Your organisation should collect
                and use information only for authorised
                purposes and in accordance with applicable law.
              </p>

              <h3>Access and security</h3>

              <p>
                Access to laboratory information should be
                restricted to authorised users. Appropriate
                safeguards, account controls and retention
                practices should be maintained.
              </p>

              <h3>Your responsibilities</h3>

              <p>
                Keep account credentials secure and avoid
                sharing sensitive information through
                unauthorised channels.
              </p>

              <p className="lp-legal-notice">
                This is starter copy, not a verified statement
                of LabLIMS' actual data practices. Replace it
                with your approved privacy policy before
                publishing.
              </p>
            </div>
          )}

          {/* TERMS OF SERVICE */}

          {type === "terms" && (
            <div className="lp-legal-content">
              <h3>Use of the platform</h3>

              <p>
                Use LabLIMS only for authorised purposes and
                in accordance with your organisation's
                permissions and applicable laws.
              </p>

              <h3>Account responsibilities</h3>

              <p>
                Users are responsible for protecting their
                credentials and maintaining accurate account
                information.
              </p>

              <h3>Data and availability</h3>

              <p>
                Organisations should maintain appropriate
                data protection, backup and operational
                procedures for their laboratory workflows.
              </p>

              <p className="lp-legal-notice">
                These are placeholder terms, not a complete
                legal agreement. Obtain appropriate legal
                review before publishing.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* =====================================================
   FAQ
===================================================== */

function FaqSection({ onOpenPopup }) {
  const faqs = [
    {
      q: "What can I manage with LabLIMS?",
      a: "Patient records, investigations, reports, billing and team access, all in one connected workspace.",
    },
    {
      q: "Who is LabLIMS for?",
      a: "Diagnostic laboratories and their teams, including front desk staff, technicians, reviewers and administrators.",
    },
    {
      q: "Can team members see different things?",
      a: "LabLIMS is built around role-aware workflows, so people work with the screens that match their responsibilities.",
    },
    {
      q: "How do I get started?",
      a: "Select Get started to create your workspace. If you have questions along the way, contact support.",
    },
    {
      q: "Where can I get help?",
      a: "Open our help center to explore common questions or contact the support team.",
    },
  ];

  return (
    <section
      className="lp-section lp-section-tint"
      id="faq"
    >
      <div className="lp-container lp-faq-grid">
        <Reveal className="lp-faq-intro">
          <h2>Questions, answered.</h2>

          <p>
            Can't find what you need? Our support team is happy
            to help.
          </p>

          <button
            type="button"
            className="lp-text-link lp-inline-popup-button"
            onClick={() => onOpenPopup("contact")}
          >
            Contact support <ArrowUpRight size={16} />
          </button>
        </Reveal>

        <Reveal className="lp-faq-list" delay={80}>
          {faqs.map(({ q, a }) => (
            <details className="lp-faq-item" key={q}>
              <summary>
                {q}
                <ChevronDown size={18} />
              </summary>

              <p>{a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* =====================================================
   CTA
===================================================== */

function CTASection({ onOpenPopup }) {
  return (
    <section className="lp-cta-section" id="contact">
      <div className="lp-container">
        <Reveal className="lp-cta-card">
          <span
            className="lp-aurora lp-cta-aurora-a"
            aria-hidden="true"
          />

          <span
            className="lp-aurora lp-cta-aurora-b"
            aria-hidden="true"
          />

          <div className="lp-cta-content">
            <h2>
              Ready to bring your laboratory together?
            </h2>

            <p>
              Create your workspace and take the next step
              toward a more organised laboratory workflow.
            </p>

            <div className="lp-cta-actions">
              <Link
                to="/signup"
                className="lp-btn lp-btn-light lp-btn-large"
              >
                Get started free <ArrowRight size={17} />
              </Link>

              <button
                type="button"
                className="lp-cta-contact lp-inline-popup-button"
                onClick={() => onOpenPopup("contact")}
              >
                <Headphones size={16} />
                Contact support
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* =====================================================
   FOOTER
===================================================== */

function Footer({ onOpenPopup }) {
  const productLinks = [
    { label: "Workflow", href: "#workflow" },
    { label: "Features", href: "#features" },
    { label: "Solutions", href: "#solutions" },
  ];

  const resourceLinks = [
    { label: "Help center", popup: "help" },
    { label: "Contact support", popup: "contact" },
  ];

  const legalLinks = [
    { label: "Privacy policy", popup: "privacy" },
    { label: "Terms of service", popup: "terms" },
  ];

  const renderLinks = (links) =>
    links.map((item) =>
      item.popup ? (
        <button
          type="button"
          className="lp-footer-popup-link"
          key={item.label}
          onClick={() => onOpenPopup(item.popup)}
        >
          {item.label}
        </button>
      ) : (
        <a href={item.href} key={item.label}>
          {item.label}
        </a>
      )
    );

  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-main">
          <div className="lp-footer-brand-column">
            <LabLimsLogo />

            <p>
              A connected workspace for modern laboratory
              operations. Organise patient records,
              investigations and reporting with LabLIMS.
            </p>
          </div>

          <nav
            className="lp-footer-links-column"
            aria-label="Product"
          >
            <h4>Product</h4>
            {renderLinks(productLinks)}
          </nav>

          <nav
            className="lp-footer-links-column"
            aria-label="Resources"
          >
            <h4>Resources</h4>
            {renderLinks(resourceLinks)}
          </nav>

          <nav
            className="lp-footer-links-column"
            aria-label="Legal"
          >
            <h4>Legal</h4>
            {renderLinks(legalLinks)}
          </nav>
        </div>

        <div className="lp-footer-bottom">
          <span>
            © {new Date().getFullYear()} LabLIMS. All rights
            reserved.
          </span>

          <a href="#top" className="lp-back-to-top">
            Back to top <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* =====================================================
   LANDING PAGE
===================================================== */

export default function Landing() {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (type) => setActivePopup(type);
  const closePopup = () => setActivePopup(null);

  return (
    <main className="lab-landing" id="top">
      <Navbar />

      <HeroSection />

      <Marquee />

      <WorkflowSection />

      <FeaturesSection />

      <SolutionsSection />

      <WhyLabLimsSection />

      <FaqSection onOpenPopup={openPopup} />

      <CTASection onOpenPopup={openPopup} />

      <Footer onOpenPopup={openPopup} />

      <SupportModal
        type={activePopup}
        onClose={closePopup}
        onOpenPopup={openPopup}
      />
    </main>
  );
}
