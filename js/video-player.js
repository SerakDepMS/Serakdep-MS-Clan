// video-player.js - Reproductor de video con múltiples videos aleatorios

class VideoPlayer {
  constructor() {
    this.video = document.getElementById("main-video");
    this.videoList = [
      {
        src: "makima-from-chainsaw-man.3840x2160.mp4",
        title: "Trailer Oficial del Clan",
        description:
          "Presentación de Serakdep MS: Un clan unido por la pasión por Roblox.",
      },
      {
        src: "snaptik_7529605531388955911.mp4",
        title: "Gameplay: Blox Fruits",
        description: "Nuestros miembros dominando los mares de Blox Fruits.",
      },
      {
        src: "celestial-veil.3840x2160.mp4",
        title: "Eventos de la Semana",
        description: "Revisión de los mejores eventos y torneos de la semana.",
      },
      {
        src: "snaptik_7530315646731603205.mp4",
        title: "Nuestra Comunidad",
        description: "Conoce a los miembros de Serakdep MS y sus experiencias.",
      },
      {
        src: "snaptik_7520935301603134736.mp4",
        title: "Tutoriales y Consejos",
        description:
          "Aprende estrategias y mejora tu juego con nuestros tutoriales.",
      },
    ];

    this.currentVideoIndex = 0;
    this.randomMode = false;
    this.isMuted = true; // Comienza muted para autoplay
    this.volume = 0;

    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadRandomVideo();
    this.updateVideoCounter();

    // Iniciar con un video aleatorio
    setTimeout(() => {
      this.loadRandomVideo();
    }, 100);
  }

  setupElements() {
    // Elementos del DOM
    this.bigPlayBtn = document.getElementById("big-play-btn");
    this.playPauseBtn = document.getElementById("play-pause-btn");
    this.nextVideoBtn = document.getElementById("next-video-btn");
    this.volumeBtn = document.getElementById("volume-btn");
    this.fullscreenBtn = document.getElementById("fullscreen-btn");
    this.randomBtn = document.getElementById("random-btn");
    this.volumeSlider = document.getElementById("volume-slider");
    this.volumeControls = document.getElementById("volume-controls");
    this.videoOverlay = document.getElementById("video-overlay");

    // Elementos de información
    this.videoTitle = document.getElementById("video-title");
    this.videoDescription = document.getElementById("video-description");
    this.currentVideoSpan = document.getElementById("current-video");
    this.totalVideosSpan = document.getElementById("total-videos");

    // Configurar volumen inicial
    this.video.volume = this.volume;
    this.volumeSlider.value = this.volume;

    // Mostrar total de videos
    this.totalVideosSpan.textContent = this.videoList.length;
  }

  setupEventListeners() {
    // Botón de reproducción grande
    this.bigPlayBtn.addEventListener("click", () => this.togglePlay());

    // Botón play/pause
    this.playPauseBtn.addEventListener("click", () => this.togglePlay());

    // Botón siguiente video
    this.nextVideoBtn.addEventListener("click", () => this.nextVideo());

    // Botón de volumen
    this.volumeBtn.addEventListener("click", () => this.toggleMute());
    this.volumeBtn.addEventListener("mouseenter", () =>
      this.showVolumeControls()
    );
    this.volumeBtn.addEventListener("mouseleave", () =>
      this.hideVolumeControls()
    );

    // Slider de volumen
    this.volumeSlider.addEventListener("input", (e) =>
      this.changeVolume(e.target.value)
    );
    this.volumeSlider.addEventListener("mouseenter", () =>
      this.showVolumeControls()
    );
    this.volumeControls.addEventListener("mouseleave", () =>
      this.hideVolumeControls()
    );

    // Botón pantalla completa
    this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());

    // Botón modo aleatorio
    this.randomBtn.addEventListener("click", () => this.toggleRandomMode());

    // Eventos del video
    this.video.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("play", () => this.onVideoPlay());
    this.video.addEventListener("pause", () => this.onVideoPause());
    this.video.addEventListener("ended", () => this.onVideoEnded());
    this.video.addEventListener("waiting", () => this.showLoading());
    this.video.addEventListener("canplay", () => this.hideLoading());
    this.video.addEventListener("error", (e) => this.onVideoError(e));

    // Teclas de acceso rápido
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Salir de pantalla completa con ESC
    document.addEventListener("fullscreenchange", () =>
      this.onFullscreenChange()
    );

