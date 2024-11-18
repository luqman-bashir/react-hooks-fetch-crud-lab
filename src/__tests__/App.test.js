import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../components/App";
import { server } from "../mocks/server";
import { resetQuestions } from "../mocks/handlers";

beforeAll(() => server.listen());
afterEach(() => {

  server.resetHandlers();
  resetQuestions();
});
afterAll(() => server.close());

describe("App Integration Tests", () => {
  test("fetches and displays all questions", async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/View Questions/i));

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/lorem testum 1/i)).toBeInTheDocument();
      expect(screen.getByText(/lorem testum 2/i)).toBeInTheDocument();
    });
  });

  test("creates a new question", async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/New Question/i));

    fireEvent.change(screen.getByLabelText(/Prompt:/i), {
      target: { value: "What is the capital of France?" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 1:/i), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 2:/i), {
      target: { value: "London" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 3:/i), {
      target: { value: "Berlin" },
    });
    fireEvent.change(screen.getByLabelText(/Answer 4:/i), {
      target: { value: "Madrid" },
    });
    fireEvent.change(screen.getByLabelText(/Correct Answer:/i), {
      target: { value: "0" },
    });

    fireEvent.click(screen.getByText(/Add Question/i));
    fireEvent.click(screen.getByText(/View Questions/i));

    // Verify the new question is displayed
    await waitFor(() => {
      expect(screen.getByText(/What is the capital of France\?/i)).toBeInTheDocument();
    });
  });

  test("deletes a specific question", async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/View Questions/i));

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/lorem testum 1/i)).toBeInTheDocument();
      expect(screen.getByText(/lorem testum 2/i)).toBeInTheDocument();
    });

    // Find the list item containing "lorem testum 1"
    const question1 = screen.getByText(/lorem testum 1/i).closest("li");

    // Ensure the list item is found
    expect(question1).toBeInTheDocument();

    // Find the delete button within that specific list item
    const deleteButton = within(question1).getByRole("button", { name: /Delete Question/i });

    // Click the delete button
    fireEvent.click(deleteButton);

    // Verify the question is removed
    await waitFor(() => {
      expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
    });
  });

  test("deletes all questions one by one", async () => {
    render(<App />);

    fireEvent.click(screen.getByText(/View Questions/i));

    // Wait for questions to load
    await waitFor(() => {
      expect(screen.getByText(/lorem testum 1/i)).toBeInTheDocument();
      expect(screen.getByText(/lorem testum 2/i)).toBeInTheDocument();
    });

    // Get all list items
    const listItems = screen.getAllByRole("listitem");


    // Delete each question one by one
    for (const item of listItems) {
      const deleteButton = within(item).getByRole("button", { name: /Delete Question/i });
      fireEvent.click(deleteButton);

      // Wait for the item to be removed
      await waitFor(() => {
        expect(item).not.toBeInTheDocument();
      });
    }

    // Verify no questions are left
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
