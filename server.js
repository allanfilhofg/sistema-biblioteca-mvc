require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Permite o Front-End acessar

const app = express();

// Middlewares (Configurações básicas)
app.use(cors());
app.use(express.json()); // Permite ler JSON

// Importar Rotas
const AuthRoutes = require('./BackEnd/Routes/authroutes');
const UsuarioRoutes = require('./BackEnd/Routes/usuarioroutes');
const LivroRoutes = require('./BackEnd/Routes/livroroutes');
const EmprestimoRoutes = require('./BackEnd/Routes/emprestimoroutes');
const AdministradorRoutes = require('./BackEnd/Routes/administradorroutes');
const AvaliacaoController = require('./BackEnd/Controller/avaliacaocontroller'); // Import direto para simplificar ou crie a rota

console.log("📌 Configurando rotas...");

// Definir Rotas
app.use('/auth', AuthRoutes);
app.use('/usuarios', UsuarioRoutes);
app.use('/livros', LivroRoutes);
app.use('/emprestimos', EmprestimoRoutes);
app.use('/administradores', AdministradorRoutes);
app.post('/avaliacoes', AvaliacaoController.criar);
app.get('/avaliacoes/livro/:codigo_livro', AvaliacaoController.listarPorLivro);

// Rota de Teste (Health Check)
app.get('/', (req, res) => {
    res.json({ status: "API Biblioteca Online e Rodando! 📚" });
});
const usuarioDao = require('./BackEnd/Dao/usuariodao'); // Garanta que o path está certo
app.get('/usuarios/:matricula', async (req, res) => {
    try {
        const user = await usuarioDao.findByMatricula(req.params.matricula);
        res.json({ success: true, data: user });
    } catch(e) { res.status(500).json({error: e.message}); }
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Link: http://localhost:${PORT}`);
});