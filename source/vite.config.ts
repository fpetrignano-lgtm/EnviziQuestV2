import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/EnviziQuestV2/" : "/",
  plugins: [react()],
  build: { chunkSizeWarningLimit: 700 },
}));
