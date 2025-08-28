import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock AuthData context
vi.mock("../context/AuthProvider", () => ({
    AuthData: () => ({ user: { id: 1, name: "Test User" } }),
}));

describe("Home component", () => {
    it("renders without crashing and shows main elements", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Check background image style includes voitureCover file name (partial)
        const divWithBg = screen.getByTitle("Retro Taxi");
        expect(divWithBg.style.backgroundImage).toContain("voiture-en-montagne");

        // Navigation and Header texts present
        expect(screen.getByText(/retro taxi/i)).toBeInTheDocument();
        expect(screen.getByText(/let's discover the future of transportation/i)).toBeInTheDocument();

        // Discover link exists and points to /blogs
        const discoverLink = screen.getByRole("link", { name: /discover/i });
        expect(discoverLink).toBeInTheDocument();
        expect(discoverLink).toHaveAttribute("href", "/blogs");
    });
});
