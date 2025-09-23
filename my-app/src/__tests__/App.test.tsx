import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

vi.useFakeTimers();

test("renders heading", () => {
  render(<App />);

  // Assert that "This is a test" appears
  expect(screen.getByText("This is a test")).toBeInTheDocument();
});
