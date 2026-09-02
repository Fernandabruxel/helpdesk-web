/**
 * Camada centralizada de comunicacao com a HelpDesk API.
 */

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('helpdesk_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function tratarResposta(res) {
  const dados = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('helpdesk_token');
      localStorage.removeItem('helpdesk_usuario');
      if (!location.pathname.endsWith('login.html') && !location.pathname.endsWith('cadastro.html')) {
        window.location.href = 'login.html';
      }
    }
    throw new Error(dados.erro || 'Ocorreu um erro na requisicao.');
  }
  return dados;
}

async function login(dados) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(dados)
  });
  return tratarResposta(res);
}

async function registrarUsuario(dados) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(dados)
  });
  return tratarResposta(res);
}

async function listarChamados(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${API_URL}/chamados${query}`, { headers: getHeaders() });
  return tratarResposta(res);
}

async function buscarChamado(id) {
  const res = await fetch(`${API_URL}/chamados/${id}`, { headers: getHeaders() });
  return tratarResposta(res);
}

async function criarChamado(dados) {
  const res = await fetch(`${API_URL}/chamados`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(dados)
  });
  return tratarResposta(res);
}

async function atualizarChamado(id, dados) {
  const res = await fetch(`${API_URL}/chamados/${id}`, {
    method: 'PUT', headers: getHeaders(), body: JSON.stringify(dados)
  });
  return tratarResposta(res);
}

async function alterarStatus(id, status) {
  const res = await fetch(`${API_URL}/chamados/${id}/status`, {
    method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status })
  });
  return tratarResposta(res);
}

async function listarComentarios(id) {
  const res = await fetch(`${API_URL}/chamados/${id}/comentarios`, { headers: getHeaders() });
  return tratarResposta(res);
}

async function adicionarComentario(id, comentario) {
  const res = await fetch(`${API_URL}/chamados/${id}/comentarios`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify({ comentario })
  });
  return tratarResposta(res);
}