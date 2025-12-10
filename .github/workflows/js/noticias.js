// noticias.js - Sistema de noticias completo con comentarios y WhatsApp

// Configuración
const CONFIG = {
  // Contraseña del administrador (puedes cambiarla)
  ADMIN_PASSWORD: "SerakdepMS2025!",

  // Items por página
  ITEMS_PER_PAGE: 6,

  // Categorías
  CATEGORIES: {
    update: { icon: "🔄", text: "Actualización" },
    collaboration: { icon: "🤝", text: "Colaboración" },
    event: { icon: "🎉", text: "Evento" },
    tournament: { icon: "🏆", text: "Torneo" },
    maintenance: { icon: "🔧", text: "Mantenimiento" },
    announcement: { icon: "📢", text: "Anuncio" },
  },
};

// Variables globales
let isAdminLoggedIn = false;
let currentFilter = "all";
let currentPage = 1;
let editingNewsId = null;

// Base de datos de noticias CON COMENTARIOS Y WHATSAPP
let newsDatabase = {
  lastUpdate: new Date().toISOString(),
  totalViews: 0,
  whatsappStats: {
    members: 125,
    notifications: 48,
    clicks: 0,
    joinLink: "https://whatsapp.com/channel/0029VaYOURCHANNELCODE", // ¡REEMPLAZA ESTO CON TU ENLACE!
  },
  news: [
    {
      id: 1,
      title: "Nueva Colaboración con Clan DragonForce",
      category: "collaboration",
      content:
        "¡Estamos emocionados de anunciar nuestra nueva colaboración con el clan DragonForce! Juntos organizaremos torneos mensuales y eventos especiales. Los primeros eventos conjuntos comenzarán la próxima semana.\n\nDetalles:\n• Eventos mensuales\n• Torneos especiales\n• Premios exclusivos\n• Intercambio de miembros",
      excerpt:
        "Anunciamos colaboración con clan DragonForce para eventos y torneos conjuntos.",
      date: "2025-03-15",
      image: "",
      important: true,
      pinned: true,
      views: 125,
      comments: [
        {
          id: 1,
          author: "JuanPerez",
          text: "¡Excelente noticia! ¿Cuándo comienzan los primeros eventos?",
          date: "2025-03-15 14:30",
          role: "member",
        },
        {
          id: 2,
          author: "Admin",
          text: "Los primeros eventos comenzarán la próxima semana. Estén atentos al calendario.",
          date: "2025-03-15 15:45",
          role: "admin",
        },
        {
          id: 3,
          author: "GamerGirl",
          text: "¡No puedo esperar! Me encanta DragonForce 😍",
          date: "2025-03-16 09:20",
          role: "member",
        },
      ],
    },
    {
      id: 2,
      title: "Actualización del Sistema de Torneos",
      category: "update",
      content:
        "Hemos mejorado nuestro sistema de torneos con nuevas características:\n\n1. Sistema de emparejamiento más justo\n2. Mejores premios y recompensas\n3. Seguimiento en tiempo real de las partidas\n4. Estadísticas detalladas por jugador\n\nLa nueva versión estará disponible a partir del próximo lunes.",
      excerpt: "Mejoras importantes en el sistema de torneos del clan.",
      date: "2025-03-12",
      image: "",
      important: true,
      pinned: false,
      views: 89,
      comments: [
        {
          id: 1,
          author: "ProGamer",
          text: "Finalmente un sistema de emparejamiento justo. ¡Bien hecho!",
          date: "2025-03-12 16:20",
          role: "member",
        },
        {
          id: 2,
          author: "Novato22",
          text: "¿Habrá premios para jugadores nuevos también?",
          date: "2025-03-13 10:15",
          role: "member",
        },
      ],
    },
    {
      id: 3,
      title: "Torneo Especial de Aniversario",
      category: "tournament",
      content:
        "¡Celebra nuestro primer aniversario con un torneo especial!\n\nPremios:\n• 1er lugar: 50K Robux\n• 2do lugar: 25K Robux\n• 3er lugar: 10K Robux\n• Participación: 1K Robux para todos\n\nInscripciones abiertas hasta el 20 de marzo. ¡No te lo pierdas!",
      excerpt: "Torneo de aniversario con grandes premios en Robux.",
      date: "2025-03-10",
      image: "",
      important: false,
      pinned: true,
      views: 156,
      comments: [
        {
          id: 1,
          author: "LuchadorX",
          text: "¡50K Robux! ¡Me apunto ya mismo!",
          date: "2025-03-10 18:45",
          role: "member",
        },
        {
          id: 2,
          author: "Estratega",
          text: "¿Cuáles serán las reglas del torneo?",
          date: "2025-03-11 11:30",
          role: "member",
        },
        {
          id: 3,
          author: "Admin",
          text: "Las reglas se publicarán mañana en la sección de eventos.",
          date: "2025-03-11 14:15",
          role: "admin",
        },
        {
          id: 4,
          author: "Suertudo",
          text: "¡Espero ganar aunque sea el premio de participación! 😄",
          date: "2025-03-12 09:20",
          role: "member",
        },
      ],
    },
  ],
};

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", function () {
  // Actualizar año
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Cargar datos guardados
  loadFromLocalStorage();

  // Inicializar sistema
  initEventListeners();
  renderNews();
  updateStats();
  loadSidebar();

  // Inicializar WhatsApp
  setupWhatsappSystem();

  // Verificar sesión guardada
  checkSavedSession();

  console.log(
    "Sistema de noticias con comentarios y WhatsApp inicializado 🗞️💬📱"
  );
});

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Botón de login admin
  document
    .getElementById("admin-login-btn")
    .addEventListener("click", showLoginModal);
  document
    .getElementById("close-login")
    .addEventListener("click", hideLoginModal);
  document.getElementById("btn-login").addEventListener("click", loginAdmin);

  // Botón logout
  document.getElementById("btn-logout").addEventListener("click", logoutAdmin);

  // Botones del panel admin
  document
    .getElementById("btn-new-news")
    .addEventListener("click", showNewsForm);
  document
    .getElementById("btn-manage-news")
    .addEventListener("click", showManageModal);

  // Formulario de noticias
  document.getElementById("btn-save-news").addEventListener("click", saveNews);
  document
    .getElementById("btn-cancel-news")
    .addEventListener("click", hideNewsForm);

  // Filtros
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

  // Paginación
  document
    .getElementById("prev-page")
    .addEventListener("click", () => changePage(-1));
  document
    .getElementById("next-page")
    .addEventListener("click", () => changePage(1));

  // Login con Enter
  document
    .getElementById("admin-password")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        loginAdmin();
      }
    });
}

