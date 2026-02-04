const usuarioDao = require('../Dao/usuariodao');
const jwt = require('jsonwebtoken');

module.exports = {
    login: async (req, res) => {
        try {
            console.log("----------------------------------------------");
            console.log("👉 1. Requisição de Login Recebida:", req.body);
            
            const { login, senha } = req.body;

            if (!login || !senha) {
                console.log("❌ Falta login ou senha.");
                return res.status(400).json({ success: false, message: "Informe login e senha." });
            }

            // Busca no banco
            console.log("🔍 2. Buscando usuário no DAO para:", login);
            const user = await usuarioDao.findByLogin(login);
            
            console.log("👤 3. Resultado do Banco:", user);

            // Verifica se existe
            if (!user) {
                console.log("❌ Usuário não encontrado no banco.");
                return res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }

            // Verifica a senha (IMPORTANTE: Seu SQL salva senha como string simples, sem hash)
            console.log(`🔐 4. Comparando senhas: Banco[${user.senha}] vs Digitada[${senha}]`);
            
            if (String(user.senha) !== String(senha)) {
                console.log("❌ Senha incorreta.");
                return res.status(401).json({ success: false, message: "Senha incorreta." });
            }

            // Gera Token
            console.log("🔑 5. Gerando token...");
            const token = jwt.sign(
                { matricula: user.matricula, nome: user.nome, tipo: user.tipo },
                process.env.JWT_SECRET || 'segredo_biblioteca',
                { expiresIn: '24h' }
            );

            console.log("✅ 6. Sucesso! Enviando resposta.");
            
            res.json({
                success: true,
                message: "Login realizado!",
                token,
                user: {
                    matricula: user.matricula,
                    nome: user.nome,
                    tipo: user.tipo 
                }
            });

        } catch (error) {
            // AQUI ESTÁ O ERRO 500 REAL
            console.error("🔥🔥🔥 ERRO CRÍTICO NO SERVIDOR:", error);
            res.status(500).json({ 
                success: false, 
                message: "Erro interno: " + error.message 
            });
        }
    }
};