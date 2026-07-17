import db from "../config/db.js";

export const getProfile = (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            profilePic
        FROM users
        WHERE id=?
    `;

    db.query(sql, [req.userId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "User Not Found"
            });

        }

        res.json(result[0]);

    });

};
export const getPublicProfile = (req,res)=>{

    const {id}=req.params;

    const sql="SELECT id,name FROM users WHERE id=?";

    db.query(sql,[id],(err,result)=>{

        if(err){

            return res.status(500).json({
                message:"Database Error"
            });

        }

        if(result.length===0){

            return res.status(404).json({
                message:"User not found"
            });

        }

        res.json(result[0]);

    });

}
export const updateName = (req, res) => {

    const { name } = req.body;

    const sql = "UPDATE users SET name=? WHERE id=?";

    db.query(sql, [name, req.userId], (err) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.json({
            message: "Name Updated Successfully"
        });

    });

};