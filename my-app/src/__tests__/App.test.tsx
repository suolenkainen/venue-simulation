import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

vi.useFakeTimers();

test("renders heading and counts up", () => {
  render(<App />);

  // Assert that "This is a test" appears
  expect(screen.getByText("This is a test")).toBeInTheDocument();
  expect(screen.getByText("Elapsed: 00:00")).toBeInTheDocument();
});
