// Sidebar.jsx
import React from "react";
import Legend from "./Legend";
import QuestionNumbers from "./QuestionNumbers";

export default function Sidebar() {
  const questionNumbers = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="w-[300px]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#00296b] font-medium">Sections Name</h3>
          <div className="flex gap-2">
            <span className="text-[#00296b]">←</span>
            <span className="text-[#00296b]">→</span>
          </div>
        </div>
        <Legend />
        <QuestionNumbers questionNumbers={questionNumbers} />
      </div>
    </div>
  );
}
