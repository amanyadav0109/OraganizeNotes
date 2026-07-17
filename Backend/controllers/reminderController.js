import db from "../config/db.js";

export const getUpcomingReminders = (req, res) => {

    const sql = `
        SELECT
            id,
            title,
            dueDate,
            isCompleted,
            lastReminderAt
        FROM notes
        WHERE
            userId = ?
            AND dueDate IS NOT NULL
        ORDER BY dueDate ASC
    `;

    db.query(sql, [req.user.id], (err, results) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(results);

    });

};