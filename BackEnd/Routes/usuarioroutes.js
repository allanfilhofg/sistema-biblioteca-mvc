const express = require('express');
const router = express.Router();
const usuariocontroller = require('../Controller/usuariocontroller');

router.get('/', usuariocontroller.listar);
router.post('/', usuariocontroller.criar);

// --- NOVA ROTA ---
router.get('/:matricula', usuariocontroller.buscarPorMatricula);

module.exports = router;