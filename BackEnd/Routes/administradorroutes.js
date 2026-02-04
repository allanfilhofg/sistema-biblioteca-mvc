const express = require('express');
const router = express.Router();
const administradorController = require('../Controller/administradorcontroller');

// GET http://localhost:3000/administradores
router.get('/', administradorController.listar);

// POST http://localhost:3000/administradores
router.post('/', administradorController.criar);

// POST http://localhost:3000/administradores/login
router.post('/login', administradorController.loginAdmin);

module.exports = router;