import { useState } from "react";

function MCQView({ data }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!data) return null;

  const questions = Array.isArray(data.questions)
    ? data.questions
    : [];

  const score = questions.reduce((total, q, index) => {
    return answers[index] === q.answer ? total + 1 : total;
  }, 0);

  const handleOptionClick = (questionIndex, optionIndex) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        {data.title || "MCQ Test"}
      </h2>

      {questions.length === 0 ? (
        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            No MCQs Available
          </h2>

          <p className="mt-3 text-yellow-700 dark:text-yellow-200">
            There wasn't enough information in your notes to generate MCQs.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {questions.map((mcq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-5">
                  Q{index + 1}. {mcq.question}
                </h3>

                <div className="space-y-3">
                  {(mcq.options || []).map((option, i) => {
                    const selected = answers[index] === i;
                    const correct = mcq.answer === i;

                    let classes =
                      "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600";

                    if (submitted) {
                      if (correct) {
                        classes =
                          "border-green-500 bg-green-100 dark:bg-green-900";
                      } else if (selected && !correct) {
                        classes =
                          "border-red-500 bg-red-100 dark:bg-red-900";
                      }
                    } else if (selected) {
                      classes =
                        "border-blue-500 bg-blue-100 dark:bg-blue-900";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(index, i)}
                        className={`w-full text-left rounded-xl border p-4 transition ${classes}`}
                      >
                        <strong>
                          {String.fromCharCode(65 + i)}.
                        </strong>{" "}
                        {option}
                      </button>
                    );
                  })}
                </div>

                {submitted && mcq.explanation && (
                  <div className="mt-5 bg-blue-50 dark:bg-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">
                      Explanation
                    </h4>

                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {mcq.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-bold transition"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-2xl p-8">
                  <h2 className="text-3xl font-bold text-green-700 dark:text-green-300">
                    🎉 Quiz Completed
                  </h2>

                  <p className="mt-4 text-2xl font-bold dark:text-white">
                    Score: {score} / {questions.length}
                  </p>

                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {score === questions.length
                      ? "Excellent! Perfect Score."
                      : score >= questions.length / 2
                      ? "Good Job! Keep Practicing."
                      : "Keep Learning. You'll Improve!"}
                  </p>

                  <button
                    onClick={resetQuiz}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MCQView;