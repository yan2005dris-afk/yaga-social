import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders AuthPage by default when unauthenticated", () => {
    render(<App />);
    expect(screen.getByText(/Welcome to Relaymesh/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /sign in/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("tab", { name: /^sign up$/i })).toBeInTheDocument();
  });
});
