const API = 'http://localhost:3000'; // Altere se necessário

// LOGIN
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            location.href = 'home.html';
        } else {
            document.getElementById('msg').textContent = data.error || 'Erro';
        }
    });
}

// REGISTRO
async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    document.getElementById('msg').textContent = res.ok
        ? 'Registrado! Agora faça login.'
        : data.error || 'Erro';
}

// ENVIAR MENSAGEM
const msgForm = document.getElementById('msg-form');
if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = document.getElementById('content').value;
        const token = localStorage.getItem('token');

        const res = await fetch(`${API}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (res.ok) {
            document.getElementById('content').value = '';
            carregarMensagens();
        }
    });
}

// LISTAR MENSAGENS
async function carregarMensagens() {
    const res = await fetch(`${API}/messages`);
    const mensagens = await res.json();

    const ul = document.getElementById('lista-mensagens');
    if (!ul) return;

    ul.innerHTML = '';
    mensagens.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.content} (user ${msg.userId})`;
        ul.appendChild(li);
    });
}

if (document.getElementById('lista-mensagens')) {
    carregarMensagens();
}
