import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Actions sets BASE_URL to /repo-name/ for Pages project sites.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || "/",
});
