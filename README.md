  Sistema de Gestão de Biblioteca (SGB)

Um sistema completo para gerenciamento de bibliotecas acadêmicas, desenvolvido com arquitetura MVC e API RESTful. O projeto gerencia o fluxo completo de empréstimos, devoluções, cálculo de multas e controle de acervo.

🖼️ Telas do Projeto

(Espaço reservado para screenshots - Adicione suas imagens na pasta /screenshots e linke aqui)

O sistema possui interfaces distintas e responsivas para Administradores e Alunos.

🚀 Funcionalidades

🎓 Módulo do Aluno (Leitor)

Catálogo Visual: Visualização de livros disponíveis em cards modernos.

Empréstimo Rápido: Solicitação de empréstimo com um clique (se disponível).

Meus Empréstimos: Acompanhamento de datas de devolução e status.

Avaliação: Sistema de avaliação de obras …
[00:48, 04/02/2026] Allan Justo: # 📚 Sistema de Gestão de Biblioteca (SGB)

Um *sistema completo para gerenciamento de bibliotecas acadêmicas, desenvolvido com **arquitetura MVC* e *API RESTful*.  
O projeto cobre todo o fluxo de uma biblioteca moderna: *empréstimos, devoluções, cálculo automático de multas e controle de acervo*.

---

## 🖼️ Telas do Projeto

> 📌 Espaço reservado para screenshots  
Adicione suas imagens na pasta /screenshots e referencie aqui.

O sistema possui *interfaces distintas, modernas e responsivas* para:

- 👨‍💼 *Administradores*
- 🎓 *Alunos (Leitores)*

---

## 🚀 Funcionalidades

### 🎓 Módulo do Aluno (Leitor)

- 📚 *Catálogo Visual*  
  Visualização de livros disponíveis em *cards modernos*.

- ⚡ *Empréstimo Rápido*  
  Solicitação de empréstimo com *um clique*, caso o livro esteja disponível.

- 📆 *Meus Empréstimos*  
  Acompanhamento de *datas de devolução*, status e histórico.

- ⭐ *Avaliações*  
  Sistema de avaliação de obras com *estrelas e comentários*.

- ⚠️ *Alertas de Multa*  
  Visualização clara de *pendências financeiras*.

---

### 💼 Módulo do Administrador

- 📊 *Dashboard de Gestão*  
  Visão geral de empréstimos *ativos, atrasados e finalizados*.

- 🗂️ *Gestão de Acervo*  
  Cadastro, edição e manutenção dos livros.

- 🔄 *Controle de Status*  
  Alteração manual de status:
  - Disponível
  - Consulta Local
  - Perdido

- 💰 *Devoluções & Multas*  
  Processamento de devoluções com *cálculo automático de multas por atraso*.

- 🧾 *Relatórios*  
  Geração de relatórios de desempenho *prontos para impressão*.

---

## 🛠️ Tecnologias Utilizadas

### 🔧 Back-End (API)

- *Node.js & Express* — Servidor e rotas REST
- *MySQL (mysql2)* — Banco de dados relacional
- *Arquitetura DAO* — Isolamento da lógica SQL
- *JWT (JsonWebToken)* — Autenticação e segurança
- *Dotenv* — Gerenciamento de variáveis de ambiente

---

### 🎨 Front-End (Interface)

- *HTML5 & CSS3* — Design moderno, limpo e responsivo
- *JavaScript (Vanilla)* — Consumo de API (fetch), DOM e modais
- *FontAwesome* — Ícones vetoriais
- *DiceBear API* — Avatares automáticos e personalizados

---

## 📂 Arquitetura do Projeto

O projeto segue uma *arquitetura em camadas*, garantindo separação de responsabilidades e fácil manutenção:

```bash
/
├── BackEnd/
│   ├── Config/       # Conexão com o Banco de Dados
│   ├── Controller/   # Regras de negócio e validações
│   ├── Dao/          # Acesso a dados e SQL
│   ├── Model/        # Estrutura das entidades
│   └── Routes/       # Endpoints da API
├── public/           # Front-End (HTML, CSS, JS, imagens)
├── server.js         # Ponto de entrada do servidor
└── .env              # Variáveis de ambiente
