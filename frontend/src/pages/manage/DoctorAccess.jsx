
import { useMemo, useState } from "react";
import "./manage.css";

const INITIAL_DOCTORS = [];

const STATUS = {
  invited: "Invited",
  granted: "Access Granted",
  revoked: "Access Revoked",
};

function Icon({ name, size = 20 }) {
  const paths = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    close: <path d="m18 6-12 12M6 6l12 12" />,
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M5.5 9A7 7 0 0 1 17 5l3 2M4 17l3 2a7 7 0 0 0 11.5-4" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    userCheck: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11l2 2 4-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    ban: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m5.6 5.6 12.8 12.8" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.users}
    </svg>
  );
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function DoctorAccess() {
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState("");

  const total = doctors.length;
  const invited = doctors.filter((d) => d.status === STATUS.invited).length;
  const granted = doctors.filter((d) => d.status === STATUS.granted).length;
  const revoked = doctors.filter((d) => d.status === STATUS.revoked).length;
  const limit = 100;

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesTab =
        activeTab === "All" || doctor.status === activeTab;

      const matchesSearch =
        !term ||
        doctor.name.toLowerCase().includes(term) ||
        doctor.email.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [doctors, activeTab, search]);

  function notify(message) {
    setToast(message);
    // The message is dismissed by the close button.
  }

  function inviteDoctor(event) {
    event.preventDefault();
    setFormError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      setFormError("Please enter the doctor's name and email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (total >= limit) {
      setFormError("The doctor invitation limit has been reached.");
      return;
    }

    if (doctors.some((d) => d.email.toLowerCase() === cleanEmail)) {
      setFormError("This email address is already in the directory.");
      return;
    }

    const newDoctor = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      name: cleanName,
      email: cleanEmail,
      status: STATUS.invited,
      invitedOn: formatDate(),
    };

    setDoctors((current) => [newDoctor, ...current]);
    setName("");
    setEmail("");
    setShowInvite(false);
    setActiveTab("All");
    setSearch("");
    notify("Doctor added to the invitation list.");
  }

  function updateStatus(id, status) {
    setDoctors((current) =>
      current.map((doctor) =>
        doctor.id === id ? { ...doctor, status } : doctor
      )
    );

    notify(`Doctor status updated to "${status}".`);
  }

  function resendInvite(doctor) {
    // Connect this action to your real invitation API.
    notify(`Resend requested for ${doctor.email}. Connect your email API to send it.`);
  }

  function deleteDoctor() {
    if (!pendingDelete) return;

    setDoctors((current) =>
      current.filter((doctor) => doctor.id !== pendingDelete.id)
    );
    setPendingDelete(null);
    notify("Doctor removed from this directory.");
  }

  return (
    <main className="doctor-page">
      <div className="doctor-container">
        <header className="doctor-page-header">
          <div className="doctor-heading">
            <div className="doctor-eyebrow">
              <span className="doctor-eyebrow-dot" />
              LABLIMS ADMINISTRATION
            </div>

            <h1>Doctor Portal Access</h1>
            <p>
              Manage doctor invitations, report access, and portal permissions
              from one place.
            </p>
          </div>

          <button
            className="doctor-primary-btn"
            onClick={() => {
              setFormError("");
              setShowInvite(true);
            }}
            disabled={total >= limit}
          >
            <Icon name="plus" size={18} />
            Invite doctor
          </button>
        </header>

        <section className="doctor-capacity" aria-label="Portal capacity">
          <div className="doctor-capacity-icon">
            <Icon name="shield" size={21} />
          </div>
          <div className="doctor-capacity-copy">
            <strong>Doctor portal capacity</strong>
            <span>
              {total} of {limit} doctor accounts used
            </span>
          </div>
          <div className="doctor-capacity-progress">
            <div className="doctor-progress-track">
              <div
                className="doctor-progress-fill"
                style={{ width: `${Math.min((total / limit) * 100, 100)}%` }}
              />
            </div>
            <span>{limit - total} slots available</span>
          </div>
        </section>

        <section className="doctor-stats" aria-label="Doctor access statistics">
          <article className="doctor-stat-card">
            <div className="doctor-stat-top">
              <span className="doctor-stat-label">Total doctors</span>
              <span className="doctor-stat-icon stat-blue">
                <Icon name="users" />
              </span>
            </div>
            <div className="doctor-stat-value">{total}</div>
            <span className="doctor-stat-caption">In your directory</span>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-top">
              <span className="doctor-stat-label">Pending invites</span>
              <span className="doctor-stat-icon stat-amber">
                <Icon name="clock" />
              </span>
            </div>
            <div className="doctor-stat-value">{invited}</div>
            <span className="doctor-stat-caption">Awaiting registration</span>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-top">
              <span className="doctor-stat-label">Access granted</span>
              <span className="doctor-stat-icon stat-green">
                <Icon name="userCheck" />
              </span>
            </div>
            <div className="doctor-stat-value">{granted}</div>
            <span className="doctor-stat-caption">Permission enabled</span>
          </article>

          <article className="doctor-stat-card">
            <div className="doctor-stat-top">
              <span className="doctor-stat-label">Access revoked</span>
              <span className="doctor-stat-icon stat-red">
                <Icon name="ban" />
              </span>
            </div>
            <div className="doctor-stat-value">{revoked}</div>
            <span className="doctor-stat-caption">Permission disabled</span>
          </article>
        </section>

        <section className="doctor-directory">
          <div className="doctor-directory-header">
            <div>
              <h2>Doctor directory</h2>
              <p>View and manage access for your referring doctors.</p>
            </div>
            <span className="doctor-total-pill">
              {filteredDoctors.length}{" "}
              {filteredDoctors.length === 1 ? "doctor" : "doctors"}
            </span>
          </div>

          <div className="doctor-toolbar">
            <label className="doctor-search">
              <Icon name="search" size={19} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor name or email..."
                aria-label="Search doctors"
              />
              {search && (
                <button
                  type="button"
                  className="doctor-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </label>

            <button
              className="doctor-secondary-btn"
              onClick={() => {
                setSearch("");
                setActiveTab("All");
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="doctor-tabs" role="tablist" aria-label="Filter by status">
            {[
              { label: "All doctors", value: "All", count: total },
              { label: "Invited", value: STATUS.invited, count: invited },
              { label: "Access granted", value: STATUS.granted, count: granted },
              { label: "Revoked", value: STATUS.revoked, count: revoked },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.value}
                className={`doctor-tab ${
                  activeTab === tab.value ? "is-active" : ""
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                <span className="doctor-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="doctor-table-wrap">
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>DOCTOR</th>
                  <th>INVITED ON</th>
                  <th>ACCESS STATUS</th>
                  <th className="doctor-actions-heading">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td>
                      <div className="doctor-person">
                        <div className="doctor-avatar" aria-hidden="true">
                          {doctor.name
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="doctor-person-copy">
                          <strong>{doctor.name}</strong>
                          <span>{doctor.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="doctor-date">{doctor.invitedOn}</td>

                    <td>
                      <span
                        className={`doctor-status ${
                          doctor.status === STATUS.invited
                            ? "status-invited"
                            : doctor.status === STATUS.granted
                            ? "status-granted"
                            : "status-revoked"
                        }`}
                      >
                        <span className="doctor-status-dot" />
                        {doctor.status}
                      </span>
                    </td>

                    <td>
                      <div className="doctor-row-actions">
                        {doctor.status === STATUS.invited && (
                          <>
                            <button
                              className="doctor-action-btn action-blue"
                              onClick={() => resendInvite(doctor)}
                            >
                              <Icon name="refresh" size={15} />
                              Resend
                            </button>
                            <button
                              className="doctor-action-btn action-green"
                              onClick={() =>
                                updateStatus(doctor.id, STATUS.granted)
                              }
                            >
                              Grant access
                            </button>
                          </>
                        )}

                        {doctor.status === STATUS.granted && (
                          <button
                            className="doctor-action-btn action-red"
                            onClick={() =>
                              updateStatus(doctor.id, STATUS.revoked)
                            }
                          >
                            Revoke access
                          </button>
                        )}

                        {doctor.status === STATUS.revoked && (
                          <button
                            className="doctor-action-btn action-green"
                            onClick={() =>
                              updateStatus(doctor.id, STATUS.granted)
                            }
                          >
                            Restore access
                          </button>
                        )}

                        <button
                          className="doctor-icon-btn"
                          onClick={() => setPendingDelete(doctor)}
                          aria-label={`Delete ${doctor.name}`}
                          title="Delete doctor"
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredDoctors.length === 0 && (
              <div className="doctor-empty-state">
                <div className="doctor-empty-icon">
                  <Icon name={search ? "search" : "users"} size={27} />
                </div>
                <h3>
                  {search
                    ? "No matching doctors"
                    : activeTab === "All"
                    ? "No doctors added yet"
                    : `No doctors with ${activeTab.toLowerCase()} status`}
                </h3>
                <p>
                  {search
                    ? "Try a different name or email address, or reset your filters."
                    : activeTab === "All"
                    ? "Invite a doctor to start managing portal access and report permissions."
                    : "Doctors with this status will appear here when available."}
                </p>
                {search ? (
                  <button
                    className="doctor-secondary-btn"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                ) : activeTab === "All" ? (
                  <button
                    className="doctor-primary-btn"
                    onClick={() => setShowInvite(true)}
                  >
                    <Icon name="plus" size={17} />
                    Invite your first doctor
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <footer className="doctor-table-footer">
            <span>
              Showing {filteredDoctors.length} of {total} doctors
            </span>
            <span className="doctor-footer-note">
              <Icon name="shield" size={15} />
              Manage permissions responsibly
            </span>
          </footer>
        </section>

        <p className="doctor-security-note">
          <Icon name="shield" size={16} />
          <span>
            <strong>Access management:</strong> This screen manages the local
            UI state. Enforce actual report permissions on your backend.
          </span>
        </p>
      </div>

      {showInvite && (
        <div
          className="doctor-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowInvite(false);
              setFormError("");
            }
          }}
        >
          <section
            className="doctor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-invite-title"
          >
            <div className="doctor-modal-header">
              <div className="doctor-modal-title-icon">
                <Icon name="mail" size={22} />
              </div>
              <button
                className="doctor-icon-btn"
                onClick={() => {
                  setShowInvite(false);
                  setFormError("");
                }}
                aria-label="Close invitation dialog"
              >
                <Icon name="close" />
              </button>
            </div>

            <h2 id="doctor-invite-title">Invite a doctor</h2>
            <p className="doctor-modal-description">
              Add the doctor's details to your portal invitation list.
            </p>

            <form onSubmit={inviteDoctor}>
              <label className="doctor-field-label" htmlFor="doctor-name">
                Doctor name <span>*</span>
              </label>
              <input
                id="doctor-name"
                className="doctor-form-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Dr. Ananya Sharma"
                autoFocus
                maxLength={100}
                required
              />

              <label className="doctor-field-label" htmlFor="doctor-email">
                Email address <span>*</span>
              </label>
              <input
                id="doctor-email"
                className="doctor-form-input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="doctor@clinic.com"
                maxLength={254}
                required
              />

              {formError && (
                <p className="doctor-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="doctor-invite-info">
                <Icon name="shield" size={18} />
                <span>
                  Adding a doctor here does not send an email or grant real
                  report permissions until connected to your backend.
                </span>
              </div>

              <div className="doctor-modal-actions">
                <button
                  type="button"
                  className="doctor-secondary-btn"
                  onClick={() => {
                    setShowInvite(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="doctor-primary-btn">
                  <Icon name="plus" size={17} />
                  Add doctor
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {pendingDelete && (
        <div
          className="doctor-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPendingDelete(null);
            }
          }}
        >
          <section
            className="doctor-modal doctor-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="doctor-delete-title"
            aria-describedby="doctor-delete-description"
          >
            <div className="doctor-delete-icon">
              <Icon name="trash" size={23} />
            </div>
            <h2 id="doctor-delete-title">Remove this doctor?</h2>
            <p id="doctor-delete-description">
              Remove <strong>{pendingDelete.name}</strong> from this directory?
              This action only removes the local entry in this demo.
            </p>
            <div className="doctor-modal-actions">
              <button
                className="doctor-secondary-btn"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button className="doctor-danger-btn" onClick={deleteDoctor}>
                Remove doctor
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className="doctor-toast" role="status">
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
    </main>
  );
}
