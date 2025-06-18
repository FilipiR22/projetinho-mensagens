const API = `${window.location.protocol}//${window.location.host}`;

// LOGIN
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // O campo nome não é necessário para login

        console.log('antes de enviar a requisição');
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        console.log(res)
        console.log('depois de enviar a requisição');
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
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!name) {
        document.getElementById('msg').textContent = 'Informe o nome para registrar.';
        return;
    }

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        document.getElementById('msg').textContent = res.ok
            ? 'Registrado! Agora faça login.'
            : data.error || 'Erro';
    } catch (error) {
        document.getElementById('msg').textContent = 'Erro ao conectar ao servidor.';
    }
}

// ENVIAR MENSAGEM
const msgForm = document.getElementById('msg-form');
if (msgForm) {
    msgForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = document.getElementById('content').value;
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${API}/mensagens`, {
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
        } catch (error) {
            alert('Erro ao enviar mensagem.');
        }
    });
}

// LISTAR MENSAGENS
async function carregarMensagens() {
    try {
        const res = await fetch(`${API}/mensagens`);
        const mensagens = await res.json();

        const ul = document.getElementById('lista-mensagens');
        if (!ul) return;

        ul.innerHTML = '';
        mensagens.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = `${msg.content} (user ${msg.userId})`;
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
    }
}

if (document.getElementById('lista-mensagens')) {
    carregarMensagens();
}
