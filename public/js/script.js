const API = 'http://localhost:3000/api';

// ── Proteção de rota ───────────────────────────────────────────────────────
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

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ── Carrega dados do usuário e conta ──────────────────────────────────────
async function carregarDados() {
  try {
    const [contaRes, perfilRes] = await Promise.all([
      fetch(API + '/conta/saldo',  { headers: getHeaders() }),
      fetch(API + '/auth/perfil',  { headers: getHeaders() }),
    ]);

    if (contaRes.status === 401 || perfilRes.status === 401) { sair(); return; }

    const conta  = await contaRes.json();
    const perfil = await perfilRes.json();

    // Saudação com nome real
    const h2 = document.querySelector('h2');
    if (h2) h2.textContent = `${saudacao()}, ${perfil.nome.split(' ')[0]} 👋`;

    // Nome no header
    document.querySelectorAll('button span, .btn-perfil span').forEach(el => {
      if (el.textContent.includes('Matheus') || el.textContent.includes('Peterson')) {
        el.textContent = perfil.nome;
      }
    });

    // Saldo — primeiro .metrica-valor
    const metricas = document.querySelectorAll('.metrica-valor');
    if (metricas[0]) metricas[0].textContent = formatarReal(conta.saldo);

    // Número da conta na seção Pix
    document.querySelectorAll('.chave-pix, .numero-conta').forEach(el => {
      if (el.textContent.includes('@') || el.textContent.includes('almeria')) {
        el.textContent = perfil.email;
      }
    });

  } catch (e) {
    console.error('Erro ao carregar dados:', e);
  }
}

// ── Carrega extrato ────────────────────────────────────────────────────────
async function carregarExtrato() {
  try {
    const res = await fetch(API + '/conta/extrato?limite=10', { headers: getHeaders() });
    if (!res.ok) return;
    const { transacoes } = await res.json();
    if (!transacoes || transacoes.length === 0) return;

    // Injeta no painel de pagamentos se existir lista
    const lista = document.querySelector('.lista-transacoes, .historico-lista');
    if (!lista) return;

    lista.innerHTML = transacoes.map(tx => {
      const positivo = tx.valor > 0;
      const cor = positivo ? 'var(--verde)' : 'var(--rosa)';
      const sinal = positivo ? '+' : '';
      const data = new Date(tx.createdAt).toLocaleDateString('pt-BR');
      return `
        <div class="item-transferencia transacao-item" data-tipo="${tx.tipo}">
          <div class="detalhes-transferencia">
            <div class="nome-transferencia">${tx.descricao || tx.tipo}</div>
            <div class="data-transferencia">${data}</div>
          </div>
          <div class="valor-transferencia" style="color:${cor}">
            ${sinal}${formatarReal(Math.abs(tx.valor))}
          </div>
        </div>`;
    }).join('');

  } catch (e) {
    console.error('Erro ao carregar extrato:', e);
  }
}

// ── Pix ────────────────────────────────────────────────────────────────────
async function enviarPix() {
  const destino   = document.getElementById('pix-destino')?.value?.trim();
  const valor     = parseFloat(document.getElementById('pix-valor')?.value);
  const descricao = document.getElementById('pix-descricao')?.value?.trim();

  if (!destino) { alert('Informe a conta de destino.'); return; }
  if (!valor || valor <= 0) { alert('Informe um valor válido.'); return; }

  try {
    const res = await fetch(API + '/transacao/pix', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ numeroDestino: destino, valor, descricao }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.erro); return; }
    alert(`Pix de ${formatarReal(valor)} enviado com sucesso!`);
    carregarDados();
  } catch {
    alert('Erro ao enviar Pix.');
  }
}

// ── Transferência ──────────────────────────────────────────────────────────
async function fazerTransferencia() {
  const destino = document.getElementById('transf-destino')?.value?.trim();
  const valor   = parseFloat(document.getElementById('transf-valor')?.value);

  if (!destino) { alert('Informe a conta de destino.'); return; }
  if (!valor || valor <= 0) { alert('Informe um valor válido.'); return; }

  try {
    const res = await fetch(API + '/transacao/transferencia', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ numeroDestino: destino, valor }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.erro); return; }
    alert(`Transferência de ${formatarReal(valor)} realizada!`);
    carregarDados();
  } catch {
    alert('Erro ao fazer transferência.');
  }
}

// ── Inicializa ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  carregarDados();
  carregarExtrato();
});