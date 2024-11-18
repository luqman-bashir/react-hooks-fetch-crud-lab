import React, { useState, useRef, useEffect } from "react";

function QuestionForm() {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: 0,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    // Mark as mounted
    isMounted.current = true;

    return () => {
      // Mark as unmounted when cleanup happens
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt,
        answers: [formData.answer1, formData.answer2, formData.answer3, formData.answer4],
        correctIndex: parseInt(formData.correctIndex, 10),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        if (isMounted.current) {
          setFormData({
            prompt: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            correctIndex: 0,
          });
        }
      })
      .catch((error) => console.error("Failed to submit question:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          name="prompt"
          value={formData.prompt}
          onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
        />
      </label>
      <label>
        Answer 1:
        <input
          type="text"
          name="answer1"
          value={formData.answer1}
          onChange={(e) => setFormData((prev) => ({ ...prev, answer1: e.target.value }))}
        />
      </label>
      <label>
        Answer 2:
        <input
          type="text"
          name="answer2"
          value={formData.answer2}
          onChange={(e) => setFormData((prev) => ({ ...prev, answer2: e.target.value }))}
        />
      </label>
      <label>
        Answer 3:
        <input
          type="text"
          name="answer3"
          value={formData.answer3}
          onChange={(e) => setFormData((prev) => ({ ...prev, answer3: e.target.value }))}
        />
      </label>
      <label>
        Answer 4:
        <input
          type="text"
          name="answer4"
          value={formData.answer4}
          onChange={(e) => setFormData((prev) => ({ ...prev, answer4: e.target.value }))}
        />
      </label>
      <label>
        Correct Answer:
        <select
          name="correctIndex"
          value={formData.correctIndex}
          onChange={(e) => setFormData((prev) => ({ ...prev, correctIndex: e.target.value }))}
        >
          <option value="0">{formData.answer1}</option>
          <option value="1">{formData.answer2}</option>
          <option value="2">{formData.answer3}</option>
          <option value="3">{formData.answer4}</option>
        </select>
      </label>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;