// games-filter.js

document.addEventListener("DOMContentLoaded", function () {
  // Datos de juegos organizados por categorías
  const gamesData = {
    popular: [
      "👑 Royale High",
      "✨ Salón de Fiestas",
      "🏡 Brookhaven",
      "👶 Adopt Me",
      "🔫 Arsenal",
      "🚔 Jailbreak",
      "🥊 Juego de Boxeo sin Título",
      "🧟 Murder Mystery 2",
      "🍇 Blox Fruits",
      "👑 King Legacy",
      "🏎️ Driving Empire",
      "🦈 SharkBite",
      "🔥 Bola de Fuego",
      "🏙️ Welcome to Bloxburg",
      "🎢 Theme Park Tycoon 2",
      "🍕 Work at a Pizza Place",
      "🧸 MeepCity",
      "🌪️ Natural Disaster Survival",
      "🚪 Doors",
    ],
    rol: [
      "🏰 Medieval RPG",
      "👑 Kingdom Life",
      "🏴‍☠️ Pirate's Life",
      "🐺 WolfLife",
      "🧛 Vampire's Blood",
      "🏰 Fantasy Kingdom",
      "👑 Royalty Life",
      "🚓 Prison Life",
      "👑 Kingdom Life",
      "🧛 Vampire Hunters 3",
      "🏰 Medieval RPG",
      "👑 Royalty Life",
      "🛡️ Dark Souls RPG",
      "🏇 Knight's Tale",
      "🗡️ Samurai's Legacy",
      "🗡️ Samurai's Honor",
      "🗡️ Samurai's Journey",
      "🏰 Castle Defenders",
      "🏰 Fantasy Kingdom",
      "👑 Royalty Life",
    ],
    simuladores: [
      "✨ Salón de Fiestas",
      "🦖 Dinosaur Simulator",
      "✈️ Plane Crazy",
      "🎣 Fishing Simulator",
      "🏎️ Vehicle Simulator",
      "🐉 Dragon Adventures",
      "🚁 Helicopter Simulator",
      "🏗️ Construction Simulator",
      "🚜 Farming Simulator",
      "🚛 Truck Simulator",
      "🐕 Pet Simulator X",
      "🥚 Egg Farm Simulator",
      "⛏️ Mining Simulator",
      "🧪 Lab Experiment",
      "🛩️ Aircraft Simulator",
      "🐝 Bee Swarm Simulator",
      "🔬 Science Simulator",
      "🚀 Rocket Simulator",
      "⚗️ Alchemy Simulator",
      "✈️ Airplane Simulator",
      "🧪 Chemistry Simulator",
      "🚀 Jetpack Simulator",
      "📡 Physics Simulator",
      "👨‍🚀 Astronaut Simulator",
      "🫧 Bubble Gum Simulator",
      "🧪 Slime Simulator",
      "🌠 Galaxy Simulator",
      "✨ Magic Simulator",
      "⛏️ Gold Rush",
      "💎 Crystal Simulator",
      "🚗 Rocket League",
      "💎 Gem Simulator",
      "⚡ Energy Simulator",
      "⭐ Star Simulator",
      "💪 Power Simulator",
      "🌪️ Elemental Simulator",
      "🔭 Space Exploration",
      "🌤️ Sky Simulator",
      "🛩️ Dogfight Simulator",
      "✈️ Warplane Simulator",
      "✈️ Flight Simulator",
      "🚁 Heli Wars",
      "🚤 Speed Boat",
      "🚂 Train Simulator",
      "🛥️ Boat Simulator",
      "🛶 Canoeing Simulator",
      "🐎 Horse Simulator",
      "🦅 Bird Simulator",
      "🐶 Dog Simulator",
      "🐱 Cat Simulator",
      "🦈 Mega Shark",
      "🚑 Ambulance Simulator",
      "🚒 Firefighter Simulator",
      "🏨 Hotel Tycoon",
      "🎬 Movie Studio Tycoon",
      "🚦 Traffic Simulator",
      "🚉 Subway Simulator",
      "🚌 Bus Simulator",
      "🛒 Retail Tycoon",
      "🌲 Lumber Tycoon 2",
    ],
    terror: [
      "👻 The Mimic",
      "🚪 Doors",
      "🧟 Zombie Attack",
      "🧟 The Undead Coming",
      "👹 The Rake",
      "🏚️ Haunted Mansion",
      "🌑 Darkness",
      "🏚️ Evil Manor",
      "👻 Ghost Castle",
      "🧟 Zombie Uprising",
      "🤫 Dead Silence",
      "👻 Ghost Hunt",
      "📖 Creepy Story",
      "📚 Scary Stories",
      "🏥 Horror Hospital",
      "🏚️ Haunted Mansion",
      "👻 Ghost Castle",
      "🏰 Cursed Castle",
      "📈 Scary Elevator",
      "🎃 Scary Elevator 2",
      "🧟 Zombie Rush",
      "🌑 Darkness",
      "🏚️ Evil Manor",
    ],
    aventura: [
      "🗺️ Fantastic Frontier",
      "🧭 Treasure Hunt Simulator",
      "🏝️ Treasure Island",
      "🚀 Space Sailors",
      "🌌 Starscape",
      "🌴 Jungle Adventure",
      "🏜️ Desert Treasure",
      "🌊 Ocean Treasure",
      "⛰️ Mountain Treasure",
      "🧊 Arctic Treasure",
      "🚀 Space Adventure",
      "🌙 Moon Mission",
      "🌕 Lunar Mission",
      "🕳️ Treasure Cave",
      "🌴 Jungle Adventure",
      "🏜️ Desert Treasure",
      "🌊 Ocean Treasure",
      "⛰️ Mountain Treasure",
      "🧊 Arctic Treasure",
      "🪐 Cosmic Journey",
      "🔭 Space Exploration",
      "🗝️ Lost Rooms",
      "🧭 Lost in Time",
      "🛸 Alien Invasion",
      "🤖 Robot 64",
      "🌌 Starscape",
      "🪐 Space Knights",
      "🚀 Space Knights 2",
      "🌠 Galaxy Simulator",
      "🚀 Space Race",
      "🚀 Space Battle",
      "🚀 Space Defense",
    ],
    accion: [
      "⚔️ Combat Simulator",
      "🔪 Survive the Killer",
      "🏹 Archery Tournament",
      "🏹 Bow Master",
      "🗡️ Sword Factory",
      "⚔️ Battle Simulator",
      "🔫 Phantom Forces",
      "🥋 Karate Kaizen",
      "🏹 Arrow Fight",
      "🏹 Bow Battle",
      "🗡️ Knife Ability Test",
      "💣 Bomb Survival",
      "🏹 Archery Battle",
      "🏷️ Parkour Tag",
      "⚔️ Combat Simulator",
      "⚔️ Battle Simulator",
      "🔫 Phantom Forces",
      "🏹 Arrow Arena",
      "🏹 Arrow Tournament",
      "🏹 Arrow Storm",
      "🏹 Cupid's Arrow",
      "⚔️ Sword Factory",
      "🏹 Bow Wars",
      "🏹 Archer's Tale",
      "🏹 Archer's Challenge",
      "🏹 Archer Defense",
      "🔥 Fireball Island",
      "☁️ Sky Wars",
      "🏰 Dungeon Quest",
      "🧟 Zombie Uprising",
      "🚀 Rocket Arena",
      "🏹 Arrow Fight",
      "🏹 Bow Battle",
      "🏹 Arrow Storm",
      "🏹 Cupid's Arrow",
    ],
    obstaculos: [
      "🧗 Tower of Hell",
      "🚲 Obby But You're on a Bike",
      "🏃 Speed Run 4",
      "❄️ Ice Obby",
      "🌈 Rainbow Obby",
      "🔥 Fire Obby",
      "💧 Water Obby",
      "🌍 Earth Obby",
      "💨 Wind Obby",
      "🌋 Lava Obby",
      "☁️ Sky Obby",
      "☁️ Cloud Obby",
      "🌲 Forest Obby",
      "🧩 The Maze",
      "🏃 Speed Run 4",
      "🚲 Obby But You're on a Bike",
      "❄️ Ice Obby",
      "🌈 Rainbow Obby",
      "🔥 Fire Obby",
      "💧 Water Obby",
      "🌍 Earth Obby",
      "💨 Wind Obby",
      "🌋 Lava Obby",
      "☁️ Sky Obby",
      "☁️ Cloud Obby",
      "🌲 Forest Obby",
    ],
    fantasia: [
      "🐉 Dragon Blox",
      "🐲 Dragon's Life",
      "🐉 Dragon's Quest",
      "🐲 Dragon's Realm",
      "🐉 Dragon's Might",
      "🧙 Wizard Simulator",
      "✨ Magic Simulator",
      "🧙 Mage Duel",
      "🧛 Vampire Hunters 3",
      "🐺 Werewolf Life",
      "🐉 Dragon Adventures",
      "🐲 Dragon's Life",
      "🐉 Dragon's Quest",
      "🐲 Dragon's Realm",
      "🐉 Dragon's Might",
      "🐉 Dragon Blox",
      "🐉 Dragon Fight",
      "🐉 Dragon World",
      "🐉 Dragon Battle",
      "🐉 Dragon Defense",
      "🐉 Dragon's Flight",
      "🐲 Dragon's Den",
      "🐉 Dragon's Might",
      "🧙 Wizard Wars",
      "🧙 Mage Defense",
      "✨ Magic Simulator",
      "🧙 Mage Duel",
    ],
    anime: [
      "🥷 Anime Fighters Simulator",
      "🌀 Shindo Life",
      "🥷 Ninja Legends",
      "🥷 Shinobi Life",
      "🥷 Ninja's Path",
      "🥷 Ninja's Destiny",
      "🐉 Dragon Ball Z Final Stand",
      "🥷 Ninja Legends",
      "🥷 Shinobi Life",
      "🥷 Ninja's Path",
      "🥷 Ninja's Destiny",
      "🌀 Shindo Life",
    ],
    deportes: [
      "🥊 Juego de Boxeo sin Título",
      "🏀 Basketball Stars",
      "⛳ Super Golf",
      "🏀 Hoops Life",
      "🏎️ Street Race",
      "🏎️ Drag Race",
      "🏆 Trophy Racing",
      "🚤 Boat Race",
      "🚤 Speed Boat",
      "🏀 Basketball Stars",
      "⛳ Super Golf",
      "🏀 Hoops Life",
      "🏎️ Street Race",
      "🏎️ Drag Race",
      "🏆 Trophy Racing",
      "🚤 Boat Race",
      "🚤 Speed Boat",
      "🚗 Rocket League",
    ],
    estrategia: [
      "🧩 Puzzle Factory",
      "🧪 Alchemy Simulator",
      "🧪 Potion Craft",
      "⚗️ Alchemy Lab",
      "🧪 Science Simulator",
      "🔬 Science Simulator",
      "🧪 Chemistry Simulator",
      "🧪 Experiment 137",
      "🧪 Lab Experiment",
      "🧩 Puzzle Factory",
      "🧪 Alchemy Simulator",
      "🧪 Potion Craft",
      "⚗️ Alchemy Lab",
      "🧪 Science Simulator",
      "🔬 Science Simulator",
      "🧪 Chemistry Simulator",
      "🧪 Experiment 137",
      "🎨 Art Class",
      "🧠 Game Dev Tycoon",
      "🧪 Potion Defense",
      "🏰 Castle Defense",
      "🧟 Zombie Defense",
      "🚀 Space Defense",
      "🐉 Dragon Defense",
      "🏹 Bow Defense",
      "🚁 Helicopter Defense",
      "🏹 Archer Defense",
      "🚓 Police Defense",
      "🏎️ Racing Defense",
      "🧙 Mage Defense",
      "🏰 Kingdom Defense",
    ],
    carreras: [
      "🏎️ Vehicle Simulator",
      "✈️ Plane Crazy",
      "🚁 Helicopter Simulator",
      "🚂 Train Simulator",
      "🚤 Boat Race",
      "🚤 Speed Boat",
      "🏎️ Street Race",
      "🏎️ Drag Race",
      "🚀 Rocket Simulator",
      "🏎️ Driving Empire",
      "🚤 Speed Boat",
      "🚤 Boat Race",
      "🏎️ Street Race",
      "🏎️ Drag Race",
      "🏆 Trophy Racing",
      "🚗 Driving Empire",
      "🏎️ Vehicle Simulator",
    ],
    survival: [
      "🧟 Zombie Attack",
      "🧟 The Undead Coming",
      "🧟 Zombie Rush",
      "🧟 Zombie Uprising",
      "🧟 Apocalypse Rising",
      "🧟 Zombie Outbreak",
      "🧟 Zombie Siege",
      "🧟 Zombie Defense",
      "🧟 Zombie Survival 2",
      "🌪️ Natural Disaster Survival",
      "💣 Bomb Survival",
      "🧊 Frostbite",
      "🔥 Fireball Island",
      "🏝️ Island Royale",
      "🧭 Adventure Up",
    ],
    construccion: [
      "⛵ Build a Boat",
      "🏗️ Construction Simulator",
      "🎢 Theme Park Tycoon 2",
      "🏙️ Welcome to Bloxburg",
      "🌲 Lumber Tycoon 2",
      "🏨 Hotel Tycoon",
      "🎬 Movie Studio Tycoon",
      "🛒 Retail Tycoon",
      "🏗️ Construction Simulator",
    ],
    policiasLadrones: [
      "🚔 Jailbreak",
      "🚓 Police Patrol",
      "🚓 Police Chase",
      "🚓 Police Simulator",
      "🚓 Police Defense",
      "🚓 Prison Life",
      "🚔 Jailbreak",
    ],
  };

  // Categorías con emojis y nombres
  const categories = [
    {
      id: "popular",
      name: "Popular",
      emoji: "🎮",
      count: gamesData.popular.length,
    },
    { id: "rol", name: "Rol", emoji: "🏰", count: gamesData.rol.length },
    {
      id: "simuladores",
      name: "Simuladores",
      emoji: "🧪",
      count: gamesData.simuladores.length,
    },
    {
      id: "terror",
      name: "Terror",
      emoji: "🧟",
      count: gamesData.terror.length,
    },
    {
      id: "aventura",
      name: "Aventura",
      emoji: "🚀",
      count: gamesData.aventura.length,
    },
    {
      id: "accion",
      name: "Acción",
      emoji: "⚔️",
      count: gamesData.accion.length,
    },
    {
      id: "obstaculos",
      name: "Obstáculos",
      emoji: "🧩",
      count: gamesData.obstaculos.length,
    },
    {
      id: "fantasia",
      name: "Fantasía",
      emoji: "🐉",
      count: gamesData.fantasia.length,
    },
    { id: "anime", name: "Anime", emoji: "🧙", count: gamesData.anime.length },
    {
      id: "deportes",
      name: "Deportes",
      emoji: "🏀",
      count: gamesData.deportes.length,
    },
    {
      id: "estrategia",
      name: "Estrategia",
      emoji: "🧠",
      count: gamesData.estrategia.length,
    },
    {
      id: "carreras",
      name: "Carreras",
      emoji: "🏎️",
      count: gamesData.carreras.length,
    },
    {
      id: "survival",
      name: "Supervivencia",
      emoji: "🛡️",
      count: gamesData.survival.length,
    },
    {
      id: "construccion",
      name: "Construcción",
      emoji: "🏗️",
      count: gamesData.construccion.length,
    },
    {
      id: "policiasLadrones",
      name: "Policías/Ladrones",
      emoji: "🚔",
      count: gamesData.policiasLadrones.length,
    },
  ];

  // Variables globales
  let currentCategory = "popular"; // Por defecto la primera categoría
  let currentSearch = "";
  let allGames = [];
  let currentVisibleCount = 9; // Mostrar 9 juegos inicialmente
  let filteredGames = []; // Almacenar juegos filtrados actuales

  // Inicializar
  function init() {
    // Preparar lista de todos los juegos
    prepareGamesList();

    // Renderizar categorías
    renderCategories();

    // Renderizar juegos
    renderGames();

    // Configurar event listeners
    setupEventListeners();

    // Actualizar estadísticas
    updateStats();
  }

  // Preparar lista de todos los juegos
  function prepareGamesList() {
    allGames = [];

    for (const [categoryId, games] of Object.entries(gamesData)) {
      games.forEach((gameName) => {
        // Extraer emoji y nombre
        const emojiMatch = gameName.match(/^(\p{Emoji}+)\s+(.+)$/u);
        const emoji = emojiMatch ? emojiMatch[1] : "🎮";
        const name = emojiMatch ? emojiMatch[2] : gameName;

        allGames.push({
          id: `${categoryId}-${name.toLowerCase().replace(/\s+/g, "-")}`,
          displayName: gameName,
          emoji: emoji,
          name: name,
          category: categoryId,
          searchText: gameName.toLowerCase(),
        });
      });
    }
  }

  // Renderizar categorías
  function renderCategories() {
    const container = document.getElementById("categories-container");
    if (!container) return;

    container.innerHTML = categories
      .map(
        (category) => `
      <button class="category-filter ${
        category.id === currentCategory ? "active" : ""
      }" 
              data-category="${category.id}">
        <span class="category-icon">${category.emoji}</span>
        <span class="category-name">${category.name}</span>
        <span class="category-count">${category.count}</span>
      </button>
    `
      )
      .join("");
  }

  // Renderizar juegos
  function renderGames() {
    const container = document.getElementById("games-grid");
    const noGamesMessage = document.getElementById("no-games-message");
    const loadMoreBtn = document.getElementById("load-more-games");
    const currentShownElement = document.getElementById("current-shown");
    const currentTotalElement = document.getElementById("current-total");

    if (!container) return;

    // Filtrar juegos
    filteredGames = filterGames();

    // Calcular cuántos juegos mostrar
    const gamesToShow = filteredGames.slice(0, currentVisibleCount);
    const totalGames = filteredGames.length;

    // Mostrar/ocultar mensaje de no resultados
    if (gamesToShow.length === 0) {
      container.style.display = "none";
      noGamesMessage.style.display = "block";
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
    } else {
      container.style.display = "grid";
      noGamesMessage.style.display = "none";

      // Renderizar juegos
      container.innerHTML = gamesToShow
        .map(
          (game) => `
        <div class="game-card" data-game-id="${game.id}">
          <div class="game-card-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="game-emoji">${game.emoji}</span>
              <span class="game-title">${game.name}</span>
            </div>
          </div>
          <div class="game-categories">
            <span class="game-category-tag">${getCategoryName(
              game.category
            )}</span>
          </div>
        </div>
      `
        )
        .join("");

      // Mostrar/ocultar botón "Mostrar más"
      if (loadMoreBtn) {
        if (currentVisibleCount < totalGames) {
          loadMoreBtn.style.display = "inline-flex";
          loadMoreBtn.innerHTML = `
            <i class="fas fa-plus-circle"></i> Mostrar más juegos
            <span class="games-count">(Mostrando ${currentVisibleCount} de ${totalGames})</span>
          `;
        } else {
          loadMoreBtn.style.display = "none";
        }
      }

      // Actualizar contadores de visualización
      if (currentShownElement) {
        currentShownElement.textContent = gamesToShow.length;
      }
      if (currentTotalElement) {
        currentTotalElement.textContent = totalGames;
      }
    }

    // Actualizar contadores
    updateGameCounters(gamesToShow.length);

    // Actualizar estadísticas de la categoría actual
    updateCategoryStats();
  }

  // Filtrar juegos
  function filterGames() {
    return allGames.filter((game) => {
      // Filtrar por categoría (siempre filtrar por una categoría específica)
      if (game.category !== currentCategory) {
        return false;
      }

      // Filtrar por búsqueda
      if (
        currentSearch &&
        !game.searchText.includes(currentSearch.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  // Obtener nombre de categoría
  function getCategoryName(categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  }

  // Actualizar contadores de juegos
  function updateGameCounters(visibleCount) {
    const resultsCountElement = document.getElementById("search-results-count");
    const visibleGamesElement = document.getElementById("visible-games");

    if (resultsCountElement) {
      resultsCountElement.textContent = visibleCount;
    }

    if (visibleGamesElement) {
      visibleGamesElement.textContent = visibleCount;
    }
  }

  // Actualizar estadísticas de la categoría actual
  function updateCategoryStats() {
    const currentCategoryData = categories.find(
      (c) => c.id === currentCategory
    );
    const categoryGamesCountElement = document.getElementById(
      "category-games-count"
    );

    if (currentCategoryData && categoryGamesCountElement) {
      categoryGamesCountElement.textContent = currentCategoryData.count;
    }
  }

  // Actualizar estadísticas generales
  function updateStats() {
    const totalGamesElement = document.getElementById("total-games");
    const totalCategoriesElement = document.getElementById("total-categories");

    if (totalGamesElement) {
      totalGamesElement.textContent = allGames.length;
    }

    if (totalCategoriesElement) {
      totalCategoriesElement.textContent = categories.length;
    }

    // Actualizar estadísticas de la categoría actual
    updateCategoryStats();
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Filtros de categoría
    document
      .getElementById("categories-container")
      ?.addEventListener("click", (e) => {
        const categoryBtn = e.target.closest(".category-filter");
        if (categoryBtn) {
          const categoryId = categoryBtn.dataset.category;
          setActiveCategory(categoryId);
        }
      });

    // Búsqueda
    const searchInput = document.getElementById("games-search-input");
    const clearSearchBtn = document.getElementById("clear-search");

    searchInput?.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      currentVisibleCount = 9; // Resetear a 9 al buscar
      renderGames();
      clearSearchBtn.style.display = currentSearch ? "flex" : "none";
    });

    clearSearchBtn?.addEventListener("click", () => {
      searchInput.value = "";
      currentSearch = "";
      currentVisibleCount = 9; // Resetear a 9 al limpiar búsqueda
      renderGames();
      clearSearchBtn.style.display = "none";
      searchInput.focus();
    });

    // Alternar categorías
    document
      .getElementById("toggle-categories")
      ?.addEventListener("click", () => {
        const categoriesGrid = document.querySelector(".categories-grid");
        const toggleBtn = document.getElementById("toggle-categories");

        categoriesGrid.classList.toggle("collapsed");
        toggleBtn.querySelector("i").classList.toggle("fa-chevron-down");
        toggleBtn.querySelector("i").classList.toggle("fa-chevron-up");
      });

    // Botón "Mostrar más"
    document
      .getElementById("load-more-games")
      ?.addEventListener("click", () => {
        // Aumentar en 9 los juegos visibles
        currentVisibleCount += 9;
        renderGames();

        // Desplazar suavemente hacia abajo para ver los nuevos juegos
        const gamesGrid = document.getElementById("games-grid");
        if (gamesGrid) {
          gamesGrid.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });

    // Restablecer filtros (MODIFICADO PARA NO HACER SCROLL)
    document.getElementById("reset-filters")?.addEventListener("click", (e) => {
      // Prevenir cualquier comportamiento por defecto
      e.preventDefault();
      e.stopPropagation();

      // Guardar la posición actual del scroll
      const currentScrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      currentCategory = "popular"; // Volver a la categoría por defecto
      currentSearch = "";
      currentVisibleCount = 9; // Resetear a 9 juegos
      searchInput.value = "";
      clearSearchBtn.style.display = "none";

      // Actualizar UI
      document.querySelectorAll(".category-filter").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === "popular");
      });

      renderGames();

      // Restaurar la posición del scroll
      window.scrollTo(0, currentScrollPosition);

      // Enfocar en el botón de restablecer para mantener la posición
      e.target.blur();
    });

    // VOLVER AL INICIO DE LA SECCIÓN DE JUEGOS
    document.getElementById("scroll-to-top")?.addEventListener("click", () => {
      // Encontrar la sección de juegos
      const gamesSection = document
        .querySelector(".card .games-filter-system")
        ?.closest(".card");

      if (gamesSection) {
        // Calcular la posición de la sección con un pequeño offset
        const sectionTop =
          gamesSection.getBoundingClientRect().top + window.pageYOffset - 100;

        // Hacer scroll suave a la sección
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });
      } else {
        // Fallback: ir al principio de la página
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Establecer categoría activa (MODIFICADO PARA NO HACER SCROLL)
  function setActiveCategory(categoryId) {
    // Guardar la posición actual del scroll
    const currentScrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    currentCategory = categoryId;
    currentVisibleCount = 9; // Resetear a 9 al cambiar de categoría

    // Actualizar UI de categorías
    document.querySelectorAll(".category-filter").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === categoryId);
    });

    // Renderizar juegos
    renderGames();

    // Restaurar la posición del scroll
    window.scrollTo(0, currentScrollPosition);
  }

  // Inicializar cuando el DOM esté listo
  init();
});
