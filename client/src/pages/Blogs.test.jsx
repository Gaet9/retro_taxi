import { render, screen, waitFor } from "@testing-library/react";
import { Blogs } from "./Blogs";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock fetchBlogsPublished API
vi.mock("../api/blogs", () => ({
    fetchBlogsPublished: vi.fn(),
}));

// Mock components
vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));
vi.mock("../components/Header", () => ({
    Header: () => <header data-testid='Retro-Taxi'></header>,
}));

import { fetchBlogsPublished } from "../api/blogs";

describe("Blogs component", () => {
    const fakeBlogs = [
        {
            id: 1,
            title: "Robot taxi",
            content: "Epic Elon",
            category: "Sport",
            model: "Model S",
            brand: "Tesla",
            image_url: "Tesla.jpg",
            created_at: "2025-01-01",
            user_id: 1,
            status: "draft",
            last_updated: "2025-02-01",
            summary: "Tesla X summary",
        },
        {
            id: 2,
            title: "Autuonomous Taxis",
            content: "Discovery",
            category: "Family",
            model: "Cruise",
            brand: "GM",
            image_url: "GM.jpg",
            created_at: "2025-01-02",
            user_id: 2,
            status: "published",
            last_updated: "2025-02-02",
            summary: "Cruise down",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        fetchBlogsPublished.mockResolvedValue({ data: fakeBlogs });
    });

    it("renders Navigation, Header and blog cards", async () => {
        render(
            <MemoryRouter>
                <Blogs />
            </MemoryRouter>
        );

        // Navigation, Header present
        expect(screen.getByTestId("mock-navigation")).toBeInTheDocument();
        expect(screen.getByTestId("Retro-Taxi")).toBeInTheDocument();

        // Wait for blogs to render
        await waitFor(() => {
            fakeBlogs.forEach(({ brand, model, category, created_at }) => {
                expect(screen.getByText(brand)).toBeInTheDocument();
                expect(screen.getByText(model)).toBeInTheDocument();
                expect(screen.getByText(category)).toBeInTheDocument();

                // Check formatted date text exists
                expect(screen.getByText(new Date(created_at).toLocaleDateString())).toBeInTheDocument();
            });
        });

        // Check links have correct "to" attribute
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(fakeBlogs.length);
        expect(links[0]).toHaveAttribute("href", "/1");
        expect(links[1]).toHaveAttribute("href", "/2");
    });
});
