class Usuario {
    constructor(matricula, nome, cpf, endereco, email, senha, telefone, status_academico, tipo) {
        this.matricula = matricula;
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = endereco;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.status_academico = status_academico;
        this.tipo = tipo || 'USUARIO'; // Padrão
    }

    // Método auxiliar para verificar senha (como no seu Java)
    validarSenha(senhaInformada) {
        return this.senha === senhaInformada;
    }
}

module.exports = Usuario;