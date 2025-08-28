import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { About } from "./About";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Navigation } from "../components/Navigation";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

vi.mock("../components/Navigation", () => ({
    Navigation: () => <nav data-testid='mock-navigation' />,
}));

vi.mock("../components/Header", () => ({
    Header: ({ children, color }) => (
        <header data-testid='mock-header' className={color}>
            {children}
        </header>
    ),
}));

vi.mock("../components/Footer", () => ({
    Footer: () => <footer data-testid='mock-footer' />,
}));

describe("<About />", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <About />
            </MemoryRouter>
        );
    });

    it("renders the main page structure", () => {
        expect(screen.getByTestId("mock-navigation")).toBeInTheDocument();
        expect(screen.getByTestId("mock-header")).toBeInTheDocument();
        expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    });

    it("displays the correct page title", () => {
        expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("renders the autonomous vehicles introduction section", () => {
        expect(screen.getByText("What Are Autonomous Cars?")).toBeInTheDocument();
        expect(screen.getByText("The Future of Transportation")).toBeInTheDocument();
        expect(screen.getByText(/Autonomous vehicles, also known as self-driving cars/)).toBeInTheDocument();
    });

    it("displays technology tags", () => {
        expect(screen.getByText("AI & Machine Learning")).toBeInTheDocument();
        expect(screen.getByText("Computer Vision")).toBeInTheDocument();
        expect(screen.getByText("Sensor Fusion")).toBeInTheDocument();
        expect(screen.getByText("Safety Systems")).toBeInTheDocument();
    });

    it("shows key components information", () => {
        expect(screen.getByText("Key Components")).toBeInTheDocument();
        expect(screen.getByText(/High-definition cameras for visual recognition/)).toBeInTheDocument();
        expect(screen.getByText(/LiDAR sensors for 3D mapping/)).toBeInTheDocument();
        expect(screen.getByText(/AI processors for decision making/)).toBeInTheDocument();
        expect(screen.getByText(/Redundant safety systems/)).toBeInTheDocument();
    });

    it("renders the educational videos section", () => {
        expect(screen.getByText("Learn More About Autonomous Vehicles")).toBeInTheDocument();
        expect(screen.getByText("How Self-Driving Cars Work")).toBeInTheDocument();
        expect(screen.getByText("Quick tour with Baidu in Wuhan (China)")).toBeInTheDocument();
        expect(screen.getByText("First drive with Waymo in Los Angeles (USA)")).toBeInTheDocument();
        expect(screen.getByText("First drive with Tesla's robot taxi in Austin (USA)")).toBeInTheDocument();
    });

    it("displays video links with correct URLs", () => {
        const videoLinks = screen.getAllByRole("link");
        expect(videoLinks).toHaveLength(4); // 4 video links

        // Check specific video URLs
        expect(videoLinks[0]).toHaveAttribute("href", "https://youtu.be/piNab6aZYis");
        expect(videoLinks[1]).toHaveAttribute("href", "https://youtu.be/FwABzdr5elM");
        expect(videoLinks[2]).toHaveAttribute("href", "https://youtu.be/JHgr9SgeicM");
        expect(videoLinks[3]).toHaveAttribute("href", "https://youtu.be/_s-h0YXtF0c");
    });

    it("renders the timeline section", () => {
        expect(screen.getByText("Timeline of Autonomous Vehicle Development")).toBeInTheDocument();
        expect(screen.getByText("1920s - Early Concepts")).toBeInTheDocument();
        expect(screen.getByText("1980s - DARPA Challenges")).toBeInTheDocument();
        expect(screen.getByText("2004-2007 - DARPA Grand Challenge")).toBeInTheDocument();
        expect(screen.getByText("2009-2016 - Google's Waymo")).toBeInTheDocument();
        expect(screen.getByText("2015-2020 - Industry Expansion")).toBeInTheDocument();
        expect(screen.getByText("2020-Present - Commercial Deployment")).toBeInTheDocument();
    });

    it("displays the autonomy levels section", () => {
        expect(screen.getByText("Levels of Vehicle Autonomy")).toBeInTheDocument();
        expect(screen.getByText("Manual Control")).toBeInTheDocument();
        expect(screen.getByText("Full Autonomy")).toBeInTheDocument();

        // Check level cards
        expect(screen.getByText("Level 0")).toBeInTheDocument();
        expect(screen.getByText("Level 1")).toBeInTheDocument();
        expect(screen.getByText("Level 2")).toBeInTheDocument();
        expect(screen.getByText("Level 3")).toBeInTheDocument();
        expect(screen.getByText("Level 4")).toBeInTheDocument();
        expect(screen.getByText("Level 5")).toBeInTheDocument();
    });

    it("shows autonomy level descriptions", () => {
        expect(screen.getByText("No Automation")).toBeInTheDocument();
        expect(screen.getByText("Driver Assistance")).toBeInTheDocument();
        expect(screen.getByText("Partial Automation")).toBeInTheDocument();
        expect(screen.getByText("Conditional Automation")).toBeInTheDocument();
        expect(screen.getByText("High Automation")).toBeInTheDocument();
        expect(screen.getByText("Full Automation")).toBeInTheDocument();
    });

    it("renders the Waymo safety statistics section", () => {
        expect(screen.getByText("Waymo Safety Performance")).toBeInTheDocument();
        expect(screen.getByText("88%")).toBeInTheDocument();
        expect(screen.getByText("79%")).toBeInTheDocument();
        expect(screen.getByText("78%")).toBeInTheDocument();
        expect(screen.getByText("93%")).toBeInTheDocument();
        expect(screen.getByText("81%")).toBeInTheDocument();
        expect(screen.getByText("86%")).toBeInTheDocument();
    });

    it("displays safety statistics descriptions", () => {
        expect(screen.getByText("Fewer serious injury or worse crashes")).toBeInTheDocument();
        expect(screen.getByText("Fewer airbag deployment crashes")).toBeInTheDocument();
        expect(screen.getByText("Fewer injury-causing crashes")).toBeInTheDocument();
        expect(screen.getByText("Fewer pedestrian crashes with injuries")).toBeInTheDocument();
        expect(screen.getByText("Fewer cyclist crashes with injuries")).toBeInTheDocument();
        expect(screen.getByText("Fewer motorcycle crashes with injuries")).toBeInTheDocument();
    });

    it("shows current state and future outlook section", () => {
        expect(screen.getByText("Current State & Future Outlook")).toBeInTheDocument();
        expect(screen.getByText("Current Technology")).toBeInTheDocument();
        expect(screen.getByText("Regulatory Progress")).toBeInTheDocument();
        expect(screen.getByText("Future Vision")).toBeInTheDocument();
    });

    it("displays future outlook descriptions", () => {
        expect(screen.getByText(/Level 4 autonomy achieved in controlled environments/)).toBeInTheDocument();
        expect(screen.getByText(/Governments worldwide are developing frameworks/)).toBeInTheDocument();
        expect(screen.getByText(/By 2030, autonomous vehicles could transform urban mobility/)).toBeInTheDocument();
    });

    it("renders with correct styling classes", () => {
        const mainContainer = screen.getByText("What Are Autonomous Cars?").closest("section");
        expect(mainContainer).toHaveClass("mb-16");

        const glassmorphismCard = screen.getByText("The Future of Transportation").closest("div");
        expect(glassmorphismCard).toHaveClass("bg-white/60", "backdrop-blur-sm", "rounded-3xl");
    });

    it("includes proper accessibility elements", () => {
        // Check for proper heading hierarchy
        const h1Elements = screen.getAllByRole("heading", { level: 1 });
        expect(h1Elements.length).toBeGreaterThan(0);

        const h2Elements = screen.getAllByRole("heading", { level: 2 });
        expect(h2Elements.length).toBeGreaterThan(0);

        const h3Elements = screen.getAllByRole("heading", { level: 3 });
        expect(h3Elements.length).toBeGreaterThan(0);
    });

    it("displays progress bars for autonomy levels", () => {
        const progressBars = document.querySelectorAll(".bg-gradient-to-r");
        expect(progressBars.length).toBeGreaterThan(0);
    });

    it("shows timeline with visual elements", () => {
        const timelineLine = document.querySelector(".bg-gradient-to-b");
        expect(timelineLine).toBeInTheDocument();

        const timelineMarkers = document.querySelectorAll(".bg-purple-600, .bg-blue-600");
        expect(timelineMarkers.length).toBeGreaterThan(0);
    });
});
