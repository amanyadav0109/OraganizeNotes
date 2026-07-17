import db from "../config/db.js";

export const createNote = (req, res) => {
   

    const { title, content, dueDate, subjectId } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and Content are required"
        });
    }

    const sql = `
        INSERT INTO notes(title, content, userId, dueDate, subjectId)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Save exactly the time received from frontend
    const mysqlDate = dueDate || null;

    

    db.query(
        sql,
        [title, content, req.userId, mysqlDate, subjectId],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            return res.status(201).json({
                message: "Note Created Successfully",
                noteId: result.insertId
            });
        }
    );
};
export const getNotesBySubject = (req, res) => {

    const { subjectId } = req.params;

    const sql = `
        SELECT *
        FROM notes
        WHERE subjectId=? AND userId=?
        ORDER BY isPinned DESC, createdAt DESC
    `;

    db.query(sql, [subjectId, req.userId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        console.log("Notes Found:", result);

        return res.status(200).json(result);

    });

};
export const getSingleNote = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM notes
        WHERE id=? AND userId=?
    `;

    db.query(sql, [id, req.userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Note Not Found"
            });
        }

        return res.status(200).json(result[0]);

    });

};
export const updateNote = (req, res) => {

    const { id } = req.params;

    const { title, content, dueDate } = req.body;

    const sql = `
        UPDATE notes
        SET
        title=?,
        content=?,
        dueDate=?
        WHERE id=? AND userId=?
    `;

    db.query(
        sql,
        [title, content, dueDate || null, id, req.userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Note Not Found"
                });
            }

            return res.status(200).json({
                message: "Note Updated Successfully"
            });

        }
    );

};
export const deleteNote = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE
        FROM notes
        WHERE id=? AND userId=?
    `;

    db.query(sql, [id, req.userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Note Not Found"
            });
        }

        return res.status(200).json({
            message: "Note Deleted Successfully"
        });

    });

};
export const pinNote = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE notes
        SET isPinned = NOT isPinned
        WHERE id=? AND userId=?
    `;

    db.query(sql, [id, req.userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Note Not Found"
            });
        }

        return res.status(200).json({
            message: "Pin Status Updated"
        });

    });

};
export const searchNotes = (req, res) => {
    const { query } = req.query;

    const searchValue = `%${query}%`;

    const sql = `
        SELECT
            notes.*,
            subjects.subjectName
        FROM notes
        INNER JOIN subjects
            ON notes.subjectId = subjects.id
        WHERE notes.userId = ?
        AND (
            notes.title LIKE ?
            OR notes.content LIKE ?
            OR subjects.subjectName LIKE ?
        )
        ORDER BY
            notes.isPinned DESC,
            notes.createdAt DESC
    `;

    db.query(
        sql,
        [
            req.userId,
            searchValue,
            searchValue,
            searchValue
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.json(result);
        }
    );
};
export const getMyNotes = (req, res) => {

    const sql = `
        SELECT
notes.*,
subjects.subjectName
FROM notes
LEFT JOIN subjects
ON notes.subjectId = subjects.id
WHERE notes.userId = ?
AND notes.isPinned=0
ORDER BY notes.createdAt DESC;
    `;

    db.query(sql, [req.userId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });

        }

        return res.status(200).json(result);

    });

};
export const getPinnedNotes = (req, res) => {

    const sql = `
        SELECT
    notes.*,
    subjects.subjectName
FROM notes
LEFT JOIN subjects
ON notes.subjectId = subjects.id
WHERE notes.userId=? AND notes.isPinned=1
ORDER BY notes.createdAt DESC
    `;

    db.query(sql, [req.userId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        return res.status(200).json(result);

    });

};

export const completeTask = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE notes
        SET
            isCompleted = 1,
            lastReminderAt = NOW()
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json({
            message: "Task Completed Successfully"
        });

    });

};