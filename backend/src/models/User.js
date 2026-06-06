const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root_password',
    database: process.env.DB_NAME || 'infraestructura_db',
    waitForConnections: true,
    connectionLimit: 10
});

async function initDB() {
    const conn = await pool.getConnection();
    await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            active TINYINT(1) DEFAULT 1
        )
    `);
    conn.release();
}
initDB().catch(err => console.error("Error inicializando DB:", err));

class User {
    static async create({ name, email, password }) {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return { id: result.insertId, name, email };
    }

    static async getAllActive() {
        const [rows] = await pool.query('SELECT id, name, email FROM users WHERE active = 1');
        return rows;
    }

    static async update(id, { name, email }) {
        await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return { id, name, email };
    }

    static async softDelete(id) {
        await pool.query('UPDATE users SET active = 0 WHERE id = ?', [id]);
        return { id, message: "Usuario eliminado lógicamente" };
    }

    static async login(email, password) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ? AND active = 1', [email, password]);
        return rows[0] || null;
    }
}

module.exports = User;
