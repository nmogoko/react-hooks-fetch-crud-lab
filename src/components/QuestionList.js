import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch(`  http://localhost:4000/questions`)
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  }, []);

  // Function to send a DELETE request and update state
  async function deleteQuestion(id) {
    const url = `http://localhost:4000/questions/${id}`; // URL to delete question

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete resource: ${response.statusText}`);
      }

      // After successful deletion, update the state
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );

      console.log("Resource deleted successfully");
    } catch (error) {
      console.error("Error during delete request:", error);
    }
  }

  // Update answer function (updates server and then state)
  const updateAnswer = (id, newAnswer) => {
    const url = `http://localhost:4000/questions/${id}`;
    const updatedData = { correctIndex: Number(newAnswer) };

    // Send PATCH request to json-server
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update answer on server");
        }
        return response.json();
      })
      .then((updatedQuestion) => {
        // Update the state with the new correct answer
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? { ...question, correctIndex: newAnswer } : question
          )
        );
      })
      .catch((error) => console.error("Error updating answer:", error));
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {/* display QuestionItem components here after fetching */}
        {questions.map((question, index) => (
          <QuestionItem
            question={question}
            key={index}
            onDelete={() => deleteQuestion(question.id)}
            onUpdateAnswer={updateAnswer}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
