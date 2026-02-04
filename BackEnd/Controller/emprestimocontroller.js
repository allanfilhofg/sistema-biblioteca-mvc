const emprestimoDao = require('../Dao/emprestimodao');
const livroDao = require('../Dao/livrodao');
const pool = require('../Config/database');

module.exports = {
    listar: async (req, res) => {
        try {
            const lista = await emprestimoDao.findAll();
            res.json({ success: true, data: lista });
        } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    },
    
    criar: async (req, res) => {
        try {
            const { matricula_usuario, codigo_livro, data_retirada } = req.body;
            // Validação e lógica de empréstimo...
            const livro = await livroDao.findByCodigo(codigo_livro);
            if (!livro || livro.status_livro !== 'DISPONIVEL') {
                return res.status(400).json({ success: false, message: "Livro indisponível." });
            }
            const retirada = new Date(data_retirada);
            const prevista = new Date(retirada);
            prevista.setDate(prevista.getDate() + 7);

            const novoCodigo = await emprestimoDao.create({ matricula_usuario, codigo_livro, data_retirada, data_prevista_devolucao: prevista });
            await livroDao.updateStatus(codigo_livro, 'EMPRESTADO');

            res.status(201).json({ success: true, message: "Empréstimo realizado!", codigo: novoCodigo });
        } catch (e) { res.status(500).json({ success: false, message: "Erro ao realizar empréstimo." }); }
    },
    
    // FUNÇÃO QUE DEVOLVE O LIVRO (PUT /devolver)
    devolver: async (req, res) => {
        try {
            const { codigo_emprestimo } = req.params;
            const data_devolucao = req.body.data_devolucao || new Date().toISOString().split('T')[0];
            const emprestimo = await emprestimoDao.findByCodigo(codigo_emprestimo);
            
            // Cálculo de Multa
            const prevista = new Date(emprestimo.data_prevista_devolucao);
            const real = new Date(data_devolucao);
            let multa = 0.0;
            if (real > prevista) {
                const diffTime = Math.abs(real - prevista);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                multa = diffDays * 2.00;
            }
            
            await emprestimoDao.registrarDevolucao(codigo_emprestimo, data_devolucao, multa);
            await livroDao.updateStatus(emprestimo.codigo_livro, 'DISPONIVEL');
            
            res.json({ success: true, message: `Devolvido! Multa: R$ ${multa.toFixed(2)}` });
        } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    },

    // FUNÇÃO QUE REGISTRA PAGAMENTO (PUT /pagar)
    pagar: async (req, res) => {
        try {
            const { codigo_emprestimo } = req.params;
            await emprestimoDao.pagarMulta(codigo_emprestimo);
            res.json({ success: true, message: "Multa paga com sucesso!" });
        } catch (e) {
            res.status(500).json({ success: false, message: "Erro ao pagar multa." });
        }
    },
    
    // FUNÇÃO RESUMO PARA O DASHBOARD
    resumo: async (req, res) => {
        try {
            const [[totalLivros]] = await pool.execute('SELECT COUNT(*) as total FROM Livro');
            const [[livrosEmprestados]] = await pool.execute('SELECT COUNT(*) as total FROM Livro WHERE status_livro = "EMPRESTADO"');
            
            const [multasPendentesRow] = await pool.execute(`
                 SELECT SUM(multa) as total 
                 FROM Emprestimo 
                 WHERE data_devolucao IS NOT NULL AND pago = FALSE AND multa > 0
            `);
            
            const [[usuariosAtivos]] = await pool.execute('SELECT COUNT(*) as total FROM Usuario WHERE tipo = "USUARIO"');
            
            res.json({
                success: true,
                data: {
                    totalLivros: totalLivros.total,
                    livrosEmprestados: livrosEmprestados.total,
                    multasPendentes: (multasPendentesRow[0].total || 0).toFixed(2),
                    usuariosAtivos: usuariosAtivos.total
                }
            });
        } catch (e) {
            console.error("ERRO NO RESUMO DO DASHBOARD:", e);
            res.status(500).json({ success: false, message: "Erro ao carregar métricas do dashboard." });
        }
    }
};