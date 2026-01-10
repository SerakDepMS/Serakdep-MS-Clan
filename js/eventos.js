document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  initCalendarData();
  initTodayEvent();
  initCalendar();
  initEventListeners();
  initStatistics();
  initReminderSystem();

  updateEventsDoneCounter();

  setInterval(checkDateUpdate, 60000);

  console.log("Eventos.js cargado correctamente 🐼");
});

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let lastKnownDate = new Date();

function getLocalDate(dateString = null) {
  if (!dateString) {
    const now = new Date();

    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  const parts = dateString.split("-");
  if (parts.length !== 3) return new Date(dateString);

  return new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );
}

function formatDateForKey(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initCalendarData() {
  const today = getLocalDate();
  const currentYear = today.getFullYear();
  const currentMonthNum = today.getMonth();

  if (!window.calendarEvents) {
    window.calendarEvents = {};
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  Object.keys(window.calendarEvents).forEach((dateKey) => {
    const eventDate = getLocalDate(dateKey);
    if (eventDate < thirtyDaysAgo) {
      delete window.calendarEvents[dateKey];
    }
  });

  const fixedEventsByMonth = {
    // Diciembre (11) - Navidad
    11: {
      20: {
        type: "game",
        icon: "🎮",
        title: "Game Night Navideña",
        description: "Una noche especial de juegos con temática navideña",
        time: "18:00 GMT-5",
      },
      22: {
        type: "tournament",
        icon: "🏆",
        title: "Torneo Navideño Blox Fruits",
        description: "Competencia especial de Navidad con premios especiales",
        time: "19:00 GMT-5",
      },
      24: {
        type: "special",
        icon: "🎅",
        title: "Nochebuena del Clan",
        description:
          "Celebración especial de Nochebuena con todos los miembros",
        time: "20:00 GMT-5",
      },
      28: {
        type: "tournament",
        icon: "🎯",
        title: "Torneo de Fin de Año",
        description: "Último torneo del año con grandes premios",
        time: "18:30 GMT-5",
      },
      31: {
        type: "special",
        icon: "🎊",
        title: "Fiesta de Año Nuevo",
        description: "Celebra el fin de año con el clan",
        time: "22:00 GMT-5",
      },
    },
    // Enero (0) - Año Nuevo
    0: {
      5: {
        type: "game",
        icon: "🎮",
        title: "Game Night",
        description: "Primera game night del año",
        time: "18:00 GMT-5",
      },
      8: {
        type: "special",
        icon: "🎪",
        title: "Evento de Reencuentro",
        description: "Reencuentro después de las vacaciones",
        time: "19:00 GMT-5",
      },
      12: {
        type: "tournament",
        icon: "🏆",
        title: "Torneo Blox Fruits",
        description: "Primer torneo oficial del año",
        time: "18:00 GMT-5",
      },
      15: {
        type: "tournament",
        icon: "🎭",
        title: "Campeonato Brookhaven",
        description: "Competición en Brookhaven RP",
        time: "19:30 GMT-5",
      },
      19: {
        type: "game",
        icon: "🌙",
        title: "Game Night: Adopt Me",
        description: "Noche temática de Adopt Me",
        time: "18:00 GMT-5",
      },
      22: {
        type: "tournament",
        icon: "🎯",
        title: "Torneo Arsenal",
        description: "Competencia de disparos en Arsenal",
        time: "19:00 GMT-5",
      },
      25: {
        type: "special",
        icon: "🎁",
        title: "Evento Especial",
        description: "Evento sorpresa del mes",
        time: "20:00 GMT-5",
      },
      28: {
        type: "tournament",
        icon: "🏅",
        title: "Competencia King Legacy",
        description: "Torneo de King Legacy",
        time: "18:30 GMT-5",
      },
    },
  };

  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const targetMonthNum = (currentMonthNum + monthOffset) % 12;
    const targetYear =
      currentYear + Math.floor((currentMonthNum + monthOffset) / 12);

    if (fixedEventsByMonth[targetMonthNum]) {
      Object.keys(fixedEventsByMonth[targetMonthNum]).forEach((day) => {
        const dateKey = `${targetYear}-${String(targetMonthNum + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;

        if (!window.calendarEvents[dateKey]) {
          window.calendarEvents[dateKey] =
            fixedEventsByMonth[targetMonthNum][day];
        }
      });
    }

    generateRecurrentEvents(targetYear, targetMonthNum);
  }

  console.log(
    `Calendario cargado con ${
      Object.keys(window.calendarEvents).length
    } eventos`
  );
}

function generateRecurrentEvents(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = getLocalDate(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`
    );

    if (date.getDay() === 4) {
      const dateKey = formatDateForKey(date);

      if (!window.calendarEvents[dateKey]) {
        window.calendarEvents[dateKey] = {
          type: "game",
          icon: "🎮",
          title: "Game Night Semanal",
          description:
            "Noche de juegos semanal del clan. ¡Trae tu mejor energía!",
          time: "18:00 GMT-5",
        };
      }
    }
  }
}

function updateEventsDoneCounter() {
  const today = getLocalDate();

  const pastEvents = Object.entries(window.calendarEvents || {}).filter(
    ([dateKey, event]) => {
      const eventDate = getLocalDate(dateKey);
      return eventDate < today;
    }
  ).length;

  const eventsDoneElement = document.getElementById("events-done");
  if (eventsDoneElement) {
    eventsDoneElement.textContent = pastEvents;
  }

  const pastTournaments = Object.entries(window.calendarEvents || {}).filter(
    ([dateKey, event]) => {
      const eventDate = getLocalDate(dateKey);
      return eventDate < today && event.type === "tournament";
    }
  ).length;

  const totalWinsElement = document.getElementById("total-wins");
  if (totalWinsElement) {
    totalWinsElement.textContent = pastTournaments * 5;
  }
}

function initCalendar() {
  updateCurrentDate();
  renderCalendar(currentMonth, currentYear);
  renderEventList(currentMonth, currentYear);
}

function updateCurrentDate() {
  const now = getLocalDate();
  currentMonth = now.getMonth();
  currentYear = now.getFullYear();
  lastKnownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function checkDateUpdate() {
  const now = getLocalDate();
  const currentDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (currentDate.getTime() !== lastKnownDate.getTime()) {
    console.log("¡Nuevo día detectado! Actualizando calendario...");

    const currentYearElement = document.getElementById("current-year");
    if (currentYearElement) {
      currentYearElement.textContent = now.getFullYear();
    }

    initCalendarData();
    updateCurrentDate();

    checkTodayReminders();

    if (currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
      renderCalendar(currentMonth, currentYear);
      renderEventList(currentMonth, currentYear);
    }

    initTodayEvent();

    updateEventsDoneCounter();
  }
}

function navigateToCurrentMonth() {
  const now = getLocalDate();
  currentMonth = now.getMonth();
  currentYear = now.getFullYear();
  renderCalendar(currentMonth, currentYear);
  renderEventList(currentMonth, currentYear);

  showNotification("Calendario actualizado al mes actual", "info");
}

function renderCalendar(month, year) {
  const calendarGrid = document.getElementById("calendar-grid");
  const monthYearElement = document.getElementById("current-month-year");

  if (!calendarGrid || !monthYearElement) return;

  calendarGrid.innerHTML = "";

  const today = getLocalDate();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

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

  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  daysOfWeek.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day header";
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });

  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay();

  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();

  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendarGrid.appendChild(emptyDay);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.dataset.day = day;
    dayElement.dataset.month = month;
    dayElement.dataset.year = year;

    const isToday =
      year === todayYear && month === todayMonth && day === todayDate;
    if (isToday) {
      dayElement.classList.add("today");
      dayElement.title = "Hoy";
    }

    const dayOfWeek = new Date(year, month, day).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayElement.classList.add("weekend");
    }

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const event = window.calendarEvents ? window.calendarEvents[dateKey] : null;

    if (event) {
      dayElement.classList.add("event-day");
      dayElement.dataset.eventType = event.type;
      dayElement.title = `${event.title}\n${event.description || ""}`;

      dayElement.classList.add(`event-${event.type}`);
    }

    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    if (event) {
      const eventIcons = document.createElement("div");
      eventIcons.className = "event-icons";
      eventIcons.textContent = event.icon;
      eventIcons.title = event.title;
      dayElement.appendChild(eventIcons);
    }

    if (isToday) {
      const todayIndicator = document.createElement("div");
      todayIndicator.className = "today-indicator";
      todayIndicator.textContent = "HOY";
      dayElement.appendChild(todayIndicator);
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

  const currentMonthEvents = Object.entries(window.calendarEvents || {})
    .filter(([dateKey]) => {
      const eventDate = getLocalDate(dateKey);
      return eventDate.getMonth() === month && eventDate.getFullYear() === year;
    })
    .sort(([dateA], [dateB]) => getLocalDate(dateA) - getLocalDate(dateB));

  if (currentMonthEvents.length === 0) {
    eventsList.innerHTML = `
      <div class="events-list-header">
        <h4>Eventos de ${monthNames[month]} ${year}</h4>
      </div>
      <div class="no-events-message">
        <i class="fas fa-calendar-times"></i>
        <p>No hay eventos programados para este mes.</p>
        <small>Los eventos se actualizan automáticamente cada mes</small>
      </div>
    `;
    return;
  }

  let html = `
    <div class="events-list-header">
      <h4>Eventos de ${monthNames[month]} ${year}</h4>
      <span class="events-count">${currentMonthEvents.length} eventos</span>
    </div>
    <div class="events-list-container">
  `;

  const today = getLocalDate();

  currentMonthEvents.forEach(([dateKey, event], index) => {
    const eventDate = getLocalDate(dateKey);
    const day = eventDate.getDate();
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const fullDayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const dayName = fullDayNames[eventDate.getDay()];
    const shortDayName = dayNames[eventDate.getDay()];

    let typeClass = "";
    let typeColor = "";
    switch (event.type) {
      case "tournament":
        typeClass = "Torneo";
        typeColor = "#FF9800";
        break;
      case "game":
        typeClass = "Game Night";
        typeColor = "#2196F3";
        break;
      case "special":
        typeClass = "Especial";
        typeColor = "#9C27B0";
        break;
      default:
        typeClass = "Evento";
        typeColor = "#4CAF50";
    }

    const isToday =
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();

    const isPast =
      eventDate <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const daysUntil = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    const isSoon = daysUntil >= 0 && daysUntil <= 3;

    const eventClass = isToday
      ? "today-event-list"
      : isPast
      ? "past-event-list"
      : isSoon
      ? "soon-event-list"
      : "";

    const hasReminder = checkIfHasReminder(dateKey);

    html += `
      <div class="event-list-item ${eventClass}" data-event-date="${dateKey}">
        <div class="event-list-date">
          <div class="event-day-number">${day}</div>
          <div class="event-day-name">${shortDayName}</div>
        </div>
        <div class="event-list-content">
          <div class="event-list-title">
            <span class="event-icon">${event.icon}</span>
            <strong>${event.title}</strong>
            ${isToday ? '<span class="today-badge">HOY</span>' : ""}
            ${
              isSoon && !isToday
                ? `<span class="soon-badge">En ${daysUntil} día${
                    daysUntil !== 1 ? "s" : ""
                  }</span>`
                : ""
            }
            ${
              hasReminder
                ? '<span class="reminder-badge" title="Tienes recordatorio para este evento"><i class="fas fa-bell"></i></span>'
                : ""
            }
          </div>
          <div class="event-list-description">
            ${event.description || "¡No te pierdas este evento increíble!"}
          </div>
          <div class="event-list-footer">
            <span class="event-list-type" style="color: ${typeColor}">
              <i class="fas fa-tag"></i> ${typeClass}
            </span>
            <span class="event-list-time">
              <i class="fas fa-clock"></i> ${event.time || "18:00 GMT-5"}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
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

function initTodayEvent() {
  const today = getLocalDate();
  const todayKey = formatDateForKey(today);
  const event = window.calendarEvents ? window.calendarEvents[todayKey] : null;

  const todayEventElement = document.getElementById("today-event");
  const todayCountdownElement = document.getElementById("today-countdown");

  if (!todayEventElement || !todayCountdownElement) return;

  if (event) {
    const now = new Date();
    const eventDateTime = new Date(today);
    const timeMatch = (event.time || "18:00").match(/(\d{1,2}):(\d{2})/);

    if (timeMatch) {
      eventDateTime.setHours(
        parseInt(timeMatch[1]),
        parseInt(timeMatch[2]),
        0,
        0
      );
    }

    const eventEndTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000);
    const isEventLive = now >= eventDateTime && now <= eventEndTime;
    const isEventFinished = now > eventEndTime;

    let typeText = "";
    let typeColor = "";
    switch (event.type) {
      case "tournament":
        typeText = "🏆 Torneo";
        typeColor = "#FF9800";
        break;
      case "game":
        typeText = "🎮 Game Night";
        typeColor = "#2196F3";
        break;
      case "special":
        typeText = "🎁 Evento Especial";
        typeColor = "#9C27B0";
        break;
    }

    let statusBadge = "";
    if (isEventLive) {
      statusBadge = '<span class="live-badge">EN VIVO</span>';
    } else if (isEventFinished) {
      statusBadge = '<span class="finished-badge">FINALIZADO</span>';
    }

    todayEventElement.innerHTML = `
      <div class="today-event-content">
        <div class="today-event-icon" style="background-color: ${typeColor}20">${
      event.icon
    }</div>
        <div class="today-event-details">
          <div class="today-event-header">
            <h3>${event.title}</h3>
            ${statusBadge}
            <span class="today-event-badge">HOY</span>
          </div>
          <p class="today-event-type" style="color: ${typeColor}">${typeText}</p>
          <p class="today-event-description">${
            event.description || "¡No te pierdas este evento especial!"
          }</p>
          <div class="today-event-meta">
            <span class="today-event-time"><i class="fas fa-clock"></i> ${
              event.time || "18:00 GMT-5"
            }</span>
            <span class="today-event-location"><i class="fas fa-map-marker-alt"></i> Discord del Clan</span>
          </div>
        </div>
      </div>
    `;

    setupTodayCountdown("today-countdown", event.time || "18:00");
  } else {
    const nextEvent = findNextEvent();

    if (nextEvent) {
      const nextDate = getLocalDate(nextEvent.date);
      const daysUntil = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
      const formattedDate = formatDate(nextDate);

      todayEventElement.innerHTML = `
        <div class="today-event-content no-event">
          <div class="today-event-icon">📅</div>
          <div class="today-event-details">
            <h3>Próximo evento en ${daysUntil} día${
        daysUntil !== 1 ? "s" : ""
      }</h3>
            <p class="today-event-type">${nextEvent.icon} ${nextEvent.title}</p>
            <p class="today-event-description">${formattedDate} - ${
        nextEvent.time || "18:00 GMT-5"
      }</p>
            <div class="today-event-meta">
              <span class="today-event-time"><i class="fas fa-calendar-day"></i> ${formattedDate}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      todayEventElement.innerHTML = `
        <div class="today-event-content no-event">
          <div class="today-event-icon">📅</div>
          <div class="today-event-details">
            <h3>No hay eventos hoy</h3>
            <p class="today-event-description">Revisa el calendario para ver los próximos eventos programados.</p>
            <div class="today-event-meta">
              <span class="today-event-time"><i class="fas fa-sync-alt"></i> Los eventos se actualizan automáticamente</span>
            </div>
          </div>
        </div>
      `;
    }

    todayCountdownElement.innerHTML = `
      <div class="next-event-info">
        <i class="fas fa-calendar-alt"></i>
        <p>Próximo evento: ${
          nextEvent ? formatDate(getLocalDate(nextEvent.date)) : "Próximamente"
        }</p>
        ${nextEvent ? `<small>${nextEvent.title}</small>` : ""}
      </div>
    `;
  }
}

function setupTodayCountdown(elementId, eventTime) {
  const countdownElement = document.getElementById(elementId);
  if (!countdownElement) return;

  function updateCountdown() {
    const now = new Date();
    const today = getLocalDate();
    const todayKey = formatDateForKey(today);
    const event = window.calendarEvents
      ? window.calendarEvents[todayKey]
      : null;

    if (!event) {
      countdownElement.innerHTML = `
        <div class="no-event-today">
          <p>No hay eventos programados para hoy</p>
        </div>
      `;
      return;
    }

    const eventDateTime = new Date(today);

    const timeMatch = eventTime.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      eventDateTime.setHours(
        parseInt(timeMatch[1]),
        parseInt(timeMatch[2]),
        0,
        0
      );
    } else {
      eventDateTime.setHours(18, 0, 0, 0);
    }

    const eventEndTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000);
    if (now > eventEndTime) {
      countdownElement.innerHTML = `
        <div class="event-finished">
          <div class="event-finished-icon">
            <i class="fas fa-flag-checkered"></i>
          </div>
          <p class="event-finished-title">¡Evento finalizado!</p>
          <p class="event-finished-subtitle">Gracias por participar</p>
          <div class="event-finished-stats">
            <span><i class="fas fa-trophy"></i> Ganadores: no definido</span>
          </div>
        </div>
      `;
      return;
    }

    if (now >= eventDateTime && now <= eventEndTime) {
      countdownElement.innerHTML = `
        <div class="event-live">
          <div class="event-live-icon">
            <i class="fas fa-broadcast-tower"></i>
          </div>
          <p class="event-live-title">¡EN VIVO AHORA!</p>
          <p class="event-live-subtitle">El evento está en progreso</p>
          <div class="event-live-actions">
            <button class="btn-join-now" onclick="joinEventNow()">
              <i class="fas fa-play-circle"></i> Unirse ahora
            </button>
          </div>
          <p class="event-live-note">Tiempo restante del evento: ${calculateEventRemainingTime(
            eventDateTime
          )}</p>
        </div>
      `;
      return;
    }

    const timeLeft = eventDateTime - now;

    if (timeLeft > 0) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
        <div class="today-countdown-timer">
          <div class="today-timer-unit">
            <span class="today-timer-number">${hours
              .toString()
              .padStart(2, "0")}</span>
            <span class="today-timer-label">Horas</span>
          </div>
          <div class="today-timer-separator">:</div>
          <div class="today-timer-unit">
            <span class="today-timer-number">${minutes
              .toString()
              .padStart(2, "0")}</span>
            <span class="today-timer-label">Minutos</span>
          </div>
          <div class="today-timer-separator">:</div>
          <div class="today-timer-unit">
            <span class="today-timer-number">${seconds
              .toString()
              .padStart(2, "0")}</span>
            <span class="today-timer-label">Segundos</span>
          </div>
        </div>
        <p class="countdown-note">El evento comienza hoy a las ${eventTime}</p>
        <div class="countdown-action">
          <button class="btn-reminder" onclick="setReminderForToday()">
            <i class="fas fa-bell"></i> Recordarme
          </button>
        </div>
      `;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function calculateEventRemainingTime(eventStartTime) {
  const eventEndTime = new Date(eventStartTime.getTime() + 2 * 60 * 60 * 1000);
  const now = new Date();
  const timeLeft = eventEndTime - now;

  if (timeLeft <= 0) return "Finalizado";

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

function joinEventNow() {
  const today = getLocalDate();
  const todayKey = formatDateForKey(today);
  const event = window.calendarEvents ? window.calendarEvents[todayKey] : null;

  if (event) {
    if (confirm(`¿Unirte al evento "${event.title}" ahora?`)) {
      switch (event.type) {
        case "tournament":
          window.open(
            "https://www.roblox.com/games/2753915549/Blox-Fruits",
            "_blank"
          );
          break;
        case "game":
          joinDiscord();
          break;
        case "special":
          window.open("https://discord.gg/vts4PTHR9K", "_blank");
          break;
      }
    }
  }
}

function findNextEvent() {
  if (!window.calendarEvents) return null;

  const today = getLocalDate();
  const now = new Date();

  const todayKey = formatDateForKey(today);
  const todayEvent = window.calendarEvents[todayKey];

  if (todayEvent) {
    const eventDateTime = new Date(today);
    const timeMatch = (todayEvent.time || "18:00").match(/(\d{1,2}):(\d{2})/);

    if (timeMatch) {
      eventDateTime.setHours(
        parseInt(timeMatch[1]),
        parseInt(timeMatch[2]),
        0,
        0
      );
    }

    if (
      eventDateTime >= now ||
      now < new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000)
    ) {
      return {
        date: todayKey,
        title: todayEvent.title,
        icon: todayEvent.icon,
        type: todayEvent.type,
        time: todayEvent.time || "18:00 GMT-5",
      };
    }
  }

  const upcomingEvents = Object.entries(window.calendarEvents)
    .filter(([dateKey]) => {
      const eventDate = getLocalDate(dateKey);
      return eventDate > today;
    })
    .sort(([dateA], [dateB]) => getLocalDate(dateA) - getLocalDate(dateB));

  if (upcomingEvents.length > 0) {
    const [nextDate, nextEvent] = upcomingEvents[0];
    return {
      date: nextDate,
      title: nextEvent.title,
      icon: nextEvent.icon,
      type: nextEvent.type,
      time: nextEvent.time || "18:00 GMT-5",
    };
  }

  return null;
}

function initReminderSystem() {
  checkTodayReminders();

  setInterval(checkReminders, 60000);
}

function checkTodayReminders() {
  const reminders = getReminders();
  const today = formatDateForKey(getLocalDate());

  reminders.forEach((reminder) => {
    if (reminder.date === today) {
      showNotification(
        `Recordatorio: ${reminder.title} hoy a las ${reminder.time}`,
        "info"
      );
    }
  });
}

function checkReminders() {
  const reminders = getReminders();
  const now = new Date();

  reminders.forEach((reminder, index) => {
    const reminderDate = getLocalDate(reminder.date);
    const reminderTime = reminder.time || "18:00";
    const timeMatch = reminderTime.match(/(\d{1,2}):(\d{2})/);

    if (timeMatch) {
      const eventDateTime = new Date(reminderDate);
      eventDateTime.setHours(
        parseInt(timeMatch[1]),
        parseInt(timeMatch[2]),
        0,
        0
      );

      const notificationTime = new Date(
        eventDateTime.getTime() - 15 * 60 * 1000
      );

      if (
        now >= notificationTime &&
        now < eventDateTime &&
        !reminder.notified
      ) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Recordatorio: ${reminder.title}`, {
            body: `Comienza en 15 minutos (${reminder.time})`,
            icon: "/favicon.ico",
          });
        }

        showNotification(`¡En 15 minutos: ${reminder.title}!`, "warning");

        reminders[index].notified = true;
        saveReminders(reminders);
      }
    }
  });
}

