import { Navigate, Outlet } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";

export const PrivateRoutes = () => {
    const { user } = AuthData();

    if (!user?.isLoggedIn) return <Navigate to='/login' replace />;
    if (!user?.isAdmin) return <Navigate to='/not-found' replace />;

    return <Outlet />;
};
