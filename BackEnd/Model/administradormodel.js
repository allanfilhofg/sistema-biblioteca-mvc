const Usuario = require('./usuariomodel');

class Administrador extends Usuario {
    constructor(matricula, nome, cpf, endereco, email, senha, telefone, status_academico) {
        // Chama o construtor do Pai (Usuario) e força o tipo 'ADMIN'
        super(matricula, nome, cpf, endereco, email, senha, telefone, status_academico, 'ADMIN');
    }
}

module.exports = Administrador;