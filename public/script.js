const API = `${window.location.protocol}//${window.location.host}`;

document.addEventListener('DOMContentLoaded', () => {
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            try {
                const res = await fetch(`${API}/usuario/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'home.html';
                } else {
                    document.getElementById('msg').textContent = data.erro || 'Erro ao logar';
                }
            } catch {
                document.getElementById('msg').textContent = 'Erro de conexão';
            }
        });
    }

    // Cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            try {
                const res = await fetch(`${API}/usuario/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });
                const data = await res.json();
                if (res.ok) {
                    window.location.href = 'index.html';
                } else {
                    document.getElementById('msg').textContent = data.erro || 'Erro ao cadastrar';
                }
            } catch {
                document.getElementById('msg').textContent = 'Erro de conexão';
            }
        });
    }

    // Home (mensagens)
    if (window.location.pathname.endsWith('home.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }

        const listaMensagens = document.getElementById('listaMensagens');
        const msgDiv = document.getElementById('msg');
        const novaMensagemForm = document.getElementById('novaMensagemForm');
        const conteudoInput = document.getElementById('conteudo');
        const logoutBtn = document.getElementById('logoutBtn');

        // Logout
        logoutBtn.onclick = () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        };

        // Listar mensagens
        async function carregarMensagens() {
            listaMensagens.innerHTML = '';
            msgDiv.textContent = '';
            try {
                const res = await fetch(`${API}/mensagens`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const mensagens = await res.json();
                if (Array.isArray(mensagens)) {
                    mensagens.forEach(m => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item d-flex justify-content-between align-items-center';
                        li.innerHTML = `
              <span class="conteudo">${m.conteudo}</span>
              <div>
                <button class="btn btn-sm btn-warning me-2 editarBtn">Editar</button>
                <button class="btn btn-sm btn-danger excluirBtn">Excluir</button>
              </div>
            `;
                        // Editar
                        li.querySelector('.editarBtn').onclick = async () => {
                            const novoConteudo = prompt('Editar mensagem:', m.conteudo);
                            if (novoConteudo && novoConteudo.trim() !== '') {
                                const res = await fetch(`${API}/mensagens/${m.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`
                                    },
                                    body: JSON.stringify({ conteudo: novoConteudo })
                                });
                                if (res.ok) carregarMensagens();
                                else msgDiv.textContent = 'Erro ao editar mensagem';
                            }
                        };
                        // Excluir
                        li.querySelector('.excluirBtn').onclick = async () => {
                            if (confirm('Deseja excluir esta mensagem?')) {
                                const res = await fetch(`${API}/mensagens/${m.id}`, {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                if (res.ok) carregarMensagens();
                                else msgDiv.textContent = 'Erro ao excluir mensagem';
                            }
                        };
                        listaMensagens.appendChild(li);
                    });
                } else {
                    msgDiv.textContent = mensagens.erro || 'Erro ao carregar mensagens';
                }
            } catch {
                msgDiv.textContent = 'Erro de conexão';
            }
        }

        carregarMensagens();

        // Nova mensagem
        novaMensagemForm.onsubmit = async (e) => {
            e.preventDefault();
            const conteudo = conteudoInput.value;
            if (!conteudo.trim()) return;
            try {
                const res = await fetch(`${API}/mensagens`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ conteudo })
                });
                if (res.ok) {
                    conteudoInput.value = '';
                    carregarMensagens();
                } else {
                    const data = await res.json();
                    msgDiv.textContent = data.erro || 'Erro ao criar mensagem';
                }
            } catch {
                msgDiv.textContent = 'Erro de conexão';
            }
        };
    }
});