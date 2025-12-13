// main.js - Corregido
document.addEventListener("DOMContentLoaded", function () {
  // Activar enlace actual en el menú
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html") ||
      (currentPage === "index.html" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // Menú móvil
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const nav = document.querySelector("nav");

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", function () {
      nav.classList.toggle("active");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function (event) {
      if (
        !nav.contains(event.target) &&
        !mobileMenuBtn.contains(event.target)
      ) {
        nav.classList.remove("active");
      }
    });
  }

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Actualizar año en el copyright
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Añadir clase fade-in a elementos al cargar
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("fade-in");
    }, index * 100);
  });
});

