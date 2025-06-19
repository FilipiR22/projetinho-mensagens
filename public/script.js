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
