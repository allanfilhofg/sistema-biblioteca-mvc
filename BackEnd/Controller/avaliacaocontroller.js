const avaliacaoDao = require('../Dao/avaliacaodao');

module.exports = {
    // Rota para o Aluno enviar a avaliação (POST)
    criar: async (req, res) => {
        try {
            // Validação básica
            const { codigo_livro, matricula_usuario, nota, comentario } = req.body;
            if (!codigo_livro || !matricula_usuario || !nota) {
                return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
            }

            await avaliacaoDao.create(req.body);
            res.status(201).json({ success: true, message: "Avaliação registrada!" });
        } catch (e) {
            console.error("Erro ao criar avaliação:", e);
            res.status(500).json({ success: false, message: e.message });
        }
    },

    // Rota para o Admin listar todas as avaliações de um livro (GET)
    listarPorLivro: async (req, res) => {
        try {
            const { codigo_livro } = req.params;
            const avaliacoes = await avaliacaoDao.findByLivro(codigo_livro);
            res.json({ success: true, data: avaliacoes });
        } catch (e) {
            console.error("Erro ao listar avaliações:", e);
            res.status(500).json({ success: false, message: e.message });
        }
    }
};