import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { PrivateRoutes } from "./PrivateRoutes";
import "@testing-library/jest-dom/vitest";

import { AuthData } from "../context/AuthProvider";

// Mock AuthData hook
vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

vi.mock("./NotFound", () => ({
    NotFound: () => <div>Not Found Page</div>,
}));

describe("Protected routes ", () => {
    it("redirects to /login if user is not logged in", () => {
        AuthData.mockReturnValue({ user: { isLoggedIn: false } });

        render(
            <MemoryRouter initialEntries={["/private"]}>
                <Routes>
                    <Route path='/private' element={<PrivateRoutes />} />
                    <Route path='/login' element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it("redirects to /not-found if user is logged in but not admin", () => {
        AuthData.mockReturnValue({ user: { isLoggedIn: true, isAdmin: false } });

        render(
            <MemoryRouter initialEntries={["/private"]}>
                <Routes>
                    <Route path='/private' element={<PrivateRoutes />} />
                    <Route path='/not-found' element={<div>Not Found Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Not Found Page")).toBeInTheDocument();
    });

    it("renders Outlet if user is logged in and admin", () => {
        AuthData.mockReturnValue({ user: { isLoggedIn: true, isAdmin: true } });

        render(
            <MemoryRouter initialEntries={["/private"]}>
                <Routes>
                    <Route element={<PrivateRoutes />}>
                        <Route path='/private' element={<div>Admin Page</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Admin Page/i)).toBeInTheDocument();
    });
});
