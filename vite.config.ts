import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 850,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: (id) =>
                "content-" + id.split("/").at(-1)!.replace(".json", ""),
              test: /src[\\/]content[\\/].+\.json$/,
            },
            { name: "math-renderer", test: /node_modules[\\/]katex/ },
            { name: "framework", test: /node_modules/ },
          ],
        },
      },
    },
  },
});
