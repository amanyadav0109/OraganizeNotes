import React, { useState } from "react";

const notesData = [
  {
    id: 1,
    title: "DBMS Normalization Notes",
    subject: "DBMS",
    unit: "Unit 3",
    description: "Complete notes covering 1NF, 2NF, 3NF and BCNF.",
    price: 20,
    seller: "Rahul",
  },
  {
    id: 2,
    title: "Operating System Process Management",
    subject: "Operating System",
    unit: "Unit 2",
    description: "Process scheduling, threads and process synchronization.",
    price: 15,
    seller: "Aman",
  },
  {
    id: 3,
    title: "Computer Networks TCP/IP",
    subject: "Computer Networks",
    unit: "Unit 4",
    description: "TCP/IP model, protocols and network layer concepts.",
    price: 25,
    seller: "Priya",
  },
];

const FindNotes = () => {
  const [search, setSearch] = useState("");

  const filteredNotes = notesData.filter((note) =>
    `${note.title} ${note.subject} ${note.unit}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search subject, unit or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 
          bg-slate-50 dark:bg-slate-800 px-4 py-3 outline-none
          focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>

      {/* Notes */}
      <div className="space-y-4">

        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 
              bg-slate-50 dark:bg-slate-800 p-4"
            >

              {/* Title */}
              <h3 className="font-bold text-base sm:text-lg dark:text-white">
                {note.title}
              </h3>

              {/* Subject + Unit */}
              <div className="flex gap-2 mt-2 flex-wrap">

                <span className="rounded-full bg-blue-100 text-blue-700 
                dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 text-xs">
                  {note.subject}
                </span>

                <span className="rounded-full bg-purple-100 text-purple-700 
                dark:bg-purple-900/40 dark:text-purple-300 px-3 py-1 text-xs">
                  {note.unit}
                </span>

              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {note.description}
              </p>

              {/* Bottom */}
              <div className="mt-4 flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded by
                  </p>

                  <p className="font-medium text-sm dark:text-white">
                    {note.seller}
                  </p>
                </div>

                <div className="text-right">

                  <p className="font-bold text-lg text-green-600">
                    ₹{note.price}
                  </p>

                  <button
                    className="mt-1 rounded-lg bg-blue-600 px-4 py-2 
                    text-sm font-medium text-white hover:bg-blue-700 
                    transition"
                  >
                    Get Notes
                  </button>

                </div>

              </div>

            </div>
          ))
        ) : (
          <p className="text-center py-8 text-slate-500 dark:text-slate-400">
            No notes found.
          </p>
        )}

      </div>
    </div>
  );
};

export default FindNotes;