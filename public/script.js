const API = 'http://localhost:3000';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%&?])[A-Za-z\d@!%&?]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// LOGIN
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        const msg = document.getElementById('msg');

        if (!emailRegex.test(email)) {
            msg.textContent = 'Email inválido.';
            return;
        }

        if (!senhaRegex.test(senha)) {
            msg.textContent = 'Senha inválida: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo (@!%&?).';
            return;
        }

        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: senha })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            location.href = 'home.html';
        } else {
            msg.textContent = data.error || 'Erro';
        }
    });
}

// REGISTRO
async function register() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const msg = document.getElementById('msg');

    const nome = prompt("Digite seu nome:");
    if (!nome) return alert('Nome é obrigatório');

    if (!emailRegex.test(email)) {
        msg.textContent = 'Email inválido.';
        return;
    }

    if (!senhaRegex.test(senha)) {
        msg.textContent = 'Senha inválida: mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo (@!%&?).';
        return;
    }

    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha, nome })
    });

    const data = await res.json();
    msg.textContent = res.ok
        ? 'Registrado! Agora faça login.'
        : data.error || 'Erro';
}

// ENVIAR MENSAGEM
const msgForm = document.getElementById('msg-form');
if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const conteudo = document.getElementById('content').value;
        const token = localStorage.getItem('token');

        const res = await fetch(`${API}/mensagens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ conteudo })
        });

        if (res.ok) {
            document.getElementById('content').value = '';
            carregarMensagens();
        }
    });
}

// LISTAR MENSAGENS
async function carregarMensagens() {
    const res = await fetch(`${API}/mensagens`);
    const mensagens = await res.json();

    const ul = document.getElementById('lista-mensagens');
    if (!ul) return;

    ul.innerHTML = '';
    mensagens.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.conteudo} (usuário ${msg.userId || msg.autorId || 'desconhecido'})`;
        ul.appendChild(li);
    });
}

if (document.getElementById('lista-mensagens')) {
    carregarMensagens();
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const mensagemForm = document.getElementById('mensagemForm');
    const mensagensDiv = document.getElementById('mensagens');
    let token = null;

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                token = data.token;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('mensagemSection').style.display = 'block';
                carregarMensagens();
            } else {
                alert(data.error || 'Erro ao fazer login');
            }
        });
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            const senha = document.getElementById('cadastroSenha').value;

            // As funções de validação ficam no HTML!
            if (!validarEmail(email)) {
                alert('Email inválido!');
                return;
            }
            if (!validarSenha(senha)) {
                alert('Senha deve ter pelo menos 6 caracteres!');
                return;
            }

            const res = await fetch('/usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Cadastro realizado! Faça login.');
                cadastroForm.reset();
            } else {
                alert(data.error || 'Erro ao cadastrar');
            }
        });
    }

    if (mensagemForm) {
        mensagemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const conteudo = document.getElementById('mensagemConteudo').value;
            if (!token) {
                alert('Faça login primeiro!');
                return;
            }
            const res = await fetch('/mensagens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ conteudo })
            });
            const data = await res.json();
            if (res.ok) {
                mensagemForm.reset();
                carregarMensagens();
            } else {
                alert(data.error || 'Erro ao enviar mensagem');
            }
        });
    }

    async function carregarMensagens() {
        const res = await fetch('/mensagens', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        mensagensDiv.innerHTML = '';
        if (Array.isArray(data)) {
            data.forEach(msg => {
                const div = document.createElement('div');
                div.textContent = `${msg.conteudo} (Usuário: ${msg.idusuario})`;
                mensagensDiv.appendChild(div);
            });
        }
    }
});
