// EmiOps — resilient logo fallback and accessible mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav-links a');
  const logo = document.querySelector('.logo');
  const logoImage = document.querySelector('.logo-img');

  if (logo && logoImage) {
    const showLogoFallback = () => logo.classList.add('image-failed');

    logoImage.addEventListener('error', showLogoFallback);
    if (logoImage.complete && logoImage.naturalWidth === 0) {
      showLogoFallback();
    }
  }

  if (nav && toggle) {
    const setMenuOpen = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(!nav.classList.contains('open'));
    });

    links.forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    });
  }
});
