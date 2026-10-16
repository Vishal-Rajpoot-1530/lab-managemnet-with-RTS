import { useState } from "react";
import {
  Search,
  BookOpen,
  Users,
  FileText,
  CreditCard,
  FlaskConical,
  ChevronDown,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./HelpCenter.css";

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics of using LabLIMS.",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Patient Management",
    description: "Registration, patient records and search.",
    icon: Users,
    color: "purple",
  },
  {
    title: "Laboratory Tests",
    description: "Investigations, test selection and results.",
    icon: FlaskConical,
    color: "green",
  },
  {
    title: "Reports",
    description: "Understand and manage laboratory reports.",
    icon: FileText,
    color: "orange",
  },
  {
    title: "Billing & Payments",
    description: "Bills, discounts and payment records.",
    icon: CreditCard,
    color: "pink",
  },
];

const faqs = [
  {
    question: "How do I register a new patient?",
    answer:
      "Open Patients from your navigation menu and select the option to add a patient. Enter the required details and save the record.",
  },
  {
    question: "How do I create a new bill?",
    answer:
      "Select New Bill in the sidebar, enter the patient details, select the required investigations, and review the bill before saving.",
  },
  {
    question: "Where can I find laboratory reports?",
    answer:
      "Open the Reports section to view available reports. The actions available depend on the report status and your access permissions.",
  },
  {
    question: "How can I update investigation prices?",
    answer:
      "Open your investigation rate list, locate the test, and use the available editing controls if your account has permission.",
  },
  {
    question: "What should I do if a page is not working?",
    answer:
      "Refresh the page and check your connection. If the problem continues, contact support with the page name and a description of the issue.",
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    `${category.title} ${category.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="help-page">
      <section className="help-hero">
        <div className="help-hero-content">
          <span className="help-eyebrow">
            LABLIMS SUPPORT
          </span>

          <h1>How can we help you?</h1>

          <p>
            Find answers, explore guides, and learn how to get
            the most out of your laboratory management system.
          </p>

          <div className="help-search">
            <Search size={20} />
            <input
              type="search"
              placeholder="Search help articles and FAQs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search help articles"
            />
          </div>

          <div className="help-hero-meta">
            <span>Simple guides</span>
            <span>•</span>
            <span>Common questions</span>
            <span>•</span>
            <span>LabLIMS assistance</span>
          </div>
        </div>

        <div className="help-hero-art" aria-hidden="true">
          <div className="help-orbit orbit-one" />
          <div className="help-orbit orbit-two" />
          <div className="help-art-card">
            <div className="help-art-icon">
              <Headphones size={38} />
            </div>
            <div className="help-art-line line-long" />
            <div className="help-art-line line-short" />
            <div className="help-art-check">
              ✓
            </div>
          </div>
        </div>
      </section>

      <section className="help-section">
        <div className="help-section-heading">
          <div>
            <span className="help-section-label">
              EXPLORE RESOURCES
            </span>
            <h2>Browse help topics</h2>
            <p>Find guidance for your daily laboratory tasks.</p>
          </div>
        </div>

        <div className="help-category-grid">
          {filteredCategories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                className="help-category-card"
                key={category.title}
              >
                <div
                  className={`help-category-icon ${category.color}`}
                >
                  <Icon size={23} />
                </div>

                <h3>{category.title}</h3>
                <p>{category.description}</p>

                <button
                  type="button"
                  className="help-topic-link"
                  onClick={() =>
                    setSearch(category.title)
                  }
                >
                  Explore topic
                  <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="help-faq-section">
        <div className="help-faq-heading">
          <div>
            <span className="help-section-label">
              QUICK ANSWERS
            </span>
            <h2>Frequently asked questions</h2>
          </div>
          <span className="help-faq-count">
            {filteredFaqs.length} articles
          </span>
        </div>

        <div className="help-faq-list">
          {filteredFaqs.map((faq, index) => {
            const isOpen = activeFaq === faq.question;

            return (
              <article
                className={`help-faq-item ${
                  isOpen ? "open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  className="help-faq-question"
                  onClick={() =>
                    setActiveFaq(
                      isOpen ? null : faq.question
                    )
                  }
                  aria-expanded={isOpen}
                >
                  <span className="help-faq-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{faq.question}</span>

                  <ChevronDown
                    size={19}
                    className="help-faq-chevron"
                  />
                </button>

                {isOpen && (
                  <div className="help-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </article>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="help-empty">
              <Search size={26} />
              <h3>No matching questions</h3>
              <p>
                Try another search term or contact our support
                team.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="help-contact-banner">
        <div className="help-contact-icon">
          <Headphones size={27} />
        </div>

        <div className="help-contact-copy">
          <h2>Still need assistance?</h2>
          <p>
            Tell us what you need help with and provide the
            details of your issue.
          </p>
        </div>

        <Link
          to="/contact-support"
          className="help-contact-button"
        >
          Contact support
          <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}