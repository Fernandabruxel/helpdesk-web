/**
 * Logica das telas de chamados: listagem, novo chamado, detalhes e comentarios.
 */
document.addEventListener('DOMContentLoaded', async () => {
  await iniciarListaChamados();
  await iniciarNovoChamado();
  await iniciarDetalhesChamado();
});

async function iniciarListaChamados() {
  const tabela = document.getElementById('tabela-chamados');
  if (!tabela) return;

  protegerPagina();

  const filtroStatus = document.getElementById('filtro-status');
  const carregar = async () => {
    try {
      const status = filtroStatus ? filtroStatus.value : '';
      const chamados = await listarChamados(status || undefined);
      tabela.innerHTML = chamados.length
        ? chamados.map(c => linhaChamado(c)).join('')
        : '<tr><td colspan="4">Nenhum chamado encontrado.</td></tr>';
    } catch (err) {
      tabela.innerHTML = `<tr><td colspan="4">${err.message}</td></tr>`;
    }
  };

  if (filtroStatus) filtroStatus.addEventListener('change', carregar);
  await carregar();
}

async function iniciarNovoChamado() {
  const form = document.getElementById('form-novo-chamado');
  if (!form) return;

  protegerPagina();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const prioridade = document.getElementById('prioridade').value;
    const erroEl = document.getElementById('mensagem-erro');

    try {
      const resposta = await criarChamado({ titulo, descricao, prioridade });
      window.location.href = `chamado.html?id=${resposta.chamado.id}`;
    } catch (err) {
      erroEl.textContent = err.message;
      erroEl.style.display = 'block';
    }
  });
}

async function iniciarDetalhesChamado() {
  const container = document.getElementById('detalhes-chamado');
  if (!container) return;

  protegerPagina();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const usuario = getUsuarioLogado();

  async function recarregar() {
    try {
      const chamado = await buscarChamado(id);
      const comentarios = await listarComentarios(id);
      renderizarChamado(chamado, comentarios, usuario);
    } catch (err) {
      container.innerHTML = `<p class="alert alert-erro">${err.message}</p>`;
    }
  }

  await recarregar();

  container.addEventListener('submit', async (e) => {
    if (e.target.id === 'form-comentario') {
      e.preventDefault();
      const texto = document.getElementById('comentario').value;
      if (!texto.trim()) return;
      await adicionarComentario(id, texto);
      document.getElementById('comentario').value = '';
      await recarregar();
    }
  });

  container.addEventListener('change', async (e) => {
    if (e.target.id === 'select-status') {
      await alterarStatus(id, e.target.value);
      await recarregar();
    }
  });
}

function renderizarChamado(chamado, comentarios, usuario) {
  const container = document.getElementById('detalhes-chamado');
  const ehTecnico = usuario && usuario.tipo === 'tecnico';

  container.innerHTML = `
    <div class="card">
      <div class="page-heading">
        <h1>${chamado.titulo}</h1>
        <span class="badge badge-${classeStatus(chamado.status)}">${chamado.status}</span>
      </div>
      <p class="card-meta">Prioridade: ${chamado.prioridade}</p>
      <p class="card-meta">Cliente: ${chamado.cliente_nome}</p>
      <p class="card-meta">Tecnico: ${chamado.tecnico_nome || 'Ainda nao atribuido'}</p>
      <p class="card-meta">Aberto em: ${new Date(chamado.created_at).toLocaleString('pt-BR')}</p>
      <hr>
      <p>${chamado.descricao}</p>

      ${ehTecnico ? `
        <label for="select-status">Alterar status</label>
        <select id="select-status">
          <option value="Aberto" ${chamado.status === 'Aberto' ? 'selected' : ''}>Aberto</option>
          <option value="Em Atendimento" ${chamado.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option>
          <option value="Concluído" ${chamado.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
        </select>
      ` : ''}
    </div>

    <div class="card">
      <h2>Comentarios</h2>
      <div class="lista-comentarios">
        ${comentarios.length ? comentarios.map(c => `
          <div class="comentario">
            <strong>${c.usuario_nome}</strong> <span class="card-meta">(${c.usuario_tipo}) - ${new Date(c.created_at).toLocaleString('pt-BR')}</span>
            <p>${c.comentario}</p>
          </div>
        `).join('') : '<p>Nenhum comentario ainda.</p>'}
      </div>
      <form id="form-comentario">
        <label for="comentario">Adicionar comentario</label>
        <textarea id="comentario" rows="3" required></textarea>
        <button type="submit" class="btn btn-primary">Comentar</button>
      </form>
    </div>
  `;
}