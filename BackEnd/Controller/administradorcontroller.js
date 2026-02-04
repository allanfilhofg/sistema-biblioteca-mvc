const administradorDao = require('../Dao/administradordao');

module.exports = {
    // Listar todos os administradores
    listar: async (req, res) => {
        try {
            const admins = await administradorDao.findAllAdmins();
            res.json({ success: true, data: admins });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erro ao listar administradores." });
        }
    },

    // Criar um novo administrador
    criar: async (req, res) => {
        try {
            // Recebe dados do corpo da requisição
            const { matricula, nome, cpf, email, senha, telefone } = req.body;

            if (!matricula || !nome || !senha) {
                return res.status(400).json({ success: false, message: "Dados incompletos." });
            }

            await administradorDao.createAdmin(req.body);
            res.status(201).json({ success: true, message: "Administrador criado com sucesso!" });

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "Matrícula ou Email já existem." });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Login específico de Admin (Opcional, se quiser separar do AuthController)
    loginAdmin: async (req, res) => {
        try {
            const { matricula, senha } = req.body;
            const admin = await administradorDao.autenticarAdmin(matricula, senha);

            if (admin) {
                res.json({ success: true, message: "Admin autenticado!", user: admin });
            } else {
                res.status(401).json({ success: false, message: "Credenciais inválidas ou usuário não é admin." });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Erro no servidor." });
        }
    }
};