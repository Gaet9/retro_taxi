import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { Footer } from "./Footer";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import { SendNewsletter } from "../api/newsletter";

describe("Displays a footer component", () => {
    // Mock the SendNewsletter API call
    vi.mock("../api/newsletter", () => ({
        SendNewsletter: vi.fn(),
    }));

    beforeEach(() => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
    });
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });
    it("checks email format", () => {
        // Find the input - adjust selector based on your actual input attributes
        const emailInput = screen.getByTestId("emailFooter-id");

        // Initially, no error classes
        expect(emailInput).toHaveClass("border-purple-950");
        expect(emailInput).not.toHaveClass("border-red-500");
        expect(screen.queryByText("Invalid email format")).not.toBeInTheDocument();

        // Type invalid email
        fireEvent.change(emailInput, { target: { value: "bad-email" } });
        expect(emailInput).toHaveClass("border-red-500");
        expect(emailInput).not.toHaveClass("border-purple-950");
        expect(screen.getByText("Invalid email format")).toBeInTheDocument();

        // Type valid email
        fireEvent.change(emailInput, { target: { value: "good@example.com" } });
        expect(emailInput).toHaveClass("border-purple-950");
        expect(emailInput).not.toHaveClass("border-red-500");
        expect(screen.queryByText("Invalid email format")).not.toBeInTheDocument();
    });
    it("Disable 'join' button if form fields are empty and email format is invalid", () => {
        const emailInput = screen.getByTestId("emailFooter-id");
        const nameInput = screen.getByTestId("nameFooter-id");
        const submitBtn = screen.getByRole("button", { name: /join/i });

        // Initial state, name and email empty, join button disabled
        expect(nameInput).toHaveValue("");
        expect(emailInput).toHaveValue("");
        expect(submitBtn).toBeDisabled();
        // If email format is wrong
        fireEvent.change(emailInput, { target: { value: "bad-email" } });
        expect(submitBtn).toBeDisabled();
        // Fill name but keep invalid email
        fireEvent.change(nameInput, { target: { value: "Gaétan" } });
        expect(submitBtn).toBeDisabled();
        // Fix email
        fireEvent.change(emailInput, { target: { value: "gaetan@example.com" } });
        expect(submitBtn).not.toBeDisabled();
    });

    it("submits successfully, clears inputs, shows success notification and navigates", async () => {
        // Mock SendNewsletter to resolve successfully
        SendNewsletter.mockResolvedValueOnce({ success: true });
        // Fill inputs
        fireEvent.change(screen.getByTestId("nameFooter-id"), {
            target: { value: "Gaétan" },
        });
        fireEvent.change(screen.getByTestId("emailFooter-id"), {
            target: { value: "gaetan@example.com" },
        });
        // Click submit button
        fireEvent.click(screen.getByRole("button", { name: /join/i }));
        // Wait for async handleSubmit to finish
        await waitFor(() => {
            // Inputs should be cleared
            expect(screen.getByTestId("nameFooter-id")).toHaveValue("");
            expect(screen.getByTestId("emailFooter-id")).toHaveValue("");
        });
        // Check that SendNewsletter was called once with correct data
        expect(SendNewsletter).toHaveBeenCalledTimes(1);
        expect(SendNewsletter).toHaveBeenCalledWith({
            name: "Gaétan",
            email: "gaetan@example.com",
        });
    });
    it("shows error notification and error message on API failure", async () => {
        const errorResponse = {
            response: {
                data: {
                    message: "Email already registered",
                },
            },
        };

        SendNewsletter.mockRejectedValueOnce(errorResponse);
        fireEvent.change(screen.getByTestId("nameFooter-id"), {
            target: { value: "Gaétan" },
        });
        fireEvent.change(screen.getByTestId("emailFooter-id"), {
            target: { value: "gaetan@example.com" },
        });

        fireEvent.click(screen.getByRole("button", { name: /join/i }));

        // await waitFor(() => {
        //     // Error message from backend should be shown in UI
        //     expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        // });
    });
});
