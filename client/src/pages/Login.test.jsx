import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

// Mocks
// Mock components
vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));

vi.mock("../api/auth", () => ({
    loginApi: vi.fn(),
}));
vi.mock("../api/users", () => ({
    fetchUserWithToken: vi.fn(),
}));
vi.mock("../context/AuthProvider", () => ({
    AuthData: () => ({ login: vi.fn() }),
}));

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockLogin = vi.fn();
const mockShowNotification = vi.fn();

vi.mock("../components/Notification", () => ({
    useNotification: () => {
        return [<div key='notif' data-testid='notif'></div>, mockShowNotification];
    },
}));

vi.mock("../context/AuthProvider", () => ({
    AuthData: () => ({ login: mockLogin }), // use the shared instance
}));

import { loginApi } from "../api/auth";
import { fetchUserWithToken } from "../api/users";

describe("Login Component", () => {
    beforeEach(() => {
        cleanup();
    });

    const setup = () =>
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

    it("renders form elements", () => {
        setup();
        expect(screen.getByTestId("email-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeDisabled();
    });

    it("enables submit button when form is valid", () => {
        setup();
        const form = screen.getByTestId("login-form");
        const utils = within(form);

        fireEvent.change(utils.getByTestId("email-input"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(utils.getByTestId("password-input"), {
            target: { value: "secret" },
        });

        expect(utils.getByRole("button", { name: /login/i })).toBeEnabled();
    });

    it("handles successful login", async () => {
        loginApi.mockResolvedValueOnce({});
        fetchUserWithToken.mockResolvedValueOnce({ data: { id: 1, name: "John" } });

        setup();
        const form = screen.getByTestId("login-form");
        await userEvent.type(within(form).getByTestId("email-input"), "test@example.com");
        await userEvent.type(within(form).getByTestId("password-input"), "secret");

        await userEvent.click(screen.getByRole("button", { name: /Login/i }));

        await waitFor(() => {
            expect(loginApi).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "secret",
            });
            expect(fetchUserWithToken).toHaveBeenCalled();
            expect(mockLogin).toHaveBeenCalledWith({ id: 1, name: "John" });
            expect(mockShowNotification).toHaveBeenCalledWith("Login successful", "success");
            console.log("mocknavigate calls", mockNavigate.mock.calls);
        });
        await waitFor(
            () => {
                expect(mockNavigate).toHaveBeenCalledWith("/blogs");
            },
            { timeout: 2500 }
        );
    });

    it("handles failed login", async () => {
        loginApi.mockRejectedValueOnce(new Error("Invalid credentials"));

        setup();
        fireEvent.change(screen.getByTestId("email-input"), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), {
            target: { value: "wrong" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Login/i }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith("login failed, check your credentials", "error");
        });
    });
});