    // Mostrar controles al mover el mouse
    this.video.parentElement.addEventListener("mousemove", () =>
      this.showControls()
    );
    this.video.parentElement.addEventListener("mouseleave", () =>
      this.hideControls()
    );
  }

  loadRandomVideo() {
    if (this.randomMode) {
      // En modo aleatorio, evitar que salga el mismo video
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.videoList.length);
      } while (
        newIndex === this.currentVideoIndex &&
        this.videoList.length > 1
      );

      this.currentVideoIndex = newIndex;
    } else {
      // Secuencial
      this.currentVideoIndex =
        (this.currentVideoIndex + 1) % this.videoList.length;
    }

    this.loadVideo(this.currentVideoIndex);
  }

  loadVideo(index) {
    if (index < 0 || index >= this.videoList.length) return;

    this.currentVideoIndex = index;
    const videoData = this.videoList[index];

    // Mostrar loading
    this.showLoading();

    // Cambiar fuente del video
    this.video.src = videoData.src;

    // Actualizar información
    this.videoTitle.textContent = videoData.title;
    this.videoDescription.textContent = videoData.description;

    // Actualizar contador
    this.updateVideoCounter();

    // Mostrar notificación
    this.showNotification(`🎬 ${videoData.title}`);

    // Intentar reproducción automática
    const playPromise = this.video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay falló, mostrando botón de reproducción");
        this.showBigPlayButton();
      });
    }
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  nextVideo() {
    if (this.randomMode) {
      this.loadRandomVideo();
    } else {
      this.currentVideoIndex =
        (this.currentVideoIndex + 1) % this.videoList.length;
      this.loadVideo(this.currentVideoIndex);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;

    if (this.isMuted) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      this.volumeBtn.title = "Activar sonido";
    } else {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      this.volumeBtn.title = "Silenciar";
      this.video.volume = this.volume > 0 ? this.volume : 0.5;
      this.volumeSlider.value = this.video.volume;
    }
  }

  changeVolume(value) {
    this.volume = parseFloat(value);
    this.video.volume = this.volume;
    this.video.muted = this.volume === 0;

    // Actualizar icono del volumen
    if (this.volume === 0) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (this.volume < 0.5) {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
      this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  }

  toggleRandomMode() {
    this.randomMode = !this.randomMode;

    if (this.randomMode) {
      this.randomBtn.classList.add("active");
      this.randomBtn.title = "Desactivar aleatorio";
      this.showNotification("🔀 Modo aleatorio activado");
    } else {
      this.randomBtn.classList.remove("active");
      this.randomBtn.title = "Activar aleatorio";
      this.showNotification("➡️ Modo secuencial activado");
    }
  }

  toggleFullscreen() {
    const videoContainer = this.video.parentElement.parentElement;

    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      }
      this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      this.fullscreenBtn.title = "Salir de pantalla completa";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      this.fullscreenBtn.title = "Pantalla completa";
    }
  }

  showVolumeControls() {
    this.volumeControls.classList.add("visible");
  }

  hideVolumeControls() {
    setTimeout(() => {
      if (
        !this.volumeControls.matches(":hover") &&
        !this.volumeBtn.matches(":hover")
      ) {
        this.volumeControls.classList.remove("visible");
      }
    }, 300);
  }

  showLoading() {
    this.videoOverlay.classList.add("active");
  }

  hideLoading() {
    this.videoOverlay.classList.remove("active");
  }

  showBigPlayButton() {
    this.bigPlayBtn.classList.add("visible");
  }

  hideBigPlayButton() {
    this.bigPlayBtn.classList.remove("visible");
  }

  showControls() {
    const controls = this.video.parentElement.querySelector(".video-controls");
    controls.classList.add("active");

    // Ocultar después de 3 segundos sin movimiento
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      if (!this.video.paused) {
        controls.classList.remove("active");
      }
    }, 3000);
  }

  hideControls() {
    const controls = this.video.parentElement.querySelector(".video-controls");
    if (!this.video.paused) {
      controls.classList.remove("active");
    }
  }

  showNotification(text) {
    // Crear o reutilizar notificación
    let notification = document.querySelector(".video-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.className = "video-notification";
      this.video.parentElement.appendChild(notification);
    }

    notification.textContent = text;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
  }

  updateVideoCounter() {
    this.currentVideoSpan.textContent = this.currentVideoIndex + 1;
  }

  onVideoPlay() {
    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    this.playPauseBtn.title = "Pausar";
    this.hideBigPlayButton();
  }

  onVideoPause() {
    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.playPauseBtn.title = "Reproducir";
    this.showBigPlayButton();
  }

  onVideoEnded() {
    if (this.randomMode) {
      // En modo aleatorio, cargar otro video aleatorio
      setTimeout(() => this.loadRandomVideo(), 1000);
    } else {
      // En modo secuencial, pasar al siguiente
      setTimeout(() => this.nextVideo(), 1000);
    }
  }

  onVideoError(e) {
    console.error("Error cargando video:", e);
    this.hideLoading();
    this.showNotification("❌ Error cargando el video");

    // Intentar con otro video
    setTimeout(() => this.nextVideo(), 2000);
  }

  onFullscreenChange() {
    if (!document.fullscreenElement) {
      this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      this.fullscreenBtn.title = "Pantalla completa";
    }
  }

  handleKeyboard(e) {
    // Solo si el video está visible
    const videoRect = this.video.getBoundingClientRect();
    const isVideoVisible =
      videoRect.top >= 0 &&
      videoRect.left >= 0 &&
      videoRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      videoRect.right <=
        (window.innerWidth || document.documentElement.clientWidth);

    if (!isVideoVisible) return;

    switch (e.key.toLowerCase()) {
      case " ":
      case "k":
        e.preventDefault();
        this.togglePlay();
        break;

      case "n":
        e.preventDefault();
        this.nextVideo();
        break;

      case "m":
        e.preventDefault();
        this.toggleMute();
        break;

      case "f":
        e.preventDefault();
        this.toggleFullscreen();
        break;

      case "r":
        e.preventDefault();
        this.toggleRandomMode();
        break;

      case "arrowleft":
        e.preventDefault();
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        break;

      case "arrowright":
        e.preventDefault();
        this.video.currentTime = Math.min(
          this.video.duration,
          this.video.currentTime + 10
        );
        break;
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayer();
});

