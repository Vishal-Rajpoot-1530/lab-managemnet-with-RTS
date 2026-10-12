
import "./addon.css";

export default function XrayAddonScreen() {
  const startTrial = () => {
    window.alert("Digital X-ray trial action is frontend-only for now.");
  };

  return (
    <main className="addon-page">
      <header className="addon-topbar">
        <div className="addon-brand">
          <span className="addon-brand-icon">+</span>
          <span>LABLIMS</span>
        </div>
        <span className="addon-page-label">Add-on Marketplace</span>
      </header>

      <section className="addon-hero">
        <div className="addon-content">
          <span className="addon-eyebrow">DIGITAL IMAGING ADD-ON</span>

          <h1>
            Start your 5 day free
            <span> Digital X-ray reporting</span> addon trial
          </h1>

          <p className="addon-description">
            Discover the full potential of <strong>Digital X-ray reporting</strong>,
            built to optimize your workflow and enhance laboratory efficiency.
          </p>

          <div className="addon-price-line">
            <span>Addon Price</span>
            <strong>₹4,800 + 18% GST</strong>
            <span className="addon-price-period">for every 12 months</span>
          </div>

          <button
            className="addon-primary"
            onClick={startTrial}
            type="button"
          >
            Start free trial now!
            <span aria-hidden="true">→</span>
          </button>

          <p className="addon-footnote">
            Explore the add-on with a 5-day free trial.
          </p>
        </div>

        <div className="addon-visual" aria-hidden="true">
          <div className="addon-visual-card">
            <div className="addon-visual-header">
              <span className="addon-xray-icon">✚</span>
              <div>
                <strong>Digital X-ray</strong>
                <small>Reporting module</small>
              </div>
              <span className="addon-preview-tag">PREVIEW</span>
            </div>

            <div className="addon-xray-panel">
              <span className="addon-xray-label">CHEST · PA VIEW</span>

              <svg viewBox="0 0 280 230" className="addon-xray-art">
                <defs>
                  <linearGradient id="addon-xray-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#264d6d" />
                    <stop offset="100%" stopColor="#091a2d" />
                  </linearGradient>
                </defs>

                <rect width="280" height="230" rx="9" fill="url(#addon-xray-gradient)" />

                <g stroke="#9bc5e0" strokeWidth="1" opacity=".15">
                  {Array.from({ length: 8 }, (_, i) => (
                    <path key={`h${i}`} d={`M0 ${25 + i * 25} H280`} />
                  ))}
                  {Array.from({ length: 9 }, (_, i) => (
                    <path key={`v${i}`} d={`M${15 + i * 31} 0 V230`} />
                  ))}
                </g>

                <g fill="none" stroke="#c5e0f1" strokeWidth="3" opacity=".7">
                  <path d="M110 30 Q140 45 170 30" />
                  {Array.from({ length: 7 }, (_, i) => (
                    <g key={`r${i}`}>
                      <path d={`M137 ${52 + i * 16} Q90 ${35 + i * 16} 52 ${57 + i * 16}`} />
                      <path d={`M143 ${52 + i * 16} Q190 ${35 + i * 16} 228 ${57 + i * 16}`} />
                    </g>
                  ))}
                </g>

                <path
                  d="M117 48 C85 38 63 67 62 108 C60 146 80 176 112 179 C128 171 130 136 129 98 C128 73 126 56 117 48Z"
                  fill="#b9d9ec"
                  opacity=".72"
                />
                <path
                  d="M163 48 C195 38 217 67 218 108 C220 146 200 176 168 179 C152 171 150 136 151 98 C152 73 154 56 163 48Z"
                  fill="#b9d9ec"
                  opacity=".72"
                />
                <path
                  d="M138 39 V185"
                  stroke="#e0edf7"
                  strokeWidth="5"
                  opacity=".7"
                />
                <path
                  d="M138 105 Q150 91 164 117 Q175 143 153 161 Q139 166 138 145Z"
                  fill="#e0edf7"
                  opacity=".5"
                />

                <text
                  x="140"
                  y="213"
                  textAnchor="middle"
                  fill="#b7d8eb"
                  fontSize="9"
                  letterSpacing="2"
                >
                  XR IMAGING PREVIEW
                </text>
              </svg>
            </div>

            <div className="addon-visual-footer">
              <span>✓</span>
              <div>
                <strong>Reporting workflow</strong>
                <small>Designed for laboratory use</small>
              </div>
            </div>
          </div>

          <div className="addon-floating-note">
            <span>✓</span>
            <div>
              <strong>5-day free trial</strong>
              <small>Try the add-on</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
