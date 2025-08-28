import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Contact } from "../pages/Contact";
import { createContact } from "../api/contact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock createContact API
vi.mock("../api/contact", () => ({
    createContact: vi.fn(),
}));

// Mock AuthData context
vi.mock("../context/AuthProvider", () => ({
    AuthData: () => ({ user: { id: 1, name: "Test User" } }),
}));

// Mock react-router-dom useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockedNavigate,
    };
});

// Mock useNotification hook
const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => {
        return [<div key='notif' data-testid='notif'></div>, mockShowNotification];
    },
}));

beforeEach(() => {
    cleanup();
});

describe("Contact component", () => {
    it("renders input fields and button", () => {
        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        expect(screen.getByTestId("subjectContact-id")).toBeInTheDocument();
        expect(screen.getByTestId("nameContact-id")).toBeInTheDocument();
        expect(screen.getByTestId("emailContact-id")).toBeInTheDocument();
        expect(screen.getByTestId("messageContact-id")).toBeInTheDocument();
        expect(screen.getByTestId("submitContactBtn-id")).toBeInTheDocument();
    });

    it("allows user to type in form fields", () => {
        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId("subjectContact-id"), {
            target: { value: "Test" },
        });
        fireEvent.change(screen.getByTestId("nameContact-id"), {
            target: { value: "Gaétan" },
        });
        fireEvent.change(screen.getByTestId("emailContact-id"), {
            target: { value: "gaetan@example.com" },
        });
        fireEvent.change(screen.getByTestId("messageContact-id"), {
            target: { value: "Hello there!" },
        });

        expect(screen.getByTestId("subjectContact-id")).toHaveValue("Test");
        expect(screen.getByTestId("nameContact-id")).toHaveValue("Gaétan");
        expect(screen.getByTestId("emailContact-id")).toHaveValue("gaetan@example.com");
        expect(screen.getByTestId("messageContact-id")).toHaveValue("Hello there!");
    });

    it("submits the form and shows success notification, then navigates", async () => {
        createContact.mockResolvedValue({ subject: "Test" });

        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId("subjectContact-id"), {
            target: { value: "Test" },
        });
        fireEvent.change(screen.getByTestId("nameContact-id"), {
            target: { value: "Gaétan" },
        });
        fireEvent.change(screen.getByTestId("emailContact-id"), {
            target: { value: "gaetan@example.com" },
        });
        fireEvent.change(screen.getByTestId("messageContact-id"), {
            target: { value: "Hello there!" },
        });

        fireEvent.click(screen.getByTestId("submitContactBtn-id"));

        await waitFor(() => {
            expect(createContact).toHaveBeenCalledWith({
                subject: "Test",
                name: "Gaétan",
                email: "gaetan@example.com",
                message: "Hello there!",
            });
        });

        expect(mockShowNotification).toHaveBeenCalledWith("Contact form sent successfully!", "success");

        // Wait for navigation after timeout
        await waitFor(
            () => {
                expect(mockedNavigate).toHaveBeenCalledWith("/blogs");
            },
            { timeout: 2500 }
        );
    });

    it("shows error notification on API failure", async () => {
        createContact.mockRejectedValue(new Error("Failed to send"));

        render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId("subjectContact-id"), {
            target: { value: "Test" },
        });
        fireEvent.change(screen.getByTestId("nameContact-id"), {
            target: { value: "Gaétan" },
        });
        fireEvent.change(screen.getByTestId("emailContact-id"), {
            target: { value: "gaetan@example.com" },
        });
        fireEvent.change(screen.getByTestId("messageContact-id"), {
            target: { value: "Hello there!" },
        });

        fireEvent.click(screen.getByTestId("submitContactBtn-id"));

        await waitFor(() => {
            expect(createContact).toHaveBeenCalledWith({
                subject: "Test",
                name: "Gaétan",
                email: "gaetan@example.com",
                message: "Hello there!",
            });
        });

        expect(mockShowNotification).toHaveBeenCalledWith("Error sending the contact form", "error");
    });
});
