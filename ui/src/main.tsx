import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ProfileContextProvider from "./context/ProfileContextProvider.tsx";
import AuthContextProvider from "./context/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthContextProvider>
            <ProfileContextProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ProfileContextProvider>
        </AuthContextProvider>
    </StrictMode>,
);
