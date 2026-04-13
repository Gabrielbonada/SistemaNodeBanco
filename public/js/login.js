const API = 'http://localhost:3000/api';

async function fazerLogin() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const btn   = document.getElementById('btn-login');

  if (!email) { mostrarErro('Informe seu e-mail.'); return; }
  if (!senha) { mostrarErro('Informe sua senha.'); return; }

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarErro(data.erro || 'E-mail ou senha incorretos.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));
    window.location.href = '/index.html';

  } catch {
    mostrarErro('Erro de conexão. Verifique se o servidor está rodando.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}