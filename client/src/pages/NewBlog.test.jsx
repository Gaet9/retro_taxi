import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { NewBlog } from "./NewBlog";
import { MemoryRouter, Navigate } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));

// Mock useNotification hook
const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => {
        return [<div key='notif' data-testid='notif'></div>, mockShowNotification];
    },
}));

vi.mock("../api/blogs", () => ({
    createBlog: vi.fn(),
}));
vi.mock("../api/users", () => ({
    fetchUsers: vi.fn(),
}));

import { fetchUsers } from "../api/users";
import { createBlog } from "../api/blogs";

describe("NewBlog component", () => {
    const fakeUsers = [
        { id: 1, name: "User 1", email: "one@test.com", createdat: "2024-12-12", password: "test1", role: "user", newsletter: true },
        { id: 2, name: "User 2", email: "two@test.com", createdat: "2023-11-11", password: "test2", role: "admin", newsletter: true },
    ];

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        fetchUsers.mockResolvedValue({ data: fakeUsers });
    });

    it("renders main elements", async () => {
        render(
            <MemoryRouter>
                <NewBlog />
            </MemoryRouter>
        );

        expect(screen.getByRole("button", { name: /save as draft/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /publish/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole("option", { name: /1 - User 1/i })).toBeInTheDocument();
            expect(screen.getByRole("option", { name: /2 - User 2/i })).toBeInTheDocument();
        });
    });

    it("updates inputs when typing", async () => {
        render(
            <MemoryRouter>
                <NewBlog />
            </MemoryRouter>
        );

        const titleInput = screen.getByLabelText(/Title/i);
        await userEvent.type(titleInput, "My new blog");
        expect(titleInput).toHaveValue("My new blog");

        const brandInput = screen.getByLabelText(/Brand/i);
        await userEvent.type(brandInput, "Tesla");
        expect(brandInput.value).toBe("Tesla");

        const contentInput = screen.getByPlaceholderText(/your content here/i);
        await userEvent.type(contentInput, "This is the blog content");
        expect(contentInput.value).toBe("This is the blog content");
    });

    it("submits form and shows success notification and navigates", async () => {
        createBlog.mockResolvedValueOnce({});

        render(
            <MemoryRouter>
                <NewBlog />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Title" } });
        fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Content" } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: "CategoryZ" } });
        fireEvent.change(screen.getByLabelText(/Model/i), { target: { value: "ModelY" } });
        fireEvent.change(screen.getByLabelText(/Brand/i), { target: { value: "BrandX" } });
        fireEvent.change(screen.getByLabelText(/user_ID/i), { target: { value: "1" } });

        fireEvent.click(screen.getByText(/publish/i));

        await waitFor(() => {
            expect(createBlog).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Test Title",
                    content: "Content",
                    category: "CategoryZ",
                    model: "ModelY",
                    brand: "BrandX",
                    status: "published",
                })
            );
            expect(mockShowNotification).toHaveBeenCalledWith("Blog published successfully", "success");
        });

        await waitFor(
            () => {
                expect(mockNavigate).toHaveBeenCalledWith("/admin-dash");
            },
            { timeout: 2500 }
        );
    });

    it("shows error notification on API failure", async () => {
        render(
            <MemoryRouter>
                <NewBlog />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Fail Blog" } });
        fireEvent.click(screen.getByText(/publish/i));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith("Error creating blog", "error");
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
