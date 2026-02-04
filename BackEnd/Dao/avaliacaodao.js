const pool = require('../Config/database');

class AvaliacaoDao {
    
    // Salva a nova avaliação do aluno no banco
    async create(avaliacao) {
        const sql = `
            INSERT INTO Avaliacao (codigo_livro, matricula_usuario, nota, comentario) 
            VALUES (?, ?, ?, ?)
        `;
        await pool.execute(sql, [
            avaliacao.codigo_livro,
            avaliacao.matricula_usuario,
            avaliacao.nota,
            avaliacao.comentario
        ]);
    }

    // Lista todas as avaliações para um livro específico (para o Admin ver)
    async findByLivro(codigoLivro) {
        // Junta com a tabela Usuario para trazer o nome de quem avaliou
        const sql = `
            SELECT a.*, u.nome as nome_usuario 
            FROM Avaliacao a 
            JOIN Usuario u ON a.matricula_usuario = u.matricula 
            WHERE a.codigo_livro = ? 
            ORDER BY a.data_avaliacao DESC
        `;
        const [rows] = await pool.execute(sql, [codigoLivro]);
        return rows;
    }
}

module.exports = new AvaliacaoDao();