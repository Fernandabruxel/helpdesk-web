/**
 * Logica da tela de Dashboard: metricas gerais e chamados recentes.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const containerMetricas = document.getElementById('metricas');
  const containerRecentes = document.getElementById('chamados-recentes');
  if (!containerMetricas) return;

  protegerPagina();

  try {
    const chamados = await listarChamados();

    const total = chamados.length;
    const abertos = chamados.filter(c => c.status === 'Aberto').length;
    const emAtendimento = chamados.filter(c => c.status === 'Em Atendimento').length;
    const concluidos = chamados.filter(c => c.status === 'Concluído').length;

    containerMetricas.innerHTML = `
      <div class="card metrica"><span class="metrica-numero">${total}</span><span class="metrica-label">Total de chamados</span></div>
      <div class="card metrica"><span class="metrica-numero">${abertos}</span><span class="metrica-label">Abertos</span></div>
      <div class="card metrica"><span class="metrica-numero">${emAtendimento}</span><span class="metrica-label">Em atendimento</span></div>
      <div class="card metrica"><span class="metrica-numero">${concluidos}</span><span class="metrica-label">Concluídos</span></div>
    `;

    const recentes = chamados.slice(0, 5);
    containerRecentes.innerHTML = recentes.length
      ? recentes.map(c => linhaChamado(c)).join('')
      : '<tr><td colspan="4">Nenhum chamado ainda.</td></tr>';
  } catch (err) {
    containerMetricas.innerHTML = `<p class="alert alert-erro">${err.message}</p>`;
  }
});

function linhaChamado(c) {
  return `
    <tr onclick="window.location.href='chamado.html?id=${c.id}'" style="cursor:pointer">
      <td>${c.titulo}</td>
      <td><span class="badge badge-${classeStatus(c.status)}">${c.status}</span></td>
      <td>${c.prioridade}</td>
      <td>${new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
    </tr>`;
}

function classeStatus(status) {
  if (status === 'Aberto') return 'aberto';
  if (status === 'Em Atendimento') return 'atendimento';
  return 'concluido';
}