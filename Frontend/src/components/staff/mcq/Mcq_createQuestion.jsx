import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const Mcq_createQuestion = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [level, setLevel] = useState("easy");
  const [tags, setTags] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("contestToken");
      if (!token) {
        alert("Unauthorized access. Please start the contest again.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/mcq/questions/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const questions = Array.isArray(response.data) ? response.data.map(q => ({
          _id: q._id || { $oid: uuidv4() },
          question_id: q.question_id || uuidv4(),
          question: q.question,
          options: q.options,
          answer: q.answer,
          level: q.level,
          tags: q.tags
        })) : [];
        
        setQuestionList(questions);

        if (questions.length > 0) {
          setCurrentQuestionIndex(0);
          loadQuestionIntoForm(questions[0]);
        } else {
          resetFormForNewQuestion();
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please try again.");
        setQuestionList([]);
      }
    };

    fetchQuestions();
  }, []);

  const handleFinish = async () => {
    const token = localStorage.getItem("contestToken");
    if (!token) {
      alert("Unauthorized access. Please start the contest again.");
      return;
    }

    try {
      const formattedQuestions = questionList.map(q => ({
        _id: q._id || { $oid: uuidv4() },
        question_id: q.question_id || uuidv4(),
        question: q.question,
        options: q.options,
        answer: q.answer,
        level: q.level,
        tags: q.tags
      }));

      await axios.post(
        "http://localhost:8000/api/mcq/finish-contest/",
        { questions: formattedQuestions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Contest finished successfully!");
      navigate("/QuestionsDashboard");
    } catch (error) {
      console.error("Error finishing contest:", error);
      alert("Failed to finish contest. Please try again.");
    }
  };

  const loadQuestionIntoForm = (questionData) => {
    setIsNewQuestion(false);
    setQuestion(questionData.question || "");
    setOptions(questionData.options || ["", "", "", ""]);
    setAnswer(questionData.answer || "");
    setLevel(questionData.level || "easy");
    setTags(questionData.tags || []);
  };

  const resetFormForNewQuestion = () => {
    setIsNewQuestion(true);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setLevel("easy");
    setTags([]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleTagChange = (e) => {
    setTags(e.target.value.split(',').map(tag => tag.trim()));
  };

  const handleSaveQuestion = async () => {
    const token = localStorage.getItem("contestToken");
    if (!token) {
      alert("Unauthorized access.");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (options.some(option => !option.trim())) {
      alert("Please fill in all options.");
      return;
    }

    if (!answer) {
      alert("Please select a correct answer.");
      return;
    }

    const newQuestion = {
      _id: { $oid: uuidv4() },
      question_id: uuidv4(),
      question,
      options,
      answer,
      level,
      tags
    };

    try {
      if (isNewQuestion) {
        const response = await axios.post(
          "http://localhost:8000/api/mcq/save-questions/",
          newQuestion,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setQuestionList(prevQuestions => [...prevQuestions, response.data]);
        setCurrentQuestionIndex(questionList.length);
        alert("New question saved successfully!");
      } else {
        const questionId = questionList[currentQuestionIndex].question_id;
        await axios.put(
          `http://localhost:8000/api/mcq/questions/${questionId}`,
          newQuestion,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const updatedList = [...questionList];
        updatedList[currentQuestionIndex] = {
          ...updatedList[currentQuestionIndex],
          ...newQuestion,
        };
        setQuestionList(updatedList);
        alert("Question updated successfully!");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save the question. Please try again.");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      loadQuestionIntoForm(questionList[prevIndex]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionList.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      loadQuestionIntoForm(questionList[nextIndex]);
    } else {
      resetFormForNewQuestion();
      setCurrentQuestionIndex(questionList.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">
          Create Questions
        </h2>
      </header>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-gray-50 p-6 rounded-lg shadow flex flex-col">
          <h3 className="font-semibold text-indigo-700 mb-4">Question List</h3>
          <ul className="space-y-4 flex-grow">
            {Array.isArray(questionList) && questionList.map((q, index) => (
              <li
                key={index}
                className="p-3 bg-indigo-100 rounded-lg shadow flex items-center justify-between cursor-pointer hover:bg-indigo-200"
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  loadQuestionIntoForm(q);
                }}
              >
                <div className="text-indigo-800">
                  <span className="block font-medium">
                    {q.question?.slice(0, 20)}...
                  </span>
                  <span className="text-sm text-gray-600 italic">
                    Level: {q.level}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={handleFinish}
            className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 mt-auto"
          >
            Finish
          </button>
        </aside>

        {/* Main Form */}
        <main className="col-span-3 bg-gray-50 p-6 rounded-lg shadow">
          {/* Question Input */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2 flex justify-start">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded-lg p-4 text-gray-700"
              placeholder="Enter your question here"
              rows={4}
            />
          </div>

          {/* Options Section */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2 flex justify-start">
              Options
            </label>
            {options.map((option, index) => (
              <div className="flex items-center mb-2" key={index}>
                <span className="mr-2 font-medium">{String.fromCharCode(65 + index)}.</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-grow border rounded-lg p-2 text-gray-700"
                />
              </div>
            ))}
          </div>

          {/* Correct Answer */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2 flex justify-start">
              Correct Answer
            </label>
            <select
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-700"
            >
              <option value="">Select the correct option</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Level Selection */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2 flex justify-start">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-700"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2 flex justify-start">
              Tags
            </label>
            <input
              type="text"
              value={tags.join(', ')}
              onChange={handleTagChange}
              className="w-full border rounded-lg p-2 text-gray-700"
              placeholder="Enter tags separated by commas"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousQuestion}
              className={`bg-indigo-700 text-white py-2 px-4 rounded-lg transition-opacity ${
                currentQuestionIndex <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-800'
              }`}
              disabled={currentQuestionIndex <= 0}
            >
              Previous
            </button>
            <button
              onClick={handleSaveQuestion}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleNextQuestion}
              className="bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-800"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Mcq_createQuestion;