import { rest } from "msw";
import { data } from "./data";

let questions = [...data];

export const resetQuestions = () => {
  questions = [...data];
};

export const handlers = [
  rest.get("http://localhost:4000/questions", (req, res, ctx) => {
    console.log("GET request received");
    return res(ctx.status(200), ctx.json(questions));
  }),

  rest.post("http://localhost:4000/questions", (req, res, ctx) => {
    const { prompt, answers, correctIndex } = req.body;

    if (!prompt || !Array.isArray(answers) || correctIndex === undefined) {
      return res(
        ctx.status(400),
        ctx.json({
          message: "Invalid request: 'prompt', 'answers', and 'correctIndex' are required.",
        })
      );
    }

    if (answers.length < 2) {
      return res(
        ctx.status(400),
        ctx.json({ message: "Invalid request: 'answers' must include at least two options." })
      );
    }

    const id = questions.length ? questions[questions.length - 1].id + 1 : 1;
    const newQuestion = { id, prompt, answers, correctIndex };
    questions.push(newQuestion);

    console.log("New question added:", newQuestion);
    return res(ctx.status(201), ctx.json(newQuestion));
  }),

  rest.delete("http://localhost:4000/questions/:id", (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const index = questions.findIndex((q) => q.id === id);

    if (index === -1) {
      console.error(`Question with id ${id} not found.`);
      return res(ctx.status(404), ctx.json({ message: `Question with id ${id} not found.` }));
    }

    questions.splice(index, 1);

    console.log(`Question with id ${id} deleted successfully.`);
    return res(ctx.status(200), ctx.json({ message: `Question with id ${id} deleted successfully.` }));
  }),

  rest.patch("http://localhost:4000/questions/:id", (req, res, ctx) => {
    const id = parseInt(req.params.id, 10);
    const { correctIndex } = req.body;

    const question = questions.find((q) => q.id === id);

    if (!question) {
      return res(ctx.status(404), ctx.json({ message: `Question with id ${id} not found.` }));
    }

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

    question.correctIndex = correctIndex;

    console.log(`Question with id ${id} updated successfully.`);
    return res(
      ctx.status(200),
      ctx.json({
        message: `Question with id ${id} updated successfully.`,
        question,
      })
    );
  }),
];
