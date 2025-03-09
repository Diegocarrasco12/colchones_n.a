import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (desarrollo o producción)
  const env = loadEnv(mode, process.cwd(), "");
  console.log(env)

  return {
    plugins: [react()],
    base: "/", 
    build: {
      outDir: "dist",
      assetsDir: "assets",
    },
    server: {
      host: true, 
      port: env.VITE_PORT || 3000, 
    },
    define: {
      "process.env": env, 
    },
  };
});
