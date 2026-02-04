const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345678', // Sua senha direta aqui para garantir
    database: process.env.DB_NAME || 'Biblioteca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log("📚 Conectado ao MySQL (Biblioteca)!");
        conn.release();
    })
    .catch(err => console.error("❌ Erro de conexão:", err));

module.exports = pool;