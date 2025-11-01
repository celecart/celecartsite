import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply initial theme before React renders to ensure correct colors
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", !!isDark);
  } catch {
    // Fallback to dark appearance if storage or matchMedia is unavailable
    document.documentElement.classList.add("dark");
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
