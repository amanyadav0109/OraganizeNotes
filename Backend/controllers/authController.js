import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminAuth } from "../config/firebaseAdmin.js";

// REGISTER

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }

        const checkSql = "SELECT * FROM users WHERE email=?";

        db.query(checkSql, [email], async (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Database Error"
                });

            }

            if (result.length > 0) {

                return res.status(400).json({
                    message: "User already exists"
                });

            }

            const hashPassword = await bcrypt.hash(password, 10);

            const insertSql = `
            INSERT INTO users(name,email,password)
            VALUES(?,?,?)
            `;

            db.query(insertSql, [name, email, hashPassword], (err) => {

                if (err) {

                    return res.status(500).json({
                        message: "Database Error"
                    });

                }

                return res.status(201).json({
                    message: "Register Success"
                });

            });

        });

    } catch (err) {

        res.status(500).json(err);

    }

};

// LOGIN

export const login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql, [email], async (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Credentials"
            });

        }

        const token = jwt.sign(

            {
                id: user.id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            message: "Login Success",

            token,

            user: {

                id: user.id,

                name: user.name,

                email: user.email

            }

        });

    });

};

// CURRENT USER

export const currentUser = (req, res) => {

    const sql = "SELECT id,name,email FROM users WHERE id=?";

    db.query(sql, [req.userId], (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database Error"
            });

        }

        res.status(200).json(result[0]);

    });

};

// LOGOUT

export const logout = (req, res) => {

    res.status(200).json({
        message: "Logout Success"
    });

};



export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "ID Token Required",
      });
    }

    
   
const decoded = await adminAuth.verifyIdToken(idToken);

    const email = decodedToken.email;
    const name = decodedToken.name;

    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            message: "Database Error",
          });
        }

    
        if (results.length > 0) {
          const token = jwt.sign(
            { id: results[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );

          return res.json({
            token,
            user: results[0],
          });
        }

      
        db.query(
          "INSERT INTO users(name,email) VALUES(?,?)",
          [name, email],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                message: "Database Error",
              });
            }

            const token = jwt.sign(
              { id: result.insertId },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );

            res.json({
              token,
              user: {
                id: result.insertId,
                name,
                email,
              },
            });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Invalid Google Token",
    });
  }
};
