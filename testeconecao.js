const mysql = require('mysql2/promise');
require('dotenv').config();

async function testar() {
    console.log("⏳ Tentando conectar ao banco de dados...");
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '12345678', // Verifique sua senha no .env
            database: 'Biblioteca'
        });

        console.log("✅ Sucesso! Conexão estabelecida com o MySQL.");
        
        // Teste simples de consulta
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log("📊 Teste de Query (1+1):", rows[0].solution);
        
        await connection.end();
    } catch (error) {
        console.error("❌ Falha na conexão:", error.message);
        console.error("👉 Verifique se o MySQL está rodando e se as credenciais no .env estão corretas.");
    }
}

testar();