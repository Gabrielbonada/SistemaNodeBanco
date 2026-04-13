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

function formatarReal(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarSucesso(msg) {
  alert('✅ ' + msg);
}

function mostrarErro(msg) {
  alert('❌ ' + msg);
}

// ── Pix ───────────────────────────────────────────────────────────────────
async function enviarPix() {
  const destino   = document.getElementById('pix-destino')?.value?.trim();
  const valor     = parseFloat(document.getElementById('pix-valor')?.value);
  const descricao = document.getElementById('pix-descricao')?.value?.trim();

  if (!destino) { mostrarErro('Informe a chave ou conta de destino.'); return; }
  if (!valor || valor <= 0) { mostrarErro('Informe um valor válido.'); return; }

  try {
    const res = await fetch(API + '/transacao/pix', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ numeroDestino: destino, valor, descricao }),
    });

    const data = await res.json();
    if (res.status === 401) { sair(); return; }
    if (!res.ok) { mostrarErro(data.erro); return; }

    mostrarSucesso(`Pix de ${formatarReal(valor)} enviado!`);
    document.getElementById('pix-destino').value = '';
    document.getElementById('pix-valor').value = '';
    if (document.getElementById('pix-descricao')) document.getElementById('pix-descricao').value = '';

  } catch {
    mostrarErro('Erro de conexão.');
  }
}

// ── Transferência ─────────────────────────────────────────────────────────
async function fazerTransferencia() {
  const destino = document.getElementById('transf-destino')?.value?.trim();
  const valor   = parseFloat(document.getElementById('transf-valor')?.value);

  if (!destino) { mostrarErro('Informe o número da conta de destino.'); return; }
  if (!valor || valor <= 0) { mostrarErro('Informe um valor válido.'); return; }

  try {
    const res = await fetch(API + '/transacao/transferencia', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ numeroDestino: destino, valor }),
    });

    const data = await res.json();
    if (res.status === 401) { sair(); return; }
    if (!res.ok) { mostrarErro(data.erro); return; }

    mostrarSucesso(`Transferência de ${formatarReal(valor)} realizada!`);
    document.getElementById('transf-destino').value = '';
    document.getElementById('transf-valor').value = '';

  } catch {
    mostrarErro('Erro de conexão.');
  }
}

// ── Boleto ────────────────────────────────────────────────────────────────
async function pagarBoleto() {
  const codigo = document.getElementById('boleto-codigo')?.value?.trim();
  const valor  = parseFloat(document.getElementById('boleto-valor')?.value);

  if (!codigo) { mostrarErro('Informe o código de barras.'); return; }
  if (!valor || valor <= 0) { mostrarErro('Informe o valor do boleto.'); return; }

  try {
    const res = await fetch(API + '/transacao/boleto', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ codigoBarras: codigo, valor }),
    });

    const data = await res.json();
    if (res.status === 401) { sair(); return; }
    if (!res.ok) { mostrarErro(data.erro); return; }

    mostrarSucesso(`Boleto de ${formatarReal(valor)} pago com sucesso!`);
    document.getElementById('boleto-codigo').value = '';
    document.getElementById('boleto-valor').value = '';

  } catch {
    mostrarErro('Erro de conexão.');
  }
}

// ── Carrega dados do usuário no header ────────────────────────────────────
async function carregarUsuario() {
  try {
    const res = await fetch(API + '/auth/perfil', { headers: getHeaders() });
    if (res.status === 401) { sair(); return; }
    if (!res.ok) return;
    const user = await res.json();

    document.querySelectorAll('button span').forEach(el => {
      if (el.textContent.includes('Matheus') || el.textContent.includes('Peterson')) {
        el.textContent = user.nome;
      }
    });
  } catch {}
}

document.addEventListener('DOMContentLoaded', carregarUsuario);