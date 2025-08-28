import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserWithToken } from "../api/users";
import { logoutApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/Notification";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = ({ children }) => {
    const [user, setUser] = useState({ isLoggedIn: false, isAdmin: false });
    // Include the notification component in the wrapper thereofre in the whole app
    const [NotificationElement, showNotification] = useNotification();

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserWithToken()
            .then((data) => setUser({ ...data.data, isLoggedIn: true, isAdmin: data.data.role === "admin" }))
            .catch((err) => {
                setUser({ isLoggedIn: false, isAdmin: false });
                console.error(err);
            });
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
