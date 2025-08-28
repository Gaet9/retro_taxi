import { Navigate, Outlet } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";

export const ProtectedRoutes = () => {
    const { user } = AuthData();

    return user?.isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
};
