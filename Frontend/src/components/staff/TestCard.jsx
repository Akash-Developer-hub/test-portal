import React from 'react';
import { useNavigate } from 'react-router-dom';


const TestCard = ({ title, type, date, category, stats, status, onView, contestId }) => {
  const navigate = useNavigate();
  // Dynamic styles for the status
    const handleViewTest = () => { 
    navigate(`/viewtest/${contestId}`); // Navigate to the ViewTest page with the testId
  };

  // Dynamic styles for the status
  const statusStyles = 
  status === 'Live'
    ? 'bg-green-200 text-green-800' 
    : status === 'Upcoming'
      ? 'bg-yellow-200 text-yellow-800' 
      : 'bg-red-300 text-red-800';


  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusStyles}`}>{status}</span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <button

          onClick={handleViewTest}

          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
        >
          View Test
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{type}</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{date}</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{category}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="text-center">
            <h4 className="text-2xl font-bold">{value}</h4>
            <p className="text-gray-600 text-sm">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCard;