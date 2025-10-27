import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ✅ No require() usage here!
// ✅ Line-clamp plugin will now be loaded through tailwind.config.cjs — not here

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
