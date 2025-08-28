import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./context/AuthProvider.jsx";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthWrapper>
            <App />
        </AuthWrapper>
    </BrowserRouter>
);
