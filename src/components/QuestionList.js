import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setQuestions(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to fetch questions");
          console.error(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDelete(id) {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem key={question.id} question={question} onDelete={handleDelete} />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
