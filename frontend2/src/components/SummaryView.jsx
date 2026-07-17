function SummaryView({ data }) {

  if (!data) return null;

  const points = Array.isArray(data.points) ? data.points : [];

  return (
    <div>

      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        {data.title || "Summary"}
      </h2>

      {points.length === 0 ? (

        <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl">

          <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
            No Summary Available
          </h3>

          <p className="mt-2 text-gray-700 dark:text-gray-300">
            There wasn't enough information in your notes to generate a summary.
            Try adding more detailed content.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {points.map((item, index) => (

            <div
              key={index}
              className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 shadow-sm"
            >

              <h3 className="text-lg font-bold text-purple-600 mb-2">
                {item.heading || `Point ${index + 1}`}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 leading-7">
                {item.description || "No description available."}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SummaryView;