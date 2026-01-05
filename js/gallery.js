// GALERÍA DE RECUERDOS - JavaScript Mejorado
document.addEventListener("DOMContentLoaded", function () {
  // Datos de la galería (estructura organizada)
  const galleryData = {
    version: "1.0",
    lastUpdate: new Date().toISOString().split("T")[0],
    items: [
      {
        id: 1,
        title: "Torneo de Blox Fruits 2024",
        description:
          "Gran torneo realizado en Blox Fruits con 15 participantes. ShadowBlade se llevó la victoria después de una emocionante final. El evento contó con premios especiales y una transmisión en vivo para todos los miembros.",
        image: "images/gallery/torneo-blox-fruits.jpg",
        thumbnail: "images/gallery/thumbnails/torneo-blox-fruits-thumb.jpg",
        date: "15 Febrero 2024",
        category: "torneos",
        participants: "15 jugadores",
        tags: ["blox-fruits", "competitivo", "torneo", "premios"],
        featured: true,
      },
      {
        id: 2,
        title: "Reunión Mensual del Clan",
        description:
          "Reunión para planificar las actividades del próximo mes. Se discutieron nuevos eventos, mejoras para el clan y estrategias para crecer como comunidad. Todos los miembros pudieron expresar sus ideas.",
        image: "images/gallery/reunion-mensual.jpg",
        thumbnail: "images/gallery/thumbnails/reunion-mensual-thumb.jpg",
        date: "3 Marzo 2024",
        category: "reuniones",
        participants: "12 miembros",
        tags: ["organización", "planificación", "comunidad"],
        featured: true,
      },
      {
        id: 3,
        title: "1er Aniversario del Clan",
        description:
          "Celebración del primer año de Serakdep MS. Torta virtual, juegos, premios especiales y muchas sorpresas para todos los miembros. Un día lleno de alegría y recuerdos que quedará en la memoria del clan.",
        image: "images/gallery/aniversario-clan.jpg",
        thumbnail: "images/gallery/thumbnails/aniversario-clan-thumb.jpg",
        date: "20 Enero 2024",
        category: "aniversarios",
        participants: "18 miembros",
        tags: ["aniversario", "celebración", "fiesta", "especial"],
        featured: true,
      },
      {
        id: 4,
        title: "Evento de Halloween Especial",
        description:
          "Concurso de disfraces en Brookhaven con temática de Halloween. Los mejores disfraces recibieron premios especiales. Una noche llena de terror y diversión donde la creatividad fue la protagonista.",
        image: "images/gallery/evento-halloween.jpg",
        thumbnail: "images/gallery/thumbnails/evento-halloween-thumb.jpg",
        date: "31 Octubre 2023",
        category: "eventos",
        participants: "22 jugadores",
        tags: ["halloween", "disfraces", "concurso", "brookhaven"],
        featured: false,
      },
      {
        id: 5,
        title: "Fiesta en Brookhaven",
        description:
          "Momento divertido en Brookhaven donde todos bailaron juntos al ritmo de la música. Risas garantizadas y buen ambiente durante toda la noche. Un ejemplo de la unión del clan.",
        image: "images/gallery/momento-divertido.jpg",
        thumbnail: "images/gallery/thumbnails/momento-divertido-thumb.jpg",
        date: "10 Diciembre 2023",
        category: "divertido",
        participants: "8 amigos",
        tags: ["diversión", "baile", "social", "brookhaven"],
        featured: false,
      },
      {
        id: 6,
        title: "Torneo de Arsenal",
        description:
          "Intenso torneo en Arsenal con partidas rápidas y emocionantes. FireStorm demostró su puntería llevándose el primer lugar. La competencia fue reñida hasta el último momento.",
        image: "images/gallery/torneo-arsenal.jpg",
        thumbnail: "images/gallery/thumbnails/torneo-arsenal-thumb.jpg",
        date: "18 Noviembre 2023",
        category: "torneos",
        participants: "10 participantes",
        tags: ["arsenal", "shooter", "competitivo", "rápido"],
        featured: true,
      },
      {
        id: 7,
        title: "Bienvenida a Nuevos Miembros",
        description:
          "Sesión de bienvenida para 5 nuevos miembros. Tour por los grupos del clan, explicación detallada de las reglas y presentación con los miembros veteranos. Todos se sintieron como en casa.",
        image: "images/gallery/reunion-nuevos.jpg",
        thumbnail: "images/gallery/thumbnails/reunion-nuevos-thumb.jpg",
        date: "5 Abril 2024",
        category: "reuniones",
        participants: "17 miembros",
        tags: ["nuevos", "bienvenida", "introducción", "comunidad"],
        featured: false,
      },
      {
        id: 8,
        title: "Epic Fail Colectivo",
        description:
          "Momento gracioso donde todos caímos al mismo tiempo en un juego de parkour. Las risas duraron más de 5 minutos seguidos. A veces, los fails son los mejores recuerdos.",
        image: "images/gallery/fail-moment.jpg",
        thumbnail: "images/gallery/thumbnails/fail-moment-thumb.jpg",
        date: "22 Mayo 2024",
        category: "divertido",
        participants: "6 jugadores",
        tags: ["gracioso", "fail", "diversión", "parkour"],
        featured: false,
      },
    ],
  };

  // Estado de la galería
  const state = {
    currentFilter: "all",
    currentIndex: 0,
    visibleItems: 8,
    itemsPerLoad: 4,
    currentFilteredItems: [],
    favorites: JSON.parse(localStorage.getItem("galleryFavorites")) || [],
  };

  // Referencias a elementos del DOM
  const elements = {
    galleryGrid: document.getElementById("galleryGrid"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    loadMoreBtn: document.getElementById("loadMoreBtn"),
    shareGalleryBtn: document.getElementById("shareGalleryBtn"),
    itemsCount: document.getElementById("itemsCount"),
    totalItems: document.getElementById("totalItems"),
    lastUpdate: document.getElementById("lastUpdate"),

    // Modal
    galleryModal: document.getElementById("galleryModal"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalClose: document.getElementById("modalClose"),
    modalTitle: document.getElementById("modalTitle"),
    modalImage: document.getElementById("modalImage"),
    modalDate: document.getElementById("modalDate"),
    modalParticipants: document.getElementById("modalParticipants"),
    modalCategory: document.getElementById("modalCategory"),
    modalDescription: document.getElementById("modalDescription"),
    modalCounter: document.getElementById("modalCounter"),
    modalTags: document.getElementById("modalTags"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
    shareBtn: document.getElementById("shareBtn"),
    favoriteBtn: document.getElementById("favoriteBtn"),
  };

  // Inicializar galería
  function initGallery() {
    updateGalleryInfo();
    renderGallery();
    setupEventListeners();
    preloadFeaturedImages();
  }

  // Actualizar información de la galería
  function updateGalleryInfo() {
    elements.totalItems.textContent = galleryData.items.length;
    elements.lastUpdate.textContent = formatDate(galleryData.lastUpdate);
  }

  // Formatear fecha
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }

  // Pre-cargar imágenes destacadas
  function preloadFeaturedImages() {
    const featuredImages = galleryData.items.filter((item) => item.featured);
    featuredImages.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }

  // Renderizar galería
  function renderGallery() {
    elements.galleryGrid.innerHTML = "";

    // Filtrar items
    state.currentFilteredItems =
      state.currentFilter === "all"
        ? galleryData.items
        : galleryData.items.filter(
            (item) => item.category === state.currentFilter
          );

    // Limitar items visibles
    const itemsToShow = state.currentFilteredItems.slice(0, state.visibleItems);

    // Crear elementos
    itemsToShow.forEach((item, index) => {
      const galleryItem = createGalleryItem(item, index);
      elements.galleryGrid.appendChild(galleryItem);
    });

    // Actualizar contadores
    updateCounters();
  }

  // Crear elemento de galería
  function createGalleryItem(item, index) {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.setAttribute("data-id", item.id);
    div.setAttribute("data-index", index);

    // Verificar si es favorito
    const isFavorite = state.favorites.includes(item.id);
    const favoriteIcon = isFavorite ? "fas fa-heart" : "far fa-heart";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="item-overlay">
        <h3 class="item-title">${item.title}</h3>
        <div class="item-meta">
          <span><i class="far fa-calendar"></i> ${item.date}</span>
          <span><i class="fas fa-users"></i> ${item.participants}</span>
        </div>
        <div class="item-actions">
          <span class="item-category">${formatCategory(item.category)}</span>
          <button class="item-favorite" data-id="${item.id}">
            <i class="${favoriteIcon}"></i>
          </button>
        </div>
      </div>
    `;

    // Eventos
    div.addEventListener("click", (e) => {
      if (!e.target.closest(".item-favorite")) {
        openModal(index);
      }
    });

    // Botón favorito
    const favoriteBtn = div.querySelector(".item-favorite");
    favoriteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(item.id, favoriteBtn);
    });

    return div;
  }

  // Formatear categoría
  function formatCategory(category) {
    const categories = {
      torneos: "🎮 Torneos",
      reuniones: "👥 Reuniones",
      aniversarios: "🎂 Aniversarios",
      eventos: "✨ Eventos Especiales",
      divertido: "😂 Momentos Divertidos",
    };
    return categories[category] || category;
  }

  // Actualizar contadores
  function updateCounters() {
    const total = state.currentFilteredItems.length;
    const showing = Math.min(state.visibleItems, total);
    elements.itemsCount.textContent = `${showing}/${total}`;

    // Mostrar/ocultar botón "Cargar más"
    elements.loadMoreBtn.style.display =
      state.visibleItems >= total ? "none" : "flex";
  }

  // Cargar más items
  function loadMoreItems() {
    state.visibleItems += state.itemsPerLoad;
    renderGallery();

    // Scroll suave
    setTimeout(() => {
      const newItems = elements.galleryGrid.querySelectorAll(".gallery-item");
      if (newItems.length > 0) {
        newItems[state.visibleItems - state.itemsPerLoad].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }

  // Abrir modal
  function openModal(index) {
    state.currentIndex = index;
    const item = state.currentFilteredItems[index];

    // Actualizar contenido del modal
    elements.modalTitle.textContent = item.title;
    elements.modalDate.textContent = item.date;
    elements.modalParticipants.textContent = item.participants;
    elements.modalCategory.textContent = formatCategory(item.category);
    elements.modalDescription.textContent = item.description;
    elements.modalCounter.textContent = `${index + 1} / ${
      state.currentFilteredItems.length
    }`;

    // Actualizar tags
    elements.modalTags.innerHTML = item.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    // Actualizar favorito
    const isFavorite = state.favorites.includes(item.id);
    elements.favoriteBtn.className = `action-btn favorite-btn ${
      isFavorite ? "active" : ""
    }`;
    elements.favoriteBtn.innerHTML = `<i class="${
      isFavorite ? "fas" : "far"
    } fa-heart"></i> ${isFavorite ? "Favorito" : "Favorito"}`;

    // Cargar imagen
    loadModalImage(item.image);

    // Mostrar modal
    elements.galleryModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Actualizar navegación
    updateModalNavigation();
  }

  // Cargar imagen en modal
  function loadModalImage(src) {
    const loader = document.querySelector(".image-loader");
    const img = elements.modalImage;

    // Mostrar loader
    loader.style.display = "flex";
    img.style.display = "none";

    // Cargar imagen
    img.onload = function () {
      loader.style.display = "none";
      img.style.display = "block";
      img.classList.add("loaded");
    };

    img.onerror = function () {
      loader.innerHTML =
        '<i class="fas fa-exclamation-triangle"></i><span>Error cargando imagen</span>';
      img.src =
        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f8f9fa"/><text x="200" y="150" text-anchor="middle" fill="%236c757d" font-family="Arial">Imagen no disponible</text></svg>';
    };

    img.src = src;
  }

  // Cerrar modal
  function closeModal() {
    elements.galleryModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // Actualizar navegación del modal
  function updateModalNavigation() {
    elements.prevBtn.style.display = state.currentIndex > 0 ? "flex" : "none";
    elements.nextBtn.style.display =
      state.currentIndex < state.currentFilteredItems.length - 1
        ? "flex"
        : "none";
  }

  // Navegar entre imágenes
  function navigateModal(direction) {
    if (direction === "prev" && state.currentIndex > 0) {
      state.currentIndex--;
    } else if (
      direction === "next" &&
      state.currentIndex < state.currentFilteredItems.length - 1
    ) {
      state.currentIndex++;
    } else {
      return;
    }

    openModal(state.currentIndex);
  }

  // Alternar favorito
  function toggleFavorite(itemId, button = null) {
    const index = state.favorites.indexOf(itemId);

    if (index === -1) {
      state.favorites.push(itemId);
    } else {
      state.favorites.splice(index, 1);
    }

    // Guardar en localStorage
    localStorage.setItem("galleryFavorites", JSON.stringify(state.favorites));

    // Actualizar botón si se proporcionó
    if (button) {
      const icon = button.querySelector("i");
      icon.className = index === -1 ? "fas fa-heart" : "far fa-heart";
    }

    // Actualizar botón del modal si está abierto
    if (elements.galleryModal.classList.contains("active")) {
      const currentItemId = state.currentFilteredItems[state.currentIndex].id;
      if (currentItemId === itemId) {
        const isFavorite = state.favorites.includes(itemId);
        elements.favoriteBtn.className = `action-btn favorite-btn ${
          isFavorite ? "active" : ""
        }`;
        elements.favoriteBtn.innerHTML = `<i class="${
          isFavorite ? "fas" : "far"
        } fa-heart"></i> ${isFavorite ? "Favorito" : "Favorito"}`;
      }
    }
  }

  // Descargar imagen actual
  function downloadCurrentImage() {
    const item = state.currentFilteredItems[state.currentIndex];
    const link = document.createElement("a");
    link.href = item.image;
    link.download = `serakdep-ms-${item.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Compartir imagen actual
  async function shareCurrentImage() {
    const item = state.currentFilteredItems[state.currentIndex];

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.description.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error al compartir:", err);
      }
    } else {
      // Fallback
      await navigator.clipboard.writeText(
        `${item.title} - ${window.location.href}`
      );
      alert("¡Enlace copiado al portapapeles! Compártelo con tus amigos.");
    }
  }

  // Compartir galería completa
  async function shareGallery() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Galería de Recuerdos - Serakdep MS",
          text: "¡Mira los mejores momentos del clan Serakdep MS!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error al compartir galería:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Enlace de la galería copiado al portapapeles.");
    }
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Filtros
    elements.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remover clase active
        elements.filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Agregar clase active
        button.classList.add("active");

        // Actualizar filtro
        state.currentFilter = button.dataset.filter;
        state.visibleItems = 8;
        renderGallery();
      });
    });

    // Botón "Cargar más"
    elements.loadMoreBtn.addEventListener("click", loadMoreItems);

    // Compartir galería
    elements.shareGalleryBtn.addEventListener("click", shareGallery);

    // Modal - Cerrar
    elements.modalClose.addEventListener("click", closeModal);
    elements.modalOverlay.addEventListener("click", closeModal);

    // Modal - Navegación
    elements.prevBtn.addEventListener("click", () => navigateModal("prev"));
    elements.nextBtn.addEventListener("click", () => navigateModal("next"));

    // Modal - Acciones
    elements.downloadBtn.addEventListener("click", downloadCurrentImage);
    elements.shareBtn.addEventListener("click", shareCurrentImage);
    elements.favoriteBtn.addEventListener("click", () => {
      const itemId = state.currentFilteredItems[state.currentIndex].id;
      toggleFavorite(itemId);
    });

    // Navegación con teclado
    document.addEventListener("keydown", (e) => {
      // Cerrar modal con Escape
      if (
        e.key === "Escape" &&
        elements.galleryModal.classList.contains("active")
      ) {
        closeModal();
      }

      // Navegación en modal
      if (elements.galleryModal.classList.contains("active")) {
        if (e.key === "ArrowLeft") {
          navigateModal("prev");
        } else if (e.key === "ArrowRight") {
          navigateModal("next");
        }
      }
    });

    // Touch events para móviles
    let touchStartX = 0;
    let touchEndX = 0;

    elements.galleryModal.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    elements.galleryModal.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          navigateModal("next");
        } else {
          navigateModal("prev");
        }
      }
    }
  }

  // Inicializar
  initGallery();
});
