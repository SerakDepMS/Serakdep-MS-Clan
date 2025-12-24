// Configuración del sistema
const CONFIG = {
  ITEMS_PER_PAGE: 6,
  CATEGORIES: {
    announcement: { icon: "📢", text: "Anuncio" },
    tournament: { icon: "🏆", text: "Torneo" },
    collaboration: { icon: "🤝", text: "Colaboración" },
    maintenance: { icon: "🔧", text: "Mantenimiento" },
    update: { icon: "🔄", text: "Actualización" },
    event: { icon: "🎉", text: "Evento" },
  },
};

// CONFIGURACIÓN API_DB

if (typeof API_DB === "undefined") {
  console.error("❌ ERROR: API_DB no está definida en el HTML");
  console.log(
    '💡 Verifica que en el HTML tengas: const API_DB = "https://api.npoint.io/...";'
  );

  window.API_DB = "https://api.npoint.io/c7935f8e8b0b09b0b07b";
  console.log("⚠️ Usando URL temporal:", window.API_DB);
} else {
  window.API_DB = API_DB;
  console.log("✅ API_DB configurada desde HTML:", window.API_DB);
}

let currentFilter = "all";
let currentPage = 1;
let isOfflineMode = false;

let newsDatabase = {
  lastUpdate: new Date().toISOString(),
  totalViews: 0,
  whatsappStats: {
    members: 9,
    notifications: 0,
    clicks: 0,
    joinLink: "https://whatsapp.com/channel/0029VbBhOLo60eBgats9rn31",
  },
  news: [],
};

// INICIALIZACIÓN

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Sistema de noticias iniciando...");
  console.log("🔗 URL npoint.io:", window.API_DB);

  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  initializeData();

  initEventListeners();

  setupWhatsappSystem();

  initStatsScroll();

  console.log("✅ Sistema de noticias listo (modo solo lectura)");
});

// FUNCIONES NPONT.IO

