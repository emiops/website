// EmiOps — Mobile nav toggle & smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');

  if (toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
});
