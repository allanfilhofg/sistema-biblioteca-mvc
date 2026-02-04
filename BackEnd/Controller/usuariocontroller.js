const usuarioDao = require('../Dao/usuariodao');

module.exports = {
    listar: async (req, res) => {
        try {
            const usuarios = await usuarioDao.findAll();
            res.json({ success: true, data: usuarios });
        } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    },

    criar: async (req, res) => {
        try {
            const u = req.body;
            if(!u.matricula || !u.nome || !u.cpf) return res.status(400).json({ success: false, message: "Dados faltando" });
            
            u.tipo = u.tipo || 'USUARIO';
            u.status_academico = u.status_academico || 'GRADUANDO';

            await usuarioDao.create(u);
            res.status(201).json({ success: true, message: "Usuário criado!" });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message }); 
        }
    },

    
   buscarPorMatricula: async (req, res) => {
        try {
            const { matricula } = req.params;
            
            if (!matricula) {
                 return res.status(400).json({ success: false, message: "Matrícula não fornecida." });
            }

            const user = await usuarioDao.findByMatricula(matricula);
            
            if (user) {
                // CORREÇÃO: Clona o objeto para remover a senha com segurança
                const userData = { ...user }; 
                delete userData.senha; 
                res.json({ success: true, data: userData });
            } else {
                res.status(404).json({ success: false, message: "Aluno não encontrado" });
            }
        } catch (e) {
            console.error("ERRO na busca por matrícula:", e);
            res.status(500).json({ success: false, message: "Erro ao buscar detalhes do aluno." });
        }
    }
};