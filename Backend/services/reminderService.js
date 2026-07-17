import db from "../config/db.js";
import { transporter } from "../config/mail.js";

export const checkReminders = () => {
  console.log("Checking reminders...");

  const sql = `
SELECT
    notes.id,
    notes.title,
    notes.dueDate,
    notes.lastReminderAt,
    users.email
FROM notes
JOIN users
ON notes.userId = users.id
WHERE
    notes.isCompleted = 0
    AND notes.dueDate IS NOT NULL
   AND notes.dueDate <= DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE)
    AND (
     notes.lastReminderAt IS NULL
        OR notes.lastReminderAt <= DATE_SUB(
    DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE),
    INTERVAL 1 HOUR
)
    )
`;

  db.query(sql, async (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
      return;
    }

    for (const note of results) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,

          to: note.email,

          subject: "📚 StudyHub Reminder",

          html: `
                        <h2>Reminder</h2>

                        <p>Your note</p>

                        <h3>${note.title}</h3>

                        <p>is due at</p>

                        <strong>${new Date(note.dueDate).toLocaleString()}</strong>

                        <br><br>

                        <p>Don't forget to complete it.</p>
                    `,
        });

        db.query(
          "UPDATE notes SET lastReminderAt = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 330 MINUTE) WHERE id=?",
          [note.id],
        );

        console.log("Reminder sent to", note.email);
      } catch (err) {
        console.log(err);
      }
    }
  });
};