// ===== SISTEMA DE WHATSAPP =====
function setupWhatsappSystem() {
  // Botón para unirse a WhatsApp
  const joinBtn = document.getElementById("join-whatsapp-btn");
  if (joinBtn) {
    // Actualizar el enlace en el botón
    joinBtn.href = newsDatabase.whatsappStats.joinLink;

    joinBtn.addEventListener("click", function (e) {
      // Contar clic
      newsDatabase.whatsappStats.clicks++;

      // Aumentar miembros simulado (cada 3 clics)
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

      // Mostrar notificación
      showNotification("¡Redirigiendo al canal de WhatsApp!", "success");

      // El enlace ya está en el href, solo tracking
      console.log("Usuario redirigido a WhatsApp");
    });
  }

  // Botón para ver QR
  const qrBtn = document.getElementById("whatsapp-qr-btn");
  if (qrBtn) {
    qrBtn.addEventListener("click", showWhatsappQR);
  }

  // Actualizar estadísticas
  updateWhatsappStats();
}

function updateWhatsappStats() {
  // Actualizar números en el widget
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
          <!-- QR generado con API externa -->
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

  // Eventos del modal
  const modal = document.querySelector(".whatsapp-qr-modal.active");
  const closeBtn = modal.querySelector(".close-qr");
  const copyBtn = modal.querySelector(".copy-whatsapp-link");
  const directLink = modal.querySelector("#direct-whatsapp-link");

  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Contar clic en enlace directo
  directLink.addEventListener("click", () => {
    newsDatabase.whatsappStats.clicks++;
    saveToLocalStorage();
    updateWhatsappStats();

    // Actualizar el contador en el modal
    const clicksModalElement = document.getElementById("whatsapp-clicks-modal");
    if (clicksModalElement) {
      clicksModalElement.innerHTML = `${newsDatabase.whatsappStats.clicks} personas han accedido`;
    }
  });

  // Copiar enlace al portapapeles
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

// ===== SISTEMA DE AUTENTICACIÓN =====
function checkSavedSession() {
  const savedSession = localStorage.getItem("admin_session");
  if (savedSession) {
    const session = JSON.parse(savedSession);
    // Verificar si la sesión no ha expirado (24 horas)
    if (Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
      isAdminLoggedIn = true;
      showAdminPanel();
    } else {
      localStorage.removeItem("admin_session");
    }
  }
}

function showLoginModal() {
  document.getElementById("login-modal").classList.add("active");
}

function hideLoginModal() {
  document.getElementById("login-modal").classList.remove("active");
  document.getElementById("admin-password").value = "";
}

function loginAdmin() {
  const password = document.getElementById("admin-password").value;

  if (password === CONFIG.ADMIN_PASSWORD) {
    isAdminLoggedIn = true;

    // Guardar sesión
    const session = {
      timestamp: Date.now(),
      user: "admin",
    };
    localStorage.setItem("admin_session", JSON.stringify(session));

    // Ocultar login y mostrar panel
    hideLoginModal();
    showAdminPanel();

    showNotification("¡Sesión iniciada exitosamente!", "success");

    // Recargar noticias para mostrar botones de admin
    renderNews();
  } else {
    showNotification("Contraseña incorrecta", "error");
  }
}

function logoutAdmin() {
  if (confirm("¿Estás seguro de cerrar sesión?")) {
    isAdminLoggedIn = false;
    localStorage.removeItem("admin_session");
    document.getElementById("admin-panel").classList.remove("active");
    showNotification("Sesión cerrada", "info");

    // Recargar noticias para quitar botones de admin
    renderNews();
  }
}

function showAdminPanel() {
  document.getElementById("admin-panel").classList.add("active");
  updateAdminStats();
}

// ===== SISTEMA DE NOTICIAS =====
function renderNews() {
  const container = document.getElementById("news-container");

  // Filtrar noticias
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

  // Ordenar: primero las fijadas, luego por fecha
  filteredNews.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredNews.length / CONFIG.ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + CONFIG.ITEMS_PER_PAGE
  );

  // Limpiar contenedor
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
    // Renderizar cada noticia
    paginatedNews.forEach((news) => {
      const category = CONFIG.CATEGORIES[news.category] || {
        icon: "📰",
        text: "Noticia",
      };
      const date = new Date(news.date).toLocaleDateString("es-ES");
      const commentsCount = news.comments ? news.comments.length : 0;

      const newsHTML = `
        <article class="news-card" data-id="${news.id}">
          ${
            isAdminLoggedIn
              ? `
          <div class="admin-actions-news">
            <button class="btn-admin edit-news" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-admin delete-news" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
            <button class="btn-admin pin-news" title="${
              news.pinned ? "Desfijar" : "Fijar"
            }">
              <i class="fas fa-thumbtack"></i>
            </button>
          </div>
          `
              : ""
          }
          
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
              <span class="news-comments">
                <i class="far fa-comment"></i>
                <span class="comments-count">${commentsCount}</span> comentarios
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

    // Agregar eventos a las noticias recién creadas
    addNewsEvents();
  }

  // Actualizar paginación
  updatePagination(filteredNews.length, totalPages);
}

function addNewsEvents() {
  // Botón "Leer más"
  document.querySelectorAll(".btn-read-more").forEach((btn) => {
    btn.addEventListener("click", function () {
      const newsCard = this.closest(".news-card");
      const newsId = parseInt(newsCard.dataset.id);
      readMoreNews(newsId);
    });
  });

  // Botón compartir
  document.querySelectorAll(".btn-share").forEach((btn) => {
    btn.addEventListener("click", function () {
      const newsCard = this.closest(".news-card");
      const newsId = parseInt(newsCard.dataset.id);
      const news = newsDatabase.news.find((n) => n.id === newsId);
      if (news) shareNews(news);
    });
  });

  // Botones de administración (si está logueado)
  if (isAdminLoggedIn) {
    document.querySelectorAll(".edit-news").forEach((btn) => {
      btn.addEventListener("click", function () {
        const newsCard = this.closest(".news-card");
        const newsId = parseInt(newsCard.dataset.id);
        editNews(newsId);
      });
    });

    document.querySelectorAll(".delete-news").forEach((btn) => {
      btn.addEventListener("click", function () {
        const newsCard = this.closest(".news-card");
        const newsId = parseInt(newsCard.dataset.id);
        deleteNews(newsId);
      });
    });

    document.querySelectorAll(".pin-news").forEach((btn) => {
      btn.addEventListener("click", function () {
        const newsCard = this.closest(".news-card");
        const newsId = parseInt(newsCard.dataset.id);
        togglePinNews(newsId);
      });
    });
  }
}

function readMoreNews(id) {
  const news = newsDatabase.news.find((n) => n.id === id);
  if (!news) return;

  // Incrementar vistas
  news.views++;
  newsDatabase.totalViews++;
  saveToLocalStorage();
  updateStats();
  updateAdminStats();

  const category = CONFIG.CATEGORIES[news.category] || {
    icon: "📰",
    text: "Noticia",
  };
  const date = new Date(news.date).toLocaleDateString("es-ES");
  const commentsCount = news.comments ? news.comments.length : 0;

  // Asegurar que exista el array de comentarios
  if (!news.comments) {
    news.comments = [];
  }

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
            <span><i class="far fa-comment"></i> ${commentsCount} comentarios</span>
          </div>
          <button class="btn btn-primary share-news-modal">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
        </div>

        <!-- SECCIÓN DE COMENTARIOS -->
        <div class="comments-section">
          <h3><i class="far fa-comments"></i> Comentarios <span class="comment-count-badge">${commentsCount}</span></h3>
          
          <div class="comments-list">
            ${
              commentsCount > 0
                ? news.comments
                    .map(
                      (comment) => `
                      <div class="comment-item" data-comment-id="${comment.id}">
                        <div class="comment-header">
                          <span class="comment-author">
                            ${
                              comment.role === "admin"
                                ? '<i class="fas fa-user-shield"></i>'
                                : '<i class="fas fa-user"></i>'
                            }
                            ${comment.author}
                            ${
                              comment.role === "admin"
                                ? '<span style="color:#4CAF50;font-size:0.8em;"> (Admin)</span>'
                                : ""
                            }
                          </span>
                          <span class="comment-date">
                            <i class="far fa-clock"></i>
                            ${comment.date}
                          </span>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                        ${
                          isAdminLoggedIn
                            ? `
                        <div class="comment-actions">
                          <button class="btn-comment-delete delete-comment-btn" title="Eliminar comentario">
                            <i class="fas fa-trash"></i> Eliminar
                          </button>
                        </div>
                        `
                            : ""
                        }
                      </div>
                    `
                    )
                    .join("")
                : '<div class="no-comments"><i class="far fa-comment-slash"></i><p>No hay comentarios aún. ¡Sé el primero en comentar!</p></div>'
            }
          </div>

          <form class="comment-form" id="comment-form-${news.id}">
            <div class="form-group">
              <input type="text" class="comment-author-input" placeholder="Tu nombre (opcional)" maxlength="50" value="${
                localStorage.getItem("comment_author") || ""
              }">
            </div>
            <div class="form-group">
              <textarea class="comment-text-input" placeholder="Escribe tu comentario aquí..." rows="3" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-paper-plane"></i> Publicar Comentario
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Agregar estilos si no existen
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

  // Eventos del modal
  const modal = document.querySelector(".news-modal.active");
  const closeBtn = modal.querySelector(".close-modal");
  const shareBtn = modal.querySelector(".share-news-modal");
  const commentForm = modal.querySelector(`#comment-form-${news.id}`);
  const authorInput = commentForm.querySelector(".comment-author-input");
  const textInput = commentForm.querySelector(".comment-text-input");

  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  shareBtn.addEventListener("click", () => {
    shareNews(news);
    modal.remove();
  });

  // Enfoque automático en el campo de texto
  textInput.focus();

  // Evento para enviar comentario
  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (!text) {
      showNotification("Escribe un comentario antes de publicar", "error");
      textInput.focus();
      return;
    }

    // Guardar nombre del autor para futuros comentarios
    if (author) {
      localStorage.setItem("comment_author", author);
    }

    // Agregar comentario
    const newComment = addComment(news.id, author || "Anónimo", text);

    if (newComment) {
      showNotification("¡Comentario publicado!", "success");

      // Cerrar modal y volver a abrirlo para mostrar el comentario nuevo
      modal.remove();
      readMoreNews(news.id);
    }
  });

  // Eventos para eliminar comentarios (solo admin)
  if (isAdminLoggedIn) {
    modal.querySelectorAll(".delete-comment-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const commentItem = this.closest(".comment-item");
        const commentId = parseInt(commentItem.dataset.commentId);

        if (confirm("¿Eliminar este comentario permanentemente?")) {
          deleteComment(news.id, commentId);
          showNotification("Comentario eliminado", "warning");

          // Cerrar modal y volver a abrirlo para actualizar
          modal.remove();
          readMoreNews(news.id);
        }
      });
    });
  }
}

