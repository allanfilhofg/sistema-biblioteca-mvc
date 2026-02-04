class Livro {
    constructor(codigo_livro, titulo, autor, ano_publicacao, categoria, isbn, status_livro) {
        this.codigo_livro = codigo_livro;
        this.titulo = titulo;
        this.autor = autor;
        this.ano_publicacao = ano_publicacao;
        this.categoria = categoria;
        this.isbn = isbn;
        this.status_livro = status_livro || 'DISPONIVEL';
    }
}

module.exports = Livro;