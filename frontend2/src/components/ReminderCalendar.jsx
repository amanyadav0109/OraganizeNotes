
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

import "react-day-picker/dist/style.css";
import { getReminders } from "../services/reminderService";

function ReminderCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);

      const data = await getReminders();
      const reminders = data.filter((note) => note.dueDate);

      setNotes(reminders);
      filterNotes(new Date(), reminders);
    } catch (err) {
      console.log("Reminder loading error:", err);
    } finally {
      setLoading(false);
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

  const reminderDays = notes.map(
    (note) => new Date(note.dueDate)
  );

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Calendar Section */}
      <div className="w-full min-w-0">

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-slate-800">
              <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
                Calendar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a date to view tasks
              </p>
            </div>
          </div>

          <div className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {reminderDays.length} Reminders
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 sm:p-3">

          <div className="calendar-wrapper w-full overflow-x-auto">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              modifiers={{
                reminder: reminderDays,
              }}
              modifiersClassNames={{
                reminder: "reminder-day",
              }}
              className="w-full text-slate-800 dark:text-white"
            />
          </div>

        </div>
      </div>

      {/* Selected Date Tasks */}
      <div className="w-full min-w-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">

        {/* Fixed Header */}
        <div className="flex items-center justify-between gap-3 mb-4">

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-500 shrink-0" />

              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                Selected Date Tasks
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 ml-7">
              {format(selectedDate, "EEEE, PPP")}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5">
            {selectedNotes.length} Tasks
          </span>

        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mb-3" />

        {/* Scrollable Task List - Fixed Height */}
        <div
          className="
            h-[260px]
            w-full
            overflow-y-auto
            overflow-x-hidden
            pr-2
            space-y-3
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-slate-100
            dark:[&::-webkit-scrollbar-track]:bg-slate-800
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-slate-300
            dark:[&::-webkit-scrollbar-thumb]:bg-slate-600
            hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
          "
        >

          {loading ? (

            <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading reminders...</p>
            </div>

          ) : selectedNotes.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4">

              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-blue-500" />
              </div>

              <h4 className="font-semibold text-slate-700 dark:text-white">
                All clear!
              </h4>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                No reminders scheduled for this date.
              </p>

            </div>

          ) : (

            selectedNotes.map((note) => (

              <div
                key={note.id}
                className="
                  group
                  w-full
                  p-3 sm:p-4
                  rounded-xl
                  border border-slate-200
                  dark:border-slate-700
                  bg-slate-50
                  dark:bg-slate-800
                  hover:border-blue-300
                  dark:hover:border-slate-500
                  transition-all duration-200
                "
              >

                <div className="flex items-start gap-3">

                  <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-100 dark:bg-slate-700 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <h4 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white break-words">
                      {note.title || "Untitled Reminder"}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock3 className="w-3.5 h-3.5 shrink-0" />

                      <span>
                        {format(new Date(note.dueDate), "PPP · p")}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

        {/* Footer */}
        {!loading && selectedNotes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Scroll to view all {selectedNotes.length} reminders
            </p>
          </div>
        )}

      </div>

      {/* Calendar Styling */}
      <style>{`
        .calendar-wrapper .rdp-root {
          width: 100%;
          --rdp-accent-color: #2563eb;
          --rdp-accent-background-color: #dbeafe;
          margin: 0;
        }

        .calendar-wrapper .rdp-months {
          width: 100%;
          justify-content: center;
        }

        .calendar-wrapper .rdp-month {
          width: 100%;
        }

        .calendar-wrapper .rdp-month_grid {
          width: 100%;
        }

        .calendar-wrapper .rdp-weekdays,
        .calendar-wrapper .rdp-week {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
        }

        .calendar-wrapper .rdp-day,
        .calendar-wrapper .rdp-weekday {
          text-align: center;
        }

        .calendar-wrapper .rdp-day_button {
          width: 34px;
          height: 34px;
          margin: auto;
          border-radius: 50%;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .calendar-wrapper .rdp-day_button:hover {
          background-color: #dbeafe;
          color: #2563eb;
        }

        .dark .calendar-wrapper .rdp-day_button:hover {
          background-color: #334155;
          color: white;
        }

        .calendar-wrapper .reminder-day .rdp-day_button {
          background-color: #ef4444;
          color: white;
          border-radius: 50%;
        }

        .calendar-wrapper .rdp-selected .rdp-day_button {
          border: 2px solid #2563eb;
          font-weight: 700;
        }

        .calendar-wrapper .rdp-nav button {
          color: inherit;
        }

        .dark .calendar-wrapper .rdp-root {
          color: white;
        }

        .dark .calendar-wrapper .rdp-chevron {
          fill: white;
        }

        @media (max-width: 480px) {
          .calendar-wrapper .rdp-day_button {
            width: 30px;
            height: 30px;
            font-size: 12px;
          }

          .calendar-wrapper .rdp-caption_label {
            font-size: 14px;
          }
        }
      `}</style>

    </div>
  );
}

export default ReminderCalendar;
