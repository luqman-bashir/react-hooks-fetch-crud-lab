import React from "react";

function QuestionItem({ question, onDelete }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  function handleDelete() {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          onDelete(id); // Notify parent component about the deletion
        } else {
          console.error(`Failed to delete question with id ${id}`);
        }
      })
      .catch((err) => {
        console.error(`Error deleting question with id ${id}:`, err);
      });
  }

  function handleChange(event) {
    const newCorrectIndex = parseInt(event.target.value);
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Failed to update question with id ${id}`);
        }
      })
      .catch((err) => {
        console.error(`Error updating question with id ${id}:`, err);
      });
  }

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select defaultValue={correctIndex} onChange={handleChange}>
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
