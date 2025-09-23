import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Finance from "../Finance";

vi.useFakeTimers();

test("check finance tab appears", () => {
  render(<Finance />);

  // Assert that "Content for Finance" appears
  expect(
    screen.getByText("Content for Finance. Replace with your Financial view.")
  ).toBeInTheDocument();
});
