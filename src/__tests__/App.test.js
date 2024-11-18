import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../components/App";
import { server } from "../mocks/server";

// Start the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("creates a new question", async () => {
  render(<App />);

  // Navigate to the form page
  fireEvent.click(screen.getByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText("Prompt:"), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText("Answer 1:"), {
    target: { value: "Answer A" },
  });
  fireEvent.change(screen.getByLabelText("Answer 2:"), {
    target: { value: "Answer B" },
  });
  fireEvent.change(screen.getByLabelText("Answer 3:"), {
    target: { value: "Answer C" },
  });
  fireEvent.change(screen.getByLabelText("Answer 4:"), {
    target: { value: "Answer D" },
  });
  fireEvent.change(screen.getByLabelText("Correct Answer:"), {
    target: { value: "0" },
  });

  // Submit the form
  fireEvent.click(screen.getByText("Add Question"));

  // Navigate to the list page
  fireEvent.click(screen.getByText("View Questions"));

  // Wait for the new question to appear in the list
  await waitFor(() => {
    // Use a custom function to match part of the text
    expect(screen.getByText((content) => content.includes("Test Prompt"))).toBeInTheDocument();
  });
});
