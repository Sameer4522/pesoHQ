import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		allowedHosts: true,
		proxy: {
			"/api": {
				target: "http://localhost:8080/" + "/api",
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, ""),
				ws: true,
				secure: false,
			},
		},
	},
});
