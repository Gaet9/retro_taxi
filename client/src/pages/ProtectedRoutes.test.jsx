import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { AuthData } from "../context/AuthProvider";
import { ProtectedRoutes } from "./ProtectedRoutes";

// Mock AuthData hook
vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

vi.mock("./NotFound", () => ({
    NotFound: () => <div>Not Found Page</div>,
}));

describe("PrivateRoutes", () => {
    it("redirects to /login if user is not logged in", () => {
        AuthData.mockReturnValue({ user: { isLoggedIn: false } });

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path='/protected' element={<ProtectedRoutes />} />
                    <Route path='/login' element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it("renders Outlet if user is logged in", () => {
        AuthData.mockReturnValue({ user: { isLoggedIn: true } });

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route element={<ProtectedRoutes />}>
                        <Route path='/protected' element={<div>Protected</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Protected/i)).toBeInTheDocument();
    });
});
