import React from "react";

export default function Question({
  question,
  currentIndex,
  totalQuestions,
  onNext,
  onPrevious,
  onFinish,
}) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#00296b] text-xl">Question {currentIndex + 1}</h2>
        <button className="text-red-500 text-sm border border-red-500 rounded-full px-4 py-1">
          Mark for review
        </button>
      </div>

      <p className="text-lg mb-8">{question.text}</p>

      <div className="space-y-4 mb-12">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            className="w-full p-4 text-left border rounded-lg hover:border-[#00296b] transition-colors"
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          className="bg-[#fdc500] text-[#00296b] px-8 py-2 rounded-full flex items-center gap-2"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        <button
          className="bg-[#fdc500] text-[#00296b] px-8 py-2 rounded-full"
          onClick={onFinish}
        >
          Finish
        </button>
        <button
          className="bg-[#fdc500] text-[#00296b] px-8 py-2 rounded-full flex items-center gap-2"
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
