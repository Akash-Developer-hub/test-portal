// QuestionNumbers.jsx
import React from "react";

export default function QuestionNumbers({ questionNumbers }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {questionNumbers.map((num) => (
        <button
          key={num}
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            num === 4
              ? "bg-red-500 text-white"
              : num === 12
              ? "bg-blue-600 text-white"
              : num <= 5
              ? "bg-green-500 text-white"
              : num === 15
              ? "bg-yellow-400 text-white"
              : "bg-gray-100"
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
