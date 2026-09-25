import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("SidebarNav Component", () => {
  it("renders all navigation links", () => {
    renderWithRouter(<SidebarNav />);

    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Messages")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
  });

  it("renders message and alert badge counts", () => {
    renderWithRouter(
      <SidebarNav unreadMessagesCount={4} unreadAlertsCount={12} />,
    );

    expect(screen.getByTestId("nav-badge-messages")).toHaveTextContent("4");
    expect(screen.getByTestId("nav-badge-alerts")).toHaveTextContent("9+");
  });

  it("renders New Post button and fires callback on click", () => {
    const handleNewPost = vi.fn();
    renderWithRouter(<SidebarNav onNewPostClick={handleNewPost} />);

    const button = screen.getByRole("button", { name: /new post/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleNewPost).toHaveBeenCalledTimes(1);
  });

  it("renders connected relays status and latency", () => {
    renderWithRouter(<SidebarNav connectedRelaysCount={5} pingMs={38} />);

    expect(screen.getByText("5 relays connected")).toBeInTheDocument();
    expect(screen.getByText("38ms")).toBeInTheDocument();
  });
});
