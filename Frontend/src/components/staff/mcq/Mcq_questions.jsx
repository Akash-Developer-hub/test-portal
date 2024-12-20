import React from 'react';
import { useNavigate,useParams } from "react-router-dom";



const Mcq_questions = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const handleCreateManually = () => {
    const token = localStorage.getItem("contestToken");
    if (!token) {
      alert("Unauthorized access. Please start the contest again.");
      return;
    }

    navigate("/mcq/CreateQuestion");
  };

  const handleBulkUpload = () => {
    const token = localStorage.getItem("contestToken");
    if (!token) {
      alert("Unauthorized access. Please start the contest again.");
      return;
    }

    navigate("/mcq/bulkUpload");
  };


  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Add & Manage Your Questions</h2>
      <p className="text-lg text-gray-600 mb-8">Choose how you'd like to add questions to your assessment. Select the method that works best for you to quickly build your test.</p>

      {/* Options Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Each Option */}
        <div onClick={handleCreateManually} 
        className="p-6 bg-gray-50 rounded-lg text-center shadow-md transform transition-all hover:translate-y-2 hover:shadow-xl">
          <div className="text-4xl text-blue-600 mb-4">+</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Create Manually</h3>
          <p className="text-sm text-gray-500">Enter each question and its options directly. Perfect for custom content!</p>
        </div>

        <div onClick={handleBulkUpload} 
        className="p-6 bg-gray-50 rounded-lg text-center shadow-md transform transition-all hover:translate-y-2 hover:shadow-xl">
          <div className="text-4xl text-blue-600 mb-4">📁</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Bulk Upload</h3>
          <p className="text-sm text-gray-500">Upload a CSV or Excel file with your questions and options for bulk addition.</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg text-center shadow-md transform transition-all hover:translate-y-2 hover:shadow-xl">
          <div className="text-4xl text-blue-600 mb-4">🔖</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Question Library</h3>
          <p className="text-sm text-gray-500">Pick from your saved questions library, organized by topic and ready to reuse.</p>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg text-center shadow-md transform transition-all hover:translate-y-2 hover:shadow-xl">
          <div className="text-4xl text-blue-600 mb-4">🤖</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">AI Generator</h3>
          <p className="text-sm text-gray-500">Automatically generate questions based on your selected topic.</p>
        </div>
      </div>
    </div>
  );
};

export default Mcq_questions;