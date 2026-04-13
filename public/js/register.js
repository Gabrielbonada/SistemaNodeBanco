const API = 'http://localhost:3000/api';

async function cadastrar() {
  const nome   = document.getElementById('nome').value.trim();
  const email  = document.getElementById('email').value.trim();
  const senha  = document.getElementById('senha').value;
  const termos = document.getElementById('termos').checked;
  const btn    = document.getElementById('btn-cadastrar');

  if (!nome)            { mostrarErro('Informe seu nome.'); return; }
  if (!email)           { mostrarErro('Informe seu e-mail.'); return; }
  if (senha.length < 8) { mostrarErro('Senha deve ter pelo menos 8 caracteres.'); return; }
  if (!termos)          { mostrarErro('Aceite os termos para continuar.'); return; }

  btn.disabled = true;
  btn.textContent = 'Cadastrando...';

  try {
    const res = await fetch(API + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarErro(data.erro || 'Erro ao cadastrar.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.user));

    document.getElementById('alerta-sucesso').style.display = 'flex';
    setTimeout(() => window.location.href = '/index.html', 1500);

  } catch {
    mostrarErro('Erro de conexão. Verifique se o servidor está rodando.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Criar conta';
  }
}