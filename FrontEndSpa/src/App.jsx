import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// O CSS é carregado via <link> no index.html.

const API = "http://localhost:3000";
const userDefault = { matricula: '', nome: 'Visitante', tipo: 'VISITANTE' };

// --- COMPONENTES AUXILIARES ---

const Navbar = ({ user, handleLogout, title, iconClass }) => (
    <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '1.5rem' }}><i className={iconClass}></i></div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
                {title}
            </span>
        </div>
        <div className="user-info">
            <span>Olá, <strong>{user.nome}</strong></span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{marginLeft: '15px'}}>
                <i className="fas fa-sign-out-alt"></i> Sair
            </button>
        </div>
    </nav>
);

// --- TELA LOGIN ---
const LoginScreen = ({ handleLogin }) => {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => { localStorage.clear(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('Verificando...');
        try {
            const res = await fetch(`${API}/auth/login`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, senha })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                handleLogin(data.user);
            } else { setMsg(data.message); }
        } catch (error) { setMsg('Erro de conexão (Porta 3000).'); }
    };

    return (
        <div className="login-container-wrapper">
            <div className="login-box">
                <div style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '10px' }}><i className="fas fa-book-reader"></i></div>
                <h1 className="logo-pulsante" style={{ fontSize: '2rem', marginBottom: '5px' }}>BIBLIOTECA</h1>
                <p style={{ opacity: 0.8, marginBottom: '30px' }}>Sistema Integrado SPA</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Matrícula ou Email" value={login} onChange={e => setLogin(e.target.value)} required />
                    <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', background: 'var(--accent)', color: '#333' }}>ENTRAR</button>
                </form>
                <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{msg}</p>
                
                {/* DADOS DE TESTE VISÍVEIS */}
                <div style={{marginTop: '20px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', fontSize: '0.8rem'}}>
                    <p style={{margin:0}}>🎓 Admin: <strong>allan@edu.unifor.br</strong> / 1234</p>
                    <p style={{margin:0}}>📚 Aluno: <strong>2023001</strong> / 1234</p>
                </div>
            </div>
        </div>
    );
};

