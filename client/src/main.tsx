import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply initial theme before React renders to ensure correct colors
(() => {
  try {
    const stored = localStorage.getItem("theme");
    // Default to light mode (ignore system preference unless explicitly stored)
    const isDark = stored ? stored === "dark" : false;
    document.documentElement.classList.toggle("dark", !!isDark);
  } catch {
    // Fallback to light mode
    document.documentElement.classList.remove("dark");
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
