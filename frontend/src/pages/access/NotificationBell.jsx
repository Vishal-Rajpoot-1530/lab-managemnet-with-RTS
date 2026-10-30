import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { manageApiService } from "../../api";
import { authApi } from "../../api/core/apiAuth";

const REFRESH_INTERVAL = 60_000;

const COLORS = {
  info: "#2563eb",
  success: "#16a34a",
  warning: "#d97706",
  critical: "#dc2626",
};

function timeAgo(value) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (!Number.isFinite(minutes) || minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/**
 * Bell with the messages the super admin sent to this lab.
 * Put <NotificationBell /> in the header, in place of the current bell.
 * "Read" is remembered in this browser for the signed-in user.
 */
export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [read, setRead] = useState([]);
  const [open, setOpen] = useState(false);
  const [storageKey, setStorageKey] = useState(null);
  const box = useRef(null);

  // Who is signed in, to remember what they have read.
  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => setStorageKey(`labNotificationsRead:${user.email}`))
      .catch(() => setStorageKey("labNotificationsRead:anonymous"));
  }, []);

  useEffect(() => {
    if (!storageKey) return;
    try {
      setRead(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      setRead([]);
    }
  }, [storageKey]);

//   const load = useCallback(async () => {
//     try {
//       setItems(await manageApiService.notifications.list());
//     } catch {
//       // Not signed in to a lab, or the server is unreachable: show an empty bell.
//     }
//   }, []);



const load = useCallback(async () => {
  try {
    const response = await manageApiService.notifications.list();

    console.log("[Notifications] API response:", response);

    setItems(Array.isArray(response) ? response : response?.data ?? []);
  } catch (error) {
    console.error("[Notifications] Fetch failed:", error);
  }
}, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  // Close when clicking elsewhere or pressing Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => box.current && !box.current.contains(event.target) && setOpen(false);
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const remember = (ids) => {
    setRead(ids);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch {
      // storage unavailable: unread counts reset on reload
    }
  };

  const unread = items.filter((item) => !read.includes(item.id));

  const markRead = (id) => !read.includes(id) && remember([...read, id]);
  const markAllRead = () => remember([...new Set([...read, ...items.map((i) => i.id)])]);

  return (
    <div ref={box} style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
        aria-expanded={open}
        style={{ position: "relative", background: "transparent", border: 0, cursor: "pointer", padding: 8, color: "inherit", display: "grid", placeItems: "center" }}
      >
        <Bell size={20} />
        {unread.length > 0 && (
          <span style={{ position: "absolute", top: 2, right: 2, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#dc2626", color: "#fff", fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center" }}>
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div role="dialog" aria-label="Notifications"
          style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 360, maxWidth: "92vw", background: "#fff", color: "#111827", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,.18)", zIndex: 100, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
            <strong>Notifications</strong>
            {unread.length > 0 && (
              <button type="button" onClick={markAllRead}
                style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "transparent", border: 0, color: "#2563eb", cursor: "pointer", fontSize: 13 }}>
                <CheckCheck size={14} /> Mark all as read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {items.length === 0 && (
              <p style={{ margin: 0, padding: "28px 16px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                No notifications.
              </p>
            )}

            {items.map((item) => {
              const isUnread = !read.includes(item.id);
              return (
                <button key={item.id} type="button" onClick={() => markRead(item.id)}
                  style={{ display: "block", width: "100%", textAlign: "left", background: isUnread ? "rgba(37,99,235,.05)" : "transparent", border: 0, borderBottom: "1px solid #f1f2f4", padding: "12px 16px", cursor: "pointer", color: "inherit" }}>
                  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[item.severity] || COLORS.info, flex: "none" }} />
                    <strong style={{ fontSize: 14, flex: 1 }}>{item.title}</strong>
                    {isUnread && <span style={{ fontSize: 11, color: "#2563eb" }}>New</span>}
                  </span>
                  <span style={{ display: "block", margin: "4px 0 0 16px", fontSize: 13, color: "#374151", whiteSpace: "pre-wrap" }}>
                    {item.message}
                  </span>
                  <span style={{ display: "block", margin: "6px 0 0 16px", fontSize: 12, color: "#9ca3af" }}>
                    {timeAgo(item.createdAt)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}