// eventos.js - Funcionalidades específicas para la página de eventos

document.addEventListener("DOMContentLoaded", function () {
  // Actualizar el año en el copyright
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Inicializar todas las funcionalidades
  initCountdownTimers();
  initCalendar();
  initEventListeners();
  initStatistics();

  console.log("Eventos.js cargado correctamente 🐼");
});

// ===== FUNCIONES DEL CALENDARIO =====
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initCalendar() {
  // Datos de eventos
  window.calendarEvents = {
    "2025-03-08": { type: "game", icon: "🎮", title: "Game Night" },
    "2025-03-13": { type: "special", icon: "🎪", title: "Evento Especial" },
    "2025-03-14": { type: "game", icon: "🌙", title: "Game Night: Adopt Me" },
    "2025-03-15": {
      type: "tournament",
      icon: "🏆",
      title: "Torneo Blox Fruits",
    },
    "2025-03-16": {
      type: "tournament",
      icon: "🎭",
      title: "Campeonato Brookhaven",
    },
    "2025-03-19": { type: "tournament", icon: "🎯", title: "Torneo Arsenal" },
    "2025-03-22": {
      type: "tournament",
      icon: "🏅",
      title: "Competencia King Legacy",
    },
    "2025-03-25": { type: "special", icon: "🎁", title: "Evento Aniversario" },
    "2025-03-28": { type: "special", icon: "🎊", title: "Fiesta del Clan" },
  };

  renderCalendar(currentMonth, currentYear);
  renderEventList(currentMonth, currentYear);
}

function renderCalendar(month, year) {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYearElement = document.getElementById("current-month-year");

  if (!calendarGrid || !monthYearElement) return;

  // Limpiar calendario anterior
  calendarGrid.innerHTML = "";

  // Configurar fecha actual
  const today = new Date();
  const isCurrentMonth =
    month === today.getMonth() && year === today.getFullYear();

  // Actualizar título del mes
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  monthYearElement.textContent = `${monthNames[month]} ${year}`;

  // Crear encabezados de días
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  daysOfWeek.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day header";
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });

  // Obtener primer día del mes
  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay(); // 0 = Domingo

  // Obtener último día del mes
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  // Días vacíos al inicio
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendarGrid.appendChild(emptyDay);
  }

  // Crear días del mes
  for (let day = 1; day <= totalDays; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.dataset.day = day;
    dayElement.dataset.month = month;
    dayElement.dataset.year = year;

    // Verificar si es hoy
    if (isCurrentMonth && day === today.getDate()) {
      dayElement.classList.add("today");
    }

    // Verificar si hay evento
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const event = window.calendarEvents[dateKey];

    if (event) {
      dayElement.classList.add("event-day");
      dayElement.dataset.eventType = event.icon;
      dayElement.title = event.title;
    }

    // Agregar número del día
    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    // Agregar iconos de eventos si hay más de uno
    if (event) {
      const eventIcons = document.createElement("div");
      eventIcons.className = "event-icons";
      eventIcons.textContent = event.icon;
      dayElement.appendChild(eventIcons);
    }

    calendarGrid.appendChild(dayElement);
  }
}

function renderEventList(month, year) {
  const eventsList = document.getElementById("calendar-events-list");
  if (!eventsList) return;

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Filtrar eventos del mes actual
  const currentMonthEvents = Object.entries(window.calendarEvents || {})
    .filter(([date]) => {
      const eventDate = new Date(date);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    })
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB));

  if (currentMonthEvents.length === 0) {
    eventsList.innerHTML = `
            <h4>Eventos de ${monthNames[month]} ${year}</h4>
            <p style="text-align: center; color: #666; padding: 20px;">
                No hay eventos programados para este mes.
            </p>
        `;
    return;
  }

  let html = `<h4>Eventos de ${monthNames[month]} ${year}</h4>`;

  currentMonthEvents.forEach(([date, event]) => {
    const eventDate = new Date(date);
    const day = eventDate.getDate();
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const dayName = dayNames[eventDate.getDay()];

    let typeClass = "";
    switch (event.type) {
      case "tournament":
        typeClass = "Torneo";
        break;
      case "game":
        typeClass = "Game Night";
        break;
      case "special":
        typeClass = "Especial";
        break;
    }

    html += `
            <div class="event-list-item">
                <div class="event-list-date">
                    ${dayName} ${day}
                </div>
                <div class="event-list-title">
                    <strong>${event.icon} ${event.title}</strong>
                </div>
                <div class="event-list-type">
                    ${typeClass}
                </div>
            </div>
        `;
  });

  eventsList.innerHTML = html;
}