// ===== FUNCIONES DEL FORMULARIO =====
function showNewsForm() {
  if (!isAdminLoggedIn) {
    showNotification("Debes iniciar sesión primero", "error");
    return;
  }

  editingNewsId = null;
  document.getElementById("form-title").textContent = "Nueva Noticia";
  document.getElementById("news-form").classList.add("active");
  document.getElementById("news-title").focus();

  // Limpiar formulario
  document.getElementById("news-form").reset();
}

function hideNewsForm() {
  document.getElementById("news-form").classList.remove("active");
  editingNewsId = null;
}

function saveNews() {
  if (!isAdminLoggedIn) {
    showNotification("Debes iniciar sesión primero", "error");
    return;
  }

  const title = document.getElementById("news-title").value.trim();
  const category = document.getElementById("news-category").value;
  const content = document.getElementById("news-content").value.trim();
  const image = document.getElementById("news-image").value.trim();
  const important = document.getElementById("news-important").checked;
  const pinned = document.getElementById("news-pinned").checked;

  if (!title || !content) {
    showNotification("Completa el título y contenido", "error");
    return;
  }

  if (editingNewsId) {
    // Editar noticia existente
    const index = newsDatabase.news.findIndex((n) => n.id === editingNewsId);
    if (index !== -1) {
      newsDatabase.news[index] = {
        ...newsDatabase.news[index],
        title,
        category,
        content,
        excerpt: content.substring(0, 150) + "...",
        image,
        important,
        pinned,
      };
      showNotification("Noticia actualizada", "success");
    }
  } else {
    // Crear nueva noticia
    const newId =
      newsDatabase.news.length > 0
        ? Math.max(...newsDatabase.news.map((n) => n.id)) + 1
        : 1;

    const newNews = {
      id: newId,
      title,
      category,
      content,
      excerpt: content.substring(0, 150) + "...",
      date: new Date().toISOString().split("T")[0],
      image,
      important,
      pinned,
      views: 0,
      comments: [], // Array vacío para comentarios
    };

    newsDatabase.news.unshift(newNews);
    showNotification("Noticia publicada", "success");
  }

  // Guardar y actualizar
  saveToLocalStorage();
  hideNewsForm();
  renderNews();
  updateStats();
  updateAdminStats();
  loadSidebar();
}

