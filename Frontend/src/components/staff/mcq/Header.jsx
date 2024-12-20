// Header.jsx
import React from "react";

export default function Header({ hasTime }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <h1 className="text-[#00296b] text-xl font-medium">MCQ ASSEMENT</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 text-[#00296b]">⏰</span>
        <div>
          <div className="text-[#00296b] font-medium">
            {hasTime ? new Date(hasTime).toLocaleTimeString() : "Stop Timer"}
          </div>
          <div className="text-[#00296b] text-xs">Time Left</div>
        </div>
      </div>
    </div>
  );
}
