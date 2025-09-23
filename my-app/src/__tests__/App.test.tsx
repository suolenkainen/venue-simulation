import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

test("00 renders heading", () => {
  render(<App />);

  // Assert that "This is a test" appears
  expect(screen.getByText("This is a test")).toBeInTheDocument();
});
