import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewTest = () => {
  const { contestId } = useParams(); // Get contestId from the URL
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/contests/${contestId}/`);
        setTestDetails(response.data); // Save the exact JSON structure
      } catch (err) {
        setError("Failed to fetch test details");
        console.error(err);
      }
    };

    if (contestId) {
      fetchTestDetails();
    }
  }, [contestId]);

  if (error) return <div>{error}</div>;
  if (!testDetails) return <div>Loading...</div>;

  // Destructure testDetails for easier rendering
  const { assessmentOverview, testConfiguration, problems, visible_to } = testDetails;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{assessmentOverview?.name || "N/A"}</h1>
        <p className="text-gray-600">
          Registration: <strong>{assessmentOverview?.registrationStart || "N/A"}</strong> -{" "}
          <strong>{assessmentOverview?.registrationEnd || "N/A"}</strong>
        </p>
      </div>

      {/* Assessment Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Assessment Overview</h2>
        <p><strong>Description:</strong> {assessmentOverview?.description || "N/A"}</p>
        <p><strong>Guidelines:</strong> {assessmentOverview?.guidelines || "N/A"}</p>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Test Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Sections:</strong> {testConfiguration?.sections || "N/A"}</p>
          <p><strong>Questions:</strong> {testConfiguration?.questions || "N/A"}</p>
          <p><strong>Duration:</strong> {testConfiguration?.duration || "N/A"}</p>
          <p><strong>Fullscreen Mode:</strong> {testConfiguration?.fullScreenMode ? "Enabled" : "Disabled"}</p>
          <p><strong>Face Detection:</strong> {testConfiguration?.faceDetection ? "Enabled" : "Disabled"}</p>
          <p><strong>Device Restriction:</strong> {testConfiguration?.deviceRestriction ? "Enabled" : "Disabled"}</p>
          <p><strong>Noise Detection:</strong> {testConfiguration?.noiseDetection ? "Enabled" : "Disabled"}</p>
          <p><strong>Pass Percentage:</strong> {testConfiguration?.passPercentage}%</p>
        </div>
      </div>

      {/* Problem Titles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Problem Titles</h2>
        <ul className="list-disc ml-6">
          {problems?.map((problem, index) => (
            <li key={index}>{problem.title}</li>
          ))}
        </ul>
      </div>

      {/* Visible To */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Visible To</h2>
        <ul className="list-disc ml-6">
          {visible_to?.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
      <button
        className="bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded m-4"
        onClick={() => navigate('/staffdashboard')}
        >
            Previous Page
        </button>
    </div>
  );
};

export default ViewTest;