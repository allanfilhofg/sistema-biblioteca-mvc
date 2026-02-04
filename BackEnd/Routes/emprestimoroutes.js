const express = require('express');
const router = express.Router();
const emprestimocontroller = require('../Controller/emprestimocontroller'); // <-- IMPORT CORRETO

router.get('/', emprestimocontroller.listar);
router.post('/', emprestimocontroller.criar);
router.put('/:codigo_emprestimo/devolver', emprestimocontroller.devolver);
router.put('/:codigo_emprestimo/pagar', emprestimocontroller.pagar);

// LINHA PROBLEMÁTICA (Agora deve encontrar a função)
router.get('/resumo', emprestimocontroller.resumo); 

module.exports = router;