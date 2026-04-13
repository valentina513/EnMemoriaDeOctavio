// NAVEGACIÓN ENTRE PÁGINAS (con botones fijos)
document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const footerBtns = document.querySelectorAll('.footer-btn');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active-page');
        });
        const activePage = document.getElementById('page-' + pageId);
        if (activePage) {
            activePage.classList.add('active-page');
        }
        
        footerBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageId) {
                btn.classList.add('active');
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    footerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Pestañas de Fotos / Videos en Recuerdos
    const fotosTab = document.getElementById('fotos-tab');
    const videosTab = document.getElementById('videos-tab');
    const fotosContent = document.getElementById('fotos-content');
    const videosContent = document.getElementById('videos-content');

    if (fotosTab && videosTab && fotosContent && videosContent) {
        fotosTab.addEventListener('click', () => {
            fotosTab.classList.add('active');
            videosTab.classList.remove('active');
            fotosContent.classList.add('active-content');
            videosContent.classList.remove('active-content');
        });

        videosTab.addEventListener('click', () => {
            videosTab.classList.add('active');
            fotosTab.classList.remove('active');
            videosContent.classList.add('active-content');
            fotosContent.classList.remove('active-content');
        });
    }
    
    cargarMensajes();
    iniciarLightbox();
});

// ==================== MENSAJES ====================

// Cargar mensajes desde localStorage
function cargarMensajes() {
    const contenedor = document.getElementById("lista-tributos");
    if (!contenedor) return;
    
    const mensajes = JSON.parse(localStorage.getItem('mensajes_octavio') || '[]');
    
    // Guardar los mensajes originales (fijos)
    const originales = [];
    for (let i = 0; i < contenedor.children.length; i++) {
        const child = contenedor.children[i];
        if (!child.hasAttribute('data-guardado')) {
            originales.push(child.cloneNode(true));
        }
    }
    
    // Limpiar todo
    contenedor.innerHTML = '';
    
    // Restaurar originales
    originales.forEach(orig => {
        contenedor.appendChild(orig);
    });
    
    // Agregar mensajes guardados
    mensajes.forEach((msg, idx) => {
        const card = document.createElement("div");
        card.className = "tributo-card";
        card.setAttribute('data-guardado', 'true');
        card.innerHTML = `
            <div class="tributo-titulo">${escapeHtml(msg.titulo)}</div>
            <div class="tributo-texto">${escapeHtml(msg.texto)}</div>
            <div class="tributo-autor"><strong>${escapeHtml(msg.autor)}</strong></div>
            <button class="btn-eliminar" onclick="eliminarMensaje(${idx})" style="margin-top: 10px; background: #dc3545; color: white; border: none; padding: 5px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: all 0.3s;">🗑️ Eliminar</button>
        `;
        contenedor.appendChild(card);
    });
}

function guardarMensajes(mensajes) {
    localStorage.setItem('mensajes_octavio', JSON.stringify(mensajes));
}

function agregarMensaje() {
    const titulo = prompt("Título del mensaje:");
    const texto = prompt("Escribe el mensaje:");
    const autor = prompt("Tu nombre o relación:");

    if (!titulo || !texto || !autor) return;

    const mensajes = JSON.parse(localStorage.getItem('mensajes_octavio') || '[]');
    mensajes.push({ titulo, texto, autor });
    guardarMensajes(mensajes);
    cargarMensajes();
}

function eliminarMensaje(idx) {
    if (confirm("¿Eliminar este mensaje?")) {
        const mensajes = JSON.parse(localStorage.getItem('mensajes_octavio') || '[]');
        mensajes.splice(idx, 1);
        guardarMensajes(mensajes);
        cargarMensajes();
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ==================== LIGHTBOX ====================

function iniciarLightbox() {
    const imagenes = document.querySelectorAll(".galeria-item img");
    if (imagenes.length === 0) return;

    const lightbox = document.getElementById("lightbox");
    const imagenGrande = document.getElementById("imagen-grande");
    const cerrar = document.getElementById("cerrar");
    const next = document.querySelector(".next");
    const prev = document.querySelector(".prev");

    let index = 0;
    let currentImages = [];

    imagenes.forEach((img, i) => {
        currentImages.push(img.src);
        img.addEventListener("click", () => {
            index = i;
            mostrarImagen(index);
            lightbox.style.display = "flex";
        });
    });

    function mostrarImagen(i) {
        imagenGrande.src = currentImages[i];
    }

    if (next) {
        next.addEventListener("click", () => {
            index = (index + 1) % currentImages.length;
            mostrarImagen(index);
        });
    }

    if (prev) {
        prev.addEventListener("click", () => {
            index = (index - 1 + currentImages.length) % currentImages.length;
            mostrarImagen(index);
        });
    }

    if (cerrar) {
        cerrar.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
            }
        });
    }
}