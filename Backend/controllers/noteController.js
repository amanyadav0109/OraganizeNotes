import db from "../config/db.js";


import { bucket } from "../config/firebaseAdmin.js";
import crypto from "crypto";

export const createNote = async (req, res) => {
    try {
        const {
            title,
            content,
            dueDate,
            subjectId
        } = req.body;

        const pdfFile = req.file;

        // At least content OR PDF required
        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!content?.trim() && !pdfFile) {
            return res.status(400).json({
                message: "Please write content or attach a PDF"
            });
        }

        let filePath = null;
        let fileName = null;

        // Upload PDF to Firebase Storage
        if (pdfFile) {
            fileName = pdfFile.originalname;

            const storageFileName = `${crypto.randomUUID()}.pdf`;

            filePath = `notes/${storageFileName}`;

            const file = bucket.file(filePath);

            await file.save(pdfFile.buffer, {
                metadata: {
                    contentType: "application/pdf"
                }
            });
        }

        const sql = `
            INSERT INTO notes
            (
                title,
                content,
                userId,
                dueDate,
                subjectId,
                filePath,
                fileName
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const mysqlDate = dueDate || null;

        db.query(
            sql,
            [
                title,
                content?.trim() || null,
                req.userId,
                mysqlDate,
                subjectId || null,
                filePath,
                fileName
            ],
            (err, result) => {
                if (err) {
                    console.error("CREATE NOTE DB ERROR:", err);

                    return res.status(500).json({
                        message: "Database Error"
                    });
                }

                return res.status(201).json({
                    message: "Note Created Successfully",
                    noteId: result.insertId,
                    filePath,
                    fileName
                });
            }
        );

    } catch (error) {
        console.error("CREATE NOTE ERROR:", error);

        return res.status(500).json({
            message: "Failed to create note"
        });
    }
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

    console.log("UPDATE NOTE DATA:", {
        id,
        title,
        content,
        dueDate,
        userId: req.userId
    });

    const sql = `
        UPDATE notes
        SET title=?, content=?, dueDate=?
        WHERE id=? AND userId=?
    `;

    db.query(
        sql,
        [
            title,
            content,
            dueDate || null,
            id,
            req.userId
        ],
        (err, result) => {

            if (err) {
                console.error("UPDATE NOTE DB ERROR:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Note Not Found"
                });
            }

            return res.status(200).json({
                success: true,
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
export const getNotePdf = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT filePath, fileName
        FROM notes
        WHERE id = ? AND userId = ?
    `;

    db.query(sql, [id, req.userId], async (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Note Not Found"
            });
        }

        const note = result[0];

        if (!note.filePath) {
            return res.status(404).json({
                message: "PDF not attached"
            });
        }

        try {
            const file = bucket.file(note.filePath);

            const [exists] = await file.exists();

            if (!exists) {
                return res.status(404).json({
                    message: "PDF file not found"
                });
            }

            const [buffer] = await file.download();

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${note.fileName || "note.pdf"}"`
            );

            res.send(buffer);

        } catch (error) {

            console.error("PDF DOWNLOAD ERROR:", error);

            return res.status(500).json({
                message: "Failed to load PDF"
            });
        }
    });
};