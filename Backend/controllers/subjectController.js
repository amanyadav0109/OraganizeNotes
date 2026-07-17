import db from "../config/db.js";

// Create Subject
export const createSubject = (req, res) => {

    const { subjectName } = req.body;

    if (!subjectName) {
        return res.status(400).json({
            message: "Subject Name is required"
        });
    }

    const sql = `
        INSERT INTO subjects (subjectName, userId)
        VALUES (?, ?)
    `;

    db.query(sql, [subjectName, req.userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        return res.status(201).json({
            message: "Subject Created Successfully"
        });

    });

};


// Get All Subjects
export const getAllSubjects = (req, res) => {

    const sql = `
  SELECT
subjects.id,
subjects.subjectName,
COUNT(notes.id) AS totalNotes
FROM subjects
LEFT JOIN notes
ON notes.subjectId = subjects.id
WHERE subjects.userId = ?
GROUP BY subjects.id
ORDER BY subjects.createdAt DESC;
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


// Update Subject
export const updateSubject = (req, res) => {

    const { id } = req.params;
    const { subjectName } = req.body;

    const sql = `
        UPDATE subjects
        SET subjectName=?
        WHERE id=? AND userId=?
    `;

    db.query(sql, [subjectName, id, req.userId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Subject Not Found"
            });
        }

        return res.status(200).json({
            message: "Subject Updated Successfully"
        });

    });

};


// Delete Subject
export const deleteSubject = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM subjects
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
                message: "Subject Not Found"
            });
        }

        return res.status(200).json({
            message: "Subject Deleted Successfully"
        });

    });

};
export const searchSubjects = (req, res) => {

    const { query } = req.query;

    const sql = `
    SELECT
        subjects.id,
        subjects.subjectName,
        COUNT(notes.id) AS totalNotes
    FROM subjects
    LEFT JOIN notes
        ON notes.subjectId = subjects.id
    WHERE
        subjects.userId = ?
        AND subjects.subjectName LIKE ?
    GROUP BY subjects.id
    ORDER BY subjects.subjectName ASC
    `;

    db.query(
        sql,
        [
            req.userId,
            `%${query}%`
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