// --- TELA ALUNO ---
const AlunoScreen = ({ user, handleLogout }) => {
    const [livros, setLivros] = useState([]);
    const [meusEmprestimos, setMeusEmprestimos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [livroAvaliar, setLivroAvaliar] = useState({ codigo: '', titulo: '' });
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');

    const carregarDados = async () => {
        try {
            const [resL, resE] = await Promise.all([fetch(`${API}/livros`), fetch(`${API}/emprestimos`)]);
            const jsonL = await resL.json();
            const jsonE = await resE.json();
            setLivros(jsonL.data || []);
            setMeusEmprestimos((jsonE.data || []).filter(e => e.matricula_usuario == user.matricula)); 
        } catch (e) { console.error(e); }
    };

    useEffect(() => { carregarDados(); }, []);

    const alugar = async (codigoLivro) => {
        if(!confirm("Confirmar empréstimo?")) return;
        const res = await fetch(`${API}/emprestimos`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matricula_usuario: user.matricula, codigo_livro: codigoLivro, data_retirada: new Date().toISOString().split('T')[0] })
        });
        if(res.ok) { alert("Sucesso!"); carregarDados(); } else { alert("Erro."); }
    };

    const pagarMulta = async (codigoEmp) => {
        if(!confirm("Pagar multa?")) return;
        const res = await fetch(`${API}/emprestimos/${codigoEmp}/pagar`, { method: "PUT" });
        if(res.ok) { alert("Pago!"); carregarDados(); }
    };

    const enviarAvaliacao = async () => {
        await fetch(`${API}/avaliacoes`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo_livro: livroAvaliar.codigo, matricula_usuario: user.matricula, nota, comentario })
        });
        alert("Avaliação Enviada!"); setShowModal(false); setComentario(''); setNota(5);
    };

    return (
        <>
            <Navbar user={user} handleLogout={handleLogout} title="Área do Leitor" iconClass="fas fa-book-open" />
            <div className="container">
                <h2 style={{ marginBottom: '15px' }}><i className="fas fa-clock"></i> Meus Empréstimos</h2>
                <div className="table-responsive" style={{ marginBottom: '40px' }}>
                    <table>
                        <thead><tr><th>Livro</th><th>Devolução</th><th>Status</th><th>Multa</th><th>Ação</th></tr></thead>
                        <tbody>
                            {meusEmprestimos.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center'}}>Sem empréstimos.</td></tr> :
                             meusEmprestimos.map(e => (
                                <tr key={e.codigo_emprestimo}>
                                    <td><strong>{e.livro}</strong></td>
                                    <td>{new Date(e.data_prevista_devolucao).toLocaleDateString('pt-BR')}</td>
                                    <td><span className={`badge status-${e.status_emprestimo}`}>{e.status_emprestimo}</span></td>
                                    <td>{e.multa_calculada > 0 ? (e.pago ? "PAGO" : `R$ ${e.multa_calculada}`) : "-"}</td>
                                    <td>{e.multa_calculada > 0 && !e.pago && <button onClick={() => pagarMulta(e.codigo_emprestimo)} className="btn btn-danger btn-sm">Pagar</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 style={{ borderTop: '1px solid #ccc', paddingTop: '20px' }}>Acervo</h2>
                <div className="books-grid">
                    {livros.map(l => (
                        <div className="book-card" key={l.codigo_livro}>
                            <div className="book-cover"><i className="fas fa-book"></i></div>
                            <div className="book-info">
                                <b>{l.titulo}</b><br/><small>{l.autor}</small>
                            </div>
                            <div className="book-footer">
                                {l.status_livro === 'DISPONIVEL' ? 
                                    <button onClick={() => alugar(l.codigo_livro)} className="btn btn-success btn-sm" style={{width:'100%'}}>Emprestar</button> :
                                    <span className={`badge status-${l.status_livro}`} style={{width:'100%', textAlign:'center'}}>{l.status_livro}</span>
                                }
                                <button onClick={() => { setLivroAvaliar({codigo: l.codigo_livro, titulo: l.titulo}); setShowModal(true); }} style={{background:'none', border:'none', color:'#fbc531', fontSize:'1.5rem', cursor:'pointer'}}>★</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Avaliar: {livroAvaliar.titulo}</h3>
                        <div className="star-rating" style={{margin:'20px 0', textAlign:'center'}}>
                            {[5,4,3,2,1].map((n) => (
                                <span key={n} onClick={() => setNota(n)} style={{cursor:'pointer', fontSize:'2.5rem', color: n <= nota ? '#fbc531' : '#ddd'}}>★</span>
                            ))}
                        </div>
                        <textarea placeholder="Comentário..." value={comentario} onChange={e => setComentario(e.target.value)} rows="3"></textarea>
                        <button onClick={enviarAvaliacao} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Enviar</button>
                        <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ width: '100%', marginTop: '5px' }}>Cancelar</button>
                    </div>
                </div>
            )}
        </>
    );
};

// --- TELA ADMIN ---
const AdminScreen = ({ user, handleLogout }) => {
    const [livros, setLivros] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);
    const [metricas, setMetricas] = useState({});
    
    // Controle de Modais
    const [modalAberto, setModalAberto] = useState(null); 
    
    // Dados temporários
    const [modalUser, setModalUser] = useState(null); 
    const [listaAvaliacoes, setListaAvaliacoes] = useState([]); 
    const [tituloAvaliacao, setTituloAvaliacao] = useState('');
    const [novoLivro, setNovoLivro] = useState({ codigo_livro: '', titulo: '', autor: '', ano_publicacao: '', categoria: '', isbn: '' });
    const [statusData, setStatusData] = useState({ codigo: '', titulo: '', status: 'DISPONIVEL' });

    const carregarTudo = async () => {
        try {
            const [resL, resE, resM] = await Promise.all([fetch(`${API}/livros`), fetch(`${API}/emprestimos`), fetch(`${API}/emprestimos/resumo`)]);
            setLivros((await resL.json()).data || []);
            setEmprestimos((await resE.json()).data || []);
            const jsonM = await resM.json();
            if(jsonM.success) setMetricas(jsonM.data);
        } catch(e) { console.error(e); }
    };

    useEffect(() => { carregarTudo(); }, []);

    const devolver = async (codigo) => {
        if(!confirm("Devolver?")) return;
        await fetch(`${API}/emprestimos/${codigo}/devolver`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data_devolucao: new Date().toISOString().split('T')[0] }) });
        carregarTudo();
    };

    // ABRIR MODAL DE DETALHES DO ALUNO
    const verDetalhesAluno = async (matricula) => {
        try {
            const res = await fetch(`${API}/usuarios/${matricula}`);
            const json = await res.json();
            if(json.data) {
                setModalUser(json.data);
                setModalAberto('USER');
            } else {
                alert(`Erro: Aluno com matrícula ${matricula} não encontrado.`);
            }
        } catch(e) { alert("Erro de conexão ao buscar aluno."); }
    };

    // ABRIR MODAL DE AVALIAÇÕES
    const verAvaliacoes = async (codigoLivro, titulo) => {
        try {
            const res = await fetch(`${API}/avaliacoes/livro/${codigoLivro}`);
            const json = await res.json();
            setListaAvaliacoes(json.data || []);
            setTituloAvaliacao(titulo);
            setModalAberto('AVALIACOES'); 
        } catch(e) { alert("Erro ao buscar avaliações."); }
    };

    const salvarLivro = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API}/livros`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(novoLivro) });
        if(res.ok) { alert("Cadastrado!"); setModalAberto(null); carregarTudo(); }
        else { alert("Erro ao cadastrar."); }
    };

    const salvarStatus = async () => {
        const res = await fetch(`${API}/livros/${statusData.codigo}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: statusData.status })
        });
        if(res.ok) { alert("Atualizado!"); setModalAberto(null); carregarTudo(); }
        else { alert("Erro ao atualizar."); }
    };

    return (
        <>
            <Navbar user={user} handleLogout={handleLogout} title="Administração" iconClass="fas fa-university" />
            <div className="container">
                {/* DASHBOARD */}
                <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
                    <div className="book-card" style={{ padding: '20px', borderTop: '5px solid var(--secondary)' }}>
                        <p style={{margin:0}}>Acervo</p><h3>{metricas.totalLivros || livros.length}</h3>
                    </div>
                    <div className="book-card" style={{ padding: '20px', borderTop: '5px solid var(--primary)' }}>
                        <p style={{margin:0}}>Emprestados</p><h3>{metricas.livrosEmprestados || 0}</h3>
                    </div>
                    <div className="book-card" style={{ padding: '20px', borderTop: '5px solid var(--danger)' }}>
                        <p style={{margin:0}}>Multas</p><h3>R$ {metricas.multasPendentes || '0.00'}</h3>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => setModalAberto('RELATORIO')} className="btn btn-secondary"><i className="fas fa-print"></i> Relatório</button>
                    <button onClick={() => setModalAberto('LIVRO')} className="btn btn-success"><i className="fas fa-plus"></i> Novo Livro</button>
                </div>

                {/* TABELA EMPRÉSTIMOS */}
                <h3 style={{marginBottom:'15px'}}>Empréstimos Ativos</h3>
                <div className="table-responsive" style={{ marginBottom: '40px' }}>
                    <table>
                        <thead><tr><th>Cód</th><th>Aluno (Clique)</th><th>Livro</th><th>Devolução</th><th>Status</th><th>Ação</th></tr></thead>
                        <tbody>
                            {emprestimos.filter(e => e.status_emprestimo !== 'DEVOLVIDO').map(e => (
                                <tr key={e.codigo_emprestimo}>
                                    <td>{e.codigo_emprestimo}</td>
                                    <td>
                                        <div onClick={() => verDetalhesAluno(e.matricula_usuario)} style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${e.usuario}`} style={{width:'30px', borderRadius:'50%'}} />
                                            <span style={{color:'var(--primary)', fontWeight:'bold', textDecoration:'underline'}}>{e.usuario}</span>
                                        </div>
                                    </td>
                                    <td>{e.livro}</td>
                                    <td>{new Date(e.data_prevista_devolucao).toLocaleDateString('pt-BR')}</td>
                                    <td><span className={`badge status-${e.status_emprestimo}`}>{e.status_emprestimo}</span></td>
                                    <td><button onClick={() => devolver(e.codigo_emprestimo)} className="btn btn-primary btn-sm">Devolver</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TABELA ACERVO */}
                <h3 style={{marginBottom:'15px'}}>Acervo</h3>
                <div className="table-responsive">
                    <table>
                        <thead><tr><th>Cód</th><th>Título</th><th>Autor</th><th>Status</th><th>Opiniões</th></tr></thead>
                        <tbody>
                            {livros.map(l => (
                                <tr key={l.codigo_livro}>
                                    <td>{l.codigo_livro}</td>
                                    <td>{l.titulo}</td>
                                    <td>{l.autor}</td>
                                    <td>
                                        <span onClick={() => { setStatusData({codigo: l.codigo_livro, titulo: l.titulo, status: l.status_livro}); setModalAberto('STATUS'); }} 
                                              className={`badge status-${l.status_livro}`} style={{cursor:'pointer'}}>
                                            {l.status_livro} <i className="fas fa-edit"></i>
                                        </span>
                                    </td>
                                    <td><button onClick={() => verAvaliacoes(l.codigo_livro, l.titulo)} className="btn btn-secondary btn-sm">Ver</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAIS DO ADMIN --- */}

            {/* MODAL DETALHES ALUNO */}
            {modalAberto === 'USER' && modalUser && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{display:'flex', justifyContent:'flex-end'}}><button onClick={() => setModalAberto(null)} className="close-modal">×</button></div>
                        <h3 style={{color: 'var(--secondary)'}}>Detalhes do Aluno</h3>
                        <div style={{textAlign:'center', marginBottom:'20px'}}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${modalUser.nome}`} style={{width:'80px', borderRadius:'50%'}} />
                            <h4 style={{marginTop:'10px'}}>{modalUser.nome}</h4>
                            <span className="badge status-DISPONIVEL">{modalUser.status_academico}</span>
                        </div>
                        <p><strong>Matrícula:</strong> {modalUser.matricula}</p>
                        <p><strong>CPF:</strong> {modalUser.cpf}</p>
                        <p><strong>Email:</strong> {modalUser.email}</p>
                        <p><strong>Telefone:</strong> {modalUser.telefone}</p>
                        <p><strong>Endereço:</strong> {modalUser.endereco}</p>
                        <button onClick={() => setModalAberto(null)} className="btn btn-secondary" style={{width:'100%', marginTop:'20px'}}>Fechar</button>
                    </div>
                </div>
            )}

            {/* MODAL AVALIAÇÕES DO LIVRO */}
            {modalAberto === 'AVALIACOES' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{display:'flex', justifyContent:'flex-end'}}><button onClick={() => setModalAberto(null)} className="close-modal">×</button></div>
                        <h3 style={{color:'var(--secondary)'}}>Opiniões: {tituloAvaliacao}</h3>
                        <div style={{maxHeight:'300px', overflowY:'auto', margin:'20px 0', paddingRight:'15px'}}>
                            {listaAvaliacoes.length === 0 ? <p style={{textAlign:'center', color:'#999'}}>Nenhuma avaliação registrada.</p> : 
                             listaAvaliacoes.map((av, i) => (
                                <div key={i} style={{borderBottom:'1px solid #eee', padding:'10px 0'}}>
                                    <div style={{color:'var(--accent)', fontSize:'1.2rem'}}>{"★".repeat(av.nota)}</div>
                                    <p style={{fontStyle:'italic', color:'#555', margin:'5px 0'}}>"{av.comentario}"</p>
                                    <small style={{color:'#999'}}>- {av.nome_usuario || 'Anônimo'}</small>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setModalAberto(null)} className="btn btn-secondary" style={{width:'100%', marginTop:'10px'}}>Fechar</button>
                    </div>
                </div>
            )}

            {/* MODAL NOVO LIVRO */}
            {modalAberto === 'LIVRO' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Novo Livro</h3>
                        <form onSubmit={salvarLivro}>
                            <input type="text" placeholder="Código (Ex: L010)" required onChange={e => setNovoLivro({...novoLivro, codigo_livro: e.target.value})} />
                            <input type="text" placeholder="Título" required onChange={e => setNovoLivro({...novoLivro, titulo: e.target.value})} />
                            <input type="text" placeholder="Autor" required onChange={e => setNovoLivro({...novoLivro, autor: e.target.value})} />
                            <input type="number" placeholder="Ano" required onChange={e => setNovoLivro({...novoLivro, ano_publicacao: e.target.value})} />
                            <input type="text" placeholder="Categoria" required onChange={e => setNovoLivro({...novoLivro, categoria: e.target.value})} />
                            <input type="text" placeholder="ISBN" required onChange={e => setNovoLivro({...novoLivro, isbn: e.target.value})} />
                            <button className="btn btn-primary" style={{width:'100%'}}>Salvar</button>
                            <button type="button" onClick={() => setModalAberto(null)} className="btn btn-secondary" style={{width:'100%', marginTop:'10px'}}>Cancelar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL STATUS */}
            {modalAberto === 'STATUS' && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Alterar Status: {statusData.titulo}</h3>
                        <select onChange={e => setStatusData({...statusData, status: e.target.value})} value={statusData.status}>
                            <option value="DISPONIVEL">✅ Disponível</option>
                            <option value="EMPRESTADO">📤 Emprestado</option>
                            <option value="CONSULTA_LOCAL">📖 Consulta Local</option>
                        </select>
                        <button onClick={salvarStatus} className="btn btn-primary" style={{width:'100%'}}>Salvar</button>
                        <button onClick={() => setModalAberto(null)} className="btn btn-secondary" style={{width:'100%', marginTop:'10px'}}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* MODAL RELATÓRIO */}
            {modalAberto === 'RELATORIO' && (
                <div className="modal-overlay">
                    <div className="modal-content modal-lg">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h2 style={{color:'var(--primary)'}}>Relatório Geral</h2>
                            <button onClick={() => setModalAberto(null)} className="btn btn-danger btn-sm no-print">X</button>
                        </div>
                        <div className="table-responsive">
                            <table style={{border:'1px solid #ddd'}}>
                                <thead style={{background:'#eee'}}><tr><th>Cód</th><th>Aluno</th><th>Livro</th><th>Retirada</th><th>Status</th></tr></thead>
                                <tbody>
                                    {emprestimos.map(e => (
                                        <tr key={e.codigo_emprestimo}>
                                            <td>{e.codigo_emprestimo}</td><td>{e.usuario}</td><td>{e.livro}</td>
                                            <td>{new Date(e.data_retirada).toLocaleDateString()}</td>
                                            <td>{e.status_emprestimo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => window.print()} className="btn btn-secondary no-print" style={{marginTop:'20px', float:'right'}}>Imprimir</button>
                    </div>
                </div>
            )}

            {/* MODAIS USER/AVALIACOES JÁ ESTÃO RENDERIZANDO DENTRO DO ADMIN SCREEN */}
        </>
    );
};

const App = () => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : userDefault;
    });
    const handleLogin = (u) => setUser(u);
    const handleLogout = () => { localStorage.clear(); setUser(userDefault); };

    return (
        <div className="main-content">
            {user.tipo === 'ADMIN' ? <AdminScreen user={user} handleLogout={handleLogout} /> :
             user.tipo === 'USUARIO' ? <AlunoScreen user={user} handleLogout={handleLogout} /> :
             <LoginScreen handleLogin={handleLogin} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);

export default App;