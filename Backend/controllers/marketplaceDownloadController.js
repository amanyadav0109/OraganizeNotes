import db from "../config/db.js";
import { getStorage } from "firebase-admin/storage";

export const downloadMarketplaceNote = (req, res) => {
  const userId = req.userId;
  const noteId = Number(req.params.noteId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!noteId) {
    return res.status(400).json({
      success: false,
      message: "Invalid note ID",
    });
  }

  // 1. Check whether user purchased this note
  const purchaseSql = `
    SELECT id
    FROM marketplace_purchases
    WHERE user_id = ?
      AND note_id = ?
      AND status = 'paid'
    LIMIT 1
  `;

  db.query(
    purchaseSql,
    [userId, noteId],
    async (purchaseError, purchaseResults) => {
      if (purchaseError) {
        console.error(
          "PURCHASE CHECK ERROR:",
          purchaseError
        );

        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      // User has not purchased the note
      if (purchaseResults.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You have not purchased this note",
        });
      }

      // 2. Get file path
      const noteSql = `
        SELECT
          id,
          title,
          file_name,
          file_path
        FROM marketplace_notes
        WHERE id = ?
        LIMIT 1
      `;

      db.query(
        noteSql,
        [noteId],
        async (noteError, noteResults) => {
          if (noteError) {
            console.error(
              "NOTE FETCH ERROR:",
              noteError
            );

            return res.status(500).json({
              success: false,
              message: "Database error",
            });
          }

          if (noteResults.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Note not found",
            });
          }

          const note = noteResults[0];

          if (!note.file_path) {
            return res.status(404).json({
              success: false,
              message: "Note file not available",
            });
          }

          try {
            // 3. Get Firebase Storage bucket
            const bucket = getStorage().bucket();

            // 4. Get file from Firebase
            const file = bucket.file(note.file_path);

            // Check if file exists
            const [exists] = await file.exists();

            if (!exists) {
              return res.status(404).json({
                success: false,
                message: "PDF file not found in storage",
              });
            }

            // 5. Set download headers
            res.setHeader(
              "Content-Type",
              "application/pdf"
            );

            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${encodeURIComponent(
                note.file_name || "notes.pdf"
              )}"`
            );

            // 6. Stream PDF to browser
            file.createReadStream()
              .on("error", (error) => {
                console.error(
                  "FIREBASE DOWNLOAD ERROR:",
                  error
                );

                if (!res.headersSent) {
                  res.status(500).json({
                    success: false,
                    message: "Failed to download file",
                  });
                }
              })
              .pipe(res);

          } catch (error) {
            console.error(
              "DOWNLOAD ERROR:",
              error
            );

            return res.status(500).json({
              success: false,
              message: "Failed to download note",
            });
          }
        }
      );
    }
  );
};