function setReminder(eventDate, eventTitle, eventTime = "18:00") {
  const reminders = getReminders();
  const reminderId = `${eventDate}-${eventTitle}`;

  const existingIndex = reminders.findIndex((r) => r.id === reminderId);

  if (existingIndex >= 0) {
    if (
      confirm(
        "¿Ya tienes un recordatorio para este evento. ¿Quieres eliminarlo?"
      )
    ) {
      reminders.splice(existingIndex, 1);
      saveReminders(reminders);
      showNotification("Recordatorio eliminado", "info");
      return;
    }
  } else {
    reminders.push({
      id: reminderId,
      date: eventDate,
      title: eventTitle,
      time: eventTime,
      notified: false,
      created: new Date().toISOString(),
    });

    saveReminders(reminders);
    showNotification(`Recordatorio establecido para ${eventTitle}`, "success");

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  renderEventList(currentMonth, currentYear);
}

function setReminderForToday() {
  const today = getLocalDate();
  const todayKey = formatDateForKey(today);
  const event = window.calendarEvents[todayKey];

  if (event) {
    setReminder(todayKey, event.title, event.time || "18:00");
  }
}

function getReminders() {
  try {
    const reminders = localStorage.getItem("eventReminders");
    return reminders ? JSON.parse(reminders) : [];
  } catch (e) {
    console.error("Error cargando recordatorios:", e);
    return [];
  }
}

function saveReminders(reminders) {
  try {
    localStorage.setItem("eventReminders", JSON.stringify(reminders));
  } catch (e) {
    console.error("Error guardando recordatorios:", e);
  }
}

function checkIfHasReminder(dateKey) {
  const reminders = getReminders();
  return reminders.some((reminder) => reminder.date === dateKey);
}

function removeReminder(dateKey, eventTitle) {
  const reminders = getReminders();
  const reminderId = `${dateKey}-${eventTitle}`;
  const newReminders = reminders.filter((r) => r.id !== reminderId);
  saveReminders(newReminders);
  return newReminders;
}

function initStatistics() {
  animateStatCounters();
}

function animateStatCounters() {
  const stats = [
    { element: "total-prizes", target: getRandomInt(5, 20), duration: 2000 },
    {
      element: "avg-participants",
      target: getRandomInt(15, 40),
      duration: 2000,
    },
  ];

  stats.forEach((stat) => {
    const element = document.getElementById(stat.element);
    if (!element) return;

    let current = 0;
    const increment = stat.target / (stat.duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.target) {
        current = stat.target;
        clearInterval(timer);
      }

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

function initEventListeners() {
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const todayBtn = document.getElementById("today-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => changeMonth("prev"));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => changeMonth("next"));
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", navigateToCurrentMonth);
  } else {
    const navButtons = document.querySelector(".calendar-navigation");
    if (navButtons) {
      const btn = document.createElement("button");
      btn.id = "today-btn";
      btn.className = "today-button";
      btn.innerHTML = '<i class="fas fa-calendar-day"></i> Hoy';
      btn.addEventListener("click", navigateToCurrentMonth);
      navButtons.appendChild(btn);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeMonth("prev");
    } else if (e.key === "ArrowRight") {
      changeMonth("next");
    } else if (e.key === "Home" || e.key === "h") {
      navigateToCurrentMonth();
    }
  });

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
        showEventModal(event, dateKey);
      }
    }

    if (e.target.closest(".event-list-item")) {
      const eventItem = e.target.closest(".event-list-item");
      const date = eventItem.dataset.eventDate;
      const event = window.calendarEvents[date];

      if (event) {
        const eventDate = getLocalDate(date);
        const formattedDate = formatDate(eventDate);
        showEventModal(event, date, formattedDate);
      }
    }
  });

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

