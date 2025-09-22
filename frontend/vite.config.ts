import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "../internal/server/dist",
  },
  plugins: [tailwindcss(), solid()],
});
