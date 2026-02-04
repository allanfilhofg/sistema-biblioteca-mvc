const express = require('express');
const router = express.Router();
const livroController = require('../Controller/livrocontroller');

router.get('/', livroController.listar);
router.post('/', livroController.criar);

// NOVA ROTA
router.put('/:codigo_livro/status', livroController.atualizarStatus);

module.exports = router;