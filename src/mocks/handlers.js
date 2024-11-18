import { rest } from "msw";
import { data } from "./data";

let questions = [...data]; // Clone the initial data to avoid mutating the original

export const handlers = [
  // GET: Fetch all questions
  rest.get("http://localhost:4000/questions", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(questions) // Return the list of questions
    );
  }),

  // POST: Add a new question
  rest.post("http://localhost:4000/questions", (req, res, ctx) => {
    const { prompt, answers, correctIndex } = req.body;

    // Validation: Check for missing fields
    if (!prompt || !Array.isArray(answers) || correctIndex === undefined) {
      return res(
        ctx.status(400),
        ctx.json({
          message: "Invalid request: 'prompt', 'answers', and 'correctIndex' are required.",
        })
      );
    }

    // Validation: Ensure 'answers' contains at least two options
    if (answers.length < 2) {
      return res(
        ctx.status(400),
        ctx.json({ message: "Invalid request: 'answers' must include at least two options." })
      );
    }

    // Create a new question
    const id = questions.length ? questions[questions.length - 1].id + 1 : 1;
    const newQuestion = { id, prompt, answers, correctIndex };
    questions.push(newQuestion);

    return res(
      ctx.status(201),
      ctx.json(newQuestion) // Return the newly created question
    );
  }),

  // DELETE: Remove a question
  rest.delete("http://localhost:4000/questions/:id", (req, res, ctx) => {
    const { id } = req.params;

    const questionIndex = questions.findIndex((q) => q.id === parseInt(id, 10));
    if (questionIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: `Question with id ${id} not found.` })
      );
    }

    // Remove the question from the list
    questions.splice(questionIndex, 1);

    return res(
      ctx.status(200),
      ctx.json({ message: `Question with id ${id} deleted successfully.` })
    );
  }),

  // PATCH: Update a question's correct answer index
  rest.patch("http://localhost:4000/questions/:id", (req, res, ctx) => {
    const { id } = req.params;
    const { correctIndex } = req.body;

    const question = questions.find((q) => q.id === parseInt(id, 10));
    if (!question) {
      return res(
        ctx.status(404),
        ctx.json({ message: `Question with id ${id} not found.` })
      );
    }

    // Validate 'correctIndex'
    if (
      correctIndex === undefined ||
      correctIndex < 0 ||
      correctIndex >= question.answers.length
    ) {
      return res(
        ctx.status(400),
        ctx.json({
          message: `Invalid correctIndex: Must be between 0 and ${
            question.answers.length - 1
          }.`,
        })
      );
    }

    // Update the correctIndex
    question.correctIndex = correctIndex;

    return res(
      ctx.status(200),
      ctx.json({
        message: `Question with id ${id} updated successfully.`,
        question,
      })
    );
  }),
];
