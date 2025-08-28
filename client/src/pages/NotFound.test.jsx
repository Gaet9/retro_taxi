import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { NotFound } from "../pages/NotFound";
import "@testing-library/jest-dom/vitest";

describe("NotFound component", () => {
    beforeEach(() => {
        cleanup();
    });
    it("renders the 404 message", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        // Check the text is there
        expect(screen.getByText(/sorry this page doesn't exist/i)).toBeInTheDocument();
    });

    it("has a link to the blogs page", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        const link = screen.getByLabelText("link");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/blogs");
    });
});
