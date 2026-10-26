
import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ThemeToggle from "./components/ThemeToggle";
import Toast from "./components/Toast";

export default function App() {
  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState(() => {
    try {
      return (
        localStorage.getItem("pixelflow-theme") ||
        "dark"
      );
    } catch {
      return "dark";
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pixelflow-theme",
        theme
      );
    } catch {
      
    }
  }, [theme]);

  // FIX: Stable notification function.
  const notify = useCallback(
    (message, type = "success") => {
      setToast({
        id: `${Date.now()}-${Math.random()}`,
        message,
        type
      });
    },
    []
  );

  function handleLogin(userData) {
    setUser(userData);
    notify("Welcome to PixelFlow!");
  }

  function handleLogout() {
    setUser(null);
    notify("You have signed out.");
  }

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="logo">
          <span className="logo-icon">
            ✦
          </span>

          <span className="logo-name">
            pixel<span>flow</span>
          </span>

          <span className="logo-label">
            STUDIO
          </span>
        </div>

        {user && (
          <div className="header-actions">
            <span className="user-email">
              {user.email}
            </span>

            <button
              type="button"
              className="signout"
              onClick={handleLogout}
            >
              Sign out ↗
            </button>
          </div>
        )}
      </header>

      {!user ? (
        <Login
          onLogin={handleLogin}
          onError={(message) =>
            notify(message, "error")
          }
        />
      ) : (
        <Dashboard
          user={user}
          notify={notify}
        />
      )}

      <ThemeToggle
        theme={theme}
        setTheme={setTheme}
      />

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
