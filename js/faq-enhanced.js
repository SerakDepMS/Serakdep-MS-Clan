// faq-enhanced.js - Funcionalidades avanzadas para FAQ

class EnhancedFAQ {
  constructor() {
    this.faqItems = document.querySelectorAll(".faq-item");
    this.searchInput = document.getElementById("faq-search");
    this.categoryButtons = document.querySelectorAll(".faq-category-btn");
    this.searchResultsCount = document.getElementById("search-results");
    this.currentCategory = "all";
    this.searchQuery = "";

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFAQAccordion();
    this.updateSearchResults();
  }

  setupEventListeners() {
    // Búsqueda en tiempo real
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterFAQs();
      });
    }

    // Filtro por categorías
    this.categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setActiveCategory(button);
      });
    });

    // Limpiar búsqueda con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.searchInput) {
        this.searchInput.value = "";
        this.searchQuery = "";
        this.filterFAQs();
        this.searchInput.blur();
      }
    });
  }

  setupFAQAccordion() {
    this.faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Cerrar todos los demás
        if (!isActive) {
          this.closeAllFAQs();
        }

        // Alternar estado
        item.classList.toggle("active");

        // Animar altura
        if (item.classList.contains("active")) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = "0";
        }
      });
    });
  }

  closeAllFAQs() {
    this.faqItems.forEach((item) => {
      item.classList.remove("active");
      const answer = item.querySelector(".faq-answer");
      answer.style.maxHeight = "0";
    });
  }

  setActiveCategory(button) {
    // Remover clase active de todos los botones
    this.categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // Agregar clase active al botón clickeado
    button.classList.add("active");

    // Actualizar categoría actual
    this.currentCategory = button.dataset.category;

    // Filtrar FAQs
    this.filterFAQs();
  }

  filterFAQs() {
    let visibleCount = 0;
    const searchTerm = this.searchQuery;

    this.faqItems.forEach((item) => {
      const questionText = item
        .querySelector(".faq-question span")
        .textContent.toLowerCase();
      const answerText = item
        .querySelector(".faq-answer")
        .textContent.toLowerCase();
      const itemCategory = item.dataset.category;

      // Verificar si coincide con la búsqueda
      const matchesSearch =
        !searchTerm ||
        questionText.includes(searchTerm) ||
        answerText.includes(searchTerm);

      // Verificar si coincide con la categoría
      const matchesCategory =
        this.currentCategory === "all" || itemCategory === this.currentCategory;

      // Mostrar u ocultar elemento
      if (matchesSearch && matchesCategory) {
        item.style.display = "block";
        visibleCount++;

        // Resaltar término de búsqueda
        if (searchTerm) {
          this.highlightText(item, searchTerm);
        } else {
          this.removeHighlights(item);
        }
      } else {
        item.style.display = "none";
        item.classList.remove("active");
        const answer = item.querySelector(".faq-answer");
        answer.style.maxHeight = "0";
      }
    });

    // Mostrar/Ocultar secciones de categoría
    this.toggleCategorySections();

    // Actualizar contador de resultados
    this.updateSearchResultsCount(visibleCount);
  }

  toggleCategorySections() {
    const categorySections = document.querySelectorAll(".faq-category-section");

    categorySections.forEach((section) => {
      const category = section.dataset.category;
      const hasVisibleItems = Array.from(
        section.querySelectorAll(".faq-item")
      ).some((item) => item.style.display !== "none");

      if (this.currentCategory === "all" || category === this.currentCategory) {
        section.style.display = hasVisibleItems ? "block" : "none";
      } else {
        section.style.display = "none";
      }
    });
  }

  highlightText(item, term) {
    const questionSpan = item.querySelector(".faq-question span");
    const answerDiv = item.querySelector(".faq-answer");

    // Remover resaltados anteriores
    this.removeHighlights(item);

    // Resaltar en la pregunta
    const questionHTML = questionSpan.textContent;
    const highlightedQuestion = questionHTML.replace(
      new RegExp(term, "gi"),
      (match) => `<span class="highlight">${match}</span>`
    );
    questionSpan.innerHTML = highlightedQuestion;

    // Resaltar en la respuesta
    const paragraphs = answerDiv.querySelectorAll("p, li, strong");
    paragraphs.forEach((element) => {
      const originalHTML = element.innerHTML;
      const highlightedHTML = originalHTML.replace(
        new RegExp(term, "gi"),
        (match) => `<span class="highlight">${match}</span>`
      );
      element.innerHTML = highlightedHTML;
    });
  }

  removeHighlights(item) {
    const highlights = item.querySelectorAll(".highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(
        document.createTextNode(highlight.textContent),
        highlight
      );
      parent.normalize();
    });
  }

  updateSearchResultsCount(count) {
    if (!this.searchResultsCount) return;

    if (this.searchQuery && count > 0) {
      this.searchResultsCount.textContent = `${count} resultados`;
      this.searchResultsCount.style.display = "block";
    } else if (this.searchQuery && count === 0) {
      this.searchResultsCount.textContent = "0 resultados";
      this.searchResultsCount.style.display = "block";
    } else {
      this.searchResultsCount.style.display = "none";
    }
  }

  updateSearchResults() {
    const totalItems = document.querySelectorAll(".faq-item").length;
    if (this.searchResultsCount && !this.searchQuery) {
      this.searchResultsCount.textContent = `${totalItems} preguntas`;
      this.searchResultsCount.style.display = "block";
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new EnhancedFAQ();

  // Añadir estilos para resaltado
  const style = document.createElement("style");
  style.textContent = `
        .highlight {
            background-color: #fff3cd;
            color: #856404;
            padding: 0 2px;
            border-radius: 3px;
            font-weight: bold;
        }
        
        .faq-category-section[style*="display: none"] + .faq-category-section {
            margin-top: 0;
        }
    `;
  document.head.appendChild(style);
});
