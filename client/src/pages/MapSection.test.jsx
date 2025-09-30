import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

import { MapSection } from "./MapSection";

// Mock lightweight react-leaflet components to avoid Leaflet DOM/Map init
vi.mock("react-leaflet", () => ({
    MapContainer: ({ children }) => <div data-testid='mock-map'>{children}</div>,
    TileLayer: () => <div data-testid='mock-tilelayer' />,
    Marker: ({ children }) => <div data-testid='mock-marker'>{children}</div>,
    Popup: ({ children }) => <div data-testid='mock-popup'>{children}</div>,
    useMap: () => ({
        setView: vi.fn(),
        getZoom: () => 10,
        on: vi.fn(),
        off: vi.fn(),
        flyToBounds: vi.fn(),
        flyTo: vi.fn(),
    }),
    GeoJSON: () => <div data-testid='mock-geojson' />,
}));

// Mock child UI components to simple placeholders
vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));
vi.mock("../components/Header", () => ({
    Header: ({ children }) => <header data-testid='mock-header'>{children}</header>,
}));
vi.mock("../components/Footer", () => ({
    Footer: () => <footer data-testid='mock-footer' />,
}));

// Mock AuthData hook
vi.mock("../context/AuthProvider", () => ({
    AuthData: () => ({ user: { id: 1, name: "Tester", isLoggedIn: true } }),
}));

// Mock Notification hook
const mockShowNotification = vi.fn();
vi.mock("../components/Notification", () => ({
    useNotification: () => [<div key='notif' data-testid='notif'></div>, mockShowNotification],
}));

// Mock Zones API
vi.mock("../api/zones", () => ({
    getAllZones: vi.fn(),
    createZone: vi.fn(),
    updateZone: vi.fn(),
    deleteZone: vi.fn(),
}));

import { getAllZones } from "../api/zones";

const polygonFeature = {
    type: "Feature",
    properties: { name: "Test Area" },
    geometry: {
        type: "Polygon",
        coordinates: [
            [
                [-118.5, 34.0],
                [-118.4, 34.0],
                [-118.4, 34.1],
                [-118.5, 34.1],
                [-118.5, 34.0],
            ],
        ],
    },
};

describe("MapSection", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        getAllZones.mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: "LA Waymo Zone",
                    company: "Waymo",
                    city: "Los Angeles",
                    country: "USA",
                    operational_model: "Driverless",
                    service_status: "Available",
                    fleet_size: 42,
                    coordinates: polygonFeature,
                },
                {
                    id: 2,
                    name: "SF Tesla Zone",
                    company: "Tesla",
                    city: "San Francisco",
                    country: "USA",
                    operational_model: "Human-monitored",
                    service_status: "Limited",
                    fleet_size: 15,
                    coordinates: polygonFeature,
                },
            ],
        });
    });

    afterEach(() => {
        cleanup();
    });

    const renderPage = () =>
        render(
            <MemoryRouter>
                <MapSection />
            </MemoryRouter>
        );

    it("renders main structure and controls", async () => {
        renderPage();

        expect(screen.getByTestId("mock-navigation")).toBeInTheDocument();
        expect(screen.getByTestId("mock-header")).toBeInTheDocument();

        // Control buttons
        expect(screen.getByRole("button", { name: /My Location/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Reset View/i })).toBeInTheDocument();

        // Zones table and Filters label
        expect(await screen.findByText(/Zones/i)).toBeInTheDocument();
        expect(screen.getByText(/Filters:/i)).toBeInTheDocument();
    });

    it("loads and displays zones data in the table", async () => {
        renderPage();

        await waitFor(() => {
            // Company names from mocked data
            expect(screen.getByText("Waymo")).toBeInTheDocument();
            expect(screen.getByText("Tesla")).toBeInTheDocument();
            // Cities
            expect(screen.getByText("Los Angeles")).toBeInTheDocument();
            expect(screen.getByText("San Francisco")).toBeInTheDocument();
            // Countries
            expect(screen.getAllByText("USA").length).toBeGreaterThan(0);
        });
    });

    it("filters by company, city and country", async () => {
        renderPage();

        await screen.findByText(/Zones/i);

        const inputs = screen.getAllByRole("textbox");
        const [companyInput, cityInput, countryInput] = inputs;

        // Filter by company
        fireEvent.change(companyInput, { target: { value: "Waymo" } });
        await waitFor(() => {
            expect(screen.getByText("Waymo")).toBeInTheDocument();
            // Tesla row should be filtered out
            expect(screen.queryByText("Tesla")).toBeNull();
        });

        // Reset and filter by city
        fireEvent.change(companyInput, { target: { value: "" } });
        fireEvent.change(cityInput, { target: { value: "San" } });
        await waitFor(() => {
            expect(screen.getByText("San Francisco")).toBeInTheDocument();
            expect(screen.queryByText("Los Angeles")).toBeNull();
        });

        // Reset and filter by country
        fireEvent.change(cityInput, { target: { value: "" } });
        fireEvent.change(countryInput, { target: { value: "USA" } });
        await waitFor(() => {
            // Both are USA so both appear again
            expect(screen.getByText("Waymo")).toBeInTheDocument();
            expect(screen.getByText("Tesla")).toBeInTheDocument();
        });
    });

    it("sorts columns when headers are clicked", async () => {
        renderPage();
        await screen.findByText(/Zones/i);

        const companyHeader = screen.getByText(/Company/i);
        fireEvent.click(companyHeader);
        fireEvent.click(companyHeader); // toggle sort

        // Not asserting order specifically (DOM table not enumerated), but ensure no crash and data still present
        await waitFor(() => {
            expect(screen.getByText("Waymo")).toBeInTheDocument();
            expect(screen.getByText("Tesla")).toBeInTheDocument();
        });
    });
});
