import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Simulation from "../Simulation";

test("00 check simulation tab appears", () => {
  render(<Simulation />);

  // Assert that "Content for Simulation" appears
  expect(
    screen.getByText(
      "Content for Simulation. Replace with your Simulation view."
    )
  ).toBeInTheDocument();
});
