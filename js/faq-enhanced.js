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
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterFAQs();
      });
    }

    this.categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setActiveCategory(button);
      });
    });

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

        if (!isActive) {
          this.closeAllFAQs();
        }

        item.classList.toggle("active");

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
    this.categoryButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    this.currentCategory = button.dataset.category;

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

      const matchesSearch =
        !searchTerm ||
        questionText.includes(searchTerm) ||
        answerText.includes(searchTerm);

      const matchesCategory =
        this.currentCategory === "all" || itemCategory === this.currentCategory;

      if (matchesSearch && matchesCategory) {
        item.style.display = "block";
        visibleCount++;

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

    this.toggleCategorySections();

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

    this.removeHighlights(item);

    if (!term.trim()) return;

    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedTerm, "gi");

    this.highlightTextInNode(questionSpan, searchRegex);

    const answerElements = answerDiv.querySelectorAll("p, li, strong");
    answerElements.forEach((el) => this.highlightTextInNode(el, searchRegex));
  }

  highlightTextInNode(element, regex) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.parentNode.classList?.contains("highlight")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });

    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    textNodes.forEach((textNode) => {
      const textContent = textNode.textContent;
      const matches = [...textContent.matchAll(regex)];

      if (matches.length === 0) return;

      const parentNode = textNode.parentNode;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      matches.forEach((match) => {
        const matchedIndex = match.index;

        if (matchedIndex > lastIndex) {
          fragment.appendChild(
            document.createTextNode(
              textContent.substring(lastIndex, matchedIndex)
            )
          );
        }

        const highlightSpan = document.createElement("span");
        highlightSpan.className = "highlight";
        highlightSpan.textContent = match[0];
        fragment.appendChild(highlightSpan);

        lastIndex = matchedIndex + match[0].length;
      });

      if (lastIndex < textContent.length) {
        fragment.appendChild(
          document.createTextNode(textContent.substring(lastIndex))
        );
      }

      parentNode.replaceChild(fragment, textNode);
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

document.addEventListener("DOMContentLoaded", () => {
  new EnhancedFAQ();

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
