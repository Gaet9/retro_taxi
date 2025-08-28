import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { AdminDashboard } from "./AdminDashboard";
import "@testing-library/jest-dom/vitest";

vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));
// Mock APIs
vi.mock("../api/blogs", () => ({
    fetchBlogs: vi.fn(),
    deleteBlogApi: vi.fn(),
}));

vi.mock("../api/users", () => ({
    fetchUsers: vi.fn(),
    deleteUserApi: vi.fn(),
}));

// Mocks to import after mocks declaration
import { fetchBlogs, deleteBlogApi } from "../api/blogs";
import { fetchUsers } from "../api/users";
// import { deleteUserApi } from "../api/users";
import { MemoryRouter } from "react-router-dom";

describe("AdminDashboard", () => {
    const fakeBlogs = [
        {
            id: 1,
            title: "Title 1",
            content: "Content 1",
            category: "Category 1",
            model: "Model 1",
            brand: "Brand 1",
            image_url: "image 1",
            created_at: "2025-01-01",
            user_id: 1,
            status: "draft",
            last_updated: "2025-02-01",
            summary: "Summary 1",
        },
        {
            id: 2,
            title: "Title 2",
            content: "Content 2",
            category: "Category 2",
            model: "Model 2",
            brand: "Brand 2",
            image_url: "image 2",
            created_at: "2025-01-02",
            user_id: 2,
            status: "published",
            last_updated: "2025-02-02",
            summary: "Summary 2",
        },
    ];
    const fakeUsers = [
        { id: 1, name: "User 1", email: "one@test.com", createdat: "2024-12-12", password: "pwd1", role: "user", newsletter: true },
        { id: 2, name: "User 2", email: "two@test.com", createdat: "2023-11-11", password: "pwd2", role: "admin", newsletter: true },
    ];

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        fetchBlogs.mockResolvedValue({ data: fakeBlogs });
        fetchUsers.mockResolvedValue({ data: fakeUsers });
    });

    it("renders blogs and users from API", async () => {
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );

        // Wait for blogs and users to be rendered
        expect(await screen.findByText("Brand 1")).toBeInTheDocument();
        expect(await screen.findByText("Brand 2")).toBeInTheDocument();
        expect(await screen.findByText("User 1")).toBeInTheDocument();
        expect(await screen.findByText("User 2")).toBeInTheDocument();
    });

    it("deletes a blog when confirmed", async () => {
        deleteBlogApi.mockResolvedValue({});

        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );

        // Wait for initial data load
        await screen.findByText("Brand 1");

        const blogDeleteButton = screen.getByLabelText("delete-blog-1");
        fireEvent.click(blogDeleteButton);

        // Now the custom dialog should appear. Find and click the dialog's Delete button
        const dialogDeleteButton = await screen.findByRole("button", { name: /^Confirm$/i });
        fireEvent.click(dialogDeleteButton);

        await waitFor(() => {
            expect(deleteBlogApi).toHaveBeenCalledWith(1);
        });

        // The blog should be removed from the UI
        expect(screen.queryByText("Brand 1")).not.toBeInTheDocument();
    });

    it("does not delete a blog when canceled", async () => {
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );
        expect(await screen.findByText("Brand 1")).toBeInTheDocument();

        const blogDeleteButton = screen.getByLabelText("delete-blog-1");
        fireEvent.click(blogDeleteButton);

        // Find and click the dialog's Cancel button
        const dialogCancelButton = await screen.findByRole("button", { name: /^Cancel$/i });
        fireEvent.click(dialogCancelButton);

        await waitFor(() => {
            expect(deleteBlogApi).not.toHaveBeenCalled();
        });
    });

    // Deleting user is not possible from admin dashboard at the moment, maybe later
    // it("deletes a user when confirmed", async () => {
    //     deleteUserApi.mockResolvedValue({});

    //     render(
    //         <MemoryRouter>
    //             <AdminDashboard />
    //         </MemoryRouter>
    //     );
    //     await screen.findByText("User 1");

    //     const userDeleteButton = screen.getByLabelText("delete-user-1");
    //     fireEvent.click(userDeleteButton);

    //     // Now the custom dialog should appear. Find and click the dialog's Delete button
    //     const dialogDeleteButton = await screen.findByRole("button", { name: /^Confirm$/i });
    //     fireEvent.click(dialogDeleteButton);

    //     await waitFor(() => {
    //         expect(deleteUserApi).toHaveBeenCalledWith(1);
    //     });

    //     expect(screen.queryByText("User 1")).not.toBeInTheDocument();
    // });

    // it("does not delete a user when canceled", async () => {
    //     render(
    //         <MemoryRouter>
    //             <AdminDashboard />
    //         </MemoryRouter>
    //     );
    //     expect(await screen.findByText("User 1")).toBeInTheDocument();

    //     const userDeleteButton = screen.getByLabelText("delete-user-1");
    //     fireEvent.click(userDeleteButton);

    //     // Find and click the dialog's Cancel button
    //     const dialogCancelButton = await screen.findByRole("button", { name: /^Cancel$/i });
    //     fireEvent.click(dialogCancelButton);

    //     await waitFor(() => {
    //         expect(deleteUserApi).not.toHaveBeenCalled();
    //     });
    // });
    it("Opens the update page of the corresponding blog when clicking the modify button", async () => {
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );

        // Wait for blogs to render
        const modifyLinks = await screen.findAllByText("Modify");

        // Example: check the first blog's Modify link href
        expect(modifyLinks[0].closest("a")).toHaveAttribute("href", "/update-blog/1");

        // You can also test the second one similarly
        expect(modifyLinks[1].closest("a")).toHaveAttribute("href", "/update-blog/2");
    });
    it("Opens the create-blog page when clicking create blog button", async () => {
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );

        // Wait for blogs to render
        const createLink = screen.getByRole("link", { name: /create a new article/i });
        expect(createLink).toHaveAttribute("href", "/new-blog");
    });
});
