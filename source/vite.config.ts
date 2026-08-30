import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/envizi-esg-quest/",
  plugins: [react()],
});
