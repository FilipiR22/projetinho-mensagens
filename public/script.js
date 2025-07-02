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
            const token = localStorage.getItem('token');
            console.log('Token enviado:', token);
            console.log('Conteúdo da mensagem:', conteudo);
            const res = await fetch('/mensagens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ conteudo })
            });
            console.log('Resposta do servidor:', res);
            console.log('Status da resposta:', res.status);
            console.log('conteúdo:', res.conteudoMensagem);
            if (res.ok) {
                document.getElementById('conteudo').value = '';
                carregarMensagens();
            } else {
                alert('Erro ao enviar mensagem');
                console.log('conteúdo:', res.conteudoMensagem);
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

        for (let i = 0; i < mensagens.length; i++) {
            const msg = mensagens[i];
            const div = document.createElement('div');
            div.className = 'card mb-3';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex justify-content-between align-items-center';

            const p = document.createElement('p');
            p.className = 'card-text mb-0';
            p.textContent = msg.conteudo;

            const btnGroup = document.createElement('div');

            const btnComentarios = document.createElement('button');
            btnComentarios.className = 'btn btn-primary btn-sm ver-comentarios me-2';
            btnComentarios.setAttribute('data-id', msg.id);
            btnComentarios.textContent = 'Ver Comentários';

            const btnExcluir = document.createElement('button');
            btnExcluir.className = 'btn btn-danger btn-sm excluir-mensagem';
            btnExcluir.setAttribute('data-id', msg.id);
            btnExcluir.textContent = 'Excluir';

            btnGroup.appendChild(btnComentarios);
            btnGroup.appendChild(btnExcluir);

            cardBody.appendChild(p);
            cardBody.appendChild(btnGroup);
            div.appendChild(cardBody);
            lista.appendChild(div);
        }

        // Eventos dos botões
        function verComentarios() {
            document.querySelectorAll('.ver-comentarios').forEach(btn => {
                btn.addEventListener('click', function () {
                    const idMensagem = this.getAttribute('data-id');
                    window.location.href = `/mensagens/${idMensagem}/comentarios`;
                });
            });
        } 

        // Evento para exclusão
        let idParaExcluir = null;
        document.querySelectorAll('.excluir-mensagem').forEach(btn => {
            btn.addEventListener('click', function () {
                idParaExcluir = this.getAttribute('data-id');
                const modal = new bootstrap.Modal(document.getElementById('modalConfirmarExclusao'));
                modal.show();

                // Confirmação
                const btnConfirmar = document.getElementById('btnConfirmarExclusao');
                // Remove event listeners antigos para evitar múltiplas chamadas
                btnConfirmar.replaceWith(btnConfirmar.cloneNode(true));
                const novoBtnConfirmar = document.getElementById('btnConfirmarExclusao');
                novoBtnConfirmar.addEventListener('click', async function () {
                    await excluirMensagem(idParaExcluir);
                    modal.hide();
                    carregarMensagens();
                });
            });
        });
    }

    // Função para excluir mensagem
    async function excluirMensagem(idMensagem) {
        const token = localStorage.getItem('token');
        await fetch(`/mensagens/${idMensagem}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
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

    // LOGOUT
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});