import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SingleBlog } from "./SingleBlog";
import "@testing-library/jest-dom/vitest";
import { fetchBlogById } from "../api/blogs";

// Mock the external modules
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useParams: vi.fn(),
    };
});

vi.mock("../api/blogs", () => ({
    fetchBlogById: vi.fn(),
}));

vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";

import { AuthData } from "../context/AuthProvider";

beforeEach(() => {
    cleanup();
    AuthData.mockReturnValue({ user: { isLoggedIn: false } });
});

describe("SingleBlog Component", () => {
    const mockBlog = {
        data: {
            id: "1",
            title: "Tesla Model S Review",
            content: "This is a review of the Tesla Model S.",
            model: "Model S",
            brand: "Tesla",
            created_at: "2023-01-01T00:00:00Z",
            user_id: 1,
            status: "published",
            last_updated: "2023-02-01T00:00:00Z",
            summary: "Model S",
        },
    };

    it("renders blog details when data is fetched", async () => {
        useParams.mockReturnValue({ id: "1" });
        fetchBlogById.mockResolvedValue(mockBlog);

        render(
            <MemoryRouter initialEntries={["/blogs/1"]}>
                <Routes>
                    <Route path='/blogs/:id' element={<SingleBlog />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText("Tesla Model S Review")).toBeInTheDocument();
        expect(await screen.findByText("This is a review of the Tesla Model S.")).toBeInTheDocument();
        expect(await screen.findByText("Model S")).toBeInTheDocument();
        expect(await screen.findByText("Tesla")).toBeInTheDocument();
    });

    it("renders error message when blog does not exist", async () => {
        useParams.mockReturnValue({ id: "2" });
        fetchBlogById.mockRejectedValue(new Error("Failed to fetch blogs"));

        render(
            <MemoryRouter initialEntries={["/blogs/2"]}>
                <Routes>
                    <Route path='/blogs/:id' element={<SingleBlog />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Sorry this blog doesn't exist")).toBeInTheDocument();
        });
    });

    it("renders the correct dates", async () => {
        useParams.mockReturnValue({ id: "1" });
        fetchBlogById.mockResolvedValue(mockBlog);

        render(
            <MemoryRouter initialEntries={["/blogs/1"]}>
                <Routes>
                    <Route path='/blogs/:id' element={<SingleBlog />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/First published on :/i)).toBeInTheDocument();
            expect(screen.getByText(/Last updated on:/i)).toBeInTheDocument();
        });
    });

    it("renders a link to go back to the blogs page", async () => {
        useParams.mockReturnValue({ id: "2" });
        fetchBlogById.mockRejectedValue(new Error("Failed to fetch blogs"));

        render(
            <MemoryRouter initialEntries={["/blogs/2"]}>
                <Routes>
                    <Route path='/blogs/:id' element={<SingleBlog />} />
                </Routes>
            </MemoryRouter>
        );

        const link = await screen.findByText("Go back to the blogs page");
        expect(link).toHaveAttribute("href", "/blogs");
    });
});
