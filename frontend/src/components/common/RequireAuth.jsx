import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authApi } from "../../api/core/apiAuth";

/**
 * Wrap protected routes with this. It checks that a token exists and that
 * the server still accepts it, otherwise it sends the user to /login.
 */
export default function RequireAuth() {
  const location = useLocation();
  const [status, setStatus] = useState("checking"); // checking | ok | denied

  // Runs once when the protected area mounts, not on every page change.
  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      setStatus("denied");
      return undefined;
    }

    let cancelled = false;

    authApi
      .me()
      .then(() => {
        if (!cancelled) setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // No token at all (also covers logging out while a page is open).
  if (!authApi.isLoggedIn() || status === "denied") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (status === "checking") {
    return <p style={{ padding: 24 }}>Checking your session...</p>;
  }

  return <Outlet />;
}