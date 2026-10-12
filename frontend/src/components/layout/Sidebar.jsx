import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MENU } from '../../constants/menu';

import {
  Plus,
  CircleCheck,
  LayoutDashboard,
  ChartNoAxesColumnIncreasing,
  BriefcaseBusiness,
  FlaskConical,
  ScanLine,
  Scan,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import './sidebar.css';

const icons = {
  Dashboard: LayoutDashboard,
  Business: ChartNoAxesColumnIncreasing,
  Cases: BriefcaseBusiness,
  Lab: FlaskConical,
  USG: ScanLine,
  'Digital X-ray': Scan,
  Manage: Users,
};

export default function Sidebar() {
  const { pathname } = useLocation();

  const routeOpen = useMemo(() => {
    const state = {};

    MENU.forEach((item) => {
      if (
        item.children?.some(([, path]) =>
          pathname.startsWith(path)
        )
      ) {
        state[item.label] = true;
      }
    });

    return state;
  }, [pathname]);

  const [open, setOpen] = useState(routeOpen);

  useEffect(() => {
    setOpen((prev) => ({
      ...prev,
      ...routeOpen,
    }));
  }, [routeOpen]);

  const toggleGroup = (label) => {
    setOpen((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">

      {/* =====================================================
          SIDEBAR TOP ACTIONS
      ===================================================== */}
      <div className="sidebar-actions">

        <NavLink
          className={({ isActive }) =>
            `sidebar-new-bill ${isActive ? 'active' : ''}`
          }
          to="/cases/new-bill"
        >
          <span className="sidebar-new-icon">
            <Plus size={17} strokeWidth={2.4} />
          </span>

          <span className="sidebar-new-text">
            <strong>New Bill</strong>
            <small>Create a new case</small>
          </span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `sidebar-getting-started ${isActive ? 'active' : ''}`
          }
          to="/getting-started"
        >
          <span className="getting-icon">
            <CircleCheck size={16} strokeWidth={2.2} />
          </span>

          <span>Getting Started</span>
        </NavLink>

      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <nav className="sidebar-nav">

        <div className="sidebar-nav-label">
          MAIN MENU
        </div>

        {MENU.map((item) => {
          const Icon = icons[item.label] || LayoutDashboard;

          /* -----------------------------------------------
             SIMPLE LINK
          ----------------------------------------------- */
          if (item.path) {
            return (
              <NavLink
                key={item.label}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
                to={item.path}
              >
                <span className="sidebar-nav-left">
                  <span className="sidebar-nav-icon">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>

                  <span>{item.label}</span>
                </span>
              </NavLink>
            );
          }

          /* -----------------------------------------------
             GROUP
          ----------------------------------------------- */
          const expanded = !!open[item.label];

          const sectionActive = item.children?.some(
            ([, path]) => pathname.startsWith(path)
          );

          return (
            <div
              className={`sidebar-nav-group ${
                sectionActive ? 'has-active' : ''
              }`}
              key={item.label}
            >

              <button
                type="button"
                className={`sidebar-nav-group-button ${
                  sectionActive ? 'section-active' : ''
                }`}
                onClick={() => toggleGroup(item.label)}
                aria-expanded={expanded}
              >
                <span className="sidebar-nav-left">

                  <span className="sidebar-nav-icon">
                    <Icon size={17} strokeWidth={1.9} />
                  </span>

                  <span>{item.label}</span>

                </span>

                <span
                  className={`sidebar-chevron ${
                    expanded ? 'expanded' : ''
                  }`}
                >
                  {expanded ? (
                    <ChevronUp size={14} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={14} strokeWidth={2} />
                  )}
                </span>
              </button>

              {expanded && (
                <div className="sidebar-submenu">

                  {item.children.map(([label, path]) => (
                    <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) =>
                        `sidebar-submenu-link ${
                          isActive ? 'active' : ''
                        }`
                      }
                    >
                      <span className="submenu-dot" />
                      <span>{label}</span>
                    </NavLink>
                  ))}

                </div>
              )}

            </div>
          );
        })}

      </nav>

      {/* =====================================================
          SIDEBAR FOOTER
      ===================================================== */}
      {/* =====================================================
    SIDEBAR FOOTER — 3D LAB ANIMATION
===================================================== */}
<div className="sidebar-footer">

  <div className="sidebar-footer-line" />

  <div className="sidebar-lab-animation" aria-hidden="true">

    {/* Soft ambient glow */}
    <div className="lab-bottom-glow" />

    {/* Flask */}
    <div className="lab-flask">

      <div className="flask-neck">
        <div className="flask-liquid-neck" />
      </div>

      <div className="flask-body">
        <div className="flask-liquid">

          <span className="bubble bubble-1" />
          <span className="bubble bubble-2" />
          <span className="bubble bubble-3" />
          <span className="bubble bubble-4" />

        </div>
      </div>

    </div>

    {/* Floating molecule */}
    <div className="bottom-molecule molecule-left">
      <span />
      <span />
      <span />
    </div>

    <div className="bottom-molecule molecule-right">
      <span />
      <span />
      <span />
    </div>

    {/* Small particles */}
    <span className="bottom-particle particle-a" />
    <span className="bottom-particle particle-b" />
    <span className="bottom-particle particle-c" />

  </div>

</div>

    </aside>
  );
}