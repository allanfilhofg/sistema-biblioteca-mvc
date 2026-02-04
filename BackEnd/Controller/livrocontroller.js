const livroDao = require('../Dao/livrodao');

module.exports = {
    listar: async (req, res) => {
        try {
            const livros = await livroDao.findAll();
            res.json({ success: true, data: livros });
        } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    },

    criar: async (req, res) => {
        try {
            const l = req.body;
            if(!l.codigo_livro || !l.titulo) {
                return res.status(400).json({ success: false, message: "Código e Título são obrigatórios" });
            }
            await livroDao.create(l);
            res.status(201).json({ success: true, message: "Livro cadastrado!" });
        } catch (e) { 
            if(e.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: "Código ou ISBN já existe." });
            res.status(500).json({ success: false, message: e.message }); 
        }
    },

    // NOVA FUNÇÃO: Atualizar Status Manualmente
    atualizarStatus: async (req, res) => {
        try {
            const { codigo_livro } = req.params;
            const { status } = req.body; // Espera: { "status": "DISPONIVEL" }

            // Validação simples
            const statusValidos = ['DISPONIVEL', 'EMPRESTADO', 'CONSULTA_LOCAL', 'PERDIDO'];
            if (!statusValidos.includes(status)) {
                return res.status(400).json({ success: false, message: "Status inválido." });
            }

            await livroDao.updateStatus(codigo_livro, status);
            res.json({ success: true, message: "Status atualizado com sucesso!" });

        } catch (e) {
            res.status(500).json({ success: false, message: "Erro ao atualizar status." });
        }
    }
};