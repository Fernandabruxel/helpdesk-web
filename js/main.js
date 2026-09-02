document.addEventListener('DOMContentLoaded', () => {
  const alerta = document.querySelector('.alert');
  if (alerta) {
    setTimeout(() => { alerta.style.display = 'none'; }, 5000);
  }
});