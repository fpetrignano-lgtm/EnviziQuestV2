import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Lock the layout to 1080px height regardless of browser zoom (Cmd+/-).
// screen.height is the physical monitor height in CSS pixels — unaffected by browser zoom.
function applyScale() {
  const scale = screen.height / 1080;
  const root = document.getElementById("root") as HTMLElement;
  root.style.transform = `scale(${scale})`;
  root.style.transformOrigin = "top left";
  root.style.width = `${(1 / scale) * 100}vw`;
  root.style.height = "1080px";
  root.style.overflow = "hidden";
}
applyScale();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
