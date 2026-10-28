
function SummaryView({ data }) {
  if (!data) return null;

  const points = Array.isArray(data.points) ? data.points : [];

  const summaryText =
    typeof data.summary === "string" ? data.summary : "";

  const summaryObject =
    data.summary &&
    typeof data.summary === "object" &&
    !Array.isArray(data.summary)
      ? data.summary
      : null;

  const hasSummary =
    points.length > 0 ||
    summaryText.trim().length > 0 ||
    Boolean(summaryObject);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 dark:text-white">
        {data.title || "Summary"}
      </h2>

      {!hasSummary ? (
        <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
            No Summary Available
          </h3>

          <p className="mt-2 text-gray-700 dark:text-gray-300">
            No summary was generated. Try again with more detailed notes.
          </p>
        </div>
      ) : points.length > 0 ? (
        <div className="space-y-6">
          {points.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-2">
                {typeof item === "string"
                  ? `Point ${index + 1}`
                  : item?.heading || `Point ${index + 1}`}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-wrap">
                {typeof item === "string"
                  ? item
                  : item?.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <p className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-wrap">
            {summaryText ||
              summaryObject?.text ||
              summaryObject?.summary ||
              "Summary content is unavailable."}
          </p>
        </div>
      )}
    </div>
  );
}

export default SummaryView;
