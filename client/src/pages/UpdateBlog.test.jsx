// UpdateBlog.test.jsx
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UpdateBlog } from "../pages/UpdateBlog";
import "@testing-library/jest-dom/vitest";

// Mock dependencies
vi.mock("../api/blogs", () => ({
    fetchBlogById: vi.fn(),
    updateBlog: vi.fn(),
}));

vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

import { AuthData } from "../context/AuthProvider";
import { fetchBlogById, updateBlog } from "../api/blogs";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "123" }),
    };
});

const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => [<div data-testid='notif-el' />, mockShowNotification],
}));

describe("UpdateBlog", () => {
    beforeEach(() => {
        cleanup();
        AuthData.mockReturnValue({ user: { isLoggedIn: true } });
    });

    it("renders form with fetched blog data", async () => {
        fetchBlogById.mockResolvedValueOnce({
            data: {
                id: "123",
                title: "Test Title",
                content: "Test Content",
                category: "EV",
                model: "Model S",
                brand: "Tesla",
                user_id: "user123",
                status: "draft",
                last_updated: "2025-08-13T12:00:00Z",
            },
        });

        render(
            <MemoryRouter>
                <UpdateBlog />
            </MemoryRouter>
        );

        expect(await screen.findByDisplayValue("Test Title")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Tesla")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Model S")).toBeInTheDocument();
    });

    it("submits and navigates on success", async () => {
        const blogData = {
            title: "Updated Title",
            content: "Updated Content",
            category: "EV",
            model: "Model X",
            brand: "Updated Tesla",
            user_id: "user123",
            status: "draft",
            last_updated: "2025-08-13T12:00:00Z",
        };

        fetchBlogById.mockResolvedValueOnce({ data: blogData });
        updateBlog.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <UpdateBlog />
            </MemoryRouter>
        );

        const publishBtn = await screen.findByRole("button", { name: /Save \& Publish/i });
        fireEvent.click(publishBtn);

        await waitFor(() => {
            expect(updateBlog).toHaveBeenCalledWith(
                "123",
                expect.objectContaining({
                    status: "published",
                })
            );
            expect(mockShowNotification).toHaveBeenCalledWith("Blog updated!", "success");
        });

        await waitFor(
            () => {
                expect(mockNavigate).toHaveBeenCalledWith("/admin-dash");
            },
            { timeout: 2500 }
        );
    });

    it("shows error notification on failure", async () => {
        fetchBlogById.mockResolvedValueOnce({
            data: {
                title: "Fail Title",
                content: "Fail Content",
                category: "EV",
                model: "Model X",
                brand: "Tesla",
                user_id: "user123",
                status: "draft",
                last_updated: "2025-08-13T12:00:00Z",
            },
        });
        updateBlog.mockRejectedValueOnce(new Error("Update failed"));

        render(
            <MemoryRouter>
                <UpdateBlog />
            </MemoryRouter>
        );

        const publishBtn = await screen.findByRole("button", { name: /Save \& Publish/i });
        fireEvent.click(publishBtn);

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith("Failed to update blog", "error");
        });
    });

    it("renders 'blog not found' message when API returns error", async () => {
        fetchBlogById.mockRejectedValueOnce(new Error("Not found"));

        render(
            <MemoryRouter>
                <UpdateBlog />
            </MemoryRouter>
        );

        expect(await screen.findByText(/Sorry, this blog doesn't exist/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Back to Blogs/i })).toBeInTheDocument();
    });
});
