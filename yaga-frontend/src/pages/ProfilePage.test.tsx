import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ProfilePage } from "./ProfilePage";
import { AuthProvider } from "../context/AuthContext";

const renderProfilePage = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    </AuthProvider>,
  );
};

describe("ProfilePage Component", () => {
  it("renders profile header, RustFS cover notice and post grid items", () => {
    renderProfilePage();

    expect(screen.getByText("Back to feed")).toBeInTheDocument();
    expect(screen.getAllByText("Maya Krishnan").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Cover stored on RustFS")).toBeInTheDocument();
    expect(screen.getByTestId("profile-posts-grid")).toBeInTheDocument();
    expect(
      screen.getByText("Night deploys hit different..."),
    ).toBeInTheDocument();
  });
});
