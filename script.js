/**
 * FLOANY VISIÓN Y SALUD — SISTEMA COMERCIAL FRONTEND v2.0
 * Arquitectura modular con conexión FastAPI + fallback local
 */

;(function () {
    'use strict';

    /* ────────────────────────────────────────
       1. CONFIGURACIÓN GLOBAL
    ──────────────────────────────────────── */
    const CFG = {
        API: 'https://floany-vision-2.onrender.com',
        WAPP:   '51912796290',
        KEY_CART: 'floany_cart_v2',
        KEY_USER: 'floany_user',
        KEY_DARK: 'floany_dark',
    };

    // Estado global
    const STATE = {
        productos:  [],
        filtro:     'Todos',
        busqueda:   '',
        cart:       [],
        user:       null,
        detProduct: null,
    };

    /* ────────────────────────────────────────
       2. DATOS MOCK (respaldo sin backend)
    ──────────────────────────────────────── */
    const HERO_DATA = [
        {
            badge: 'Nueva Colección 2026',
            titulo: 'Acetato Premium de Diseñador',
            desc:   'Monturas de alta gama ultra‑livianas con ergonomía avanzada. Ideal para uso diario en oficina o exteriores.',
            img:    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80',
            cta:    'Ver Catálogo',
            hash:   '#catalogo',
        },
        {
            badge: 'Laboratorio Certificado',
            titulo: 'Lentes de Medida de Precisión',
            desc:   'Cristales monofocales, bifocales y progresivos con filtro Blue Defense y antirreflejo hidrofóbico.',
            img:    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80',
            cta:    'Agendar Examen',
            hash:   '#receta',
        },
        {
            badge: 'Protección UV400',
            titulo: 'Gafas de Sol Polarizadas',
            desc:   'Lunas polarizadas de última generación que bloquean el 100 % de los rayos UV‑A y UV‑B.',
            img:    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
            cta:    'Explorar Colección',
            hash:   '#catalogo',
        },
    ];

    const MOCK_PRODUCTOS = [
        {
            id: 1, nombre: 'Aviador Black Edition', tipo: 'Gafas de Sol', precio: 159.00, stock: 5,
            descripcion: 'Montura clásica estilo aviador con lunas oscuras polarizadas y protección UV400 completa.',
            imagen: 'https://images.unsplash.com/photo-1625591342274-013866180be8?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 2, nombre: 'Acetato Flex Square', tipo: 'Lentes de Medida', precio: 189.00, stock: 8,
            descripcion: 'Marcos cuadrados de acetato flexible. Ideal para cristales multifocales y mayor durabilidad.',
            imagen: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 3, nombre: 'Urban Cateye Rose', tipo: 'Gafas de Sol', precio: 145.00, stock: 2,
            descripcion: 'Diseño retro cat‑eye en color rosa translúcido con protección solar avanzada certificada.',
            imagen: 'https://images.unsplash.com/photo-1583394293214-0b7db83b7b98?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 4, nombre: 'Titanium Round Slim', tipo: 'Lentes de Medida', precio: 220.00, stock: 4,
            descripcion: 'Montura circular ultraligera de titanio puro. Máximo confort sin marcas de peso en la nariz.',
            imagen: 'https://images.unsplash.com/photo-1586984504866-d25e72bb66c7?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 5, nombre: 'Sport Wrap Pro', tipo: 'Gafas de Sol', precio: 175.00, stock: 6,
            descripcion: 'Marco envolvente de policarbonato resistente a impactos. Perfecto para actividades al aire libre.',
            imagen: 'https://images.unsplash.com/photo-1508463703616-9929f2aa5acd?auto=format&fit=crop&w=500&q=80',
        },
        {
            id: 6, nombre: 'Classic Havana Gold', tipo: 'Lentes de Medida', precio: 198.00, stock: 0,
            descripcion: 'Elegante diseño havana con patillas doradas. Combinación de acetato premium y metal de alta resistencia.',
            imagen: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80',
        },
    ];

    /* ────────────────────────────────────────
       3. HERO CAROUSEL
    ──────────────────────────────────────── */
    function buildHero() {
        const wrap = document.getElementById('heroSlides');
        if (!wrap) return;

        wrap.innerHTML = HERO_DATA.map(s => `
            <div class="swiper-slide">
                <div class="hero-slide">
                    <div class="row align-items-center g-4 w-100 position-relative" style="z-index:1;">
                        <div class="col-md-6 anim-up">
                            <span class="hero-badge"><i class="bi bi-star-fill me-1" style="font-size:.7rem;"></i>${s.badge}</span>
                            <h1 class="hero-title">${s.titulo}</h1>
                            <p class="hero-sub">${s.desc}</p>
                            <div class="d-flex gap-3 flex-wrap">
                                <a href="${s.hash}" class="btn-ocean">${s.cta} <i class="bi bi-arrow-right"></i></a>
                                <a href="https://wa.me/${CFG.WAPP}" target="_blank" class="btn-ghost" style="border-color:rgba(255,255,255,.4);color:#fff!important;">
                                    <i class="bi bi-whatsapp"></i> WhatsApp
                                </a>
                            </div>
                        </div>
                        <div class="col-md-6 hero-img-wrap">
                            <img src="${s.img}" alt="${s.titulo}"
                                 onerror="this.src='https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        new Swiper('.heroSwiper', {
            loop: true,
            autoplay: { delay: 5500, disableOnInteraction: false },
            speed: 700,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            pagination: { el: '.swiper-pagination', clickable: true },
        });
    }

    /* ────────────────────────────────────────
       4. TEMA OSCURO / CLARO
    ──────────────────────────────────────── */
    function initTheme() {
        const btn  = document.getElementById('themeBtn');
        const icon = document.getElementById('themeIcon');
        const apply = dark => {
            document.body.classList.toggle('dark', dark);
            icon.className = dark ? 'bi bi-brightness-high-fill' : 'bi bi-moon-stars';
        };
        apply(localStorage.getItem(CFG.KEY_DARK) === 'true');
        btn?.addEventListener('click', () => {
            const isDark = !document.body.classList.contains('dark');
            localStorage.setItem(CFG.KEY_DARK, isDark);
            apply(isDark);
        });
    }

    /* ────────────────────────────────────────
       5. CARGAR PRODUCTOS (API + fallback)
    ──────────────────────────────────────── */
    async function fetchProductos() {
        try {
            const res = await fetch(`${CFG.API}/productos`, { signal: AbortSignal.timeout(4000) });
            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            STATE.productos = data.length ? data : MOCK_PRODUCTOS;
        } catch {
            STATE.productos = MOCK_PRODUCTOS;
        }
        renderProductos();
    }

    /* ────────────────────────────────────────
       6. RENDER CATÁLOGO
    ──────────────────────────────────────── */
    function renderProductos() {
        const grid  = document.getElementById('productGrid');
        const empty = document.getElementById('emptyState');
        if (!grid) return;

        const q = STATE.busqueda.toLowerCase();
        const lista = STATE.productos.filter(p => {
            const filtOk  = STATE.filtro === 'Todos' || p.tipo === STATE.filtro;
            const buscOk  = !q || p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q);
            return filtOk && buscOk;
        });

        if (!lista.length) {
            grid.innerHTML = '';
            empty.classList.remove('d-none');
            return;
        }
        empty.classList.add('d-none');

        grid.innerHTML = lista.map(p => {
            const agotado = p.stock === 0;
            const stockBadge = agotado
                ? `<span class="prod-badge-stock bg-danger text-white">Agotado</span>`
                : `<span class="prod-badge-stock bg-success text-white">Stock: ${p.stock}</span>`;

            const img = p.imagen || `https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80`;

            return `
            <div class="col-lg-4 col-md-6">
              <div class="prod-card">
                <div class="prod-img-zone" onclick="verDetalle(${p.id})">
                  <img src="${img}"
                       onerror="this.src='https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80'"
                       alt="${p.nombre}" loading="lazy">
                  <span class="prod-badge-cat">${p.tipo}</span>
                  ${stockBadge}
                </div>
                <div class="prod-body">
                  <div class="prod-name" onclick="verDetalle(${p.id})">${p.nombre}</div>
                  <div class="prod-desc">${p.descripcion || 'Montura de alta calidad con garantía de laboratorio.'}</div>
                  <div>
                    <div class="prod-price-label">Precio</div>
                    <div class="prod-price">S/ ${p.precio.toFixed(2)}</div>
                  </div>
                </div>
                <div class="prod-footer">
                  <button class="btn-add ${agotado ? '' : ''}"
                          onclick="agregarAlCarrito(${p.id})"
                          ${agotado ? 'disabled' : ''}>
                    <i class="bi bi-bag-plus"></i>
                    ${agotado ? 'Agotado' : 'Añadir'}
                  </button>
                  <button class="btn-detail" onclick="verDetalle(${p.id})" title="Ver detalle">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </div>
            </div>
            `;
        }).join('');
    }

    /* Filtros */
    document.getElementById('filterGroup')?.addEventListener('click', e => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        STATE.filtro = btn.dataset.filter;
        renderProductos();
    });

    document.getElementById('searchInput')?.addEventListener('input', e => {
        STATE.busqueda = e.target.value;
        renderProductos();
    });

    /* Función global para banners de categoría */
    window.aplicarFiltro = function (tipo) {
        STATE.filtro = tipo;
        document.querySelectorAll('.filter-pill').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === tipo);
        });
        renderProductos();
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    };

    /* ────────────────────────────────────────
       7. PROBADOR DE ROSTRO
    ──────────────────────────────────────── */
    window.filtrarRostro = function (tipo, el) {
        document.querySelectorAll('.face-card').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        const q = tipo === 'Redondo' ? 'square' : tipo === 'Cuadrado' ? 'round' : '';
        const input = document.getElementById('searchInput');
        if (input) { input.value = q; STATE.busqueda = q; }
        renderProductos();
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    };

    /* ────────────────────────────────────────
       8. CARRITO DE COMPRAS
    ──────────────────────────────────────── */
    function loadCart() {
        const saved = localStorage.getItem(CFG.KEY_CART);
        STATE.cart = saved ? JSON.parse(saved) : [];
        updateCartBadge();
    }

    function saveCart() {
        localStorage.setItem(CFG.KEY_CART, JSON.stringify(STATE.cart));
        updateCartBadge();
    }

    function updateCartBadge() {
        const total = STATE.cart.reduce((a, b) => a + (b.qty || 1), 0);
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = total;
            badge.style.display = total === 0 ? 'none' : '';
        }
    }

    window.agregarAlCarrito = function (id) {
        const p = STATE.productos.find(x => x.id === id);
        if (!p || p.stock === 0) return;
        const existing = STATE.cart.find(x => x.id === id);
        if (existing) existing.qty = (existing.qty || 1) + 1;
        else STATE.cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, qty: 1 });
        saveCart();
        toast(`${p.nombre} añadido al pedido ✓`);

        // Pequeña animación al badge
        const badge = document.getElementById('cartBadge');
        badge?.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300 });
    };

    window.eliminarItem = function (id) {
        STATE.cart = STATE.cart.filter(x => x.id !== id);
        saveCart();
        renderCart();
    };

    window.vaciarCarrito = function () {
        if (!confirm('¿Vaciar todo el pedido?')) return;
        STATE.cart = [];
        saveCart();
        renderCart();
    };

    function renderCart() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (!STATE.cart.length) {
            container.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="bi bi-bag-x" style="font-size:2.5rem;"></i>
                    <p class="mt-2 small">Tu carrito está vacío</p>
                </div>`;
            document.getElementById('cartTotal').textContent = 'S/ 0.00';
            return;
        }

        let total = 0;
        container.innerHTML = STATE.cart.map(it => {
            const sub = it.precio * it.qty;
            total += sub;
            return `
            <div class="cart-item">
              <div class="cart-qty-badge">${it.qty}</div>
              <div style="flex:1; min-width:0;">
                <div class="cart-item-name text-truncate">${it.nombre}</div>
                <div style="font-size:.76rem;color:var(--c-muted);">S/ ${it.precio.toFixed(2)} c/u</div>
              </div>
              <div class="cart-item-price">S/ ${sub.toFixed(2)}</div>
              <button class="cart-remove" onclick="eliminarItem(${it.id})" title="Eliminar">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>`;
        }).join('');

        document.getElementById('cartTotal').textContent = `S/ ${total.toFixed(2)}`;
    }

    // Abrir modal carrito → render
    document.getElementById('cartModal')?.addEventListener('show.bs.modal', renderCart);

    /* ────────────────────────────────────────
       9. CHECKOUT → WhatsApp
    ──────────────────────────────────────── */
    document.getElementById('checkoutForm')?.addEventListener('submit', e => {
        e.preventDefault();
        if (!STATE.cart.length) { toast('El carrito está vacío'); return; }

        const fd = new FormData(e.target);
        let items = '';
        let total = 0;
        STATE.cart.forEach(it => {
            const sub = it.precio * it.qty;
            total += sub;
            items += `• ${it.qty} x ${it.nombre} — S/ ${sub.toFixed(2)}%0A`;
        });

        const msg = [
            `*Nuevo Pedido — Floany Visión*`,
            ``,
            items,
            `*Total:* S/ ${total.toFixed(2)}`,
            ``,
            `*Datos del cliente:*`,
            `Nombre: ${fd.get('nombre')}`,
            `WhatsApp: ${fd.get('telefono')}`,
            `Distrito: ${fd.get('distrito')}`,
            `Dirección: ${fd.get('direccion')}`,
            `Entrega: ${fd.get('entrega')}`,
            `Pago: ${fd.get('pago')}`,
        ].join('%0A');

        window.open(`https://wa.me/${CFG.WAPP}?text=${encodeURIComponent(decodeURIComponent(msg))}`, '_blank');

        STATE.cart = [];
        saveCart();
        e.target.reset();
        bootstrap.Modal.getInstance(document.getElementById('cartModal'))?.hide();
        toast('Pedido enviado por WhatsApp');
    });

    /* ────────────────────────────────────────
       10. MODAL DETALLE PRODUCTO
    ──────────────────────────────────────── */
    window.verDetalle = function (id) {
        const p = STATE.productos.find(x => x.id === id);
        if (!p) return;
        STATE.detProduct = p;

        document.getElementById('detImg').src = p.imagen || '';
        document.getElementById('detName').textContent = p.nombre;
        document.getElementById('detPrice').textContent = `S/ ${p.precio.toFixed(2)}`;
        document.getElementById('detDesc').textContent = p.descripcion || '';
        document.getElementById('detCatBadge').textContent = p.tipo;
        document.getElementById('detSkuBadge').textContent = `SKU: FLO-${String(p.id).padStart(4, '0')}`;
        document.getElementById('detMat').textContent = p.tipo.includes('Sol') ? 'Policarbonato UV400' : 'Acetato Flex / TR90';

        const stockBadge = document.getElementById('detStockBadge');
        if (p.stock === 0) {
            stockBadge.className = 'badge bg-danger';
            stockBadge.textContent = 'Agotado';
        } else {
            stockBadge.className = 'badge bg-success';
            stockBadge.innerHTML = `<i class="bi bi-check-circle me-1"></i>En Stock (${p.stock})`;
        }

        const addBtn = document.getElementById('detAddBtn');
        addBtn.disabled = p.stock === 0;
        addBtn.innerHTML = p.stock === 0
            ? '<i class="bi bi-x-circle"></i> Sin Stock'
            : '<i class="bi bi-bag-plus"></i> Añadir al Pedido';

        bootstrap.Modal.getOrCreateInstance(document.getElementById('detModal')).show();
    };

    document.getElementById('detAddBtn')?.addEventListener('click', () => {
        if (!STATE.detProduct) return;
        agregarAlCarrito(STATE.detProduct.id);
        bootstrap.Modal.getInstance(document.getElementById('detModal'))?.hide();
    });

    document.getElementById('detWappBtn')?.addEventListener('click', () => {
        if (!STATE.detProduct) return;
        const msg = `Hola Floany Visión, deseo información del modelo *${STATE.detProduct.nombre}* (${STATE.detProduct.tipo}). ¿Está disponible?`;
        window.open(`https://wa.me/${CFG.WAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    /* ────────────────────────────────────────
       11. AUTENTICACIÓN (LOGIN / REGISTRO)
    ──────────────────────────────────────── */
    function initAuth() {
        const saved = localStorage.getItem(CFG.KEY_USER);
        if (saved) {
            STATE.user = JSON.parse(saved);
            document.getElementById('authBtnTxt').textContent = STATE.user.nombre.split(' ')[0];
        }

        // Toggle login/registro
        document.getElementById('toRegister')?.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = '';
            document.getElementById('authModalTitle').textContent = 'Crear Cuenta';
        });
        document.getElementById('toLogin')?.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = '';
            document.getElementById('authModalTitle').textContent = 'Iniciar Sesión';
        });

        // Login
        document.getElementById('loginForm')?.addEventListener('submit', async e => {
            e.preventDefault();
            const errEl = document.getElementById('loginError');
            errEl.classList.add('d-none');
            const body = { correo: document.getElementById('loginEmail').value, password: document.getElementById('loginPass').value };
            try {
                const res = await fetch(`${CFG.API}/auth/login`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Credenciales incorrectas');
                STATE.user = { nombre: data.nombre, token: data.token };
                localStorage.setItem(CFG.KEY_USER, JSON.stringify(STATE.user));
                document.getElementById('authBtnTxt').textContent = STATE.user.nombre.split(' ')[0];
                bootstrap.Modal.getInstance(document.getElementById('authModal'))?.hide();
                toast(`¡Bienvenido, ${STATE.user.nombre}! 👋`);
            } catch (err) {
                errEl.textContent = err.message;
                errEl.classList.remove('d-none');
            }
        });

        // Registro
        document.getElementById('registerForm')?.addEventListener('submit', async e => {
            e.preventDefault();
            const errEl = document.getElementById('regError');
            errEl.classList.add('d-none');
            const body = {
                nombre: document.getElementById('regName').value,
                correo: document.getElementById('regEmail').value,
                password: document.getElementById('regPass').value,
            };
            try {
                const res = await fetch(`${CFG.API}/auth/register`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Error al registrar');
                toast('Cuenta creada. ¡Ya puedes iniciar sesión!');
                document.getElementById('toLogin').click();
            } catch (err) {
                errEl.textContent = err.message;
                errEl.classList.remove('d-none');
            }
        });
    }

    /* ────────────────────────────────────────
       12. CHATBOT ASISTENTE
    ──────────────────────────────────────── */
    function initBot() {
        const toggle = document.getElementById('botToggle');
        const panel  = document.getElementById('botPanel');
        const close  = document.getElementById('botClose');
        const icon   = document.getElementById('botIcon');
        const msgs   = document.getElementById('botMsgs');

        toggle?.addEventListener('click', () => {
            const open = panel.classList.toggle('open');
            icon.className = open ? 'bi bi-x-lg' : 'bi bi-chat-dots-fill';
        });
        close?.addEventListener('click', () => {
            panel.classList.remove('open');
            icon.className = 'bi bi-chat-dots-fill';
        });

        window.botAccion = function (opcion) {
            const MAP = {
                catalogo: {
                    user: '🕶️ Ver catálogo completo',
                    bot:  'Perfecto, te llevo directamente al catálogo. Puedes filtrar por tipo de lente y hacer clic en cualquier producto para ver su ficha técnica completa.',
                    fn:   () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }),
                },
                receta: {
                    user: '📄 Cotizar receta médica',
                    bot:  'Genial. Te ubiqué en la sección de carga de receta. Sube tu prescripción médica y nuestros ópticos te cotizarán en minutos por WhatsApp.',
                    fn:   () => document.getElementById('receta')?.scrollIntoView({ behavior: 'smooth' }),
                },
                examen: {
                    user: '📅 Agendar examen visual',
                    bot:  '¡Excelente! Para agendar tu examen visual computarizado gratuito en nuestra sucursal de SJL, comunícate con nosotros por WhatsApp.',
                    extra: `<a href="https://wa.me/${CFG.WAPP}?text=Hola%20Floany%2C%20deseo%20agendar%20examen%20visual" target="_blank" class="bot-opt mt-1 d-inline-flex align-items-center gap-1" style="background:var(--c-whatsapp);color:#fff;border:none;"><i class="bi bi-whatsapp"></i> Coordinar por WhatsApp</a>`,
                },
                asesor: {
                    user: '💬 Hablar con especialista',
                    bot:  'Te conecto con nuestro optómetra de guardia ahora mismo:',
                    extra: `<a href="https://wa.me/${CFG.WAPP}?text=Hola%20Floany%2C%20necesito%20asesoría%20personalizada" target="_blank" class="bot-opt mt-1 d-inline-flex align-items-center gap-1" style="background:var(--c-ink);color:#fff;border:none;"><i class="bi bi-person-fill"></i> Conectar con Especialista</a>`,
                },
            };

            const item = MAP[opcion];
            if (!item) return;

            // Burbuja usuario
            msgs.innerHTML += `<div class="bbl bbl-user">${item.user}</div>`;

            setTimeout(() => {
                msgs.innerHTML += `<div class="bbl bbl-bot">${item.bot}${item.extra ? '<br>' + item.extra : ''}</div>`;
                msgs.scrollTop = msgs.scrollHeight;
                item.fn?.();
            }, 500);
        };
    }

    /* ────────────────────────────────────────
       13. DROPZONE RECETA
    ──────────────────────────────────────── */
    function initUpload() {
        const zone  = document.getElementById('uploadZone');
        const input = document.getElementById('recetaFile');
        const label = document.getElementById('uploadLabel');
        const prog  = document.getElementById('uploadProgress');
        const badge = document.getElementById('uploadBadge');

        zone?.addEventListener('click', () => input.click());

        zone?.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = 'var(--c-ocean)'; });
        zone?.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
        zone?.addEventListener('drop', e => {
            e.preventDefault();
            zone.style.borderColor = '';
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        });

        input?.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });

        function handleFile(file) {
            label.textContent = file.name;
            prog.style.display = 'block';
            badge.classList.add('d-none');
            setTimeout(() => {
                prog.style.display = 'none';
                badge.classList.remove('d-none');
                toast('Receta cargada correctamente ✓');
            }, 1400);
        }
    }

    /* ────────────────────────────────────────
       14. RELOJ EN VIVO
    ──────────────────────────────────────── */
    function initClock() {
        function tick() {
            const now = new Date();
            const clockEl = document.getElementById('liveClock');
            const dateEl  = document.getElementById('liveDate');
            if (clockEl) clockEl.textContent = now.toLocaleTimeString('es-PE', { hour12: false });
            if (dateEl)  dateEl.textContent  = now.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ────────────────────────────────────────
       15. TOAST GLOBAL
    ──────────────────────────────────────── */
    let toastTimer;
    function toast(msg) {
        const el  = document.getElementById('toastMsg');
        const txt = document.getElementById('toastTxt');
        if (!el || !txt) return;
        txt.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
    }

    /* ────────────────────────────────────────
       16. ANIMACIONES SCROLL (Intersection Observer)
    ──────────────────────────────────────── */
    function initObserver() {
        if (!window.IntersectionObserver) return;
        const els = document.querySelectorAll('.prod-card, .testi-card, .face-card, .cat-banner');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.animation = 'fadeUp .5s ease both';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
    }

    /* ────────────────────────────────────────
       17. INICIALIZACIÓN
    ──────────────────────────────────────── */
    function init() {
        buildHero();
        initTheme();
        initAuth();
        initBot();
        initUpload();
        initClock();
        loadCart();
        fetchProductos();
        initObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();