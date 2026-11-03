import { ChevronRight } from "lucide-react";

const colorStyles = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  cyan: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  teal: "bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
};

function CategoryCard({ category, onClick }) {
  const Icon = category.icon;

  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorStyles[category.color]}`}>
          <Icon size={27} />
        </div>

        <ChevronRight
          size={21}
          className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-indigo-600"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
        {category.name}
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {category.description}
      </p>

      <p className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        Explore Tests →
      </p>
    </button>
  );
}

export default CategoryCard;