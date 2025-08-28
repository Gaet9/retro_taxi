import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "automatic", // ensures JSX works without 'import React'
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    test: {
        environment: "jsdom",
        coverage: {
            provider: "v8", // or "istanbul" if you prefer
            reportsDirectory: "./coverage",
            clean: false,
            include: ["src/**/*.{js,jsx,ts,tsx}"],
            exclude: ["node_modules/", "src/coverage/**", "src/**/*.test.{js,jsx,ts,tsx}", "src/**/__tests__/**", "src/**/__mocks__/**"],
            reporter: ["text", "html"], // shows in terminal + HTML report
        },
    },
});
