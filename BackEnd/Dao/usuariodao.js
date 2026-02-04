const pool = require('../Config/database');

class UsuarioDao {
    
    // Usado pelo AuthController (Login)
    async findByLogin(login) {
        const sql = `SELECT * FROM Usuario WHERE email = ? OR matricula = ?`;
        const [rows] = await pool.execute(sql, [login, login]);
        return rows[0];
    }
    
    // FUNÇÃO QUE ESTAVA FALTANDO NA EXPORTAÇÃO E NO CÓDIGO
    // Usado pelo AdminController (Detalhes do Aluno)
    async findByMatricula(matricula) {
        const sql = `SELECT * FROM Usuario WHERE matricula = ?`;
        const [rows] = await pool.execute(sql, [matricula]);
        return rows[0];
    }

    // Listar Todos
    async findAll() {
        const [rows] = await pool.execute('SELECT matricula, nome, email, telefone, status_academico, tipo FROM Usuario ORDER BY nome');
        return rows;
    }

    // Criar Usuário
    async create(u) {
        const sql = `
            INSERT INTO Usuario (matricula, nome, cpf, endereco, email, senha, telefone, status_academico, tipo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const tipo = u.tipo || 'USUARIO';
        const status = u.status_academico || 'GRADUANDO';

        await pool.execute(sql, [
            u.matricula, u.nome, u.cpf, u.endereco, u.email, u.senha, u.telefone, status, tipo
        ]);
    }

    async delete(matricula) {
        await pool.execute('DELETE FROM Usuario WHERE matricula = ?', [matricula]);
    }
}

module.exports = new UsuarioDao();