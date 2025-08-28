import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { AuthData } from "../context/AuthProvider";

import { Navigation } from "./Navigation";

// Mock AuthData context
vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
describe("Navigation component", () => {
    it("renders Login link when logged out", () => {
        vi.mocked(AuthData).mockReturnValue({
            user: { isLoggedIn: false, isAdmin: false },
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        expect(screen.getByTitle(/login/i)).toBeInTheDocument();
        expect(screen.queryByTitle(/logout/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle(/profile/i)).not.toBeInTheDocument();
    });

    it("renders profile, logout, and admin link when user is admin", () => {
        // Override mock for this test
        const mockLogout = vi.fn();
        vi.mocked(AuthData).mockReturnValue({
            user: { isLoggedIn: true, isAdmin: true },
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        expect(screen.getByTitle(/profile/i)).toBeInTheDocument();
        expect(screen.getByTitle(/logout/i)).toBeInTheDocument();
        expect(screen.getByTitle(/admin/i)).toBeInTheDocument();

        // Test logout button click
        fireEvent.click(screen.getByTitle(/logout/i));
        expect(mockLogout).toHaveBeenCalled();
    });

    it("renders profile and logout but NOT admin link when user is logged in but not admin", () => {
        const mockLogout = vi.fn();
        vi.mocked(AuthData).mockReturnValue({
            user: { isLoggedIn: true, isAdmin: false },
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        expect(screen.getByTitle(/profile/i)).toBeInTheDocument();
        expect(screen.getByTitle(/logout/i)).toBeInTheDocument();
        expect(screen.queryByTitle(/admin/i)).not.toBeInTheDocument();
    });

    it.each([
        { route: "/", name: /home/i },
        { route: "/blogs", name: /blogs/i },
        { route: "/about", name: /about/i },
        { route: "/contact", name: /contact/i },
        { route: "/profile", name: /profile/i },
        { route: "/admin-dash", name: /admin/i },
    ])("applies active class nav bar links when admin and logged in", ({ route, name }) => {
        vi.mocked(AuthData).mockReturnValue({
            user: { isLoggedIn: true, isAdmin: true },
            logout: vi.fn(),
        });

        render(
            <MemoryRouter initialEntries={[route]}>
                <Navigation />
            </MemoryRouter>
        );

        const activeLink = screen.getByRole("link", { name });
        expect(activeLink).toBeTruthy(); // exists
        expect(activeLink?.className).toContain("bg-purple-950");
    });

    it("applies active class to the login nav bar link when logged out", () => {
        vi.mocked(AuthData).mockReturnValue({
            user: { isLoggedIn: false, isAdmin: false },
        });

        render(
            <MemoryRouter initialEntries={["/login"]}>
                <Navigation />
            </MemoryRouter>
        );

        const homeLink = screen.getByRole("link", { name: /login/i });
        expect(homeLink.className).toContain("bg-purple-950");
    });
});
