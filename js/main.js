/**
 * WILDER YESID SEPÚLVEDA OCAMPO
 * Herramientas y Maquinaria de Construcción — Medellín
 * JavaScript modular — producción lista
 */

'use strict';

/* ─────────────────────────────────────────────────────────
   MÓDULO: Cursor personalizado
───────────────────────────────────────────────────────── */
const Cursor = (() => {
  const cursorEl = document.getElementById('cursor');
  const ringEl   = document.getElementById('cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);
    if (ringEl) {
      ringEl.style.left = ringX + 'px';
      ringEl.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animate);
  }

  function init() {
    if (!cursorEl || !ringEl) return;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorEl.style.left = e.clientX + 'px';
      cursorEl.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => {
      cursorEl.style.opacity = '0'; ringEl.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorEl.style.opacity = '1'; ringEl.style.opacity = '1';
    });

    document.querySelectorAll(
      'a, button, .product-card, .service-card, .filter-btn, .nav-link, .social-btn, .contact-item, [role="button"]'
    ).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    animate();
  }

  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Navegación
───────────────────────────────────────────────────────── */
const Nav = (() => {
  const navbar   = document.getElementById('navbar');
  const toggle   = document.getElementById('nav-toggle');
  const mobile   = document.getElementById('mobile-menu');
  const progress = document.getElementById('progress-bar');
  const backTop  = document.getElementById('back-top');
  const links    = document.querySelectorAll('.nav-link[data-section]');

  function updateScroll() {
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight - window.innerHeight;

    if (navbar)   navbar.classList.toggle('scrolled', scrollY > 40);
    if (progress) progress.style.width = ((scrollY / docH) * 100) + '%';
    if (backTop)  backTop.classList.toggle('visible', scrollY > 600);

    links.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (!section) return;
      const rect   = section.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= 120;
      link.classList.toggle('active', inView);
    });
  }

  function toggleMobile() {
    const isOpen = mobile.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobile() {
    mobile.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    if (toggle) toggle.addEventListener('click', toggleMobile);
    if (mobile) mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));
    if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Animaciones al hacer scroll
───────────────────────────────────────────────────────── */
const Reveal = (() => {
  function init() {
    const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Contadores animados
───────────────────────────────────────────────────────── */
const Counter = (() => {
  function animateCounter(el, target, suffix, duration = 1800) {
    const start = performance.now();
    function update(time) {
      const progress = Math.min((time - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * ease).toLocaleString('es-CO') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Temporizador cuenta regresiva
───────────────────────────────────────────────────────── */
const Countdown = (() => {
  function init() {
    const el = document.getElementById('countdown');
    if (!el) return;

    const end = Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
    const fmt = n => String(n).padStart(2, '0');

    function tick() {
      const diff = Math.max(0, end - Date.now());
      el.querySelector('[data-d]').textContent = fmt(Math.floor(diff / 86400000));
      el.querySelector('[data-h]').textContent = fmt(Math.floor((diff % 86400000) / 3600000));
      el.querySelector('[data-m]').textContent = fmt(Math.floor((diff % 3600000) / 60000));
      el.querySelector('[data-s]').textContent = fmt(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Ticker animado
───────────────────────────────────────────────────────── */
const Ticker = (() => {
  function init() {
    const track = document.getElementById('ticker-track');
    if (track) track.innerHTML += track.innerHTML;
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Catálogo de productos
───────────────────────────────────────────────────────── */
const Products = (() => {

  /* ── Base de datos de productos ── */
  const PRODUCTOS = [
    {
      id: 1, category: 'excavadora', brand: 'Caterpillar', name: 'Excavadora 320 GX',
      desc: 'Excavadora hidráulica de 20 toneladas con tecnología Smart Mode para máxima eficiencia de combustible.',
      price: '485.000.000', tag: 'new', tagLabel: 'Nuevo 2025',
      specs: { 'Peso operacional': '20.6 ton', 'Potencia neta': '122 kW', 'Capacidad cuchara': '0.93 m³', 'Prof. excavación': '6.7 m' },
      longDesc: 'La 320 GX combina eficiencia y productividad de clase mundial. Con el sistema Cat Smart Mode, ajusta automáticamente la potencia y el caudal hidráulico para maximizar la eficiencia y reducir el consumo de combustible hasta un 35%.'
    },
    {
      id: 2, category: 'grua', brand: 'Liebherr', name: 'Grúa Torre LTM 1090',
      desc: 'Grúa todo terreno de 90 toneladas con alcance máximo de 60 metros. Ideal para grandes proyectos.',
      price: '1.250.000.000', oldPrice: '1.450.000.000', tag: 'sale', tagLabel: '-14%',
      specs: { 'Capacidad máx.': '90 ton', 'Longitud de pluma': '60 m', 'Altura de elevación': '55.8 m', 'Contrapeso': '7.5 ton' },
      longDesc: 'La LTM 1090 es una grúa todoterreno de alto rendimiento con sistema de transmisión hidrostática y dirección en todos los ejes para máxima maniobrabilidad en sitios confinados.'
    },
    {
      id: 3, category: 'niveladora', brand: 'Caterpillar', name: 'Motoniveladora 140 GC',
      desc: 'Motoniveladora de alto rendimiento con hoja de 3.7 m. Sistema electronhidráulico de precisión.',
      price: '380.000.000', oldPrice: '465.000.000', tag: 'sale', tagLabel: '-18%',
      specs: { 'Peso operacional': '14.9 ton', 'Potencia bruta': '134 kW', 'Longitud de hoja': '3.7 m', 'Inclinación lateral': '±18°' },
      longDesc: 'Diseñada para nivelación, conformación y mantenimiento de vías. El sistema de control electronhidráulico de Cat ofrece respuesta precisa y retroalimentación al operador.'
    },
    {
      id: 4, category: 'compactadora', brand: 'Mikasa', name: 'Placa Compactadora Mikasa',
      desc: 'Herramienta para aplanar y compactar superficies como arena, grava y asfalto. Ideal para acabados lisos en grandes áreas.',
      price: '520.000', tag: 'stock', tagLabel: 'En Stock',
      image: 'assets/placa-mikasa.png',
      specs: { 'Tipo': 'Placa compactadora', 'Aplicación': 'Arena, grava, asfalto', 'Especialidad': 'Acabados lisos', 'Cobertura': 'Grandes áreas' },
      longDesc: 'Herramienta de construcción diseñada para aplanar y compactar superficies como arena, grava y asfalto. A diferencia de los vibropisones (bailarinas), que son para suelos cohesivos y zanjas, las placas Mikasa se especializan en acabados lisos y grandes áreas.'
    },
    {
      id: 5, category: 'cargador', brand: 'Komatsu', name: 'Cargador Frontal WA380',
      desc: 'Cargador articulado de 3.0 m³ de capacidad. Motor Stage V de alta eficiencia energética.',
      price: '520.000.000', tag: 'new', tagLabel: 'Nuevo',
      specs: { 'Peso operacional': '17.3 ton', 'Capacidad balde': '3.0 m³', 'Potencia neta': '155 kW', 'Carga de vuelco': '14.0 ton' },
      longDesc: 'El WA380-8 está equipado con el sistema SmartLoader Logic de Komatsu para minimizar el consumo de combustible. La tecnología KOMTRAX permite monitoreo remoto en tiempo real.'
    },
    {
      id: 6, category: 'excavadora', brand: 'Komatsu', name: 'Excavadora PC 490 LC',
      desc: 'Excavadora de gran tonelaje para minería y proyectos de infraestructura. Cabina premium inteligente.',
      price: '890.000.000', tag: null, tagLabel: null,
      specs: { 'Peso operacional': '49.0 ton', 'Potencia neta': '270 kW', 'Capacidad cuchara': '2.8 m³', 'Prof. excavación': '7.7 m' },
      longDesc: 'La PC490LC-11 es la solución para proyectos de gran envergadura que demandan alta productividad y confiabilidad. El sistema Intelligent Machine Control permite control semi-autónomo.'
    },
    {
      id: 7, category: 'grua', brand: 'Manitowoc', name: 'Grúa Celosía 14000',
      desc: 'Grúa de celosía de 600 toneladas de capacidad. Para megaproyectos de construcción y energía.',
      price: '4.200.000.000', tag: null, tagLabel: null,
      specs: { 'Capacidad máx.': '600 ton', 'Longitud de pluma': '100 m', 'Radio máx.': '84 m', 'Contrapeso': '240 ton' },
      longDesc: 'Una de las grúas todoterreno más potentes del mundo. Con 600 toneladas y pluma de 100 metros, es la elección para plantas petroquímicas, centrales eléctricas y puentes.'
    },
    {
      id: 8, category: 'compactadora', brand: 'Bomag', name: 'Compactadora BW 213 D-5',
      desc: 'Rodillo monocilíndrico con sistema ECONOMIZER para optimización de pasadas de compactación.',
      price: '198.000.000', tag: 'stock', tagLabel: 'En Stock',
      specs: { 'Peso operacional': '13.0 ton', 'Ancho de tambor': '2.13 m', 'Amplitud vibradora': '1.9 mm', 'Potencia bruta': '129 kW' },
      longDesc: 'Con el sistema ECONOMIZER, el operador recibe retroalimentación en tiempo real sobre el grado de compactación, evitando pasadas innecesarias y reduciendo combustible hasta un 30%.'
    },
    {
      id: 9, category: 'cargador', brand: 'Volvo', name: 'Cargador L220H',
      desc: 'Cargador articulado de gran tonelaje con tecnología OptiShift para cambios de marcha sin interrupciones.',
      price: '680.000.000', tag: 'new', tagLabel: 'Nuevo 2025',
      specs: { 'Peso operacional': '32.0 ton', 'Capacidad balde': '5.5 m³', 'Potencia bruta': '270 kW', 'Carga de vuelco': '25.7 ton' },
      longDesc: 'El L220H establece nuevos estándares de productividad. La transmisión OptiShift con freno de conversor de par permite transiciones de marcha suaves sin pérdida de tracción.'
    }
  ];

  /* ── Íconos SVG por categoría ── */
  function getIcono(category) {
    const iconos = {
      excavadora: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5c200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="75" y="100" width="80" height="50" rx="3" fill="rgba(245,194,0,.06)"/><rect x="108" y="80" width="42" height="30" rx="2" fill="rgba(245,194,0,.1)"/><rect x="114" y="84" width="28" height="18" rx="1" fill="rgba(245,194,0,.18)"/><line x1="108" y1="92" x2="82" y2="55"/><line x1="82" y1="55" x2="52" y2="85"/><path d="M52 85 L30 92 L36 114 L56 108 Z" fill="rgba(245,194,0,.12)"/><rect x="60" y="148" width="110" height="18" rx="9" fill="rgba(245,194,0,.08)"/><circle cx="72" cy="157" r="7" fill="rgba(245,194,0,.1)"/><circle cx="92" cy="157" r="7" fill="rgba(245,194,0,.1)"/><circle cx="112" cy="157" r="7" fill="rgba(245,194,0,.1)"/><circle cx="132" cy="157" r="7" fill="rgba(245,194,0,.1)"/><circle cx="152" cy="157" r="7" fill="rgba(245,194,0,.1)"/><line x1="75" y1="100" x2="155" y2="100"/><line x1="145" y1="100" x2="145" y2="148"/></g></svg>`,
      grua: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5c200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="82" y="130" width="60" height="50" rx="2" fill="rgba(245,194,0,.06)"/><line x1="100" y1="40" x2="100" y2="130"/><line x1="100" y1="40" x2="172" y2="58"/><line x1="172" y1="58" x2="172" y2="82"/><line x1="100" y1="50" x2="100" y2="180"/><line x1="172" y1="82" x2="172" y2="152"/><rect x="154" y="152" width="36" height="22" rx="1" fill="rgba(245,194,0,.12)"/><line x1="100" y1="55" x2="172" y2="65" stroke="rgba(245,194,0,.35)" stroke-dasharray="4 4"/><line x1="100" y1="38" x2="60" y2="74"/><rect x="60" y="178" width="86" height="14" rx="7" fill="rgba(245,194,0,.08)"/></g></svg>`,
      niveladora: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5c200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="50" y="90" width="110" height="48" rx="4" fill="rgba(245,194,0,.06)"/><rect x="110" y="72" width="44" height="26" rx="2" fill="rgba(245,194,0,.1)"/><rect x="116" y="76" width="30" height="16" rx="1" fill="rgba(245,194,0,.18)"/><rect x="22" y="128" width="164" height="8" rx="2" fill="rgba(245,194,0,.15)"/><line x1="50" y1="90" x2="160" y2="90"/><line x1="70" y1="90" x2="54" y2="128"/><line x1="148" y1="90" x2="164" y2="128"/><circle cx="42" cy="152" r="16" fill="rgba(245,194,0,.06)"/><circle cx="165" cy="152" r="16" fill="rgba(245,194,0,.06)"/><circle cx="42" cy="152" r="8"/><circle cx="165" cy="152" r="8"/></g></svg>`,
      compactadora: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5c200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="50" y="88" width="108" height="52" rx="4" fill="rgba(245,194,0,.06)"/><rect x="68" y="68" width="72" height="28" rx="2" fill="rgba(245,194,0,.1)"/><rect x="74" y="72" width="58" height="18" rx="1" fill="rgba(245,194,0,.16)"/><ellipse cx="104" cy="155" rx="52" ry="18" fill="rgba(245,194,0,.06)"/><ellipse cx="104" cy="155" rx="44" ry="12" stroke="rgba(245,194,0,.3)" stroke-width="1"/><line x1="85" y1="50" x2="85" y2="68"/><circle cx="85" cy="44" r="10" fill="rgba(245,194,0,.1)"/><line x1="50" y1="116" x2="158" y2="116" stroke="rgba(245,194,0,.25)"/></g></svg>`,
      cargador: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#f5c200" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="65" y="90" width="90" height="55" rx="4" fill="rgba(245,194,0,.06)"/><rect x="112" y="70" width="38" height="28" rx="2" fill="rgba(245,194,0,.1)"/><rect x="117" y="74" width="26" height="18" rx="1" fill="rgba(245,194,0,.18)"/><line x1="65" y1="108" x2="32" y2="100"/><line x1="32" y1="100" x2="22" y2="120"/><line x1="22" y1="120" x2="44" y2="128"/><line x1="44" y1="128" x2="65" y2="120"/><circle cx="85" cy="160" r="18" fill="rgba(245,194,0,.06)"/><circle cx="135" cy="160" r="18" fill="rgba(245,194,0,.06)"/><circle cx="85" cy="160" r="9"/><circle cx="135" cy="160" r="9"/><line x1="65" y1="145" x2="155" y2="145"/></g></svg>`
    };
    return iconos[category] || iconos['excavadora'];
  }

  /* ── Renderizar productos ── */
  function renderizar(filtro = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const lista = filtro === 'all' ? PRODUCTOS : PRODUCTOS.filter(p => p.category === filtro);
    grid.innerHTML = '';

    lista.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'product-card reveal';
      card.style.transitionDelay = `${i * 0.07}s`;
      card.dataset.productId = p.id;

      const imgContent = p.image
        ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;transition:transform var(--t-slow) var(--ease-out);" loading="lazy" />`
        : getIcono(p.category);

      card.innerHTML = `
        <div class="product-img-wrap">
          ${imgContent}
          <div class="product-img-overlay"></div>
          ${p.tag ? `<span class="product-tag tag-${p.tag}">${p.tagLabel}</span>` : ''}
          <button class="product-quick-view" data-product-id="${p.id}">Ver detalles →</button>
        </div>
        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-footer">
            <div>
              <div class="product-price">$${p.price}</div>
              ${p.oldPrice ? `<div class="product-price-old">$${p.oldPrice}</div>` : ''}
            </div>
            <button class="product-add" data-product-id="${p.id}">Cotizar</button>
          </div>
        </div>`;

      grid.appendChild(card);
    });

    // Activar animaciones en las nuevas tarjetas
    setTimeout(() => {
      grid.querySelectorAll('.product-card.reveal').forEach(el => el.classList.add('visible'));
    }, 50);

    // Eventos de clic
    grid.querySelectorAll('[data-product-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        abrirModal(parseInt(btn.dataset.productId));
      });
    });
  }

  /* ── Filtros ── */
  function initFiltros() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderizar(btn.dataset.filter);
      });
    });
  }

  /* ── Modal ── */
  function abrirModal(id) {
    const p        = PRODUCTOS.find(x => x.id === id);
    const modal    = document.getElementById('product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    if (!p || !modal || !backdrop) return;

    modal.querySelector('.modal-brand').textContent = p.brand;
    modal.querySelector('.modal-name').textContent  = p.name;
    modal.querySelector('.modal-desc').textContent  = p.longDesc;
    modal.querySelector('.modal-price').innerHTML   = `$${p.price} <small>COP</small>`;
    modal.querySelector('.modal-img').innerHTML = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;padding:16px;" loading="lazy" />`
      : getIcono(p.category);

    modal.querySelector('.modal-specs').innerHTML = Object.entries(p.specs).map(([k, v]) => `
      <div class="spec-row">
        <span class="spec-label">${k}</span>
        <span class="spec-val">${v}</span>
      </div>`).join('');

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) { backdrop.classList.remove('open'); document.body.style.overflow = ''; }
  }

  function initModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const quoteBtn = document.getElementById('modal-quote-btn');

    if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) cerrarModal(); });
    if (closeBtn) closeBtn.addEventListener('click', cerrarModal);
    if (quoteBtn) quoteBtn.addEventListener('click', () => {
      cerrarModal();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
  }

  function init() { renderizar('all'); initFiltros(); initModal(); }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Formulario de contacto
───────────────────────────────────────────────────────── */
const ContactForm = (() => {
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 11-6.219-8.56" stroke-linecap="round"/></svg> Enviando...`;
      btn.disabled = true;

      await new Promise(r => setTimeout(r, 1800));

      form.style.display = 'none';
      const success = document.getElementById('form-success');
      if (success) { success.style.display = 'flex'; success.style.flexDirection = 'column'; success.style.alignItems = 'center'; }
      showToast('✓ Mensaje enviado. Te contactamos pronto.');

      btn.innerHTML = originalHTML;
      btn.disabled = false;
    });
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   MÓDULO: Parallax hero
───────────────────────────────────────────────────────── */
const Parallax = (() => {
  function init() {
    const scene = document.querySelector('.hero-scene-wrapper');
    if (!scene) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        scene.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    }, { passive: true });
  }
  return { init };
})();


/* ─────────────────────────────────────────────────────────
   INICIALIZACIÓN
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Cursor.init();
  Nav.init();
  Reveal.init();
  Counter.init();
  Countdown.init();
  Ticker.init();
  Products.init();
  ContactForm.init();
  Parallax.init();

  console.log('%cWILDER YESID SEPÚLVEDA OCAMPO ✓', 'color:#f5c200;font-weight:bold;font-size:14px;');
});

// Keyframe spin para el botón de envío
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
