import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GroupImage from "../../../assets/bulk.png";

const Mcq_bulkUpload = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [activeTab, setActiveTab] = useState("My Device"); // Default tab
  const [fileUploaded, setFileUploaded] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a valid CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target.result;
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length > 1);

        const formattedQuestions = dataRows.map((row) => {
          return {
            _id: { $oid: generateUniqueId() },
            question_id: generateUniqueId(),
            question: row[0]?.replace(/["]/g, ""),
            options: [
              row[1]?.trim(),
              row[2]?.trim(),
              row[3]?.trim(),
              row[4]?.trim(),
            ].filter(Boolean) || [], // Ensure options is always an array
            answer: row[5]?.trim(),
            level: row[6]?.trim().toLowerCase() || "easy",
            tags: [row[7], row[8]]
              .filter(Boolean)
              .map((tag) => tag?.trim()) || [], // Ensure tags is always an array
          };
        });

        // Update state directly without API call
        setQuestions(formattedQuestions);
        setFileUploaded(true); // Set fileUploaded to true after successful upload
        console.log("Parsed questions:", formattedQuestions);
      } catch (error) {
        console.error("Error processing file:", error);
        alert(`Error processing file: ${error.message}`);
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      alert("Error reading file");
    };

    reader.readAsText(file);
  };

  const handleSelectQuestion = (index) => {
    setSelectedQuestions((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      setSelectedQuestions([]);
    } else {
      const allSelectedIndexes = filteredQuestions.map((_, idx) => idx);
      setSelectedQuestions(allSelectedIndexes);
    }
  };

  const handleSubmit = () => {
    const selectedQuestionsData = selectedQuestions.map((index) => questions[index]);

    try {
      // Load existing contests data from local storage
      const storedContests = JSON.parse(localStorage.getItem("contests")) || [];
      const updatedContests = [...storedContests, ...selectedQuestionsData];

      // Save updated contests data to local storage
      localStorage.setItem("contests", JSON.stringify(updatedContests));
      console.log("Saved questions to local storage:", updatedContests);

      alert("Questions added successfully!");
      setQuestions([]);
      setSelectedQuestions([]);
      setFileUploaded(false); // Reset fileUploaded state
      navigate("/mcq/QuestionsDashboard");
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions. Please try again.");
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesText = question.question.toLowerCase().includes(filterText.toLowerCase());
      const matchesLevel = filterLevel ? question.level === filterLevel : true;
      return matchesText && matchesLevel;
    });
  }, [questions, filterText, filterLevel]);

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Files</h1>
        <p className="text-gray-500 text-sm">
          Easily add questions by uploading your prepared files as{" "}
          <span className="font-medium text-gray-600">csv, xlsx etc.</span>
        </p>
      </div>

      {/* Main Upload Section */}
      <div className="bg-white shadow-lg rounded-3xl p-8 w-[90%] max-w-4xl">
        {/* Tabs Section */}
        <div className="flex space-x-6 mb-6 justify-center">
          <button
            className={`font-medium ${
              activeTab === "My Drive"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("My Drive")}
          >
            My Drive
          </button>
          <button
            className={`font-medium ${
              activeTab === "Dropbox"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("Dropbox")}
          >
            Dropbox
          </button>
          <button
            className={`font-medium ${
              activeTab === "My Device"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
            onClick={() => handleTabChange("My Device")}
          >
            My Device
          </button>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src={GroupImage}
            alt="Upload Illustration"
            className="w-48 h-48 object-contain mb-4"
          />
          <label
            htmlFor="fileInput"
            className="bg-yellow-400 text-black px-6 py-3 rounded-full shadow hover:bg-yellow-500 cursor-pointer transition"
          >
            Upload CSV
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>

        {/* Filter Section */}
        {fileUploaded && (
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Filter by text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-48 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md"
            />
            <input
              type="text"
              placeholder="Filter by level"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-48 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-md"
            />
          </div>
        )}
      </div>

      {/* Questions Preview Section */}
      {questions.length > 0 && (
        <div className="bg-white shadow-lg rounded-3xl p-6 mt-8 w-[90%] max-w-5xl">
          <h2 className="text-2xl font-semibold mb-4">Questions Preview</h2>
          <table className="table-auto w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedQuestions.length === filteredQuestions.length}
                  />
                </th>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Options</th>
                <th className="px-4 py-2">Answer</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } text-gray-800`}
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(index)}
                      onChange={() => handleSelectQuestion(index)}
                    />
                  </td>
                  <td className="px-4 py-2">{q.question}</td>
                  <td className="px-4 py-2">{q.options?.join(", ") || ""}</td>
                  <td className="px-4 py-2">{q.answer}</td>
                  <td className="px-4 py-2 text-center">{q.level}</td>
                  <td className="px-4 py-2 text-center">{q.tags?.join(", ") || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Selected Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mcq_bulkUpload;