function changeMonth(direction) {
  if (direction === "prev") {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  } else if (direction === "next") {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  renderCalendar(currentMonth, currentYear);
  renderEventList(currentMonth, currentYear);
}

// ===== CONTADORES REGRESIVOS =====
function initCountdownTimers() {
  // Configurar múltiples contadores
  setupCountdown("countdown1", "2025-03-15T18:00:00-05:00");
  // Puedes agregar más contadores aquí
}

function setupCountdown(elementId, targetDateString) {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) return;

  function updateCountdown() {
    const targetDate = new Date(targetDateString).getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
                <div class="timer-unit">
                    <span class="timer-number">${days}</span>
                    <span class="timer-label">Días</span>
                </div>
                <div class="timer-unit">
                    <span class="timer-number">${hours}</span>
                    <span class="timer-label">Horas</span>
                </div>
                <div class="timer-unit">
                    <span class="timer-number">${minutes}</span>
                    <span class="timer-label">Minutos</span>
                </div>
                <div class="timer-unit">
                    <span class="timer-number">${seconds}</span>
                    <span class="timer-label">Segundos</span>
                </div>
            `;
    } else {
      countdownElement.innerHTML = `
                <div style="text-align: center; width: 100%;">
                    <p style="color: #4CAF50; font-weight: bold; font-size: 1.2em;">
                        <i class="fas fa-play-circle"></i> ¡El evento ha comenzado!
                    </p>
                    <p style="color: #666; font-size: 0.9em;">
                        Únete al grupo de WhatsApp para participar
                    </p>
                </div>
            `;
    }
  }

  // Actualizar cada segundo
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===== ESTADÍSTICAS =====
function initStatistics() {
  animateStatCounters();
  animateChartBars();
}

function animateStatCounters() {
  const stats = [
    { element: "total-wins", target: 156, duration: 2000 },
    { element: "events-done", target: 48, duration: 2000 },
    { element: "total-prizes", target: 225, duration: 2000 },
    { element: "avg-participants", target: 18, duration: 2000 },
  ];

  stats.forEach((stat) => {
    const element = document.getElementById(stat.element);
    if (!element) return;

    let current = 0;
    const increment = stat.target / (stat.duration / 16); // 60fps
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.target) {
        current = stat.target;
        clearInterval(timer);
      }

      // Formatear el valor
      let displayValue;
      if (stat.element === "total-prizes") {
        displayValue = `${Math.floor(current)}K`;
      } else {
        displayValue = Math.floor(current);
      }

      element.textContent = displayValue;
    }, 16);
  });
}

function animateChartBars() {
  const bars = document.querySelectorAll(".bar-fill");

  bars.forEach((bar, index) => {
    // Reiniciar ancho a 0 para animación
    const originalWidth = bar.style.width;
    bar.style.width = "0%";

    // Animar después de un retraso
    setTimeout(() => {
      bar.style.width = originalWidth;
    }, 300 * index);
  });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Botones de navegación del calendario
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => changeMonth("prev"));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => changeMonth("next"));
  }

  // Navegación por teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeMonth("prev");
    } else if (e.key === "ArrowRight") {
      changeMonth("next");
    }
  });

  // Click en días del calendario
  document.addEventListener("click", (e) => {
    if (e.target.closest(".calendar-day.event-day")) {
      const dayElement = e.target.closest(".calendar-day");
      const day = dayElement.dataset.day;
      const month = parseInt(dayElement.dataset.month) + 1;
      const year = dayElement.dataset.year;

      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const event = window.calendarEvents[dateKey];

      if (event) {
        alert(
          `Evento: ${event.title}\nFecha: ${day}/${month}/${year}\n\n${
            event.description || "¡No te lo pierdas!"
          }`
        );
      }
    }
  });

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

// ===== FUNCIONES UTILITARIAS =====
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-ES", options);
}

// Al final del archivo eventos.js, agrega:

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar barras de gráfico
  const bars = document.querySelectorAll(".bar-fill");
  bars.forEach((bar) => {
    const width = bar.getAttribute("data-width");
    if (width) {
      // Esperar un poco para que la animación sea visible
      setTimeout(() => {
        bar.style.width = `${width}%`;
      }, 300);
    }
  });

  // Inicializar valores de estadísticas con animación
  const statValues = [
    { id: "total-wins", target: 247 },
    { id: "events-done", target: 52 },
    { id: "total-prizes", target: 1250 },
    { id: "avg-participants", target: 28 },
  ];

  statValues.forEach((stat) => {
    const element = document.getElementById(stat.id);
    if (element) {
      animateValue(
        element,
        0,
        stat.target,
        1500,
        stat.id.includes("prizes") ? "K" : ""
      );
    }
  });
});

// Función para animar números
function animateValue(element, start, end, duration, suffix = "") {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
    }

