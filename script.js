/**
 * FLOANY VISIÓN Y SALUD — SISTEMA COMERCIAL FRONTEND v3.0
 * Con favoritos, pedidos, recetas y perfil de usuario completo
 */

;(function () {
    'use strict';

    const CFG = {
        API:        'https://floany-vision-2.onrender.com',
        WAPP:       '51912796290',
        KEY_CART:   'floany_cart_v2',
        KEY_USER:   'floany_user',
        KEY_DARK:   'floany_dark',
        KEY_FAVS:   'floany_favs',
        KEY_ORDERS: 'floany_orders',
        KEY_RECETAS:'floany_recetas',
    };

    const STATE = {
        productos:  [],
        filtro:     'Todos',
        busqueda:   '',
        cart:       [],
        user:       null,
        detProduct: null,
    };

    const HERO_DATA = [
        { badge:'Nueva Colección 2026', titulo:'Acetato Premium de Diseñador', desc:'Monturas de alta gama ultra-livianas con ergonomía avanzada.', img:'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80', cta:'Ver Catálogo', hash:'#catalogo' },
        { badge:'Laboratorio Certificado', titulo:'Lentes de Medida de Precisión', desc:'Cristales con filtro Blue Defense y antirreflejo hidrofóbico.', img:'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=700&q=80', cta:'Agendar Examen', hash:'#receta' },
        { badge:'Protección UV400', titulo:'Gafas de Sol Polarizadas', desc:'Lunas polarizadas que bloquean el 100% de los rayos UV.', img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80', cta:'Explorar Colección', hash:'#catalogo' },
    ];

    const MOCK = [
        { id:1, nombre:'Aviador Black Edition', tipo:'Gafas de Sol', precio:159, stock:5, descripcion:'Montura aviador polarizada UV400.', imagen:'https://images.unsplash.com/photo-1625591342274-013866180be8?auto=format&fit=crop&w=500&q=80' },
        { id:2, nombre:'Acetato Flex Square', tipo:'Lentes de Medida', precio:189, stock:8, descripcion:'Marcos cuadrados de acetato flexible.', imagen:'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=500&q=80' },
        { id:3, nombre:'Urban Cateye Rose', tipo:'Gafas de Sol', precio:145, stock:2, descripcion:'Cat-eye rosa con protección solar.', imagen:'https://images.unsplash.com/photo-1583394293214-0b7db83b7b98?auto=format&fit=crop&w=500&q=80' },
        { id:4, nombre:'Titanium Round Slim', tipo:'Lentes de Medida', precio:220, stock:4, descripcion:'Montura circular ultraligera de titanio.', imagen:'https://images.unsplash.com/photo-1586984504866-d25e72bb66c7?auto=format&fit=crop&w=500&q=80' },
        { id:5, nombre:'Sport Wrap Pro', tipo:'Gafas de Sol', precio:175, stock:6, descripcion:'Marco envolvente para actividades al aire libre.', imagen:'https://images.unsplash.com/photo-1508463703616-9929f2aa5acd?auto=format&fit=crop&w=500&q=80' },
        { id:6, nombre:'Classic Havana Gold', tipo:'Lentes de Medida', precio:198, stock:0, descripcion:'Diseño havana con patillas doradas.', imagen:'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80' },
    ];

    // ── HERO ──
    function buildHero() {
        const wrap = document.getElementById('heroSlides');
        if (!wrap) return;
        wrap.innerHTML = HERO_DATA.map(s => `
            <div class="swiper-slide"><div class="hero-slide">
                <div class="row align-items-center g-4 w-100 position-relative" style="z-index:1;">
                    <div class="col-md-6 anim-up">
                        <span class="hero-badge"><i class="bi bi-star-fill me-1" style="font-size:.7rem;"></i>${s.badge}</span>
                        <h1 class="hero-title">${s.titulo}</h1>
                        <p class="hero-sub">${s.desc}</p>
                        <div class="d-flex gap-3 flex-wrap">
                            <a href="${s.hash}" class="btn-ocean">${s.cta} <i class="bi bi-arrow-right"></i></a>
                            <a href="https://wa.me/${CFG.WAPP}" target="_blank" class="btn-ghost" style="border-color:rgba(255,255,255,.4);color:#fff!important;"><i class="bi bi-whatsapp"></i> WhatsApp</a>
                        </div>
                    </div>
                    <div class="col-md-6 hero-img-wrap">
                        <img src="${s.img}" alt="${s.titulo}" onerror="this.src='https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80'">
                    </div>
                </div>
            </div></div>`).join('');
        new Swiper('.heroSwiper', { loop:true, autoplay:{delay:5500,disableOnInteraction:false}, speed:700, navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev'}, pagination:{el:'.swiper-pagination',clickable:true} });
    }

    // ── TEMA ──
    function initTheme() {
        const btn=document.getElementById('themeBtn'), icon=document.getElementById('themeIcon');
        const apply=dark=>{ document.body.classList.toggle('dark',dark); if(icon) icon.className=dark?'bi bi-brightness-high-fill':'bi bi-moon-stars'; };
        apply(localStorage.getItem(CFG.KEY_DARK)==='true');
        btn?.addEventListener('click',()=>{ const d=!document.body.classList.contains('dark'); localStorage.setItem(CFG.KEY_DARK,d); apply(d); });
    }

    // ── STORAGE HELPERS ──
    const getFavs    = ()=>{ try{return JSON.parse(localStorage.getItem(CFG.KEY_FAVS)||'[]')}catch{return[]} };
    const saveFavs   = f=>localStorage.setItem(CFG.KEY_FAVS,JSON.stringify(f));
    const getOrders  = ()=>{ try{return JSON.parse(localStorage.getItem(CFG.KEY_ORDERS)||'[]')}catch{return[]} };
    const saveOrders = o=>localStorage.setItem(CFG.KEY_ORDERS,JSON.stringify(o));
    const getRecetas = ()=>{ try{return JSON.parse(localStorage.getItem(CFG.KEY_RECETAS)||'[]')}catch{return[]} };
    const saveRecetas= r=>localStorage.setItem(CFG.KEY_RECETAS,JSON.stringify(r));

    // ── FAVORITOS ──
    window.toggleFavorito = function(id) {
        if (!STATE.user) { toast('Inicia sesión para guardar favoritos ❤️'); bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show(); return; }
        let favs=getFavs();
        const idx=favs.findIndex(f=>f.id===id);
        const p=STATE.productos.find(x=>x.id===id);
        if (!p) return;
        if (idx>=0){ favs.splice(idx,1); toast('Eliminado de favoritos'); }
        else { favs.push({id:p.id,nombre:p.nombre,precio:p.precio,imagen:p.imagen,tipo:p.tipo}); toast('❤️ Añadido a favoritos'); }
        saveFavs(favs);
        updateFavBtns();
        const statEl=document.getElementById('userStatFavs');
        if(statEl) statEl.textContent=getFavs().length;
    };

    function updateFavBtns() {
        const favs=getFavs();
        document.querySelectorAll('[data-fav-id]').forEach(btn=>{
            const id=parseInt(btn.dataset.favId);
            const isFav=favs.some(f=>f.id===id);
            btn.innerHTML=`<i class="bi bi-heart${isFav?'-fill':''}" style="color:${isFav?'#e53e3e':'var(--c-muted)'}"></i>`;
            btn.title=isFav?'Quitar de favoritos':'Añadir a favoritos';
        });
    }

    // ── PRODUCTOS ──
    async function fetchProductos() {
        try {
            const res=await fetch(`${CFG.API}/productos`,{signal:AbortSignal.timeout(5000)});
            if(!res.ok) throw new Error();
            const data=await res.json();
            STATE.productos=data.length?data:MOCK;
        } catch { STATE.productos=MOCK; }
        renderProductos();
    }

    function renderProductos() {
        const grid=document.getElementById('productGrid');
        const empty=document.getElementById('emptyState');
        if(!grid) return;
        const q=STATE.busqueda.toLowerCase();
        const lista=STATE.productos.filter(p=>{
            const filtOk=STATE.filtro==='Todos'||p.tipo===STATE.filtro;
            const buscOk=!q||p.nombre.toLowerCase().includes(q)||(p.descripcion||'').toLowerCase().includes(q);
            return filtOk&&buscOk;
        });
        if(!lista.length){ grid.innerHTML=''; empty.classList.remove('d-none'); return; }
        empty.classList.add('d-none');
        const favs=getFavs();
        grid.innerHTML=lista.map(p=>{
            const ag=p.stock===0;
            const isFav=favs.some(f=>f.id===p.id);
            const img=p.imagen||'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80';
            return `<div class="col-lg-4 col-md-6"><div class="prod-card">
                <div class="prod-img-zone" onclick="verDetalle(${p.id})">
                    <img src="${img}" onerror="this.src='https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80'" alt="${p.nombre}" loading="lazy">
                    <span class="prod-badge-cat">${p.tipo}</span>
                    <span class="prod-badge-stock ${ag?'bg-danger':'bg-success'} text-white">${ag?'Agotado':'Stock: '+p.stock}</span>
                    <button class="fav-card-btn" data-fav-id="${p.id}" onclick="event.stopPropagation();toggleFavorito(${p.id})" title="${isFav?'Quitar':'Guardar'}">
                        <i class="bi bi-heart${isFav?'-fill':''}" style="color:${isFav?'#e53e3e':''}"></i>
                    </button>
                </div>
                <div class="prod-body">
                    <div class="prod-name" onclick="verDetalle(${p.id})">${p.nombre}</div>
                    <div class="prod-desc">${p.descripcion||'Montura de alta calidad.'}</div>
                    <div><div class="prod-price-label">Precio</div><div class="prod-price">S/ ${p.precio.toFixed(2)}</div></div>
                </div>
                <div class="prod-footer">
                    <button class="btn-add" onclick="agregarAlCarrito(${p.id})" ${ag?'disabled':''}>
                        <i class="bi bi-bag-plus"></i> ${ag?'Agotado':'Añadir'}
                    </button>
                    <button class="btn-detail" onclick="verDetalle(${p.id})"><i class="bi bi-eye"></i></button>
                </div>
            </div></div>`;
        }).join('');
    }

    document.getElementById('filterGroup')?.addEventListener('click',e=>{
        const btn=e.target.closest('.filter-pill');
        if(!btn) return;
        document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active'); STATE.filtro=btn.dataset.filter; renderProductos();
    });
    document.getElementById('searchInput')?.addEventListener('input',e=>{ STATE.busqueda=e.target.value; renderProductos(); });
    window.aplicarFiltro=function(tipo){ STATE.filtro=tipo; document.querySelectorAll('.filter-pill').forEach(b=>b.classList.toggle('active',b.dataset.filter===tipo)); renderProductos(); document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}); };
    window.filtrarRostro=function(tipo,el){ document.querySelectorAll('.face-card').forEach(c=>c.classList.remove('active')); el.classList.add('active'); const q=tipo==='Redondo'?'square':tipo==='Cuadrado'?'round':''; const inp=document.getElementById('searchInput'); if(inp){inp.value=q;STATE.busqueda=q;} renderProductos(); document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'}); };

    // ── CARRITO ──
    function loadCart(){ try{STATE.cart=JSON.parse(localStorage.getItem(CFG.KEY_CART)||'[]')}catch{STATE.cart=[];} updateCartBadge(); }
    function saveCart(){ localStorage.setItem(CFG.KEY_CART,JSON.stringify(STATE.cart)); updateCartBadge(); }
    function updateCartBadge(){ const t=STATE.cart.reduce((a,b)=>a+(b.qty||1),0); const b=document.getElementById('cartBadge'); if(b){b.textContent=t;b.style.display=t===0?'none':'';} }

    window.agregarAlCarrito=function(id){
        const p=STATE.productos.find(x=>x.id===id);
        if(!p||p.stock===0) return;
        const ex=STATE.cart.find(x=>x.id===id);
        if(ex) ex.qty=(ex.qty||1)+1;
        else STATE.cart.push({id:p.id,nombre:p.nombre,precio:p.precio,qty:1,imagen:p.imagen});
        saveCart(); toast(`${p.nombre} añadido ✓`);
        document.getElementById('cartBadge')?.animate([{transform:'scale(1.6)'},{transform:'scale(1)'}],{duration:300});
    };
    window.eliminarItem=function(id){ STATE.cart=STATE.cart.filter(x=>x.id!==id); saveCart(); renderCart(); };
    window.vaciarCarrito=function(){ if(!confirm('¿Vaciar pedido?')) return; STATE.cart=[]; saveCart(); renderCart(); };

    function renderCart(){
        const c=document.getElementById('cartItems');
        if(!c) return;
        if(!STATE.cart.length){ c.innerHTML=`<div class="text-center py-4 text-muted"><i class="bi bi-bag-x" style="font-size:2.5rem;"></i><p class="mt-2 small">Tu carrito está vacío</p></div>`; document.getElementById('cartTotal').textContent='S/ 0.00'; return; }
        let tot=0;
        c.innerHTML=STATE.cart.map(it=>{ const s=it.precio*it.qty; tot+=s; return `<div class="cart-item"><div class="cart-qty-badge">${it.qty}</div><div style="flex:1;min-width:0;"><div class="cart-item-name text-truncate">${it.nombre}</div><div style="font-size:.76rem;color:var(--c-muted);">S/ ${it.precio.toFixed(2)} c/u</div></div><div class="cart-item-price">S/ ${s.toFixed(2)}</div><button class="cart-remove" onclick="eliminarItem(${it.id})"><i class="bi bi-x-circle-fill"></i></button></div>`; }).join('');
        document.getElementById('cartTotal').textContent=`S/ ${tot.toFixed(2)}`;
    }
    document.getElementById('cartModal')?.addEventListener('show.bs.modal',renderCart);

    // ── CHECKOUT ──
    document.getElementById('checkoutForm')?.addEventListener('submit',e=>{
        e.preventDefault();
        if(!STATE.cart.length){ toast('El carrito está vacío'); return; }
        const fd=new FormData(e.target);
        let items='', tot=0;
        const arr=[];
        STATE.cart.forEach(it=>{ const s=it.precio*it.qty; tot+=s; items+=`• ${it.qty} x ${it.nombre} — S/ ${s.toFixed(2)}%0A`; arr.push({nombre:it.nombre,qty:it.qty,precio:it.precio,subtotal:s}); });
        const orders=getOrders();
        orders.unshift({ id:Date.now(), fecha:new Date().toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'}), hora:new Date().toLocaleTimeString('es-PE',{hour12:false}), items:arr, total:tot, cliente:fd.get('nombre'), entrega:fd.get('entrega'), pago:fd.get('pago'), estado:'Enviado por WhatsApp' });
        saveOrders(orders);
        const statEl=document.getElementById('userStatOrders');
        if(statEl) statEl.textContent=orders.length;
        const msg=[`*Nuevo Pedido — Floany Visión*`,``,items,`*Total:* S/ ${tot.toFixed(2)}`,``,`*Cliente:*`,`Nombre: ${fd.get('nombre')}`,`WhatsApp: ${fd.get('telefono')}`,`Distrito: ${fd.get('distrito')}`,`Dirección: ${fd.get('direccion')}`,`Entrega: ${fd.get('entrega')}`,`Pago: ${fd.get('pago')}`].join('%0A');
        window.open(`https://wa.me/${CFG.WAPP}?text=${encodeURIComponent(decodeURIComponent(msg))}`,'_blank');
        STATE.cart=[]; saveCart(); e.target.reset();
        bootstrap.Modal.getInstance(document.getElementById('cartModal'))?.hide();
        toast('¡Pedido enviado! Revisa WhatsApp 🚀');
    });

    // ── MODAL DETALLE ──
    window.verDetalle=function(id){
        const p=STATE.productos.find(x=>x.id===id);
        if(!p) return;
        STATE.detProduct=p;
        const isFav=getFavs().some(f=>f.id===id);
        document.getElementById('detImg').src=p.imagen||'';
        document.getElementById('detName').textContent=p.nombre;
        document.getElementById('detPrice').textContent=`S/ ${p.precio.toFixed(2)}`;
        document.getElementById('detDesc').textContent=p.descripcion||'';
        document.getElementById('detCatBadge').textContent=p.tipo;
        document.getElementById('detSkuBadge').textContent=`SKU: FLO-${String(p.id).padStart(4,'0')}`;
        document.getElementById('detMat').textContent=p.tipo.includes('Sol')?'Policarbonato UV400':'Acetato Flex / TR90';
        const sb=document.getElementById('detStockBadge');
        if(p.stock===0){sb.className='badge bg-danger';sb.textContent='Agotado';}
        else{sb.className='badge bg-success';sb.innerHTML=`<i class="bi bi-check-circle me-1"></i>En Stock (${p.stock})`;}
        const ab=document.getElementById('detAddBtn');
        ab.disabled=p.stock===0;
        ab.innerHTML=p.stock===0?'<i class="bi bi-x-circle"></i> Sin Stock':'<i class="bi bi-bag-plus"></i> Añadir al Pedido';
        const fb=document.getElementById('detFavBtn');
        if(fb){
            const setFavBtn=()=>{ const f=getFavs().some(x=>x.id===id); fb.innerHTML=`<i class="bi bi-heart${f?'-fill':''}" style="color:${f?'#e53e3e':''}"></i> ${f?'En Favoritos':'Guardar'}`; };
            setFavBtn();
            fb.onclick=()=>{ toggleFavorito(p.id); setFavBtn(); updateFavBtns(); };
        }
        bootstrap.Modal.getOrCreateInstance(document.getElementById('detModal')).show();
    };
    document.getElementById('detAddBtn')?.addEventListener('click',()=>{ if(!STATE.detProduct) return; agregarAlCarrito(STATE.detProduct.id); bootstrap.Modal.getInstance(document.getElementById('detModal'))?.hide(); });
    document.getElementById('detWappBtn')?.addEventListener('click',()=>{ if(!STATE.detProduct) return; window.open(`https://wa.me/${CFG.WAPP}?text=${encodeURIComponent(`Hola Floany, deseo info del modelo *${STATE.detProduct.nombre}*`)}`,'_blank'); });

    // ── AUTH ──
    function initAuth(){
        const saved=localStorage.getItem(CFG.KEY_USER);
        if(saved){ STATE.user=JSON.parse(saved); window.__userLoggedIn=true; updateAuthBtn(); }
        document.getElementById('toRegister')?.addEventListener('click',e=>{ e.preventDefault(); document.getElementById('loginForm').style.display='none'; document.getElementById('registerForm').style.display=''; document.getElementById('authModalTitle').textContent='Crear Cuenta'; });
        document.getElementById('toLogin')?.addEventListener('click',e=>{ e.preventDefault(); document.getElementById('registerForm').style.display='none'; document.getElementById('loginForm').style.display=''; document.getElementById('authModalTitle').textContent='Iniciar Sesión'; });
        document.getElementById('loginForm')?.addEventListener('submit',async e=>{
            e.preventDefault();
            const err=document.getElementById('loginError'); err.classList.add('d-none');
            try{
                const res=await fetch(`${CFG.API}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({correo:document.getElementById('loginEmail').value,password:document.getElementById('loginPass').value}),signal:AbortSignal.timeout(60000)});
                const data=await res.json();
                if(!res.ok) throw new Error(data.detail||'Credenciales incorrectas');
                STATE.user={nombre:data.nombre,token:data.token,correo:document.getElementById('loginEmail').value};
                localStorage.setItem(CFG.KEY_USER,JSON.stringify(STATE.user));
                window.__userLoggedIn=true; updateAuthBtn();
                bootstrap.Modal.getInstance(document.getElementById('authModal'))?.hide();
                toast(`¡Bienvenido, ${STATE.user.nombre}! 👋`); updateFavBtns();
            }catch(ex){ err.textContent=ex.message; err.classList.remove('d-none'); }
        });
        document.getElementById('registerForm')?.addEventListener('submit',async e=>{
            e.preventDefault();
            const err=document.getElementById('regError'); err.classList.add('d-none');
            try{
                const res=await fetch(`${CFG.API}/auth/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre:document.getElementById('regName').value,correo:document.getElementById('regEmail').value,password:document.getElementById('regPass').value}),signal:AbortSignal.timeout(60000)});
                const data=await res.json();
                if(!res.ok) throw new Error(data.detail||'Error al registrar');
                toast('¡Cuenta creada! Inicia sesión 🎉'); document.getElementById('toLogin').click();
            }catch(ex){ err.textContent=ex.message; err.classList.remove('d-none'); }
        });
    }

    function updateAuthBtn(){
        const btn=document.getElementById('authBtn'), txt=document.getElementById('authBtnTxt');
        if(!STATE.user){ if(txt) txt.textContent='Ingresar'; return; }
        if(txt) txt.textContent=STATE.user.nombre.split(' ')[0];
        if(btn){ btn.removeAttribute('data-bs-toggle'); btn.removeAttribute('data-bs-target'); btn.onclick=()=>window.abrirModalUsuario(); }
    }

    // ── MODAL USUARIO ──
    window.abrirModalUsuario=function(){
        if(!STATE.user){ bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show(); return; }
        const n=STATE.user.nombre||'Usuario';
        document.getElementById('userAvatarBig').textContent=n.charAt(0).toUpperCase();
        if (STATE.user?.foto) {
    const av = document.getElementById('userAvatarBig');
    av.innerHTML = `<img src="${STATE.user.foto}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;" alt="foto">`;
    av.style.background = 'transparent';
    av.style.padding = '0';
}
        document.getElementById('userNameBig').textContent=n;
        document.getElementById('userEmailBig').textContent=STATE.user.correo||'';
        document.getElementById('editNombreUser').value=n;
        document.getElementById('editCorreoUser').value=STATE.user.correo||'';
        document.getElementById('userStatFavs').textContent=getFavs().length;
        document.getElementById('userStatOrders').textContent=getOrders().length;
        document.getElementById('userStatRecs').textContent=getRecetas().length;
        switchUserTab('favoritos',document.querySelector('.user-tab'));
        document.getElementById('userModal').classList.add('open');
    };
    window.cerrarModalUsuario=function(){ document.getElementById('userModal').classList.remove('open'); };

    window.switchUserTab=function(tab,el){
        document.querySelectorAll('.user-tab-content').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.user-tab').forEach(t=>t.classList.remove('active'));
        document.getElementById('tab-'+tab)?.classList.add('active');
        if(el) el.classList.add('active');
        if(tab==='favoritos') renderUserFavs();
        if(tab==='pedidos')   renderUserOrders();
        if(tab==='recetas')   renderUserRecetas();
    };

    function renderUserFavs(){
        const favs=getFavs(), c=document.getElementById('favList');
        if(!c) return;
        if(!favs.length){ c.innerHTML='<div class="user-empty"><i class="bi bi-heart"></i><p>No tienes favoritos aún</p><small>Haz clic en el ♡ de cualquier producto</small></div>'; return; }
        c.innerHTML=favs.map(f=>`<div class="fav-item"><img class="fav-img" src="${f.imagen||''}" onerror="this.src='https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=100&q=60'" alt="${f.nombre}"><div style="flex:1;min-width:0;"><div class="fav-name">${f.nombre}</div><div style="font-size:.75rem;color:var(--c-muted);">${f.tipo}</div><div class="fav-price">S/ ${f.precio.toFixed(2)}</div></div><div class="d-flex flex-column gap-1 align-items-center"><button class="fav-action-btn" onclick="agregarAlCarrito(${f.id});cerrarModalUsuario();" title="Al carrito"><i class="bi bi-bag-plus"></i></button><button class="fav-remove" onclick="toggleFavorito(${f.id});renderUserFavs();" title="Quitar"><i class="bi bi-x-circle-fill"></i></button></div></div>`).join('');
    }

    function renderUserOrders(){
        const orders=getOrders(), c=document.getElementById('pedidosList');
        if(!c) return;
        if(!orders.length){ c.innerHTML='<div class="user-empty"><i class="bi bi-bag"></i><p>No tienes pedidos aún</p><small>Tus compras aparecerán aquí automáticamente</small></div>'; return; }
        c.innerHTML=orders.map(o=>`<div class="order-card"><div class="d-flex justify-content-between align-items-start mb-2"><div><div style="font-weight:600;font-size:.88rem;">${o.fecha} · ${o.hora}</div><div style="font-size:.75rem;color:var(--c-muted);">${o.entrega} · ${o.pago}</div></div><span class="order-badge">${o.estado}</span></div><div class="order-items">${o.items.map(it=>`<div class="order-item-row"><span>${it.qty}x ${it.nombre}</span><span>S/ ${it.subtotal.toFixed(2)}</span></div>`).join('')}</div><div class="order-total">Total: <strong style="color:var(--c-ocean);">S/ ${o.total.toFixed(2)}</strong></div></div>`).join('');
    }

    function renderUserRecetas(){
        const recs=getRecetas(), c=document.getElementById('recetasList');
        if(!c) return;
        if(!recs.length){ c.innerHTML='<div class="user-empty"><i class="bi bi-file-earmark-medical"></i><p>No has subido recetas aún</p><small>Ve a la sección de receta para subir tu prescripción</small></div>'; return; }
        c.innerHTML=recs.map(r=>`<div class="receta-card"><i class="bi bi-file-earmark-check-fill" style="color:var(--c-ocean);font-size:1.4rem;"></i><div style="flex:1;"><div style="font-weight:600;font-size:.88rem;">${r.nombre}</div><div style="font-size:.75rem;color:var(--c-muted);">${r.fecha}</div></div><span style="font-size:.72rem;background:#d1ecf1;color:#0c5460;padding:.2rem .7rem;border-radius:50px;font-weight:600;">Cargada</span></div>`).join('');
    }

    window.guardarDatosUsuario=function(){
        const n=document.getElementById('editNombreUser').value.trim();
        if(!n){ toast('Ingresa tu nombre'); return; }
        STATE.user.nombre=n; localStorage.setItem(CFG.KEY_USER,JSON.stringify(STATE.user));
        document.getElementById('authBtnTxt').textContent=n.split(' ')[0];
        document.getElementById('userNameBig').textContent=n;
        document.getElementById('userAvatarBig').textContent=n.charAt(0).toUpperCase();
        toast('Datos actualizados ✓');
    };

    window.cerrarSesionUsuario=function(){
        if(!confirm('¿Cerrar sesión?')) return;
        STATE.user=null; window.__userLoggedIn=false; localStorage.removeItem(CFG.KEY_USER);
        const txt=document.getElementById('authBtnTxt'), btn=document.getElementById('authBtn');
        if(txt) txt.textContent='Ingresar';
        if(btn){ btn.setAttribute('data-bs-toggle','modal'); btn.setAttribute('data-bs-target','#authModal'); btn.onclick=null; }
        cerrarModalUsuario(); toast('Sesión cerrada'); updateFavBtns();
    };

    document.getElementById('userModal')?.addEventListener('click',function(e){ if(e.target===this) cerrarModalUsuario(); });

    // ── DROPZONE ──
    function initUpload(){
        const zone=document.getElementById('uploadZone'), input=document.getElementById('recetaFile');
        const label=document.getElementById('uploadLabel'), prog=document.getElementById('uploadProgress'), badge=document.getElementById('uploadBadge');
        zone?.addEventListener('click',()=>input.click());
        zone?.addEventListener('dragover',e=>{ e.preventDefault(); zone.style.borderColor='var(--c-ocean)'; });
        zone?.addEventListener('dragleave',()=>{ zone.style.borderColor=''; });
        zone?.addEventListener('drop',e=>{ e.preventDefault(); zone.style.borderColor=''; if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
        input?.addEventListener('change',e=>{ if(e.target.files[0]) handleFile(e.target.files[0]); });
        function handleFile(file){
            if(label) label.textContent=file.name;
            if(prog) prog.style.display='block';
            if(badge) badge.classList.add('d-none');
            setTimeout(()=>{
                if(prog) prog.style.display='none';
                if(badge) badge.classList.remove('d-none');
                const recs=getRecetas();
                recs.unshift({nombre:file.name,fecha:new Date().toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'})});
                saveRecetas(recs);
                const se=document.getElementById('userStatRecs'); if(se) se.textContent=recs.length;
                toast('Receta cargada ✓');
            },1400);
        }
    }

    // ── CHATBOT ──
    function initBot(){
        const toggle=document.getElementById('botToggle'), panel=document.getElementById('botPanel'), close=document.getElementById('botClose'), icon=document.getElementById('botIcon'), msgs=document.getElementById('botMsgs');
        toggle?.addEventListener('click',()=>{ const o=panel.classList.toggle('open'); icon.className=o?'bi bi-x-lg':'bi bi-chat-dots-fill'; });
        close?.addEventListener('click',()=>{ panel.classList.remove('open'); icon.className='bi bi-chat-dots-fill'; });
        window.botAccion=function(op){
            const MAP={
                catalogo:{user:'🕶️ Ver catálogo',bot:'Te llevo al catálogo. Filtra por tipo de lente.',fn:()=>document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'})},
                receta:{user:'📄 Cotizar receta',bot:'Sube tu prescripción y te cotizamos en minutos.',fn:()=>document.getElementById('receta')?.scrollIntoView({behavior:'smooth'})},
                examen:{user:'📅 Agendar examen',bot:'Para tu examen gratuito en SJL:',extra:`<a href="https://wa.me/${CFG.WAPP}?text=Hola%20Floany,%20deseo%20agendar%20examen" target="_blank" class="bot-opt mt-1 d-inline-flex align-items-center gap-1" style="background:var(--c-whatsapp);color:#fff;border:none;"><i class="bi bi-whatsapp"></i> Coordinar</a>`},
                asesor:{user:'💬 Especialista',bot:'Te conecto:',extra:`<a href="https://wa.me/${CFG.WAPP}?text=Hola%20Floany,%20necesito%20asesoría" target="_blank" class="bot-opt mt-1 d-inline-flex align-items-center gap-1" style="background:var(--c-ink);color:#fff;border:none;"><i class="bi bi-person-fill"></i> Conectar</a>`},
            };
            const item=MAP[op]; if(!item) return;
            msgs.innerHTML+=`<div class="bbl bbl-user">${item.user}</div>`;
            setTimeout(()=>{ msgs.innerHTML+=`<div class="bbl bbl-bot">${item.bot}${item.extra?'<br>'+item.extra:''}</div>`; msgs.scrollTop=msgs.scrollHeight; item.fn?.(); },500);
        };
    }

    // ── RELOJ ──
    function initClock(){ function tick(){ const n=new Date(); const c=document.getElementById('liveClock'); const d=document.getElementById('liveDate'); if(c) c.textContent=n.toLocaleTimeString('es-PE',{hour12:false}); if(d) d.textContent=n.toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); } tick(); setInterval(tick,1000); }

    // ── TOAST ──
    let toastT;
    function toast(msg){ const el=document.getElementById('toastMsg'),txt=document.getElementById('toastTxt'); if(!el||!txt) return; txt.textContent=msg; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2800); }

    // ── OBSERVER ──
    function initObserver(){ if(!window.IntersectionObserver) return; const obs=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){e.target.style.animation='fadeUp .5s ease both';obs.unobserve(e.target);} }),{threshold:0.1}); document.querySelectorAll('.prod-card,.testi-card,.face-card,.cat-banner').forEach(el=>obs.observe(el)); }

    // ── INIT ──
    function init(){ buildHero(); initTheme(); initAuth(); initBot(); initUpload(); initClock(); loadCart(); fetchProductos(); initObserver();initCountdown();initCounters();initBackToTop();initReveal();initGoogleAuth(); }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
    else init();


    // ── CUENTA REGRESIVA ──
    function initCountdown() {
        const target = new Date();
        target.setDate(target.getDate() + 7); // 7 días desde hoy
        target.setHours(23, 59, 59, 0);
 
        function tick() {
            const now  = new Date();
            const diff = target - now;
            if (diff <= 0) { clearInterval(cdInt); return; }
            const days  = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins  = Math.floor((diff % 3600000)  / 60000);
            const secs  = Math.floor((diff % 60000)    / 1000);
            const pad   = n => String(n).padStart(2, '0');
            const el = id => document.getElementById(id);
            if(el('cdDays'))  el('cdDays').textContent  = pad(days);
            if(el('cdHours')) el('cdHours').textContent = pad(hours);
            if(el('cdMins'))  el('cdMins').textContent  = pad(mins);
            if(el('cdSecs'))  el('cdSecs').textContent  = pad(secs);
        }
        tick();
        const cdInt = setInterval(tick, 1000);
    }
 
    // ── CONTADOR ANIMADO ──
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;
 
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const dur    = 2000;
                const step   = 30;
                const inc    = target / (dur / step);
                let current  = 0;
                obs.unobserve(el);
                const timer = setInterval(() => {
                    current += inc;
                    if (current >= target) {
                        el.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current) + suffix;
                    }
                }, step);
            });
        }, { threshold: 0.3 });
 
        counters.forEach(c => obs.observe(c));
    }
 
    // ── FAQ ──
    window.toggleFaq = function(btn) {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Cerrar todos
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    };
 
    // ── QUIZ ──
    const quizAnswers = {};
    let quizCurrentStep = 1;
    const quizTotal = 3;
 
    window.quizSelect = function(step, val) {
        quizAnswers[step] = val;
        // Marcar opción seleccionada
        document.querySelectorAll(`#quizStep${step} .quiz-opt`).forEach(b => b.classList.remove('selected'));
        document.querySelector(`#quizStep${step} [data-val="${val}"]`)?.classList.add('selected');
 
        // Avanzar automáticamente
        setTimeout(() => {
            if (step < quizTotal) {
                quizGoTo(step + 1);
            } else {
                showQuizResult();
            }
        }, 400);
    };
 
    function quizGoTo(step) {
        document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
        document.getElementById(`quizStep${step}`)?.classList.add('active');
        quizCurrentStep = step;
        const pct = ((step - 1) / quizTotal) * 100;
        document.getElementById('quizProgress').style.width = pct + '%';
        document.getElementById('quizStepLabel').textContent = `Pregunta ${step} de ${quizTotal}`;
    }
 
    function showQuizResult() {
        document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
        document.getElementById('quizProgress').style.width = '100%';
        document.getElementById('quizStepLabel').textContent = '¡Resultado listo!';
 
        const uso    = quizAnswers[1];
        const estilo = quizAnswers[2];
        const budget = quizAnswers[3];
 
        // Lógica de recomendación
        let title, desc, img, badge, filtro;
 
        if (uso === 'sol' || uso === 'estilo') {
            if (estilo === 'sport') {
                title  = 'Sport Wrap Pro';
                desc   = 'Marco envolvente de policarbonato ultra-resistente. Ideal para actividades al aire libre con máxima protección UV400.';
                img    = 'https://images.unsplash.com/photo-1508463703616-9929f2aa5acd?auto=format&fit=crop&w=400&q=80';
                badge  = '🏃 Perfecto para ti';
                filtro = 'Gafas de Sol';
            } else if (estilo === 'clasico') {
                title  = 'Aviador Black Edition';
                desc   = 'Clásico atemporal con lunas polarizadas. Elegante para cualquier ocasión con protección UV400 certificada.';
                img    = 'https://images.unsplash.com/photo-1625591342274-013866180be8?auto=format&fit=crop&w=400&q=80';
                badge  = '🎩 Clásico elegante';
                filtro = 'Gafas de Sol';
            } else {
                title  = 'Urban Cateye Rose';
                desc   = 'Diseño retro cat-eye moderno con estilo propio. El complemento perfecto para tu look cotidiano.';
                img    = 'https://images.unsplash.com/photo-1583394293214-0b7db83b7b98?auto=format&fit=crop&w=400&q=80';
                badge  = '✨ Tu estilo, tu montura';
                filtro = 'Gafas de Sol';
            }
        } else if (uso === 'trabajo' || uso === 'medida') {
            if (budget === 'alto' || estilo === 'clasico') {
                title  = 'Titanium Round Slim';
                desc   = 'Montura ultraligera de titanio puro. Sin presión en la nariz, ideal para largas jornadas frente al computador.';
                img    = 'https://images.unsplash.com/photo-1586984504866-d25e72bb66c7?auto=format&fit=crop&w=400&q=80';
                badge  = '💎 Alta gama';
                filtro = 'Lentes de Medida';
            } else {
                title  = 'Acetato Flex Square';
                desc   = 'Marcos cuadrados de acetato flexible con filtro Blue Defense integrado. Ideal para proteger tu visión digital.';
                img    = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80';
                badge  = '💻 Para tu trabajo';
                filtro = 'Lentes de Medida';
            }
        } else {
            title  = 'Classic Havana Gold';
            desc   = 'Diseño clásico havana con patillas doradas. Un ícono de la moda óptica que nunca pasa de moda.';
            img    = 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80';
            badge  = '👑 Top recomendado';
            filtro = 'Lentes de Medida';
        }
 
        document.getElementById('quizResultBadge').textContent = badge;
        document.getElementById('quizResultTitle').textContent = title;
        document.getElementById('quizResultDesc').textContent  = desc;
        document.getElementById('quizResultImg').src           = img;
        document.getElementById('quizResultImg').alt           = title;
 
        // Guardar filtro para el botón
        window._quizFiltro = filtro;
        window._quizBusqueda = title.split(' ')[0];
 
        const result = document.getElementById('quizResult');
        result.classList.add('show');
    }
 
    window.aplicarFiltroQuiz = function() {
        STATE.filtro   = window._quizFiltro || 'Todos';
        STATE.busqueda = '';
        document.querySelectorAll('.filter-pill').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === STATE.filtro);
        });
        const inp = document.getElementById('searchInput');
        if (inp) inp.value = '';
        renderProductos();
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    };
 
    window.resetQuiz = function() {
        Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);
        quizCurrentStep = 1;
        document.getElementById('quizResult').classList.remove('show');
        document.querySelectorAll('.quiz-opt').forEach(b => b.classList.remove('selected'));
        quizGoTo(1);
        document.getElementById('quizProgress').style.width = '0%';
        document.getElementById('quizStepLabel').textContent = 'Pregunta 1 de 3';
    };
 
    // ── BOTÓN VOLVER ARRIBA ──
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });
    }
 
    // ── REVEAL SCROLL ──
    function initReveal() {
        if (!window.IntersectionObserver) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.08 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }
    // ── GOOGLE LOGIN ──
    const GOOGLE_CLIENT_ID = '943009217020-e288botjtslisa8r0m30r46vfj5d6ucc.apps.googleusercontent.com';
 
    // Inicializar Google Identity Services
    function initGoogleAuth() {
        if (!window.google) {
            setTimeout(initGoogleAuth, 500);
            return;
        }
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
        });
    }
 
    // Abrir popup de Google al hacer clic
    window.loginConGoogle = function() {
        if (!window.google) { toast('Error al cargar Google. Recarga la página.'); return; }
        window.google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback: usar OAuth popup
                const client = window.google.accounts.oauth2.initTokenClient({
                    client_id: GOOGLE_CLIENT_ID,
                    scope: 'email profile',
                    callback: (response) => {
                        if (response.access_token) fetchGoogleUserInfo(response.access_token);
                    },
                });
                client.requestAccessToken();
            }
        });
    };
 
    // Manejar respuesta de Google (token JWT)
    async function handleGoogleResponse(response) {
        try {
            const credential = response.credential;
            // Decodificar el JWT de Google (sin verificar, solo para obtener datos)
            const payload = JSON.parse(atob(credential.split('.')[1]));
            await procesarUsuarioGoogle(payload.name, payload.email, payload.picture);
        } catch (err) {
            toast('Error al iniciar sesión con Google');
            console.error(err);
        }
    }
 
    // Obtener info del usuario con access token
    async function fetchGoogleUserInfo(accessToken) {
        try {
            const res  = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const user = await res.json();
            await procesarUsuarioGoogle(user.name, user.email, user.picture);
        } catch (err) {
            toast('Error al obtener datos de Google');
        }
    }
 
    // Procesar usuario de Google: registrar o loguear en nuestro backend
    async function procesarUsuarioGoogle(nombre, correo, foto) {
        try {
            // Intentar login primero
            const loginRes = await fetch(`${CFG.API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password: `google_${correo}_oauth` }),
                signal: AbortSignal.timeout(10000),
            });
 
            if (loginRes.ok) {
                const data = await loginRes.json();
                guardarSesionGoogle(data.nombre, correo, foto, data.token);
                return;
            }
 
            // Si no existe, registrar automáticamente
            const regRes = await fetch(`${CFG.API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    correo,
                    password: `google_${correo}_oauth`,
                }),
                signal: AbortSignal.timeout(10000),
            });
 
            if (regRes.ok) {
                // Loguear después de registrar
                const loginRes2 = await fetch(`${CFG.API}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ correo, password: `google_${correo}_oauth` }),
                    signal: AbortSignal.timeout(10000),
                });
                const data2 = await loginRes2.json();
                guardarSesionGoogle(data2.nombre, correo, foto, data2.token);
            }
        } catch (err) {
            // Si el backend falla, loguear solo en frontend
            guardarSesionGoogle(nombre, correo, foto, null);
        }
    }
 
    function guardarSesionGoogle(nombre, correo, foto, token) {
        STATE.user = { nombre, correo, foto, token, loginMethod: 'google' };
        localStorage.setItem(CFG.KEY_USER, JSON.stringify(STATE.user));
          // Actualizar botón navbar con foto
            const authBtn = document.getElementById('authBtn');
            if (authBtn && foto) {
            const imgNav = document.createElement('img');
            imgNav.src = foto;
            imgNav.style.cssText = 'width:28px;height:28px;border-radius:50%;object-fit:cover;margin-right:6px;';
            authBtn.prepend(imgNav);
}
        window.__userLoggedIn = true;
 
        // Actualizar botón con foto de Google
        const btn = document.getElementById('authBtn');
        const txt = document.getElementById('authBtnTxt');
        if (txt) txt.textContent = nombre.split(' ')[0];
        if (btn) {
            btn.removeAttribute('data-bs-toggle');
            btn.removeAttribute('data-bs-target');
            btn.onclick = () => window.abrirModalUsuario();
        }
 
        // Cerrar modal auth
        bootstrap.Modal.getInstance(document.getElementById('authModal'))?.hide();
        toast(`¡Bienvenido, ${nombre}! 👋`);
        updateFavBtns();
 
        // Actualizar avatar con foto de Google
        const avatar = document.getElementById('userAvatarBig');
        if (avatar && foto) {
            avatar.innerHTML = `<img src="${foto}" class="user-google-photo" alt="${nombre}">`;
            avatar.style.background = 'transparent';
            avatar.style.padding = '0';
        }
    }

})();