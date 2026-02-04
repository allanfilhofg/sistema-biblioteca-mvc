const pool = require('../Config/database');

class AdministradorDao {
    
    // Lista APENAS os administradores
    async findAllAdmins() {
        const sql = `SELECT * FROM Usuario WHERE tipo = 'ADMIN' ORDER BY nome`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    // Cria um novo administrador (Força o tipo ADMIN)
    async createAdmin(admin) {
        const sql = `
            INSERT INTO Usuario (matricula, nome, cpf, endereco, email, senha, telefone, status_academico, tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ADMIN')
        `;
        await pool.execute(sql, [
            admin.matricula, admin.nome, admin.cpf, admin.endereco, 
            admin.email, admin.senha, admin.telefone, 'POS-GRADUADO' // Admins geralmente são formados, ou receba do front
        ]);
    }

    // Autenticação específica de Admin (como no seu Java)
    async autenticarAdmin(matricula, senha) {
        const sql = `SELECT * FROM Usuario WHERE matricula = ? AND senha = ? AND tipo = 'ADMIN'`;
        const [rows] = await pool.execute(sql, [matricula, senha]);
        return rows[0]; // Retorna o admin se achou, ou undefined
    }
}

module.exports = new AdministradorDao();