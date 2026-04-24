/* Infilantil — Privacy Policy · script.js */

(function () {
  'use strict';

  /* ── ACTIVE TOC LINK ON SCROLL ── */
  const sections  = document.querySelectorAll('.policy-section[id]');
  const tocLinks  = document.querySelectorAll('.toc-link[data-section]');

  if (sections.length && tocLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            tocLinks.forEach((link) => {
              link.classList.toggle('active', link.dataset.section === id);
            });
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ── SMOOTH SCROLL FOR TOC LINKS ── */
  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      const target   = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── SECTION ENTER ANIMATION ── */
  const animateSections = () => {
    const style = document.createElement('style');
    style.textContent = `
      .policy-section {
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .45s ease, transform .45s ease;
      }
      .policy-section.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    sections.forEach((section) => revealObserver.observe(section));
  };

  /* Respect reduced motion preference */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateSections();
  } else {
    sections.forEach((s) => s.classList.add('visible'));
  }

  /* ── SIDEBAR MOBILE COLLAPSE ── */
  const sidebar = document.getElementById('sidebar');
  const tocCard = sidebar ? sidebar.querySelector('.toc-card') : null;

  if (tocCard && window.innerWidth <= 768) {
    const tocHeader = tocCard.querySelector('.toc-header');
    const tocNav    = tocCard.querySelector('nav');
    const tocBack   = tocCard.querySelector('.toc-back');

    if (tocHeader && tocNav) {
      /* Collapsed by default on mobile */
      tocNav.style.display    = 'none';
      if (tocBack) tocBack.style.display = 'none';
      tocHeader.style.cursor  = 'pointer';
      tocHeader.setAttribute('role', 'button');
      tocHeader.setAttribute('aria-expanded', 'false');

      const toggleIcon = document.createElement('span');
      toggleIcon.textContent  = '▸';
      toggleIcon.style.cssText = 'margin-left:auto;transition:transform .2s;';
      tocHeader.appendChild(toggleIcon);

      tocHeader.addEventListener('click', () => {
        const isOpen = tocNav.style.display !== 'none';
        tocNav.style.display          = isOpen ? 'none' : 'block';
        if (tocBack) tocBack.style.display = isOpen ? 'none' : 'block';
        toggleIcon.style.transform    = isOpen ? 'rotate(0)' : 'rotate(90deg)';
        tocHeader.setAttribute('aria-expanded', String(!isOpen));
      });

      /* Close nav after clicking a link on mobile */
      tocNav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          tocNav.style.display          = 'none';
          if (tocBack) tocBack.style.display = 'none';
          toggleIcon.style.transform    = 'rotate(0)';
          tocHeader.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ── BACK TO TOP BUTTON ── */
  const backBtn = document.createElement('button');
  backBtn.setAttribute('aria-label', 'Volver al inicio');
  backBtn.innerHTML = '↑';
  backBtn.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 24px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--orange);
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(236,96,36,.45);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity .3s, transform .3s;
    z-index: 999;
    font-family: var(--font-body);
    line-height: 1;
  `;
  document.body.appendChild(backBtn);

  const toggleBackBtn = () => {
    const visible = window.scrollY > 500;
    backBtn.style.opacity   = visible ? '1' : '0';
    backBtn.style.transform = visible ? 'translateY(0)' : 'translateY(12px)';
    backBtn.style.pointerEvents = visible ? 'auto' : 'none';
  };

  window.addEventListener('scroll', toggleBackBtn, { passive: true });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── COPY EMAIL ON CLICK ── */
  document.querySelectorAll('.contact-value strong, .contact-final-data strong').forEach((el) => {
    const text = el.textContent.trim();
    if (text.includes('@')) {
      el.style.cssText = 'cursor:pointer;text-decoration:underline dotted;';
      el.title = 'Copiar correo';
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
          const original = el.textContent;
          el.textContent = '¡Copiado!';
          setTimeout(() => { el.textContent = original; }, 1800);
        }).catch(() => {});
      });
    }
  });

})();
