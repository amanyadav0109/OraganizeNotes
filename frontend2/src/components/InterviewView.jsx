function InterviewView({ data }) {

  if (!data) return null;

  const questions = Array.isArray(data.questions)
    ? data.questions
    : [];

  return (
    <div>

      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        {data.title || "Interview Questions"}
      </h2>

      {questions.length === 0 ? (

        <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
            No Interview Questions Available
          </h2>

          <p className="mt-3 text-yellow-700 dark:text-yellow-200">
            There wasn't enough information in your notes to generate interview questions.
            Try adding more detailed notes.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {questions.map((question, index) => (

            <div
              key={index}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 shadow hover:shadow-lg transition"
            >

              <h3 className="font-bold text-purple-600 dark:text-purple-400">
                Question {index + 1}
              </h3>

              <p className="mt-3 text-gray-700 dark:text-gray-300 leading-7">
                {question || "Question not available."}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default InterviewView;