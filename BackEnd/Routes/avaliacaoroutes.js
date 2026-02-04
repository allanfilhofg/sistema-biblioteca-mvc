const express = require('express');
const router = express.Router();
const avaliacaoController = require('../Controller/avaliacaocontroller');

// POST /avaliacoes
router.post('/', avaliacaoController.criar);

// GET /avaliacoes/livro/:codigo_livro
router.get('/livro/:codigo_livro', avaliacaoController.listarPorLivro);

module.exports = router;