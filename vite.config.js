import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        characterDesign: "./pages/characterDesign.html", 
        p5:"./p5/p5.js"
      },
      output: {
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  publicDir: "public",
});
