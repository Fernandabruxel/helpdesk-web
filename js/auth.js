/**
 * Gerenciamento de autenticacao no Front-end (login, logout, verificacao de sessao).
 */

function salvarSessao(usuario, token) {
  localStorage.setItem('helpdesk_token', token);
  localStorage.setItem('helpdesk_usuario', JSON.stringify(usuario));
}

function getUsuarioLogado() {
  const dados = localStorage.getItem('helpdesk_usuario');
  return dados ? JSON.parse(dados) : null;
}

function estaAutenticado() {
  return !!localStorage.getItem('helpdesk_token');
}

function protegerPagina() {
  if (!estaAutenticado()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('helpdesk_token');
  localStorage.removeItem('helpdesk_usuario');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      const erroEl = document.getElementById('mensagem-erro');
      try {
        const resposta = await login({ email, senha });
        salvarSessao(resposta.usuario, resposta.token);
        window.location.href = 'dashboard.html';
      } catch (err) {
        erroEl.textContent = err.message;
        erroEl.style.display = 'block';
      }
    });
  }

  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      const tipo = document.getElementById('tipo').value;
      const erroEl = document.getElementById('mensagem-erro');
      const sucessoEl = document.getElementById('mensagem-sucesso');
      try {
        await registrarUsuario({ nome, email, senha, tipo });
        sucessoEl.textContent = 'Cadastro realizado com sucesso! Redirecionando para login...';
        sucessoEl.style.display = 'block';
        erroEl.style.display = 'none';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      } catch (err) {
        erroEl.textContent = err.message;
        erroEl.style.display = 'block';
      }
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  const nomeUsuarioEl = document.getElementById('nome-usuario-logado');
  if (nomeUsuarioEl) {
    const usuario = getUsuarioLogado();
    if (usuario) nomeUsuarioEl.textContent = `${usuario.nome} (${usuario.tipo})`;
  }
});