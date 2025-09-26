import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
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

test("01 simulation ticks and updates UI (smoke)", async () => {
  vi.useFakeTimers();

  const { container } = render(<Simulation />);

  // initial UI
  expect(screen.getByText(/Elapsed:/)).toBeInTheDocument();
  expect(screen.getByText(/Seed \(8 digits\)/i)).toBeInTheDocument();

  // advance 1 second -> generation should run
  vi.advanceTimersByTime(1000);
  // allow state updates to flush
  await vi.waitFor(() => {
    // displayed number should be present
    expect(screen.getByText(/Displayed number/)).toBeInTheDocument();
    // chart path exists
    expect(container.querySelector("svg path")).toBeTruthy();
  });

  // advance a few more seconds and assert history (chart path still present)
  vi.advanceTimersByTime(3000);
  await vi.waitFor(() => {
    expect(container.querySelector("svg path")).toBeTruthy();
  });

  vi.useRealTimers();
});
