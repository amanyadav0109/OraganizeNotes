
import {
  CheckCircle2,
  XCircle,
  CircleHelp,
  ArrowLeft,
} from "lucide-react";

export default function AnswerReview({ result, onBack }) {
  const questions = result?.questions || [];
  const answers = result?.answers || {};
  const language = result?.language || "English";

  const answerMap = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
  };

  const getCorrectAnswer = (question) => {
    if (typeof question.answer === "number") {
      return question.answer;
    }

    if (question.correct_answer) {
      return answerMap[question.correct_answer];
    }

    return -1;
  };

  const getQuestionText = (question) => {
    if (typeof question.question === "string") {
      return question.question;
    }

    return (
      question.question?.[language] ||
      question.question?.English ||
      ""
    );
  };

  const getOptions = (question) => {
    if (Array.isArray(question.options)) {
      return question.options;
    }

    if (question.options?.[language]) {
      return question.options[language];
    }

    if (question.options?.English) {
      return question.options.English;
    }

    return [
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
    ].filter(Boolean);
  };

  const getExplanation = (question) => {
    if (typeof question.explanation === "string") {
      return question.explanation || "No explanation available.";
    }

    return (
      question.explanation?.[language] ||
      question.explanation?.English ||
      "No explanation available."
    );
  };

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
        <CircleHelp
          size={40}
          className="mx-auto text-gray-400"
        />

        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          No Answer Review Available
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Questions are not available for this review.
        </p>

        <button
          onClick={onBack}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          Back to Result
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-10">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Answer Review
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check your answers and understand your mistakes.
          </p>
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:border-slate-600 dark:text-gray-200"
        >
          <ArrowLeft size={17} />
          Back to Result
        </button>
      </div>

      {/* Questions */}
      {questions.map((question, index) => {
        const selectedAnswer = answers[question.id];
        const correctAnswer = getCorrectAnswer(question);

        const isAnswered = selectedAnswer !== undefined;
        const isCorrect =
          isAnswered && selectedAnswer === correctAnswer;

        const questionText = getQuestionText(question);
        const options = getOptions(question);
        const explanation = getExplanation(question);

        return (
          <div
            key={question.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6"
          >

            {/* Question Status */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                Question {index + 1}
              </span>

              {isCorrect ? (
                <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={15} />
                  Correct
                </span>
              ) : !isAnswered ? (
                <span className="flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-700">
                  <CircleHelp size={15} />
                  Unanswered
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                  <XCircle size={15} />
                  Incorrect
                </span>
              )}
            </div>

            {/* Question */}
            <h3 className="mt-5 font-semibold leading-7 text-gray-900 dark:text-white">
              {questionText}
            </h3>

            {/* Options */}
            <div className="mt-5 space-y-3">
              {options.map((option, optionIndex) => {
                const isSelected =
                  selectedAnswer === optionIndex;

                const isAnswer =
                  correctAnswer === optionIndex;

                let optionStyle =
                  "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200";

                if (isAnswer) {
                  optionStyle =
                    "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300";
                } else if (isSelected) {
                  optionStyle =
                    "border-red-500 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300";
                }

                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-3 rounded-xl border p-4 ${optionStyle}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>

                    <span className="text-sm font-medium">
                      {option}
                    </span>

                    <span className="ml-auto flex items-center gap-2 text-xs font-semibold">
                      {isAnswer && (
                        <>
                          <CheckCircle2 size={17} />
                          <span className="hidden sm:inline">
                            Correct Answer
                          </span>
                        </>
                      )}

                      {isSelected && !isAnswer && (
                        <>
                          <XCircle size={17} />
                          <span className="hidden sm:inline">
                            Your Answer
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="mt-5 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/30">
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                Explanation
              </p>

              <p className="mt-2 text-sm leading-6 text-blue-900 dark:text-blue-200">
                {explanation}
              </p>
            </div>

          </div>
        );
      })}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        <ArrowLeft size={18} />
        Back to Result
      </button>

    </div>
  );
}
