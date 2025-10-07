import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserWithToken } from "../api/users";
import { logoutApi } from "../api/auth";
import { useNotification } from "../components/Notification";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, isAdmin: false });
    // Include the notification component in the wrapper thereofre in the whole app
    const [NotificationElement, showNotification] = useNotification();

    useEffect(() => {
        let isMounted = true;
        fetchUserWithToken()
            .then((data) => {
                if (!isMounted) return;
                setUser({ ...data.data, isLoggedIn: true, isAdmin: data.data.role === "admin" });
            })
            .catch((err) => {
                if (!isMounted) return;
                // Silently treat 401 as logged out to avoid noisy console errors
                setUser({ isLoggedIn: false, isAdmin: false });
                if (!(err?.response?.status === 401)) {
                    console.debug("Auth check failed:", err?.message || err);
                }
            });
        return () => {
            isMounted = false;
        };
    }, []);

    const login = (userData) => {
        setUser({
            ...userData,
            isLoggedIn: true,
            isAdmin: userData.role === "admin",
        });
    };

    const logout = async () => {
        try {
            await logoutApi();
            showNotification("You have been logged out", "info");
            setTimeout(() => {
                setUser({ isLoggedIn: false, isAdmin: false });
            }, 2000);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {/* Include the notification here to avoid many wrappers */}
            {NotificationElement}
            {children}
        </AuthContext.Provider>
    );
};
