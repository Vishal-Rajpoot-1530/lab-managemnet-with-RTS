import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  CalendarDays,
  Plus,
  FileText,
  IndianRupee,
  CircleAlert,
  CheckCircle2,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";

import { billingApiService } from "../../api";
import useApiList from "../../api/core/useApiList";

import "./cases.css";


/* =========================================================
   API
   ========================================================= */

const load = (q) => billingApiService.list(q);


/* =========================================================
   HELPERS
   ========================================================= */

const money = (value) =>
  `Rs.${Number(value || 0).toLocaleString("en-IN")}`;


function getId(bill) {
  return (
    bill.id ??
    bill._id ??
    bill.billId ??
    bill.registrationNo ??
    bill.regNo
  );
}


function getPatientName(bill) {
  if (bill.patientName) return bill.patientName;

  if (typeof bill.patient === "string") {
    return bill.patient;
  }

  const patient = bill.patientDetails || bill.patient || {};

  return (
    [
      patient.title,
      patient.firstName,
      patient.lastName,
    ]
      .filter(Boolean)
      .join(" ") || "—"
  );
}


function getPaid(bill) {
  return (
    bill.paid ??
    bill.received ??
    bill.payment?.received ??
    0
  );
}


function getBalance(bill) {
  const explicitBalance =
    bill.balance ??
    bill.payment?.balance;

  if (
    explicitBalance !== undefined &&
    explicitBalance !== null
  ) {
    return Number(explicitBalance) || 0;
  }

  return Math.max(
    0,
    Number(
      bill.total ??
      bill.payment?.total ??
      0
    ) -
      Number(getPaid(bill)) -
      Number(
        bill.discount ??
        bill.payment?.discount ??
        0
      )
  );
}


function getStatus(bill) {
  if (
    bill.cancelled ||
    String(bill.status || "").toLowerCase() === "cancelled"
  ) {
    return "Cancelled";
  }

  return getBalance(bill) > 0
    ? "Due"
    : "No due";
}


