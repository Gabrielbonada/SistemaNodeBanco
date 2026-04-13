const API = 'http://localhost:3000/api';

const token = localStorage.getItem('token');
if (!token) window.location.href = '/login.html';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  };
}

function sair() {
  localStorage.clear();
  window.location.href = '/login.html';
}

// ── Carrega perfil ─────────────────────────────────────────────────────────
async function carregarPerfil() {
  try {
    const res = await fetch(API + '/auth/perfil', { headers: getHeaders() });
    if (res.status === 401) { sair(); return; }
    if (!res.ok) return;

    const user = await res.json();

    // Atualiza nome no header e título
    document.querySelectorAll('h2, .perfil-nome').forEach(el => {
      if (el.textContent.includes('Matheus') || el.textContent.includes('Peterson')) {
        el.textContent = user.nome;
      }
    });

    // Atualiza span no botão de perfil
    document.querySelectorAll('button span').forEach(el => {
      if (el.textContent.includes('Matheus') || el.textContent.includes('Peterson')) {
        el.textContent = user.nome;
      }
    });

    // Preenche inputs da aba de dados
    const inputs = document.querySelectorAll('#tab-dados input[type="text"], #tab-dados input[type="email"], #tab-dados input[type="tel"]');
    inputs.forEach(input => {
      if (input.value.includes('Matheus') || input.value.includes('Peterson')) {
        input.value = user.nome;
      }
      if (input.value.includes('matheus@') || input.value.includes('almeria')) {
        input.value = user.email;
      }
      if (input.value.includes('99999') || input.type === 'tel') {
        if (user.telefone) input.value = user.telefone;
      }
    });

  } catch (e) {
    console.error('Erro ao carregar perfil:', e);
  }
}

// ── Carrega dados da conta ─────────────────────────────────────────────────
async function carregarConta() {
  try {
    const res = await fetch(API + '/conta/dados', { headers: getHeaders() });
    if (!res.ok) return;
    const conta = await res.json();

    // Mostra número da conta se tiver elemento
    document.querySelectorAll('.numero-conta, .agencia').forEach(el => {
      if (el.classList.contains('numero-conta')) el.textContent = conta.numeroConta;
      if (el.classList.contains('agencia')) el.textContent = conta.agencia;
    });

  } catch (e) {
    console.error('Erro ao carregar conta:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfil();
  carregarConta();
});