async function loadFromNpoint() {
  try {
    console.log("🔄 Cargando desde npoint.io...");

    if (!window.API_DB || window.API_DB.trim() === "") {
      console.error("❌ URL de npoint.io no configurada o vacía");
      console.log("🔍 Valor actual de window.API_DB:", window.API_DB);
      isOfflineMode = true;
      updateSyncIndicator();
      return false;
    }

    const cleanUrl = window.API_DB.trim();
    console.log("🔗 URL limpia:", cleanUrl);

    const response = await fetch(cleanUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    console.log("✅ Datos cargados de npoint.io");

    transformNpointData(data);

    updateAll();

    isOfflineMode = false;
    updateSyncIndicator();

    return true;
  } catch (error) {
    console.error("❌ Error cargando de npoint.io:", error);
    console.log("📡 Detalles del error:", error.message);
    isOfflineMode = true;
    updateSyncIndicator();
    return false;
  }
}

function transformNpointData(data) {
  newsDatabase.news = (data.news || []).map((newsItem) => {
    return {
      id: newsItem.id,
      title: newsItem.title,
      category: newsItem.category,
      content: newsItem.content,
      excerpt: newsItem.excerpt || newsItem.content.substring(0, 150) + "...",
      date: newsItem.date,
      image: newsItem.image || "",
      important: newsItem.important || false,
      pinned: newsItem.pinned || false,
      views: newsItem.views || 0,
      author: newsItem.author || "Administrador",
    };
  });

  // Calcular vistas totales
  newsDatabase.totalViews = newsDatabase.news.reduce(
    (sum, news) => sum + (news.views || 0),
    0
  );

  if (data.stats && data.stats.whatsappMembers) {
    newsDatabase.whatsappStats.members = data.stats.whatsappMembers;
  }

  saveToLocalStorage();
}

function updateSyncIndicator() {
  let indicator = document.getElementById("sync-indicator");

  if (!indicator && window.API_DB) {
    indicator = document.createElement("div");
    indicator.id = "sync-indicator";
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: ${isOfflineMode ? "#f44336" : "#4CAF50"};
      color: white;
      padding: 10px 15px;
      border-radius: 20px;
      font-size: 12px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s;
    `;
    document.body.appendChild(indicator);

    indicator.addEventListener("click", () => {
      showNotification("Recargando noticias...", "info");
      loadFromNpoint();
    });
  }

  if (indicator) {
    indicator.innerHTML = `
      <i class="fas fa-${isOfflineMode ? "wifi-slash" : "wifi"}"></i>
      <span>${isOfflineMode ? "Offline" : "En línea"}</span>
    `;
    indicator.style.background = isOfflineMode ? "#f44336" : "#4CAF50";
    indicator.title = isOfflineMode
      ? "Sin conexión al servidor. Click para intentar recargar."
      : "Conectado al servidor. Click para recargar noticias.";
  }
}

// INICIALIZACIÓN DE DATOS

async function initializeData() {
  console.log("🔧 Inicializando datos...");
  console.log("📡 API_DB disponible:", window.API_DB ? "Sí" : "No");
  console.log("🌐 URL completa:", window.API_DB);

  if (window.API_DB && window.API_DB.trim() !== "") {
    console.log("🔗 Intentando conexión con npoint.io...");
    const success = await loadFromNpoint();
    if (success) {
      console.log("✅ Datos cargados desde npoint.io");
      return;
    } else {
      console.log("❌ Falló conexión con npoint.io, usando backup local");
    }
  } else {
    console.log("⚠️ URL npoint.io no configurada, usando datos locales");
  }

  console.log("📂 Cargando desde almacenamiento local...");
  loadFromLocalStorage();

  if (newsDatabase.news.length === 0) {
    console.log("📝 Usando datos por defecto...");
    newsDatabase.news = [
      {
        id: 1,
        title: "¡Bienvenidos al Clan Serakdep MS! 🐼",
        category: "announcement",
        content:
          "Es un gran placer darles la bienvenida oficial a nuestro clan. Aquí encontrarán una comunidad unida, eventos emocionantes y mucho más. ¡Comencemos esta aventura juntos!",
        excerpt: "Bienvenida oficial al clan Serakdep MS.",
        date: new Date().toISOString().split("T")[0],
        image: "",
        important: true,
        pinned: true,
        views: 0,
        author: "Admin Principal",
      },
    ];
  }

  updateAll();
}

function updateAll() {
  updateStats();
  updateWhatsappStats();
  renderNews();
  loadSidebar();
}

// EVENT LISTENERS

function initEventListeners() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      currentPage = 1;
      renderNews();
    });
  });

  document
    .getElementById("prev-page")
    .addEventListener("click", () => changePage(-1));
  document
    .getElementById("next-page")
    .addEventListener("click", () => changePage(1));
}

// SISTEMA DE NOTICIAS

function renderNews() {
  const container = document.getElementById("news-container");

  let filteredNews = newsDatabase.news;
  if (currentFilter !== "all") {
    if (currentFilter === "important") {
      filteredNews = newsDatabase.news.filter((news) => news.important);
    } else {
      filteredNews = newsDatabase.news.filter(
        (news) => news.category === currentFilter
      );
    }
  }

  filteredNews.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const totalPages = Math.ceil(filteredNews.length / CONFIG.ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + CONFIG.ITEMS_PER_PAGE
  );

  container.innerHTML = "";

  if (paginatedNews.length === 0) {
    container.innerHTML = `
      <div class="no-news">
        <i class="far fa-newspaper"></i>
        <h3>No hay noticias disponibles</h3>
        <p>Prueba con otro filtro o vuelve más tarde.</p>
      </div>
    `;
  } else {
    paginatedNews.forEach((news) => {
      const category = CONFIG.CATEGORIES[news.category] || {
        icon: "📰",
        text: "Noticia",
      };
      const date = new Date(news.date).toLocaleDateString("es-ES");

      const newsHTML = `
        <article class="news-card" data-id="${news.id}">
          <div class="news-card-header">
            <div class="news-meta-top">
              <div class="news-category">
                <span class="category-icon">${category.icon}</span>
                <span class="category-text">${category.text}</span>
              </div>
              <div class="news-date">
                <i class="far fa-calendar"></i>
                <span class="date-text">${date}</span>
              </div>
            </div>
            
            <div class="news-badges">
              ${
                news.important
                  ? '<span class="badge-important"><i class="fas fa-exclamation-triangle"></i> Importante</span>'
                  : ""
              }
              ${
                news.pinned
                  ? '<span class="badge-pinned"><i class="fas fa-thumbtack"></i> Fijado</span>'
                  : ""
              }
              ${
                isNewNews(news.date)
                  ? '<span class="badge-new"><i class="fas fa-star"></i> Nuevo</span>'
                  : ""
              }
            </div>
          </div>
          
          <div class="news-card-content">
            <h3 class="news-title">${news.title}</h3>
            <div class="news-excerpt">${news.excerpt}</div>
            
            ${
              news.image
                ? `
            <div class="news-image-container">
              <img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">
            </div>
            `
                : ""
            }
            
            <div class="news-stats">
              <span class="news-views">
                <i class="far fa-eye"></i>
                <span class="views-count">${news.views}</span> vistas
              </span>
            </div>
          </div>
          
          <div class="news-card-footer">
            <button class="btn-read-more">
              <i class="fas fa-arrow-right"></i> Leer más
            </button>
            <div class="news-actions">
              <button class="btn-action btn-share" title="Compartir">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>
        </article>
      `;

      container.insertAdjacentHTML("beforeend", newsHTML);
    });

    addNewsEvents();
  }

  updatePagination(filteredNews.length, totalPages);
}

function addNewsEvents() {
  document.querySelectorAll(".btn-read-more").forEach((btn) => {
    btn.addEventListener("click", function () {
      const newsCard = this.closest(".news-card");
      const newsId = parseInt(newsCard.dataset.id);
      readMoreNews(newsId);
    });
  });

  document.querySelectorAll(".btn-share").forEach((btn) => {
    btn.addEventListener("click", function () {
      const newsCard = this.closest(".news-card");
      const newsId = parseInt(newsCard.dataset.id);
      const news = newsDatabase.news.find((n) => n.id === newsId);
      if (news) shareNews(news);
    });
  });
}

// MODAL DE NOTICIAS

async function readMoreNews(id) {
  const news = newsDatabase.news.find((n) => n.id === id);
  if (!news) return;

  news.views++;
  newsDatabase.totalViews++;
  saveToLocalStorage();
  updateStats();

  const category = CONFIG.CATEGORIES[news.category] || {
    icon: "📰",
    text: "Noticia",
  };
  const date = new Date(news.date).toLocaleDateString("es-ES");

  const modalHTML = `
    <div class="news-modal active">
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="modal-header">
          <span class="category">${category.icon} ${category.text}</span>
          <span class="date">${date}</span>
        </div>
        <h2>${news.title}</h2>
        ${
          news.image
            ? `<img src="${news.image}" alt="${news.title}" class="modal-image">`
            : ""
        }
        <div class="modal-body">
          ${news.content
            .split("\n")
            .map((p) => `<p>${p}</p>`)
            .join("")}
        </div>
        <div class="modal-footer">
          <div class="modal-stats">
            <span><i class="far fa-eye"></i> ${news.views} vistas</span>
          </div>
          <button class="btn btn-primary share-news-modal">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  if (!document.querySelector("#modal-styles")) {
    const styles = document.createElement("style");
    styles.id = "modal-styles";
    styles.textContent = `
      .news-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        padding: 20px;
      }
      .news-modal.active {
        display: flex;
      }
      .news-modal .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        position: relative;
        width: 100%;
      }
      .news-modal .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2em;
        cursor: pointer;
        color: #666;
      }
      .news-modal .modal-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        color: #666;
      }
      .news-modal h2 {
        margin: 0 0 20px 0;
        color: #333;
      }
      .news-modal .modal-image {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 25px;
      }
      .news-modal .modal-body {
        line-height: 1.8;
        color: #444;
        margin-bottom: 25px;
      }
      .news-modal .modal-body p {
        margin-bottom: 15px;
      }
      .news-modal .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
    `;
    document.head.appendChild(styles);
  }

  const modal = document.querySelector(".news-modal.active");
  const closeBtn = modal.querySelector(".close-modal");
  const shareBtn = modal.querySelector(".share-news-modal");

  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  shareBtn.addEventListener("click", () => {
    shareNews(news);
    modal.remove();
  });
}

// WHATSAPP SYSTEM

function setupWhatsappSystem() {
  const joinBtn = document.getElementById("join-whatsapp-btn");
  if (joinBtn) {
    joinBtn.addEventListener("click", function (e) {
      newsDatabase.whatsappStats.clicks++;

      if (newsDatabase.whatsappStats.clicks % 3 === 0) {
        newsDatabase.whatsappStats.members++;
        showNotification(
          "¡Bienvenido al canal! Ya somos " +
            newsDatabase.whatsappStats.members +
            " miembros",
          "success"
        );
      }

      saveToLocalStorage();
      updateWhatsappStats();
    });
  }

  const qrBtn = document.getElementById("whatsapp-qr-btn");
  if (qrBtn) {
    qrBtn.addEventListener("click", showWhatsappQR);
  }

  updateWhatsappStats();
}

function updateWhatsappStats() {
  const membersElement = document.getElementById("whatsapp-members");
  const notificationsElement = document.getElementById(
    "whatsapp-notifications"
  );
  const clicksElement = document.getElementById("whatsapp-clicks");

  if (membersElement) {
    membersElement.textContent = newsDatabase.whatsappStats.members;
  }

  if (notificationsElement) {
    notificationsElement.textContent = newsDatabase.whatsappStats.notifications;
  }

  if (clicksElement) {
    clicksElement.innerHTML = `<strong>${newsDatabase.whatsappStats.clicks}</strong> personas han accedido`;
  }
}

function showWhatsappQR() {
  const modalHTML = `
    <div class="whatsapp-qr-modal active">
      <div class="qr-modal-content">
        <button class="close-qr">&times;</button>
        
        <div class="qr-header">
          <h3><i class="fab fa-whatsapp"></i> Únete por QR</h3>
          <p>Escanea este código con WhatsApp para unirte al canal</p>
        </div>
        
        <div class="qr-image">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            newsDatabase.whatsappStats.joinLink
          )}&format=png&color=25D366&bgcolor=ffffff&margin=10" 
               alt="QR Code para unirse al canal de WhatsApp" 
               style="width:100%;height:100%;object-fit:contain;">
        </div>
        
        <div class="qr-actions">
          <a href="${newsDatabase.whatsappStats.joinLink}" 
             class="qr-link" 
             target="_blank" 
             id="direct-whatsapp-link">
            <i class="fab fa-whatsapp"></i> Abrir en WhatsApp Web
          </a>
          
          <button class="btn btn-primary copy-whatsapp-link">
            <i class="fas fa-copy"></i> Copiar Enlace
          </button>
        </div>
        
        <div class="whatsapp-clicks" id="whatsapp-clicks-modal">
          ${newsDatabase.whatsappStats.clicks} personas han accedido
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.querySelector(".whatsapp-qr-modal.active");
  const closeBtn = modal.querySelector(".close-qr");
  const copyBtn = modal.querySelector(".copy-whatsapp-link");
  const directLink = modal.querySelector("#direct-whatsapp-link");

  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  directLink.addEventListener("click", () => {
    newsDatabase.whatsappStats.clicks++;
    saveToLocalStorage();
    updateWhatsappStats();

    const clicksModalElement = document.getElementById("whatsapp-clicks-modal");
    if (clicksModalElement) {
      clicksModalElement.innerHTML = `${newsDatabase.whatsappStats.clicks} personas han accedido`;
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard
      .writeText(newsDatabase.whatsappStats.joinLink)
      .then(() => {
        showNotification("Enlace copiado al portapapeles", "success");
        copyBtn.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar Enlace';
        }, 2000);
      })
      .catch(() => {
        showNotification("Error al copiar", "error");
      });
  });
}

// FUNCIONES UTILITARIAS

function updateStats() {
  const totalNews = newsDatabase.news.length;
  const importantNews = newsDatabase.news.filter((n) => n.important).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthNews = newsDatabase.news.filter((n) => {
    const date = new Date(n.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  document.getElementById("total-news").textContent = totalNews;
  document.getElementById("active-announcements").textContent = importantNews;
  document.getElementById("month-news").textContent = monthNews;
  document.getElementById("total-views").textContent = newsDatabase.totalViews;
}

function loadSidebar() {
  const highlighted = [...newsDatabase.news]
    .sort((a, b) => {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 3);

  const container = document.getElementById("highlighted-news");
  container.innerHTML = highlighted
    .map(
      (news) => `
    <div class="highlight-item" data-id="${news.id}">
      <h4>${news.title}</h4>
      <p>${new Date(news.date).toLocaleDateString("es-ES")}</p>
    </div>
  `
    )
    .join("");

  document
    .querySelectorAll("#highlighted-news .highlight-item")
    .forEach((item) => {
      item.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        readMoreNews(id);
      });
    });

  const recent = newsDatabase.news.slice(0, 3);
  const footerContainer = document.getElementById("recent-news-footer");
  footerContainer.innerHTML = recent
    .map(
      (news) => `
    <li>
      <a href="javascript:void(0)" data-id="${news.id}">
        <i class="fas fa-newspaper"></i> ${news.title}
      </a>
    </li>
  `
    )
    .join("");

  document.querySelectorAll("#recent-news-footer a").forEach((link) => {
    link.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      readMoreNews(id);
    });
  });
}

function changePage(direction) {
  const totalNews =
    currentFilter === "all"
      ? newsDatabase.news.length
      : newsDatabase.news.filter((n) =>
          currentFilter === "important"
            ? n.important
            : n.category === currentFilter
        ).length;
  const totalPages = Math.ceil(totalNews / CONFIG.ITEMS_PER_PAGE);

  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  renderNews();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updatePagination(totalItems, totalPages) {
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageNumbers = document.getElementById("page-numbers");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-number";
    if (i === currentPage) btn.classList.add("active");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderNews();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    pageNumbers.appendChild(btn);
  }
}

function shareNews(news) {
  const text = `${news.title} - Serakdep MS Clan`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: news.title,
      text: news.excerpt,
      url: url,
    });
  } else {
    navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
      showNotification("Enlace copiado al portapapeles", "info");
    });
  }
}

function isNewNews(dateString) {
  const newsDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - newsDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

// ALMACENAMIENTO

function saveToLocalStorage() {
  try {
    localStorage.setItem("serakdep_news", JSON.stringify(newsDatabase));
  } catch (e) {
    console.error("Error al guardar en localStorage:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem("serakdep_news");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.news && Array.isArray(parsed.news)) {
        newsDatabase = parsed;

        if (!newsDatabase.whatsappStats) {
          newsDatabase.whatsappStats = {
            members: 0,
            notifications: 0,
            clicks: 0,
            joinLink: "https://whatsapp.com/channel/0029VbBhOLo60eBgats9rn31",
          };
        }
      }
    }
  } catch (e) {
    console.error("Error al cargar de localStorage:", e);
  }
}

// NOTIFICACIONES

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "info-circle"
    }"></i>
    <span>${message}</span>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
    };
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 4000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease;
  `;

  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// SCROLL DE ESTADÍSTICAS

function initStatsScroll() {
  const statsContainer = document.querySelector(".news-stats");
  if (!statsContainer) return;

  function checkOverflow() {
    const hasOverflow = statsContainer.scrollWidth > statsContainer.clientWidth;
    statsContainer.classList.toggle("has-overflow", hasOverflow);
  }

  statsContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      statsContainer.scrollBy({ left: -100, behavior: "smooth" });
    } else if (e.key === "ArrowRight") {
      statsContainer.scrollBy({ left: 100, behavior: "smooth" });
    }
  });

  document.querySelectorAll(".stat-item").forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute(
      "aria-label",
      `Estadística ${index + 1}: ${item.querySelector("h3").textContent}`
    );

    item.addEventListener("click", () => {
      const itemLeft = item.offsetLeft;
      const itemWidth = item.clientWidth;
      const containerWidth = statsContainer.clientWidth;
      const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

      statsContainer.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    });
  });

  checkOverflow();
  window.addEventListener("resize", checkOverflow);
}

