import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Finance from "../Finance";

test("00 check finance tab appears", () => {
  render(<Finance />);

  // Assert that "Content for Finance" appears
  expect(
    screen.getByText("Content for Finance. Replace with your Financial view.")
  ).toBeInTheDocument();
});