function formatDateTime(value) {
  if (!value) {
    return {
      date: "—",
      time: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: String(value),
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString("en-GB"),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}


function getDateInputValue(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getBillDate(bill) {
  const value =
    bill.createdAt ||
    bill.date ||
    bill.billDate;

  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}


function getReferrer(bill) {
  return (
    bill.referrerName ||
    bill.referrer ||
    bill.referrerDetails?.name ||
    "—"
  );
}


function getAgent(bill) {
  return (
    bill.sampleCollectionAgentName ||
    bill.agentName ||
    bill.agent?.name ||
    "—"
  );
}


function getCentre(bill) {
  return (
    bill.collectionCentre ||
    bill.collectionCenter ||
    "Main"
  );
}


function getInvestigations(bill) {
  const source = bill.investigations;

  const investigations = Array.isArray(source)
    ? source
    : [
        ...(Array.isArray(source?.lab)
          ? source.lab
          : []),

        ...(Array.isArray(source?.outsource)
          ? source.outsource
          : []),
      ];

  return investigations.length
    ? investigations
    : bill.tests ||
        bill.items ||
        [];
}


/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function Bills() {
  const navigate = useNavigate();

  const {
    rows = [],
    loading,
    error,
    reload,
  } = useApiList(load);


  /* =======================================================
     DATE RANGE
     ======================================================= */

  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(
    today.getDate() - 6
  );


  /* =======================================================
     FILTER STATE
     ======================================================= */

  const [duration, setDuration] =
    useState("7");

  const [fromDate, setFromDate] =
    useState(
      getDateInputValue(
        sevenDaysAgo
      )
    );

  const [toDate, setToDate] =
    useState(
      getDateInputValue(today)
    );

  const [registrationNo, setRegistrationNo] =
    useState("");

  const [patientName, setPatientName] =
    useState("");

  const [referrer, setReferrer] =
    useState("");

  const [centre, setCentre] =
    useState("");

  const [agent, setAgent] =
    useState("");

  const [hasDue, setHasDue] =
    useState(false);

  const [cancelled, setCancelled] =
    useState(false);


  /* =======================================================
     UI STATE
     ======================================================= */

  const [filters, setFilters] =
    useState(null);

  const [expandedId, setExpandedId] =
    useState(null);

  const [menuId, setMenuId] =
    useState(null);


  /* =======================================================
     FILTER OPTIONS
     ======================================================= */

  const referrers = useMemo(
    () =>
      [
        ...new Set(
          rows
            .map(getReferrer)
            .filter(
              (x) => x !== "—"
            )
        ),
      ],
    [rows]
  );


  const centres = useMemo(
    () =>
      [
        ...new Set(
          rows
            .map(getCentre)
            .filter(Boolean)
        ),
      ],
    [rows]
  );


  const agents = useMemo(
    () =>
      [
        ...new Set(
          rows
            .map(getAgent)
            .filter(
              (x) => x !== "—"
            )
        ),
      ],
    [rows]
  );


  /* =======================================================
     DURATION
     ======================================================= */

  function updateDuration(value) {
    setDuration(value);

    const end = new Date();
    const start = new Date();

    if (value === "7") {
      start.setDate(
        end.getDate() - 6
      );
    }

    if (value === "30") {
      start.setDate(
        end.getDate() - 29
      );
    }

    if (value === "month") {
      start.setDate(1);
    }

    if (value !== "custom") {
      setFromDate(
        getDateInputValue(start)
      );

      setToDate(
        getDateInputValue(end)
      );
    }
  }


  /* =======================================================
     APPLY FILTERS
     ======================================================= */

  function applyFilters(event) {
    event?.preventDefault();

    setFilters({
      fromDate,
      toDate,

      registrationNo:
        registrationNo
          .trim()
          .toLowerCase(),

      patientName:
        patientName
          .trim()
          .toLowerCase(),

      referrer,
      centre,
      agent,

      hasDue,
      cancelled,
    });
  }


  /* =======================================================
     CLEAR FILTERS
     ======================================================= */

  function clearFilters() {
    const end = new Date();
    const start = new Date();

    start.setDate(
      end.getDate() - 6
    );

    setDuration("7");

    setFromDate(
      getDateInputValue(start)
    );

    setToDate(
      getDateInputValue(end)
    );

    setRegistrationNo("");
    setPatientName("");
    setReferrer("");
    setCentre("");
    setAgent("");

    setHasDue(false);
    setCancelled(false);

    setFilters(null);
  }


  /* =======================================================
     FILTERED ROWS
     ======================================================= */

  const filteredRows = useMemo(() => {
    if (!filters) return rows;

    return rows.filter((bill) => {
      const regNo = String(
        bill.registrationNo ??
          bill.regNo ??
          bill.id ??
          ""
      ).toLowerCase();

      const patient =
        getPatientName(
          bill
        ).toLowerCase();

      const billReferrer =
        getReferrer(bill);

      const billCentre =
        getCentre(bill);

      const billAgent =
        getAgent(bill);

      const status =
        getStatus(bill);

      const date =
        getBillDate(bill);


      if (
        filters.registrationNo &&
        !regNo.includes(
          filters.registrationNo
        )
      ) {
        return false;
      }


      if (
        filters.patientName &&
        !patient.includes(
          filters.patientName
        )
      ) {
        return false;
      }


      if (
        filters.referrer &&
        billReferrer !==
          filters.referrer
      ) {
        return false;
      }


      if (
        filters.centre &&
        billCentre !==
          filters.centre
      ) {
        return false;
      }


      if (
        filters.agent &&
        billAgent !==
          filters.agent
      ) {
        return false;
      }


      if (
        filters.hasDue &&
        getBalance(bill) <= 0
      ) {
        return false;
      }


      if (
        !filters.cancelled &&
        status === "Cancelled"
      ) {
        return false;
      }


      if (filters.fromDate) {
        const start = new Date(
          `${filters.fromDate}T00:00:00`
        );

        if (!date || date < start) {
          return false;
        }
      }


      if (filters.toDate) {
        const end = new Date(
          `${filters.toDate}T23:59:59.999`
        );

        if (!date || date > end) {
          return false;
        }
      }


      return true;
    });
  }, [rows, filters]);


  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const bills = filteredRows;

    const total = bills.reduce(
      (sum, bill) =>
        sum +
        Number(
          bill.total ??
            bill.payment?.total ??
            0
        ),
      0
    );

    const paid = bills.reduce(
      (sum, bill) =>
        sum +
        Number(getPaid(bill)),
      0
    );

    const due = bills.reduce(
      (sum, bill) =>
        sum +
        Number(getBalance(bill)),
      0
    );

    const dueBills = bills.filter(
      (bill) =>
        getBalance(bill) > 0
    ).length;

    return {
      count: bills.length,
      total,
      paid,
      due,
      dueBills,
    };
  }, [filteredRows]);


  /* =======================================================
     OPEN BILL
     ======================================================= */

  function openBill(bill) {
    const id = getId(bill);

    if (!id) {
      window.alert(
        "This bill does not have an ID to open."
      );

      return;
    }

    navigate(
      `/cases/bill-details/${id}`
    );
  }


  /* =======================================================
     MODIFY
     ======================================================= */

  function modifyBill(bill) {
    const id = getId(bill);

    if (!id) return;

    navigate(
      `/cases/bills/${id}/modify`
    );
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="cases-page bills-page">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <header className="bills-page-heading">

        <div className="bills-heading-copy">

          <div className="bills-eyebrow">
            CASE MANAGEMENT
          </div>

          <h1>All bills</h1>

          <p>
            Search, review and manage
            patient billing records.
          </p>

        </div>


        <div className="bills-heading-actions">

          <button
            type="button"
            className="case-btn bills-refresh-btn"
            onClick={() => reload({})}
          >
            <RotateCcw size={14} />
            Refresh
          </button>

          <button
            type="button"
            className="case-btn primary bills-new-btn"
            onClick={() =>
              navigate(
                "/cases/new-bill"
              )
            }
          >
            <Plus size={15} />
            New Bill
          </button>

        </div>

      </header>


      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <section className="bills-summary-grid">

        <div className="bills-summary-card">

          <div className="bills-summary-icon blue">
            <FileText size={17} />
          </div>

          <div>
            <span>Total bills</span>
            <strong>
              {summary.count}
            </strong>
          </div>

          <div className="bills-summary-mark">
            {filters
              ? "Filtered"
              : "All records"}
          </div>

        </div>


        <div className="bills-summary-card">

          <div className="bills-summary-icon green">
            <IndianRupee size={17} />
          </div>

          <div>
            <span>Total billed</span>
            <strong>
              {money(summary.total)}
            </strong>
          </div>

        </div>


        <div className="bills-summary-card">

          <div className="bills-summary-icon teal">
            <CheckCircle2 size={17} />
          </div>

          <div>
            <span>Total received</span>
            <strong>
              {money(summary.paid)}
            </strong>
          </div>

        </div>


        <div className="bills-summary-card">

          <div className="bills-summary-icon orange">
            <CircleAlert size={17} />
          </div>

          <div>
            <span>Outstanding</span>
            <strong>
              {money(summary.due)}
            </strong>
          </div>

          <div className="bills-summary-mark warning">
            {summary.dueBills} due
          </div>

        </div>

      </section>


      {/* ===================================================
          FILTER PANEL
      =================================================== */}

      <form
        className="case-filters bills-filter-panel"
        onSubmit={applyFilters}
      >

        <div className="bills-filter-heading">

          <div>
            <strong>Find bills</strong>
            <span>
              Narrow the records using
              the filters below.
            </span>
          </div>

          {filters && (
            <button
              type="button"
              className="bills-clear-top"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}

        </div>


        <div className="bills-filter-grid">

          {/* Duration */}

          <div className="case-field bills-duration-field">

            <label htmlFor="bill-duration">
              Date range
            </label>

            <div className="bills-duration-control">

              <select
                id="bill-duration"
                value={duration}
                onChange={(event) =>
                  updateDuration(
                    event.target.value
                  )
                }
              >
                <option value="7">
                  Past 7 days
                </option>

                <option value="30">
                  Past 30 days
                </option>

                <option value="month">
                  This month
                </option>

                <option value="custom">
                  Custom
                </option>
              </select>


              <div className="bills-date-range">

                <CalendarDays size={14} />

                <input
                  aria-label="From date"
                  type="date"
                  value={fromDate}
                  onChange={(event) => {
                    setFromDate(
                      event.target.value
                    );

                    setDuration(
                      "custom"
                    );
                  }}
                />

                <span>to</span>

                <input
                  aria-label="To date"
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(
                      event.target.value
                    );

                    setDuration(
                      "custom"
                    );
                  }}
                />

              </div>

            </div>

          </div>


          {/* Registration */}

          <div className="case-field bills-filter-field">

            <label htmlFor="bill-registration">
              Registration no.
            </label>

            <input
              id="bill-registration"
              placeholder="Search registration..."
              value={registrationNo}
              onChange={(event) =>
                setRegistrationNo(
                  event.target.value
                )
              }
            />

          </div>


          {/* Patient */}

          <div className="case-field bills-filter-field">

            <label htmlFor="bill-patient">
              Patient name
            </label>

            <input
              id="bill-patient"
              placeholder="Search patient..."
              value={patientName}
              onChange={(event) =>
                setPatientName(
                  event.target.value
                )
              }
            />

          </div>


          {/* Referrer */}

          <div className="case-field bills-filter-field">

            <label htmlFor="bill-referrer">
              Referred by
            </label>

            <select
              id="bill-referrer"
              value={referrer}
              onChange={(event) =>
                setReferrer(
                  event.target.value
                )
              }
            >
              <option value="">
                All referrers
              </option>

              {referrers.map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Centre */}

          <div className="case-field bills-filter-field">

            <label htmlFor="bill-centre">
              Collection centre
            </label>

            <select
              id="bill-centre"
              value={centre}
              onChange={(event) =>
                setCentre(
                  event.target.value
                )
              }
            >
              <option value="">
                All centres
              </option>

              {centres.map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Agent */}

          <div className="case-field bills-filter-field">

            <label htmlFor="bill-agent">
              Sample collection agent
            </label>

            <select
              id="bill-agent"
              value={agent}
              onChange={(event) =>
                setAgent(
                  event.target.value
                )
              }
            >
              <option value="">
                All agents
              </option>

              {agents.map(
                (name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {/* Filter footer */}

        <div className="bills-filter-footer">

          <div className="bills-filter-options">

            <label className="bills-checkbox">
              <input
                type="checkbox"
                checked={hasDue}
                onChange={(event) =>
                  setHasDue(
                    event.target.checked
                  )
                }
              />

              <span>Has due</span>
            </label>


            <label className="bills-checkbox">
              <input
                type="checkbox"
                checked={cancelled}
                onChange={(event) =>
                  setCancelled(
                    event.target.checked
                  )
                }
              />

              <span>Include cancelled</span>
            </label>

          </div>


          <div className="bills-filter-buttons">

            <button
              type="button"
              className="case-btn"
              onClick={clearFilters}
            >
              Clear
            </button>

            <button
              type="submit"
              className="case-btn primary"
            >
              <Search size={14} />
              Search bills
            </button>

          </div>

        </div>

      </form>


      {/* ===================================================
          TABLE
      =================================================== */}

      {loading ? (

        <div className="bills-state-card">

          <div className="bills-loading-spinner" />

          <strong>
            Loading bills
          </strong>

          <span>
            Fetching the latest
            billing records...
          </span>

        </div>

      ) : error ? (

        <div className="api-error bills-error-card">

          <div>
            <strong>
              Unable to load bills
            </strong>

            <span>
              {String(error)}
            </span>
          </div>

          <button
            type="button"
            className="case-btn"
            onClick={() =>
              reload({})
            }
          >
            Retry
          </button>

        </div>

      ) : (

        <div className="bills-table-container">

          <div className="bills-table-header">

            <div>
              <strong>
                Billing records
              </strong>

              <span>
                Showing{" "}
                <b>
                  {filteredRows.length}
                </b>{" "}
                of {rows.length} records
              </span>
            </div>

            {filters && (
              <span className="bills-filter-active">
                Filters applied
              </span>
            )}

          </div>


          <div className="bills-table-scroll">

            <table className="bills-table">

              <thead>
                <tr>

                  <th
                    className="bills-expand-column"
                    aria-label="Expand"
                  />

                  <th>REG. NO.</th>

                  <th>DATE</th>

                  <th>PATIENT</th>

                  <th>REFERRED BY</th>

                  <th>TOTAL</th>

                  <th>PAID</th>

                  <th>DISCOUNT</th>

                  <th>STATUS</th>

                  <th>ACTIONS</th>

                </tr>
              </thead>


              <tbody>

                {filteredRows.map(
                  (bill, index) => {

                    const id =
                      getId(bill) ??
                      `bill-${index}`;

                    const dateTime =
                      formatDateTime(
                        bill.createdAt ||
                          bill.date ||
                          bill.billDate
                      );

                    const expanded =
                      expandedId === id;

                    const status =
                      getStatus(bill);

                    return (
                      <FragmentRow
                        key={id}
                        bill={bill}
                        id={id}
                        expanded={
                          expanded
                        }
                        status={status}
                        dateTime={
                          dateTime
                        }
                        menuOpen={
                          menuId === id
                        }
                        onToggleExpand={() =>
                          setExpandedId(
                            expanded
                              ? null
                              : id
                          )
                        }
                        onToggleMenu={() =>
                          setMenuId(
                            menuId === id
                              ? null
                              : id
                          )
                        }
                        onOpen={() =>
                          openBill(
                            bill
                          )
                        }
                        onModify={() =>
                          modifyBill(
                            bill
                          )
                        }
                      />
                    );
                  }
                )}


                {!filteredRows.length && (

                  <tr>

                    <td
                      colSpan={10}
                      className="bills-no-results"
                    >

                      <div className="bills-empty-icon">
                        <Search
                          size={20}
                        />
                      </div>

                      <strong>
                        No bills found
                      </strong>

                      <span>
                        Try changing your
                        search criteria.
                      </span>

                      <button
                        type="button"
                        className="case-link"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear filters
                      </button>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          <div className="bills-table-footer">

            <span>
              {filteredRows.length}{" "}
              records displayed
            </span>

            <span>
              Outstanding:{" "}
              <strong>
                {money(summary.due)}
              </strong>
            </span>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   TABLE ROW
   ========================================================= */

function FragmentRow({
  bill,
  id,
  expanded,
  status,
  dateTime,
  menuOpen,
  onToggleExpand,
  onToggleMenu,
  onOpen,
  onModify,
}) {
  const patientName =
    getPatientName(bill);

  const balance =
    getBalance(bill);

  const investigations =
    getInvestigations(bill);


  return (
    <>
      <tr
        className={
          expanded
            ? "bills-row bills-row-expanded"
            : "bills-row"
        }
      >

        {/* Expand */}

        <td className="bills-expand-column">

          <button
            type="button"
            className="bills-expand-button"
            aria-label={
              expanded
                ? "Collapse bill"
                : "Expand bill"
            }
            onClick={
              onToggleExpand
            }
          >
            {expanded ? (
              <ChevronDown
                size={15}
              />
            ) : (
              <ChevronRight
                size={15}
              />
            )}
          </button>

        </td>


        {/* Registration */}

        <td className="bills-registration">
          <span>
            {bill.registrationNo ??
              bill.regNo ??
              bill.id ??
              "—"}
          </span>
        </td>


        {/* Date */}

        <td className="bills-date-cell">

          <span>
            {dateTime.date}
          </span>

          {dateTime.time && (
            <small>
              {dateTime.time}
            </small>
          )}

        </td>


        {/* Patient */}

        <td
          className="bills-patient-cell"
          title={patientName}
        >

          <div className="bills-patient">

            <div className="bills-patient-avatar">
              {patientName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {patientName}
              </strong>

              <small>
                {bill.labNo ||
                  bill.labNumber ||
                  `Bill ${id}`}
              </small>

            </div>

          </div>

        </td>


        {/* Referrer */}

        <td
          className="bills-referrer-cell"
          title={getReferrer(bill)}
        >
          {getReferrer(bill)}
        </td>


        {/* Amount */}

        <td className="bills-amount">
          {money(
            bill.total ??
              bill.payment?.total
          )}
        </td>


        {/* Paid */}

        <td className="bills-amount bills-paid">
          {money(
            getPaid(bill)
          )}
        </td>


        {/* Discount */}

        <td className="bills-amount bills-discount">
          {money(
            bill.discount ??
              bill.payment?.discount
          )}
        </td>


        {/* Status */}

        <td>

          <span
            className={`bills-status ${
              status === "Due"
                ? "due"
                : status === "Cancelled"
                  ? "cancelled"
                  : "paid"
            }`}
          >

            <span />

            {status}

          </span>

        </td>


        {/* Actions */}

        <td className="bills-actions-cell">

          <button
            type="button"
            className="bills-view-link"
            onClick={onOpen}
          >
            View
            <ArrowUpRight
              size={13}
            />
          </button>


          <div className="bills-menu-wrap">

            <button
              type="button"
              className="bills-more-button"
              aria-label="More bill actions"
              aria-expanded={
                menuOpen
              }
              onClick={
                onToggleMenu
              }
            >
              <MoreHorizontal
                size={17}
              />
            </button>


            {menuOpen && (

              <div className="bills-action-menu">

                <button
                  type="button"
                  onClick={
                    onOpen
                  }
                >
                  View bill
                </button>

                <button
                  type="button"
                  onClick={
                    onModify
                  }
                >
                  Modify bill
                </button>

              </div>

            )}

          </div>

        </td>

      </tr>


      {/* ===================================================
          EXPANDED DETAILS
      =================================================== */}

      {expanded && (

        <tr className="bills-expanded-details">

          <td />

          <td colSpan={9}>

            <div className="bills-expanded-content">

              <div className="bills-expanded-item">

                <span>
                  Lab number
                </span>

                <strong>
                  {bill.labNo ||
                    bill.labNumber ||
                    bill.patientDetails
                      ?.labNo ||
                    "—"}
                </strong>

              </div>


              <div className="bills-expanded-item bills-investigations">

                <span>
                  Investigations
                </span>

                <div className="bills-test-list">

                  {investigations.length ? (

                    investigations
                      .slice(0, 6)
                      .map(
                        (
                          test,
                          index
                        ) => (

                          <span
                            className="bills-test-chip"
                            key={
                              test.id ||
                              test._id ||
                              index
                            }
                          >
                            {typeof test ===
                            "string"
                              ? test
                              : test.name ||
                                test.testName ||
                                test.investigationName ||
                                test.label ||
                                "Investigation"}
                          </span>

                        )
                      )

                  ) : (

                    <strong>
                      —
                    </strong>

                  )}

                </div>

              </div>


              <div className="bills-expanded-item">

                <span>
                  Collection centre
                </span>

                <strong>
                  {getCentre(bill)}
                </strong>

              </div>


              <div className="bills-expanded-item">

                <span>
                  Sample collection agent
                </span>

                <strong>
                  {getAgent(bill)}
                </strong>

              </div>


              <div className="bills-expanded-item">

                <span>
                  Balance
                </span>

                <strong
                  className={
                    balance > 0
                      ? "amount-negative"
                      : "amount-positive"
                  }
                >
                  {money(balance)}
                </strong>

              </div>


              <button
                type="button"
                className="case-btn bills-details-button"
                onClick={onOpen}
              >
                View full details
                <ArrowUpRight
                  size={13}
                />
              </button>

            </div>

          </td>

        </tr>

      )}

    </>
  );
}