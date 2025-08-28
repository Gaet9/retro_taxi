import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignUp } from "./SignUp";
import "@testing-library/jest-dom/vitest";

// Mock the external modules
vi.mock("validator");
vi.mock("../api/auth");
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => {
        return [<div key='notif' data-testid='notif'></div>, mockShowNotification];
    },
}));

vi.mock("../context/AuthProvider", () => ({
    AuthData: vi.fn(),
}));

import validator from "validator";
import { register } from "../api/auth";
import { MemoryRouter } from "react-router-dom";
import { AuthData } from "../context/AuthProvider";

describe("SignUp Component", () => {
    beforeEach(() => {
        cleanup();
        AuthData.mockReturnValue({ user: { isLoggedIn: false } });
    });

    it("renders the SignUp form", () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Sign up")).toBeInTheDocument();
    });

    it("validates email format", () => {
        validator.isEmail.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        const emailInput = screen.getByPlaceholderText("Email");
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });

    it("validates password strength", () => {
        validator.isStrongPassword.mockReturnValue(false);
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        const passwordInput = screen.getByPlaceholderText("Password");
        fireEvent.change(passwordInput, { target: { value: "weak" } });
        expect(screen.getByText("Password must be at least 8 characters long, 1 uppercase, 1 symbol, 1 number")).toBeInTheDocument();
    });

    it("enables the submit button when the form is valid", () => {
        validator.isEmail.mockReturnValue(true);
        validator.isStrongPassword.mockReturnValue(true);
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "StrongPass1!" } });
        const submitButton = screen.getByText("Sign up");
        expect(submitButton).not.toBeDisabled();
    });

    it("disables the submit button when the form is invalid", () => {
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        const submitButton = screen.getByText("Sign up");
        expect(submitButton).toBeDisabled();
    });

    it("disables the submit button when the two password ARE NOT identicals", () => {
        validator.isEmail.mockReturnValue(true);
        validator.isStrongPassword.mockReturnValue(true);
        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );
        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "Different1!" } });
        const submitButton = screen.getByText("Sign up");
        expect(submitButton).toBeDisabled();
    });

    it("submits the form and navigates on success", async () => {
        register.mockResolvedValue({});

        validator.isEmail.mockReturnValue(true);
        validator.isStrongPassword.mockReturnValue(true);

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
        const submitButton = screen.getByText("Sign up");

        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "StrongPass1!" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: "John Doe",
                email: "john@example.com",
                password: "StrongPass1!",
            });
            expect(mockShowNotification).toHaveBeenCalledWith("You create an account succesfully", "success");
        });
    });

    it("shows an error notification on submission failure", async () => {
        register.mockRejectedValue(new Error("Something went wrong"));

        validator.isEmail.mockReturnValue(true);
        validator.isStrongPassword.mockReturnValue(true);

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
        const submitButton = screen.getByText("Sign up");

        fireEvent.change(nameInput, { target: { value: "John Doe" } });
        fireEvent.change(emailInput, { target: { value: "john@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "StrongPass1!" } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith("Something went wrong", "error");
        });
    });
});