function showEventModal(event, dateKey, displayDate = null) {
  let modal = document.getElementById("event-modal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "event-modal";
    modal.className = "event-modal";
    modal.innerHTML = `
      <div class="event-modal-content">
        <div class="event-modal-header">
          <h3 id="event-modal-title"></h3>
          <button class="event-modal-close">&times;</button>
        </div>
        <div class="event-modal-body">
          <div class="event-modal-icon" id="event-modal-icon"></div>
          <div class="event-modal-info">
            <p id="event-modal-date"></p>
            <p id="event-modal-type"></p>
          </div>
          <p class="event-modal-description" id="event-modal-description"></p>
          <div class="event-modal-actions">
            <button class="btn-set-reminder" id="btn-set-reminder">
              <i class="fas fa-bell"></i> Establecer recordatorio
            </button>
            <button class="btn-remove-reminder" id="btn-remove-reminder" style="display: none;">
              <i class="fas fa-bell-slash"></i> Eliminar recordatorio
            </button>
            <button class="btn-share-event" id="btn-share-event">
              <i class="fas fa-share-alt"></i> Compartir
            </button>
            <button class="btn-join-now-modal" id="btn-join-now-modal" style="display: none;">
              <i class="fas fa-play-circle"></i> Unirse ahora
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".event-modal-close").addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  const hasReminder = checkIfHasReminder(dateKey);

  const today = getLocalDate();
  const now = new Date();
  const eventDate = getLocalDate(dateKey);
  const isToday = formatDateForKey(eventDate) === formatDateForKey(today);
  let isEventLive = false;

  if (isToday) {
    const eventDateTime = new Date(eventDate);
    const timeMatch = (event.time || "18:00").match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      eventDateTime.setHours(
        parseInt(timeMatch[1]),
        parseInt(timeMatch[2]),
        0,
        0
      );
    }
    const eventEndTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000);
    isEventLive = now >= eventDateTime && now <= eventEndTime;
  }

  let typeText = "";
  let typeColor = "";
  switch (event.type) {
    case "tournament":
      typeText = "🏆 Torneo";
      typeColor = "#FF9800";
      break;
    case "game":
      typeText = "🎮 Game Night";
      typeColor = "#2196F3";
      break;
    case "special":
      typeText = "🎁 Evento Especial";
      typeColor = "#9C27B0";
      break;
  }

  const eventDateDisplay = displayDate || formatDate(getLocalDate(dateKey));

  modal.querySelector("#event-modal-title").textContent = event.title;
  modal.querySelector(
    "#event-modal-icon"
  ).innerHTML = `<span style="font-size: 3em;">${event.icon}</span>`;
  modal.querySelector(
    "#event-modal-date"
  ).innerHTML = `📅 ${eventDateDisplay} - 🕕 ${event.time || "18:00 GMT-5"}`;
  modal.querySelector(
    "#event-modal-type"
  ).innerHTML = `<span style="color: ${typeColor}">${typeText}</span>`;
  modal.querySelector("#event-modal-description").textContent =
    event.description || "¡No te pierdas este evento increíble!";

  const setReminderBtn = modal.querySelector("#btn-set-reminder");
  const removeReminderBtn = modal.querySelector("#btn-remove-reminder");
  const joinNowBtn = modal.querySelector("#btn-join-now-modal");

  if (isEventLive) {
    joinNowBtn.style.display = "inline-block";
    joinNowBtn.onclick = function () {
      joinEventNow();
      modal.style.display = "none";
    };
  } else {
    joinNowBtn.style.display = "none";
  }

  if (hasReminder) {
    setReminderBtn.style.display = "none";
    removeReminderBtn.style.display = "inline-block";
    removeReminderBtn.onclick = function () {
      removeReminder(dateKey, event.title);
      showNotification("Recordatorio eliminado", "info");
      modal.style.display = "none";
      renderEventList(currentMonth, currentYear);
    };
  } else {
    setReminderBtn.style.display = "inline-block";
    removeReminderBtn.style.display = "none";
    setReminderBtn.onclick = function () {
      setReminder(dateKey, event.title, event.time || "18:00");
      modal.style.display = "none";
    };
  }

  modal.querySelector("#btn-share-event").onclick = function () {
    shareEvent(event, dateKey);
  };

  modal.style.display = "flex";
}

function shareEvent(event, dateKey) {
  const eventDate = getLocalDate(dateKey);
  const formattedDate = formatDate(eventDate);
  const text = `¡Únete a nuestro evento: ${
    event.title
  }!\n📅 ${formattedDate}\n🕕 ${event.time || "18:00 GMT-5"}\n\n${
    event.description || "¡No te lo pierdas!"
  }\n\n#ClanEvents`;

  if (navigator.share) {
    navigator
      .share({
        title: event.title,
        text: text,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showNotification("Evento copiado al portapapeles", "success");
      })
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showNotification("Evento copiado al portapapeles", "success");
      });
  }
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-ES", options);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showNotification(message, type = "info") {
  let notification = document.getElementById("calendar-notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "calendar-notification";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: none;
    `;
    document.body.appendChild(notification);
  }

  const colors = {
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
  };

  notification.style.backgroundColor = colors[type] || colors.info;
  notification.textContent = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Funciones auxiliares para botones
function joinDiscord() {
  showNotification("Redirigiendo a Discord...", "info");
  window.open("https://discord.com/invite/vts4PTHR9K", "_blank");
}

function joinWhatsApp() {
  showNotification("Redirigiendo a WhatsApp...", "info");
  window.open("https://chat.whatsapp.com/JuAiTl1OInpAvqtAK5PyqJ", "_blank");
}

document.addEventListener("DOMContentLoaded", function () {
  const statValues = [
    { id: "total-prizes", target: getRandomInt(5, 20) },
    { id: "avg-participants", target: getRandomInt(15, 40) },
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