function editNews(id) {
  if (!isAdminLoggedIn) return;

  const news = newsDatabase.news.find((n) => n.id === id);
  if (!news) return;

  editingNewsId = id;
  document.getElementById("form-title").textContent = "Editar Noticia";

  // Llenar formulario
  document.getElementById("news-title").value = news.title;
  document.getElementById("news-category").value = news.category;
  document.getElementById("news-content").value = news.content;
  document.getElementById("news-image").value = news.image || "";
  document.getElementById("news-important").checked = news.important;
  document.getElementById("news-pinned").checked = news.pinned;

  // Mostrar formulario
  document.getElementById("news-form").classList.add("active");
  document.getElementById("news-title").focus();
}

function deleteNews(id) {
  if (
    !isAdminLoggedIn ||
    !confirm("¿Eliminar esta noticia y todos sus comentarios?")
  )
    return;

  newsDatabase.news = newsDatabase.news.filter((n) => n.id !== id);
  saveToLocalStorage();
  renderNews();
  updateStats();
  updateAdminStats();
  loadSidebar();

  showNotification("Noticia eliminada", "warning");
}

function togglePinNews(id) {
  if (!isAdminLoggedIn) return;

  const news = newsDatabase.news.find((n) => n.id === id);
  if (news) {
    news.pinned = !news.pinned;
    saveToLocalStorage();
    renderNews();
    showNotification(
      news.pinned ? "Noticia fijada" : "Noticia desfijada",
      "info"
    );
  }
}

