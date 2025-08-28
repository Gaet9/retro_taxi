import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Profile } from "./Profile";
import "@testing-library/jest-dom/vitest";

// Mock API calls
vi.mock("../api/users", () => ({
    fetchUserWithToken: vi.fn(),
    updateUser: vi.fn(),
    deleteUserApi: vi.fn(),
}));

// Mock AuthData hook
vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

// Mock Navigation & Header (avoid full render)
vi.mock("../components/Navigation", () => ({
    Navigation: () => <div data-testid='nav' />,
}));
vi.mock("../components/Header", () => ({
    Header: ({ children }) => <h1>{children}</h1>,
}));

// Mock Notification hook
const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => [<div key='notif' data-testid='notif' />, mockShowNotification],
}));

import { AuthData } from "../context/AuthProvider";
import { fetchUserWithToken, updateUser, deleteUserApi } from "../api/users";

describe("Profile component", () => {
    const mockLogout = vi.fn();
    const fakeUser = {
        id: "123",
        name: "John Doe",
        email: "john@test.com",
        createdat: "2025-01-01T00:00:00Z",
        password: "Password1!",
        role: "user",
        newsletter: true,
    };

    beforeEach(() => {
        cleanup();
        AuthData.mockReturnValue({ logout: mockLogout });
    });

    it("renders user data after fetch", async () => {
        fetchUserWithToken.mockResolvedValue({ data: fakeUser });

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(await screen.getByTestId("nav")).toBeInTheDocument();
        expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
        expect(await screen.getByDisplayValue("user")).toBeInTheDocument();
        expect(await screen.getByDisplayValue("john@test.com")).toBeInTheDocument();
    });

    it("shows 'user doesn't exist' message if fetch returns null", async () => {
        fetchUserWithToken.mockResolvedValue({ data: null });

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(await screen.findByText(/sorry this user doesn't exist/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /go back to login page/i })).toHaveAttribute("href", "/login");
    });

    it("fetch and update email and success notification", async () => {
        fetchUserWithToken.mockResolvedValue({ data: fakeUser });
        updateUser.mockResolvedValue({});

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const emailInput = await screen.findByDisplayValue("john@test.com");
        fireEvent.change(emailInput, { target: { value: "new@test.com" } });

        const saveBtn = screen.getByRole("button", { name: /save profile/i });
        fireEvent.click(saveBtn);

        await waitFor(() => {
            expect(updateUser).toHaveBeenCalledWith({
                name: "John Doe",
                email: "new@test.com",
                password: "Password1!",
            });
            expect(mockShowNotification).toHaveBeenCalledWith("Profile updated successfully", "success");
        });
    });

    it("has a form with empty fields", async () => {
        fetchUserWithToken.mockResolvedValue({ data: fakeUser });
        updateUser.mockResolvedValue({});

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const nameInput = await screen.findByDisplayValue("John Doe");
        const emailInput = await screen.findByDisplayValue("john@test.com");
        const pwdInput = await screen.findByDisplayValue("Password1!");
        fireEvent.change(nameInput, { target: { value: "" } });
        fireEvent.change(emailInput, { target: { value: "" } });
        fireEvent.change(pwdInput, { target: { value: "" } });

        const saveBtn = screen.getByRole("button", { name: /save profile/i });
        await waitFor(() => {
            expect(saveBtn).toBeDisabled();
        });
    });

    it("calls deleteUserApi and logout on delete confirm", async () => {
        fetchUserWithToken.mockResolvedValue({ data: fakeUser });
        deleteUserApi.mockResolvedValue({});

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const deleteBtn = await screen.findByRole("button", { name: /delete profile/i });
        fireEvent.click(deleteBtn);

        // Now the custom dialog should appear. Find and click the dialog's Delete button
        const dialogDeleteButton = await screen.findByRole("button", { name: /^Confirm$/i });
        fireEvent.click(dialogDeleteButton);

        await waitFor(() => {
            expect(deleteUserApi).toHaveBeenCalled();
            expect(mockShowNotification).toHaveBeenCalledWith("profile deleted successfully", "info");
            expect(mockLogout).toHaveBeenCalled();
        });
    });
});
