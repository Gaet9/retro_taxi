import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

export const Layout = () => {
    return (
        <div className='h-screen bg-butter flex flex-col min-h-screen bg-cover racing-font'>
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    );
};
