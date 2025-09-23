import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Restaurant from "../Restaurant";

vi.useFakeTimers();

test("check restaurant tab appears", () => {
  render(<Restaurant />);

  // Assert that "Content for Restaurant" appears
  expect(
    screen.getByText("Content for Restaurant. Replace with your Bar view.")
  ).toBeInTheDocument();
});