// ===== SISTEMA DE COMENTARIOS =====
function addComment(newsId, author, text) {
  const news = newsDatabase.news.find((n) => n.id === newsId);
  if (!news) return null;

  // Asegurar que exista el array de comentarios
  if (!news.comments) {
    news.comments = [];
  }

  // Generar ID único para el comentario
  const commentId =
    news.comments.length > 0
      ? Math.max(...news.comments.map((c) => c.id)) + 1
      : 1;

  const newComment = {
    id: commentId,
    author: author,
    text: text,
    date: new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    role: isAdminLoggedIn ? "admin" : "member",
  };

  news.comments.push(newComment);
  saveToLocalStorage();
  return newComment;
}

function deleteComment(newsId, commentId) {
  const news = newsDatabase.news.find((n) => n.id === newsId);
  if (!news || !news.comments) return false;

  const initialLength = news.comments.length;
  news.comments = news.comments.filter((c) => c.id !== commentId);

  if (news.comments.length < initialLength) {
    saveToLocalStorage();
    return true;
  }

  return false;
}

// ===== FUNCIONES UTILITARIAS =====
function updateStats() {
  const totalNews = newsDatabase.news.length;
  const importantNews = newsDatabase.news.filter((n) => n.important).length;

  // Noticias de este mes
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

function updateAdminStats() {
  if (isAdminLoggedIn) {
    document.getElementById("admin-total-news").textContent =
      newsDatabase.news.length;
    document.getElementById("admin-total-views").textContent =
      newsDatabase.totalViews;
  }
}

function loadSidebar() {
  // Noticias destacadas (las 3 más importantes o recientes)
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
      <p>${new Date(news.date).toLocaleDateString("es-ES")} • ${
        news.comments ? news.comments.length : 0
      } comentarios</p>
    </div>
  `
    )
    .join("");

  // Agregar eventos
  document
    .querySelectorAll("#highlighted-news .highlight-item")
    .forEach((item) => {
      item.addEventListener("click", function () {
        const id = parseInt(this.dataset.id);
        readMoreNews(id);
      });
    });

  // Noticias recientes en footer
  const recent = newsDatabase.news.slice(0, 3);
  const footerContainer = document.getElementById("recent-news-footer");
  footerContainer.innerHTML = recent
    .map(
      (news) => `
    <li>
      <a href="javascript:void(0)" data-id="${news.id}">
        <i class="fas fa-newspaper"></i> ${news.title}
        <span class="comment-count-small">(${
          news.comments ? news.comments.length : 0
        })</span>
      </a>
    </li>
  `
    )
    .join("");

  // Agregar estilos para el contador pequeño
  if (!document.querySelector("#comment-count-styles")) {
    const styles = document.createElement("style");
    styles.id = "comment-count-styles";
    styles.textContent = `
      .comment-count-small {
        color: #4CAF50;
        font-size: 0.8em;
        font-weight: bold;
      }
    `;
    document.head.appendChild(styles);
  }

  // Agregar eventos al footer
  document.querySelectorAll("#recent-news-footer a").forEach((link) => {
    link.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      readMoreNews(id);
    });
  });
}

function changePage(direction) {
  const totalNews = newsDatabase.news.length;
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

  // Actualizar botones
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Actualizar números
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
      showNotification("Enlace copiado", "info");
    });
  }
}

function isNewNews(dateString) {
  const newsDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - newsDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7; // Noticia nueva si tiene menos de 7 días
}

function showManageModal() {
  if (!isAdminLoggedIn) {
    showNotification("Debes iniciar sesión primero", "error");
    return;
  }

  let html = '<h3><i class="fas fa-list"></i> Gestionar Noticias</h3>';
  html += '<div class="manage-list">';

  newsDatabase.news.forEach((news, index) => {
    const date = new Date(news.date).toLocaleDateString("es-ES");
    const commentsCount = news.comments ? news.comments.length : 0;
    html += `
      <div class="manage-item">
        <div class="manage-header">
          <span class="manage-number">${index + 1}</span>
          <span class="manage-title">${news.title}</span>
          <div class="manage-actions">
            <button class="btn-small edit-manage" data-id="${news.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-small delete-manage" data-id="${news.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="manage-info">
          <span><i class="far fa-calendar"></i> ${date}</span>
          <span><i class="far fa-eye"></i> ${news.views} vistas</span>
          <span><i class="far fa-comment"></i> ${commentsCount} comentarios</span>
          <span><i class="fas fa-thumbtack"></i> ${
            news.pinned ? "Fijada" : "No fijada"
          }</span>
        </div>
      </div>
    `;
  });

  html += "</div>";

  // Crear modal
  const modal = document.createElement("div");
  modal.className = "custom-modal active";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Gestionar Noticias</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        ${html}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Estilos para el modal
  if (!document.querySelector("#manage-modal-styles")) {
    const styles = document.createElement("style");
    styles.id = "manage-modal-styles";
    styles.textContent = `
      .custom-modal {
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
      .custom-modal.active {
        display: flex;
      }
      .custom-modal .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 30px;
        width: 100%;
        position: relative;
      }
      .custom-modal .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 2em;
        cursor: pointer;
        color: #666;
      }
      .manage-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 500px;
        overflow-y: auto;
        padding: 10px;
      }
      .manage-item {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 15px;
        border-left: 4px solid #4CAF50;
      }
      .manage-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }
      .manage-number {
        background: #4CAF50;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
      .manage-title {
        flex: 1;
        font-weight: 600;
      }
      .manage-actions {
        display: flex;
        gap: 10px;
      }
      .manage-info {
        display: flex;
        gap: 20px;
        color: #666;
        font-size: 0.9em;
        flex-wrap: wrap;
      }
      .btn-small {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .edit-manage {
        background: #2196f3;
        color: white;
      }
      .delete-manage {
        background: #f44336;
        color: white;
      }
    `;
    document.head.appendChild(styles);
  }

  // Eventos del modal
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Eventos de los botones
  modal.querySelectorAll(".edit-manage").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      modal.remove();
      editNews(id);
    });
  });

  modal.querySelectorAll(".delete-manage").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.dataset.id);
      deleteNews(id);
      modal.remove();
    });
  });
}

// ===== ALMACENAMIENTO LOCAL =====
function saveToLocalStorage() {
  try {
    localStorage.setItem("serakdep_news", JSON.stringify(newsDatabase));
  } catch (e) {
    console.error("Error al guardar:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem("serakdep_news");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.news && Array.isArray(parsed.news)) {
        newsDatabase = parsed;

        // Migrar a la nueva estructura de WhatsApp si es necesario
        if (!newsDatabase.whatsappStats) {
          newsDatabase.whatsappStats = {
            members: 125,
            notifications: 48,
            clicks: 0,
            joinLink: "https://whatsapp.com/channel/0029VaYOURCHANNELCODE",
          };
        }

        // Migrar comentarios antiguos (si es necesario)
        newsDatabase.news.forEach((news) => {
          if (news.comments === undefined) {
            news.comments = [];
          }
          // Asegurar que cada comentario tenga un ID único
          if (news.comments && news.comments.length > 0) {
            news.comments.forEach((comment, index) => {
              if (!comment.id) {
                comment.id = index + 1;
              }
              if (!comment.role) {
                comment.role = comment.author.toLowerCase().includes("admin")
                  ? "admin"
                  : "member";
              }
            });
          }
        });
      }
    }
  } catch (e) {
    console.error("Error al cargar:", e);
  }
}

// ===== NOTIFICACIONES =====
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

  // Estilos de animación
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

// Funcionalidad para el scroll horizontal de estadísticas - VERSIÓN MEJORADA
function initStatsScroll() {
  const statsContainer = document.querySelector(".news-stats");
  const leftIndicator = document.querySelector(".scroll-indicator.left");
  const rightIndicator = document.querySelector(".scroll-indicator.right");

  if (!statsContainer) return;

  // Verificar si hay overflow (necesita scroll)
  function checkOverflow() {
    const hasOverflow = statsContainer.scrollWidth > statsContainer.clientWidth;
    if (hasOverflow) {
      statsContainer.classList.add("has-overflow");
    } else {
      statsContainer.classList.remove("has-overflow");
    }
    return hasOverflow;
  }

  // Función para desplazar hacia la izquierda
  function scrollLeft() {
    const scrollAmount = statsContainer.clientWidth * 0.5; // 50% del ancho visible
    statsContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  }

  // Función para desplazar hacia la derecha
  function scrollRight() {
    const scrollAmount = statsContainer.clientWidth * 0.5; // 50% del ancho visible
    statsContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }

  // Añadir eventos a los indicadores
  if (leftIndicator) {
    leftIndicator.addEventListener("click", scrollLeft);
    leftIndicator.addEventListener("touchstart", (e) => {
      e.preventDefault();
      scrollLeft();
    });
  }

  if (rightIndicator) {
    rightIndicator.addEventListener("click", scrollRight);
    rightIndicator.addEventListener("touchstart", (e) => {
      e.preventDefault();
      scrollRight();
    });
  }

  // Añadir navegación con teclado
  statsContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      scrollLeft();
    } else if (e.key === "ArrowRight") {
      scrollRight();
    }
  });

  // Añadir navegación con gestos táctiles - VERSIÓN MEJORADA
  let isScrolling = false;
  let startX = 0;
  let scrollLeftPosition = 0;
  let velocity = 0;
  let lastX = 0;
  let timestamp = 0;

  statsContainer.addEventListener("touchstart", (e) => {
    isScrolling = true;
    startX = e.touches[0].pageX;
    scrollLeftPosition = statsContainer.scrollLeft;
    velocity = 0;
    lastX = startX;
    timestamp = Date.now();
    statsContainer.style.scrollBehavior = "auto"; // Desactivar smooth durante gesto
  });

  statsContainer.addEventListener("touchmove", (e) => {
    if (!isScrolling) return;

    const x = e.touches[0].pageX;
    const currentTime = Date.now();
    const timeDiff = currentTime - timestamp;

    if (timeDiff > 0) {
      velocity = (x - lastX) / timeDiff; // Velocidad en px/ms
      lastX = x;
      timestamp = currentTime;
    }

    // Disminuir la sensibilidad reduciendo el multiplicador
    const sensitivity = 0.8; // Multiplicador reducido
    const walk = (x - startX) * sensitivity;

    // Aplicar resistencia (fricción) para que sea menos sensible
    const resistance = Math.abs(walk) > 100 ? 0.7 : 1; // Más resistencia después de cierto punto

    statsContainer.scrollLeft = scrollLeftPosition - walk * resistance;

    // Prevenir scroll vertical no deseado
    e.preventDefault();
  });

  statsContainer.addEventListener("touchend", () => {
    if (!isScrolling) return;

    isScrolling = false;
    statsContainer.style.scrollBehavior = "smooth"; // Reactivar smooth

    // Aplicar inercia basada en la velocidad
    if (Math.abs(velocity) > 0.1) {
      const inertia = velocity * 300; // Factor de inercia ajustado
      statsContainer.scrollBy({
        left: -inertia,
        behavior: "smooth",
      });
    }

    // Snap al elemento más cercano
    const items = document.querySelectorAll(".stat-item");
    const containerRect = statsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestItem = null;
    let minDistance = Infinity;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(itemCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      const itemIndex = Array.from(items).indexOf(closestItem);
      const scrollTo =
        closestItem.offsetLeft -
        statsContainer.clientWidth / 2 +
        closestItem.clientWidth / 2;

      statsContainer.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  });

  // Añadir eventos de ratón para escritorio
  let isMouseDown = false;
  let mouseStartX = 0;
  let mouseScrollLeft = 0;

  statsContainer.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    mouseStartX = e.pageX;
    mouseScrollLeft = statsContainer.scrollLeft;
    statsContainer.style.cursor = "grabbing";
    statsContainer.style.userSelect = "none";
    statsContainer.style.scrollBehavior = "auto";
  });

  statsContainer.addEventListener("mousemove", (e) => {
    if (!isMouseDown) return;

    const x = e.pageX;
    const walk = (x - mouseStartX) * 0.5; // Sensibilidad reducida para ratón
    statsContainer.scrollLeft = mouseScrollLeft - walk;
  });

  statsContainer.addEventListener("mouseup", () => {
    isMouseDown = false;
    statsContainer.style.cursor = "grab";
    statsContainer.style.userSelect = "auto";
    statsContainer.style.scrollBehavior = "smooth";
  });

  statsContainer.addEventListener("mouseleave", () => {
    isMouseDown = false;
    statsContainer.style.cursor = "grab";
    statsContainer.style.userSelect = "auto";
  });

  // Inicializar cursor
  statsContainer.style.cursor = "grab";

  // Verificar overflow al cargar y al redimensionar
  checkOverflow();
  window.addEventListener("resize", checkOverflow);

  // Hacer que las estadísticas sean enfocables para accesibilidad
  document.querySelectorAll(".stat-item").forEach((item, index) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute(
      "aria-label",
      `Estadística ${index + 1}: ${item.querySelector("h3").textContent}`
    );

    // Scroll al elemento al hacer clic
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

  // Añadir botones de navegación con el teclado
  document.addEventListener("keydown", (e) => {
    if (e.target.classList.contains("stat-item")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.target.click();
      }
    }
  });
}
