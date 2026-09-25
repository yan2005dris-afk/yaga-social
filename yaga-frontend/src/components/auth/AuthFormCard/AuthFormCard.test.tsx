import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthFormCard } from "./AuthFormCard";

describe("AuthFormCard Component", () => {
  it("switches to Sign Up tab and renders extra fields", () => {
    render(<AuthFormCard onSignIn={vi.fn()} onSignUp={vi.fn()} />);

    const signUpTab = screen.getByTestId("tab-signup");
    fireEvent.click(signUpTab);

    expect(screen.getByTestId("input-fullname")).toBeInTheDocument();
    expect(screen.getByTestId("input-bio")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<AuthFormCard onSignIn={vi.fn()} onSignUp={vi.fn()} />);

    const passwordInput = screen.getByTestId(
      "input-password",
    ) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleBtn = screen.getByTestId("toggle-password-btn");
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("password");
  });

  it("triggers onSignIn when submitting sign in form", () => {
    const handleSignIn = vi.fn();
    render(<AuthFormCard onSignIn={handleSignIn} onSignUp={vi.fn()} />);

    const submitBtn = screen.getByTestId("auth-submit-btn");
    fireEvent.click(submitBtn);

    expect(handleSignIn).toHaveBeenCalledTimes(1);
  });
});
