import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import RestaurantVariables from "../RestaurantVariables";

test("00 check RestaurantVariables tab appears", () => {
  render(<RestaurantVariables />);

  // Assert that "basic information appears" appears
  expect(screen.getByText("Restaurant Variables")).toBeInTheDocument();
  //
});
