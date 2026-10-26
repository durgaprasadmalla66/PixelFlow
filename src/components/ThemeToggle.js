
import React from "react";

export default function ThemeToggle({
  theme,
  setTheme
}) {
  function toggleTheme() {
    setTheme((previous) =>
      previous === "dark"
        ? "light"
        : "dark"
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        theme === "dark"
          ? "Light mode"
          : "Dark mode"
      }
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
