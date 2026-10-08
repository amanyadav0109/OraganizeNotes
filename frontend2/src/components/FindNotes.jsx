import React, { useState } from "react";

const notesData = [
  {
    id: 1,
    title: "DBMS Normalization Notes",
    subject: "DBMS",
    unit: "Unit 3",
    description:
      "Complete notes covering 1NF, 2NF, 3NF and BCNF with easy examples.",
    price: 20,
    seller: "Rahul",
  },
  {
    id: 2,
    title: "Operating System Process Management",
    subject: "Operating System",
    unit: "Unit 2",
    description:
      "Process scheduling, threads and process synchronization notes.",
    price: 15,
    seller: "Aman",
  },
  {
    id: 3,
    title: "Computer Networks TCP/IP",
    subject: "Computer Networks",
    unit: "Unit 4",
    description:
      "TCP/IP model, protocols and important network layer concepts.",
    price: 25,
    seller: "Priya",
  },
  {
    id: 4,
    title: "Java OOPs Complete Notes",
    subject: "Java",
    unit: "Unit 2",
    description:
      "Classes, objects, inheritance, polymorphism, abstraction and encapsulation.",
    price: 30,
    seller: "Rohit",
  },
];

const FindNotes = () => {
  const [search, setSearch] = useState("");

  const filteredNotes = notesData.filter((note) =>
    `${note.title} ${note.subject} ${note.unit} ${note.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* ================= SEARCH ================= */}
      <div className="mb-4 shrink-0">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search subject, unit or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border border-slate-300
              dark:border-slate-700
              bg-slate-50
              dark:bg-slate-800
              px-11 py-3
              text-sm
              text-slate-800
              dark:text-white
              placeholder:text-slate-400
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
          />

        </div>

      </div>


      {/* ================= NOTES SCROLL AREA ================= */}
      <div
        className="
          notes-scroll
          flex-1
          min-h-0
          max-h-[395px]
          overflow-y-auto
          pr-2
          space-y-4
        "
      >

        {filteredNotes.length > 0 ? (

          filteredNotes.map((note) => (

            <div
              key={note.id}
              className="
                rounded-xl
                border border-slate-200
                dark:border-slate-700
                bg-slate-50
                dark:bg-slate-800
                p-4
                transition
                hover:border-blue-400
                dark:hover:border-blue-500
                hover:shadow-md
              "
            >

              {/* ================= TITLE ================= */}
              <h3
                className="
                  text-base
                  sm:text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                  leading-snug
                "
              >
                {note.title}
              </h3>


              {/* ================= SUBJECT + UNIT ================= */}
              <div className="flex flex-wrap gap-2 mt-3">

                <span
                  className="
                    rounded-full
                    bg-blue-100
                    dark:bg-blue-900/40
                    text-blue-700
                    dark:text-blue-300
                    px-3
                    py-1
                    text-xs
                    font-medium
                  "
                >
                  {note.subject}
                </span>

                <span
                  className="
                    rounded-full
                    bg-purple-100
                    dark:bg-purple-900/40
                    text-purple-700
                    dark:text-purple-300
                    px-3
                    py-1
                    text-xs
                    font-medium
                  "
                >
                  {note.unit}
                </span>

              </div>


              {/* ================= DESCRIPTION ================= */}
              <p
                className="
                  mt-3
                  text-sm
                  leading-relaxed
                  text-slate-600
                  dark:text-slate-300
                "
              >
                {note.description}
              </p>


              {/* ================= BOTTOM ================= */}
              <div
                className="
                  mt-5
                  flex
                  items-end
                  justify-between
                  gap-3
                "
              >

                {/* SELLER */}
                <div>

                  <p
                    className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Uploaded by
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-semibold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    👤 {note.seller}
                  </p>

                </div>


                {/* PRICE + BUTTON */}
                <div className="text-right">

                  <p className="text-lg font-bold text-green-600">
                    ₹{note.price}
                  </p>

                  <button
                    type="button"
                    className="
                      mt-1
                      rounded-lg
                      bg-blue-600
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-blue-700
                      hover:shadow-md
                      active:scale-95
                    "
                  >
                    Get Notes
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          /* ================= NO RESULTS ================= */
          <div
            className="
              flex
              min-h-[250px]
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div className="text-4xl mb-3">
              📚
            </div>

            <h3 className="font-semibold text-slate-700 dark:text-white">
              No notes found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try searching another subject or unit.
            </p>

          </div>

        )}

      </div>


      {/* ================= FOOTER ================= */}
      <div
        className="
          mt-4
          pt-3
          border-t
          border-slate-200
          dark:border-slate-700
          shrink-0
        "
      >

        <p className="text-xs text-slate-500 dark:text-slate-400">
          💡 Find notes uploaded by other students and get the material you
          need.
        </p>

      </div>

    </div>
  );
};

export default FindNotes;