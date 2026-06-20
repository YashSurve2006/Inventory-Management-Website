import pool from "./db.js";

const test = async() => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");
        console.log("DB OK:", rows);
    } catch (err) {
        console.log("DB ERROR:", err);
    }
};

test();