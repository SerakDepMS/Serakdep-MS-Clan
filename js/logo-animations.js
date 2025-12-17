// logo-animations.js - Animaciones para el logo del clan

document.addEventListener("DOMContentLoaded", function () {
  const logoContainer = document.querySelector(".clan-logo-container");
  const clanLogo = document.getElementById("clan-logo");

  if (!clanLogo) return;

  // Efecto de hover mejorado
  clanLogo.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1) rotate(5deg)";
    this.style.filter =
      "drop-shadow(0 10px 25px rgba(231, 76, 60, 0.5)) brightness(1.1)";

    // Agregar partículas
    createParticles();
  });

  clanLogo.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg)";
    this.style.filter = "drop-shadow(0 5px 15px rgba(231, 76, 60, 0.3))";
  });

  // Efecto de clic
  clanLogo.addEventListener("click", function (e) {
    e.preventDefault();

    // Animación de clic
    this.style.transform = "scale(0.95)";

    // Crear efecto de ondas
    createRippleEffect(e.clientX, e.clientY);

    // Restaurar después de 300ms
    setTimeout(() => {
      this.style.transform = "scale(1.1) rotate(5deg)";
    }, 300);
  });

  // Rotación automática ocasional
  setInterval(() => {
    if (!isElementHovered(clanLogo)) {
      clanLogo.style.transform = "scale(1.05) rotate(2deg)";

      setTimeout(() => {
        if (!isElementHovered(clanLogo)) {
          clanLogo.style.transform = "scale(1) rotate(0deg)";
        }
      }, 1000);
    }
  }, 10000);

  // Animar badges
  animateBadges();

  // Efecto de texto parpadeante
  animateSlogan();

  // Función para crear partículas
  function createParticles() {
    // Limpiar partículas anteriores
    const existingParticles = document.querySelectorAll(".particle");
    existingParticles.forEach((p) => p.remove());

    // Crear contenedor de partículas si no existe
    let particlesContainer = document.querySelector(".logo-particles");
    if (!particlesContainer) {
      particlesContainer = document.createElement("div");
      particlesContainer.className = "logo-particles";
      logoContainer.appendChild(particlesContainer);
    }

    // Crear 15 partículas
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Posición aleatoria alrededor del logo
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 60;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      // Estilos iniciales
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      particle.style.opacity = "0";

      // Tamaño aleatorio
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Color aleatorio
      const colors = [
        "rgba(231, 76, 60, 0.8)", // Rojo
        "rgba(52, 152, 219, 0.8)", // Azul
        "rgba(46, 204, 113, 0.8)", // Verde
        "rgba(155, 89, 182, 0.8)", // Púrpura
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;

      // Animación personalizada
      const duration = 2 + Math.random() * 2;
      const delay = Math.random() * 1;

      particle.style.animation = `particleFloat ${duration}s ease-out ${delay}s forwards`;

      // Agregar al contenedor
      particlesContainer.appendChild(particle);

      // Eliminar después de la animación
      setTimeout(() => {
        if (particle.parentNode) {
          particle.remove();
        }
      }, (duration + delay) * 1000);
    }
  }

  // Función para crear efecto de ondas
  function createRippleEffect(x, y) {
    const ripple = document.createElement("div");
    ripple.className = "ripple-effect";

    // Estilos del ripple
    ripple.style.position = "fixed";
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.borderRadius = "50%";
    ripple.style.background =
      "radial-gradient(circle, rgba(231, 76, 60, 0.6) 0%, transparent 70%)";
    ripple.style.pointerEvents = "none";
    ripple.style.zIndex = "1000";
    ripple.style.left = `${x - 10}px`;
    ripple.style.top = `${y - 10}px`;
    ripple.style.transform = "scale(0)";

    document.body.appendChild(ripple);

    // Animación
    ripple.animate(
      [
        { transform: "scale(0)", opacity: 1 },
        { transform: "scale(20)", opacity: 0 },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      }
    );

    // Eliminar después de la animación
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 1000);
  }

  // Función para animar badges
  function animateBadges() {
    const badges = document.querySelectorAll(".badge");

    badges.forEach((badge, index) => {
      // Retraso escalonado
      badge.style.animationDelay = `${index * 0.2}s`;

      // Efecto de aparición
      badge.style.opacity = "0";
      badge.style.transform = "translateY(20px)";

      setTimeout(() => {
        badge.style.transition = "all 0.5s ease";
        badge.style.opacity = "1";
        badge.style.transform = "translateY(0)";
      }, 300 + index * 200);

      // Efecto de pulso ocasional
      setInterval(() => {
        if (Math.random() > 0.7) {
          // 30% de probabilidad
          badge.style.transform = "scale(1.05)";

          setTimeout(() => {
            badge.style.transform = "scale(1)";
          }, 300);
        }
      }, 5000 + Math.random() * 5000);
    });
  }

  // Función para animar el slogan
  function animateSlogan() {
    const slogan = document.querySelector(".clan-slogan");
    if (!slogan) return;

    const originalText = slogan.textContent;
    const letters = originalText.split("");

    // Crear efecto de máquina de escribir
    slogan.textContent = "";

    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      span.style.animationDelay = `${index * 0.05}s`;

      slogan.appendChild(span);

      // Animar cada letra
      setTimeout(() => {
        span.style.transition = "opacity 0.3s ease";
        span.style.opacity = "1";

        // Efecto de rebote
        span.style.transform = "translateY(0)";
      }, 1000 + index * 50);
    });

    // Efecto de brillo ocasional
    setInterval(() => {
      slogan.style.textShadow = "0 0 10px rgba(231, 76, 60, 0.5)";

      setTimeout(() => {
        slogan.style.textShadow = "none";
      }, 1000);
    }, 15000);
  }

  // Verificar si un elemento está siendo hover
  function isElementHovered(element) {
    return element.matches(":hover");
  }

  // CSS para las animaciones de partículas
  const style = document.createElement("style");
  style.textContent = `
        @keyframes particleFloat {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) translate(0, 0) scale(0);
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 0.5;
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) translate(${
                  Math.random() * 100 - 50
                }px, ${Math.random() * 100 - 50}px) scale(1);
            }
        }
    `;
  document.head.appendChild(style);
});
