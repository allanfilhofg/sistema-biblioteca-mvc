class Emprestimo {
    constructor(codigo_emprestimo, matricula_usuario, codigo_livro, data_retirada) {
        this.codigo_emprestimo = codigo_emprestimo;
        this.matricula_usuario = matricula_usuario;
        this.codigo_livro = codigo_livro;
        this.data_retirada = new Date(data_retirada);
        this.data_devolucao = null;
        this.multa = 0.0;
        
        // Lógica do Java: Data prevista é +7 dias
        this.data_prevista_devolucao = new Date(this.data_retirada);
        this.data_prevista_devolucao.setDate(this.data_prevista_devolucao.getDate() + 7);
    }

    // Tradução exata do seu método Java calcularMulta()
    calcularMulta(dataDevolucaoReal) {
        if (!this.data_prevista_devolucao || !dataDevolucaoReal) return 0.0;

        const prevista = new Date(this.data_prevista_devolucao);
        const real = new Date(dataDevolucaoReal);

        // Se entregou depois da prevista
        if (real > prevista) {
            const diffTempo = Math.abs(real - prevista);
            const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
            return diffDias * 2.00; // R$ 2,00 por dia (como no seu Java)
        }
        return 0.0;
    }
}

module.exports = Emprestimo;