// DETECCIÓN DE CONEXIÓN

window.addEventListener("online", () => {
  if (isOfflineMode) {
    isOfflineMode = false;
    updateSyncIndicator();
    showNotification("✅ Conexión restablecida", "success");
    setTimeout(() => loadFromNpoint(), 2000);
  }
});

window.addEventListener("offline", () => {
  isOfflineMode = true;
  updateSyncIndicator();
  showNotification("⚠️ Sin conexión. Modo offline activado.", "warning");
});

setTimeout(updateSyncIndicator, 1000);

// FUNCIONES DEBUG

async function testNpointConnection() {
  console.log("🧪 Probando conexión con npoint.io...");

  if (!window.API_DB || window.API_DB.trim() === "") {
    console.error(
      "❌ ERROR: No hay URL configurada (window.API_DB está vacía o no definida)"
    );
    console.log("🔍 Verificando variables globales...");
    console.log("API_DB:", typeof API_DB, API_DB);
    console.log("window.API_DB:", window.API_DB);
    console.log("window.APP_CONFIG:", window.APP_CONFIG);

    if (typeof API_DB !== "undefined" && API_DB.trim() !== "") {
      window.API_DB = API_DB.trim();
      console.log("✅ API_DB obtenida de variable global:", window.API_DB);
    } else if (window.APP_CONFIG && window.APP_CONFIG.API_DB) {
      window.API_DB = window.APP_CONFIG.API_DB.trim();
      console.log("✅ API_DB obtenida de APP_CONFIG:", window.API_DB);
    } else {
      console.error("❌ No se pudo encontrar la URL de npoint.io");
      showNotification(
        "Error: No está configurada la URL de la base de datos",
        "error"
      );
      return false;
    }
  }

  console.log("🔗 URL:", window.API_DB);

  try {
    const response = await fetch(window.API_DB.trim());
    console.log("📡 Estado:", response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📦 Datos recibidos:", data);

    if (data && data.news && Array.isArray(data.news)) {
      console.log(`✅ ${data.news.length} noticias encontradas`);
      data.news.forEach((news, i) => {
        console.log(`   ${i + 1}. ${news.title} (${news.date})`);
      });
      return true;
    } else {
      console.warn("⚠️ Estructura de datos incorrecta");
      return false;
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    showNotification(`Error de conexión: ${error.message}`, "error");
    return false;
  }
}

setTimeout(() => {
  console.log("🔍 Iniciando prueba de conexión...");
  testNpointConnection();
}, 2000);
