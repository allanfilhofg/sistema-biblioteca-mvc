const pool = require('../Config/database');

class LivroDAO {
    async create(livro) {
        const sql = `INSERT INTO Livro (codigo_livro, titulo, autor, ano_publicacao, categoria, isbn, status_livro) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.execute(sql, [
            livro.codigo_livro, livro.titulo, livro.autor, livro.ano_publicacao, livro.categoria, livro.isbn, 'DISPONIVEL'
        ]);
    }

    async findAll() {
        const [rows] = await pool.execute('SELECT * FROM Livro');
        return rows;
    }

    async findByCodigo(codigo) {
        const [rows] = await pool.execute('SELECT * FROM Livro WHERE codigo_livro = ?', [codigo]);
        return rows[0];
    }
    
    // Atualiza status (usado no empréstimo)
    async updateStatus(codigo, novoStatus) {
        await pool.execute('UPDATE Livro SET status_livro = ? WHERE codigo_livro = ?', [novoStatus, codigo]);
    }
}

module.exports = new LivroDAO();