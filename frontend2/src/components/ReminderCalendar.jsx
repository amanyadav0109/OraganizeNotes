import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

import { getReminders } from "../services/reminderService";

function ReminderCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await getReminders();

      const reminders = data.filter((note) => note.dueDate);

      setNotes(reminders);

      filterNotes(new Date(), reminders);
    } catch (err) {
      console.log(err);
    }
  };

  const filterNotes = (date, reminderList = notes) => {
    const filtered = reminderList.filter(
      (note) =>
        new Date(note.dueDate).toDateString() === date.toDateString()
    );

    setSelectedNotes(filtered);
  };

  const handleSelect = (date) => {
    if (!date) return;

    setSelectedDate(date);

    filterNotes(date);
  };

  const reminderDays = notes.map((note) => new Date(note.dueDate));

  return (
    <div className="w-full overflow-hidden">

  

      <div className="overflow-x-auto">

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          modifiers={{
            reminder: reminderDays,
          }}
          modifiersClassNames={{
            reminder: "bg-red-500 text-white rounded-full",
          }}
          className="
            w-full
            rounded-2xl
            bg-white
            dark:bg-slate-900
            text-gray-900
            dark:text-white
            p-2
            sm:p-4
            text-sm
          "
        />

      </div>

      

      <div className="mt-6">

        <h3 className="text-lg sm:text-xl font-bold dark:text-white">
          Reminders
        </h3>

        {selectedNotes.length === 0 ? (

          <div className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No reminders on {format(selectedDate, "PPP")}
          </div>

        ) : (

          <div className="space-y-3 mt-5">

            {selectedNotes.map((note) => (

              <div
                key={note.id}
                className="
                  p-3
                  sm:p-4
                  rounded-xl
                  border
                  dark:border-slate-700
                  bg-gray-50
                  dark:bg-slate-800
                "
              >

                <h4 className="font-bold text-sm sm:text-base dark:text-white break-words">
                  {note.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">
                  {format(new Date(note.dueDate), "PPP p")}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ReminderCalendar;