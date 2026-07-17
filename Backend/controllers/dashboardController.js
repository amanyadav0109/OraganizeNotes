import db from "../config/db.js";

export const getDashboardStats = (req, res) => {

    const userId = req.userId;

    const subjectSql = `
        SELECT COUNT(*) AS totalSubjects
        FROM subjects
        WHERE userId = ?
    `;

    const noteSql = `
        SELECT COUNT(*) AS totalNotes
        FROM notes
        WHERE userId = ?
    `;

    const pinnedSql = `
        SELECT COUNT(*) AS totalPinned
        FROM notes
        WHERE userId = ? AND isPinned = 1
    `;

    const dueTodaySql = `
        SELECT COUNT(*) AS dueToday
        FROM notes
        WHERE userId = ?
        AND DATE(dueDate)=CURDATE()
    `;

    db.query(subjectSql,[userId],(err,subjects)=>{

        if(err){
            return res.status(500).json({message:"Database Error"});
        }

        db.query(noteSql,[userId],(err,notes)=>{

            if(err){
                return res.status(500).json({message:"Database Error"});
            }

            db.query(pinnedSql,[userId],(err,pinned)=>{

                if(err){
                    return res.status(500).json({message:"Database Error"});
                }

                db.query(dueTodaySql,[userId],(err,due)=>{

                    if(err){
                        return res.status(500).json({message:"Database Error"});
                    }

                    return res.json({

                        totalSubjects: subjects[0].totalSubjects,

                        totalNotes: notes[0].totalNotes,

                        totalPinned: pinned[0].totalPinned,

                        dueToday: due[0].dueToday

                    });

                });

            });

        });

    });

};