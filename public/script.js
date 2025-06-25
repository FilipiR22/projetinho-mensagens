let token = '';

document.addEventListener('DOMContentLoaded', () => {
    // LOGIN
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = "mensagens.html";
            } else {
                alert(data.error || 'Erro ao logar');
            }
        });
    }

    // CADASTRO
    if (document.getElementById('cadastroForm')) {
        document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nomeCadastro').value;
            const email = document.getElementById('emailCadastro').value;
            const senha = document.getElementById('senhaCadastro').value;
            const res = await fetch('/usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = "login.html";
            } else {
                alert(data.error || 'Erro ao cadastrar');
            }
        });
    }

    // MENSAGENS
    if (document.getElementById('mensagemForm')) {
        const token = localStorage.getItem('token');
        const form = document.getElementById('mensagemForm');
        const aviso = document.getElementById('avisoLogin');
        if (token) {
            form.style.display = '';
            if (aviso) aviso.classList.add('d-none');
            carregarMensagens();
        } else {
            form.style.display = 'none';
            if (aviso) aviso.classList.remove('d-none');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('conteudo').value;
            const res = await fetch('/mensagens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ conteudo })
            });
            if (res.ok) {
                document.getElementById('conteudo').value = '';
                carregarMensagens();
            } else {
                alert('Erro ao enviar mensagem');
            }
        });
    }

    // Função para carregar mensagens do usuário logado
    async function carregarMensagens() {
        const token = localStorage.getItem('token');
        const res = await fetch('/mensagens', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const mensagens = await res.json();
        const lista = document.getElementById('mensagensLista');
        lista.innerHTML = '';
        mensagens.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'card mb-3';
            div.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${msg.conteudo}</p>
                    <button class="btn btn-info btn-sm ver-comentarios" data-id="${msg.id}">Ver Comentários</button>
                </div>
            `;
            lista.appendChild(div);
        });
        document.querySelectorAll('.ver-comentarios').forEach(btn => {
            btn.addEventListener('click', function() {
                const idMensagem = this.getAttribute('data-id');
                window.location.href = `/mensagens/${idMensagem}/comentarios`;
            });
        });
    }

    // COMENTÁRIOS
    if (document.getElementById('comentarioForm')) {
        const token = localStorage.getItem('token');
        const form = document.getElementById('comentarioForm');
        const aviso = document.getElementById('avisoLoginComentario');
        const idMensagem = getIdMensagemFromUrl();
        if (token) {
            form.style.display = '';
            if (aviso) aviso.classList.add('d-none');
            carregarComentariosPagina(idMensagem);
        } else {
            form.style.display = 'none';
            if (aviso) aviso.classList.remove('d-none');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('conteudoComentario').value;
            await fetch(`/comentarios/${idMensagem}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ conteudo })
            });
            document.getElementById('conteudoComentario').value = '';
            carregarComentariosPagina(idMensagem);
        });
    }

    function getIdMensagemFromUrl() {
        // Suporta /mensagens/ID/comentarios
        const match = window.location.pathname.match(/mensagens\/(\d+)\/comentarios/);
        if (match) return match[1];
        const params = new URLSearchParams(window.location.search);
        return params.get('idmensagem');
    }

    function carregarComentariosPagina(idMensagem) {
        fetch(`/comentarios/${idMensagem}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(comentarios => {
            const comentariosDiv = document.getElementById('comentarios');
            comentariosDiv.innerHTML = '';
            comentarios.forEach(comentario => {
                const p = document.createElement('p');
                p.textContent = comentario.conteudo + ' (' + new Date(comentario.datahora).toLocaleString() + ')';
                comentariosDiv.appendChild(p);
            });
        });
    }
});