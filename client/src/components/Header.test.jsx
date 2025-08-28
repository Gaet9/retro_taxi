import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Header } from "./Header";
import { MemoryRouter } from "react-router-dom";

describe("Header component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );
    });
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });
    it("renders children correctly", () => {
        render(<Header>Test Title</Header>);
        expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("has default color class 'text-butter'", () => {
        render(<Header>Title</Header>);
        const headerDiv = screen.getByText("Title");
        expect(headerDiv).toHaveClass("text-butter");
    });

    it("applies custom color class when provided", () => {
        render(<Header color='text-purple-950'>Title</Header>);
        const headerDiv = screen.getByText("Title");
        expect(headerDiv).toHaveClass("text-purple-950");
    });
});
