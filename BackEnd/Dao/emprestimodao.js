const pool = require('../Config/database');

class EmprestimoDao {
    
    async gerarProximoCodigo() {
        try {
            const sql = "SELECT MAX(CAST(SUBSTRING(codigo_emprestimo, 2) AS UNSIGNED)) as max_num FROM Emprestimo";
            const [rows] = await pool.execute(sql);
            const proximo = (rows[0].max_num || 0) + 1;
            return "E" + String(proximo).padStart(3, '0');
        } catch (error) {
            console.error("Erro ao gerar código:", error);
            return "E001";
        }
    }

    async create(e) {
        const codigo = await this.gerarProximoCodigo();
        // Adicionamos 'false' para o campo pago
        const sql = `INSERT INTO Emprestimo (codigo_emprestimo, matricula_usuario, codigo_livro, data_retirada, data_prevista_devolucao, multa, pago) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.execute(sql, [codigo, e.matricula_usuario, e.codigo_livro, e.data_retirada, e.data_prevista_devolucao, 0.00, false]);
        return codigo;
    }

    async findAll() {
        const [rows] = await pool.execute('SELECT * FROM ViewMultas');
        return rows;
    }

    async registrarDevolucao(codigo, dataDevolucao, multa) {
        const sql = `UPDATE Emprestimo SET data_devolucao = ?, multa = ? WHERE codigo_emprestimo = ?`;
        await pool.execute(sql, [dataDevolucao, multa, codigo]);
    }
    
    async findByCodigo(codigo) {
        const [rows] = await pool.execute('SELECT * FROM Emprestimo WHERE codigo_emprestimo = ?', [codigo]);
        return rows[0];
    }

    // NOVO: Pagar Multa
    async pagarMulta(codigo) {
        await pool.execute('UPDATE Emprestimo SET pago = TRUE WHERE codigo_emprestimo = ?', [codigo]);
    }
}

module.exports = new EmprestimoDao();