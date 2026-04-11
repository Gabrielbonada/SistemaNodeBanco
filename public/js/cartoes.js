
const dadosCartoes = [
  { nome: 'Internet •••• 4012', bandeira: 'Visa', validade: '01/26', usado: '63,8%' },
  { nome: 'Universal •••• 2228', bandeira: 'Mastercard', validade: '12/27', usado: '28,2%' },
  { nome: 'Ouro •••• 5214', bandeira: 'Visa Gold', validade: '03/26', usado: '34,7%' },
];

function selecionarCartao(idx, el) {
  document.querySelectorAll('.cartao-fisico').forEach(c => c.classList.remove('ativo-cartao'));
  el.classList.add('ativo-cartao');
  const d = dadosCartoes[idx];
  if (!d) return;
  document.getElementById('lat-nome').textContent = d.nome;
  document.getElementById('lat-bandeira').textContent = d.bandeira;
  document.getElementById('lat-validade').textContent = d.validade;
  document.getElementById('lat-usado').textContent = d.usado;
  document.getElementById('barra-limite').style.width = d.usado;
}

function filtrarTipo(tipo, btn) {
  document.querySelectorAll('.chip-filtro').forEach(c => c.classList.remove('ativo'));
  btn.classList.add('ativo');
  document.querySelectorAll('.transacao-item').forEach(item => {
    const sep = item.nextElementSibling;
    if (tipo === 'todos' || item.dataset.tipo === tipo) {
      item.style.display = '';
      if (sep && sep.classList.contains('separador')) sep.style.display = '';
    } else {
      item.style.display = 'none';
      if (sep && sep.classList.contains('separador')) sep.style.display = 'none';
    }
  });
}

function abrirModalSolicitar() {
  const modal = document.getElementById('modal');
  modal.style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  document.querySelectorAll('.opcao-cartao').forEach(o => o.classList.remove('selecionado'));
}

function selecionarOpcao(el) {
  document.querySelectorAll('.opcao-cartao').forEach(o => o.classList.remove('selecionado'));
  el.classList.add('selecionado');
}

function confirmarSolicitar() {
  const selecionado = document.querySelector('.opcao-cartao.selecionado');
  if (!selecionado) { alert('Selecione um tipo de cartão.'); return; }
  fecharModal();
  // Em produção: redirecionar para fluxo de solicitação
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) fecharModal();
});

// Gráficos
window.addEventListener('load', () => {
  const tooltipDefaults = {
    backgroundColor: '#1e1e2e', borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
    titleColor: '#eeeef8', bodyColor: '#7070a0', padding: 10, cornerRadius: 8
  };

  new Chart(document.getElementById('grafico-cat-cartao'), {
    type: 'doughnut',
    data: {
      labels: ['Tecnologia', 'Alimentação', 'Lazer', 'Transporte', 'Outros'],
      datasets: [{
        data: [820, 640, 480, 320, 580],
        backgroundColor: ['#8b5cf6', '#00f5a8', '#f472b6', '#fbbf24', '#60a5fa'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ' R$ ' + ctx.raw.toLocaleString('pt-BR') } }
      }
    }
  });

  new Chart(document.getElementById('grafico-fatura'), {
    type: 'bar',
    data: {
      labels: ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'],
      datasets: [{
        data: [2100, 3400, 1850, 2900, 2200, 2840],
        backgroundColor: ['rgba(139,92,246,0.4)','rgba(139,92,246,0.4)','rgba(139,92,246,0.4)','rgba(139,92,246,0.4)','rgba(139,92,246,0.4)','rgba(139,92,246,0.85)'],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ' R$ ' + ctx.raw.toLocaleString('pt-BR') } }
      },
      scales: {
        x: { ticks: { color: '#7070a0', font: { size: 11 } }, grid: { display: false }, border: { display: false } },
        y: { display: false }
      }
    }
  });
});
