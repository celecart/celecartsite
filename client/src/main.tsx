import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handler to catch React errors
window.addEventListener('error', (event) => {
  console.error('🚨 Global Error:', event.error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: monospace;">
      <h1>Application Error</h1>
      <pre>${event.error?.stack || event.error || 'Unknown error'}</pre>
    </div>
  `;
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled Promise Rejection:', event.reason);
});

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

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('🚨 Failed to render App:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #f44336; color: white; font-family: monospace;">
      <h1>Failed to Render Application</h1>
      <pre>${error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  `;
}
