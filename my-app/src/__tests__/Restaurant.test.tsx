import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Restaurant from "../Restaurant";

test("00 check restaurant tab appears", () => {
  render(<Restaurant />);

  // Assert that "basic information appears" appears
  expect(screen.getByText("Restaurant")).toBeInTheDocument();
  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("Location")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edit" })).toBeVisible();
  //
});

test("01 edit, save, and display name & address", async () => {
  const user = userEvent.setup();

  const { container } = render(<Restaurant />);

  // query DOM directly
  const heading = container.querySelector("h2");
  expect(heading?.textContent).toBe("Restaurant");

  // click Edit button
  const editButton = container.querySelector("#edit-button");
  expect(editButton).not.toBeNull();
  if (editButton) await user.click(editButton);

  // type into inputs
  const inputs = container.querySelectorAll("input");
  expect(inputs.length).toBe(2);

  const nameInput = inputs[0] as HTMLInputElement;
  const addressInput = inputs[1] as HTMLInputElement;

  await user.clear(nameInput);
  await user.type(nameInput, "Café Example");

  await user.clear(addressInput);
  await user.type(addressInput, "123 Main St, Helsinki");

  // click Save button (second button in edit mode)
  const saveButton = container.querySelector("#save-button");
  if (saveButton) await user.click(saveButton);

  // verify text content updated
  expect(container.innerHTML).toContain("Café Example");
  expect(container.innerHTML).toContain("123 Main St, Helsinki");

  // no input fields anymore
  expect(container.querySelector("input")).toBeNull();
});

test("02 cancel changes", async () => {
  const user = userEvent.setup();

  const { container } = render(<Restaurant />);

  // click Edit button
  const editButton = container.querySelector("#edit-button");
  expect(editButton).not.toBeNull();
  if (editButton) await user.click(editButton);

  // type into inputs
  const inputs = container.querySelectorAll("input");
  expect(inputs.length).toBe(2);

  const nameInput = inputs[0] as HTMLInputElement;
  const addressInput = inputs[1] as HTMLInputElement;

  await user.clear(nameInput);
  await user.type(nameInput, "Café Example 2");

  await user.clear(addressInput);
  await user.type(addressInput, "124 Main St, Helsinki");

  // click Save button (second button in edit mode)
  const saveButton = container.querySelector("#cancel-button");
  if (saveButton) await user.click(saveButton);

  // no input fields anymore
  expect(container.querySelector("input")).toBeNull();
});
