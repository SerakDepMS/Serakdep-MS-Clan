class VideoPlayerFinal {
  constructor() {
    this.video = document.getElementById("main-video");
    this.videoList = [
      {
        src: "video1.mp4",
        title: "Trailer Oficial del Clan",
        duration: "30",
        size: "25 MB",
      },
      {
        src: "video2.mp4",
        title: "Gameplay: Blox Fruits",
        duration: "23",
        size: "35 MB",
      },
      {
        src: "video3.mp4",
        title: "Eventos de la Semana",
        duration: "13",
        size: "50 MB",
      },
      {
        src: "video4.mp4",
        title: "Nuestra Comunidad",
        duration: "39",
        size: "42 MB",
      },
      {
        src: "video5.mp4",
        title: "Tutoriales y Consejos",
        duration: "14",
        size: "65 MB",
      },
    ];

    this.currentVideoIndex = 0;
    this.isMuted = true;
    this.volume = 0;
    this.playbackSpeed = 1.0;
    this.isFullscreen = false;
    this.settingsOpen = false;
    this.volumeSliderVisible = false;

    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadVideo(this.currentVideoIndex);
    this.updateCounter();

    setTimeout(() => {
      this.loadVideo(this.currentVideoIndex);
    }, 100);
  }

  setupElements() {
    this.centerPlayBtn = document.getElementById("center-play-btn");
    this.mainPlayBtn = document.getElementById("main-play-button");
    this.mobilePlayBtn = document.getElementById("mobile-play-btn");

    this.prevBtn = document.getElementById("prev-button");
    this.nextBtn = document.getElementById("next-button");
    this.mobilePrevBtn = document.getElementById("mobile-prev-btn");
    this.mobileNextBtn = document.getElementById("mobile-next-btn");

    this.volumeToggle = document.getElementById("volume-toggle");
    this.fullscreenToggle = document.getElementById("fullscreen-toggle");
    this.settingsToggle = document.getElementById("settings-toggle");

    this.mobileVolumeBtn = document.getElementById("mobile-volume-btn");
    this.mobileFullscreenBtn = document.getElementById("mobile-fullscreen-btn");
    this.mobileSettingsBtn = document.getElementById("mobile-settings-btn");

    this.videoTitle = document.getElementById("video-title");
    this.videoDescription = document.getElementById("video-description");
    this.counterCurrent = document.getElementById("counter-current");
    this.counterTotal = document.getElementById("counter-total");
    this.currentTime = document.getElementById("current-time");
    this.totalTime = document.getElementById("total-time");

    this.progressTrack = document.getElementById("progress-track");
    this.progressSlider = document.getElementById("progress-slider");

    this.volumeSlider = document.getElementById("volume-slider");
    this.volumeSliderContainer = document.getElementById(
      "volume-slider-container"
    );
    this.volumePercentage = document.getElementById("volume-percentage");

    this.soundIndicator = document.getElementById("floating-sound");

    this.videoLoading = document.getElementById("video-loading");

    this.settingsOverlay = document.getElementById("settings-overlay");
    this.settingsCloseBtn = document.getElementById("settings-close-btn");

    this.speedOptions = document.querySelectorAll(".speed-option");

    this.qualityOptions = document.querySelectorAll(".quality-option");

    this.autoplayToggle = document.getElementById("autoplay-toggle");
    this.loopToggle = document.getElementById("loop-toggle");
    this.subtitlesToggle = document.getElementById("subtitles-toggle");

    this.restartVideoBtn = document.getElementById("restart-video");
    this.downloadVideoBtn = document.getElementById("download-video");
    this.shareVideoBtn = document.getElementById("share-video");

    this.infoFormat = document.getElementById("info-format");
    this.infoDuration = document.getElementById("info-duration");
    this.infoSize = document.getElementById("info-size");

    this.playerContainer = document.querySelector(".video-player-final");

    this.createFullscreenCloseBtn();

    this.video.volume = this.volume;
    this.volumeSlider.value = this.volume;
    this.updateVolumePercentage();

    this.counterTotal.textContent = this.videoList.length;

    this.detectOrientation();
  }

  createFullscreenCloseBtn() {
    this.fullscreenCloseBtn = document.createElement("button");
    this.fullscreenCloseBtn.className = "fullscreen-close-btn";
    this.fullscreenCloseBtn.innerHTML = '<i class="fas fa-times"></i>';
    this.fullscreenCloseBtn.title = "Salir de pantalla completa";
    this.playerContainer.appendChild(this.fullscreenCloseBtn);

    this.fullscreenCloseBtn.addEventListener("click", () =>
      this.toggleFullscreen()
    );
  }

  detectOrientation() {
    window.addEventListener("resize", () => {
      if (this.isFullscreen) {
        this.adjustVideoForOrientation();
      }
    });

    window.addEventListener("orientationchange", () => {
      if (this.isFullscreen) {
        setTimeout(() => this.adjustVideoForOrientation(), 300);
      }
    });
  }

  adjustVideoForOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
      this.video.style.width = "100%";
      this.video.style.height = "auto";
    } else {
      this.video.style.width = "auto";
      this.video.style.height = "100%";
    }

    this.video.style.display = "none";
    setTimeout(() => {
      this.video.style.display = "block";
    }, 50);
  }

  setupEventListeners() {
    this.centerPlayBtn.addEventListener("click", () => this.togglePlay());
    this.mainPlayBtn.addEventListener("click", () => this.togglePlay());
    this.mobilePlayBtn.addEventListener("click", () => this.togglePlay());

    this.prevBtn.addEventListener("click", () => this.previousVideo());
    this.nextBtn.addEventListener("click", () => this.nextVideo());
    this.mobilePrevBtn.addEventListener("click", () => this.previousVideo());
    this.mobileNextBtn.addEventListener("click", () => this.nextVideo());

    this.volumeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleVolumeSlider();
    });
    this.mobileVolumeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleVolumeSlider();
    });
    this.volumeSlider.addEventListener("input", (e) =>
      this.changeVolume(e.target.value)
    );

    this.fullscreenToggle.addEventListener("click", () =>
      this.toggleFullscreen()
    );
    this.mobileFullscreenBtn.addEventListener("click", () =>
      this.toggleFullscreen()
    );
    this.fullscreenCloseBtn.addEventListener("click", () =>
      this.toggleFullscreen()
    );

    this.settingsToggle.addEventListener("click", () => this.openSettings());
    this.mobileSettingsBtn.addEventListener("click", () => this.openSettings());
    this.settingsCloseBtn.addEventListener("click", () => this.closeSettings());
    this.settingsOverlay.addEventListener("click", (e) => {
      if (e.target === this.settingsOverlay) {
        this.closeSettings();
      }
    });

    this.progressTrack.addEventListener("click", (e) => this.seekVideo(e));
    this.progressTrack.addEventListener("touchstart", (e) =>
      this.handleTouchProgress(e)
    );

    this.video.addEventListener("click", () => this.togglePlay());
    this.video.addEventListener("play", () => this.onVideoPlay());
    this.video.addEventListener("pause", () => this.onVideoPause());
    this.video.addEventListener("ended", () => this.onVideoEnded());
    this.video.addEventListener("waiting", () => this.showLoading());
    this.video.addEventListener("canplay", () => this.hideLoading());
    this.video.addEventListener("error", (e) => this.onVideoError(e));
    this.video.addEventListener("loadedmetadata", () =>
      this.onMetadataLoaded()
    );
    this.video.addEventListener("timeupdate", () => this.updateProgress());

    this.speedOptions.forEach((option) => {
      option.addEventListener("click", () => this.changePlaybackSpeed(option));
    });

    this.qualityOptions.forEach((option) => {
      option.addEventListener("click", () => this.changeQuality(option));
    });

    this.autoplayToggle.addEventListener("change", () => this.toggleAutoplay());
    this.loopToggle.addEventListener("change", () => this.toggleLoop());
    this.subtitlesToggle.addEventListener("change", () =>
      this.toggleSubtitles()
    );

    this.restartVideoBtn.addEventListener("click", () => this.restartVideo());
    this.downloadVideoBtn.addEventListener("click", () => this.downloadVideo());
    this.shareVideoBtn.addEventListener("click", () => this.shareVideo());

    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    document.addEventListener("click", (e) => {
      if (
        !this.volumeSliderContainer.contains(e.target) &&
        !this.volumeToggle.contains(e.target) &&
        !this.mobileVolumeBtn.contains(e.target)
      ) {
        this.hideVolumeSlider();
      }
    });

    document.addEventListener("fullscreenchange", () =>
      this.onFullscreenChange()
    );
    document.addEventListener("webkitfullscreenchange", () =>
      this.onFullscreenChange()
    );

    this.setupTouchGestures();

    this.setupDoubleTap();
  }

  setupDoubleTap() {
    let lastTap = 0;
    this.video.addEventListener("touchend", (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
        this.toggleFullscreen();
      }

      lastTap = currentTime;
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (this.playerContainer.requestFullscreen) {
        this.playerContainer.requestFullscreen();
      } else if (this.playerContainer.webkitRequestFullscreen) {
        this.playerContainer.webkitRequestFullscreen();
      } else if (this.playerContainer.mozRequestFullScreen) {
        this.playerContainer.mozRequestFullScreen();
      } else if (this.playerContainer.msRequestFullscreen) {
        this.playerContainer.msRequestFullscreen();
      }

      this.playerContainer.classList.add("fullscreen");
      this.fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
      this.fullscreenToggle.title = "Salir de pantalla completa";
      this.mobileFullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      this.mobileFullscreenBtn.title = "Salir de pantalla completa";
      this.isFullscreen = true;

      this.adjustVideoForFullscreen();

      this.hidePageElements(true);

      this.showNotification("🖥️ Pantalla completa activada");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.playerContainer.classList.remove("fullscreen");
      this.fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
      this.fullscreenToggle.title = "Pantalla completa";
      this.mobileFullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      this.mobileFullscreenBtn.title = "Pantalla completa";
      this.isFullscreen = false;

      this.restoreVideoFromFullscreen();

      this.hidePageElements(false);

      this.showNotification("🖥️ Pantalla completa desactivada");
    }
  }

  adjustVideoForFullscreen() {
    this.video.style.objectFit = "contain";
    this.video.style.maxWidth = "100%";
    this.video.style.maxHeight = "100%";
    this.video.style.width = "auto";
    this.video.style.height = "auto";

    this.video.style.position = "absolute";
    this.video.style.top = "50%";
    this.video.style.left = "50%";
    this.video.style.transform = "translate(-50%, -50%)";

    this.adjustVideoForOrientation();
  }

  restoreVideoFromFullscreen() {
    this.video.style.objectFit = "contain";
    this.video.style.maxWidth = "";
    this.video.style.maxHeight = "";
    this.video.style.width = "100%";
    this.video.style.height = "100%";
    this.video.style.position = "";
    this.video.style.top = "";
    this.video.style.left = "";
    this.video.style.transform = "";
  }

  hidePageElements(hide) {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const mainContent = document.querySelectorAll(
      ".card, .panda-decorative, .clan-logo-section"
    );

    if (hide) {
      if (header) header.style.display = "none";
      if (footer) footer.style.display = "none";
      mainContent.forEach((el) => {
        if (el) el.style.display = "none";
      });
    } else {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
      mainContent.forEach((el) => {
        if (el) el.style.display = "";
      });
    }
  }

  onFullscreenChange() {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      this.playerContainer.classList.remove("fullscreen");
      this.fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
      this.fullscreenToggle.title = "Pantalla completa";
      this.mobileFullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      this.mobileFullscreenBtn.title = "Pantalla completa";
      this.isFullscreen = false;

      this.restoreVideoFromFullscreen();

      this.hidePageElements(false);
    }
  }

  loadVideo(index) {
    if (index < 0 || index >= this.videoList.length) return;

    this.currentVideoIndex = index;
    const videoData = this.videoList[index];

    this.showLoading();

    this.video.src = videoData.src;

    this.videoTitle.textContent = videoData.title;
    this.videoDescription.textContent = videoData.description;
    this.infoDuration.textContent = videoData.duration + " seg";
    this.infoSize.textContent = videoData.size;

    this.updateCounter();

    this.showNotification(`🎬 ${videoData.title}`);

    if (this.autoplayToggle.checked) {
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay falló:", error);
          this.showCenterPlayButton();
        });
      }
    } else {
      this.showCenterPlayButton();
    }
  }

  togglePlay() {
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  previousVideo() {
    this.currentVideoIndex =
      (this.currentVideoIndex - 1 + this.videoList.length) %
      this.videoList.length;
    this.loadVideo(this.currentVideoIndex);
  }

  nextVideo() {
    this.currentVideoIndex =
      (this.currentVideoIndex + 1) % this.videoList.length;
    this.loadVideo(this.currentVideoIndex);
  }

  toggleVolumeSlider() {
    if (this.volumeSliderVisible) {
      this.hideVolumeSlider();
    } else {
      this.showVolumeSlider();
    }
  }

  showVolumeSlider() {
    this.volumeSliderVisible = true;
    this.volumeSliderContainer.classList.add("visible");
  }

  hideVolumeSlider() {
    this.volumeSliderVisible = false;
    this.volumeSliderContainer.classList.remove("visible");
  }

  changeVolume(value) {
    this.volume = parseFloat(value);
    this.video.volume = this.volume;
    this.video.muted = this.volume === 0;

    this.updateVolumeIcon();
    this.updateVolumePercentage();

    if (this.volume > 0) {
      this.soundIndicator.classList.add("active");
      setTimeout(() => this.soundIndicator.classList.remove("active"), 2000);
    }
  }

  updateVolumeIcon() {
    const iconClass =
      this.volume === 0
        ? "fa-volume-mute"
        : this.volume < 0.5
        ? "fa-volume-down"
        : "fa-volume-up";

    this.volumeToggle.innerHTML = `<i class="fas ${iconClass}"></i>`;
    this.mobileVolumeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
  }

  updateVolumePercentage() {
    this.volumePercentage.textContent = `${Math.round(this.volume * 100)}%`;
  }

  openSettings() {
    this.settingsOpen = true;
    this.settingsOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeSettings() {
    this.settingsOpen = false;
    this.settingsOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  changePlaybackSpeed(button) {
    this.speedOptions.forEach((opt) => opt.classList.remove("active"));

    button.classList.add("active");

    this.playbackSpeed = parseFloat(button.dataset.speed);
    this.video.playbackRate = this.playbackSpeed;

    this.showNotification(`⚡ Velocidad: ${this.playbackSpeed}x`);
  }

  changeQuality(button) {
    this.qualityOptions.forEach((opt) => opt.classList.remove("active"));

    button.classList.add("active");

    const quality = button.dataset.quality;
    this.showNotification(
      `📺 Calidad: ${quality === "auto" ? "Automática" : quality + "p"}`
    );
  }

  toggleAutoplay() {
    this.showNotification(
      this.autoplayToggle.checked
        ? "▶️ Autoplay activado"
        : "⏸️ Autoplay desactivado"
    );
  }

  toggleLoop() {
    this.video.loop = this.loopToggle.checked;
    this.showNotification(
      this.loopToggle.checked
        ? "🔁 Repetición activada"
        : "🔁 Repetición desactivada"
    );
  }

  toggleSubtitles() {
    this.showNotification(
      this.subtitlesToggle.checked
        ? "📝 Subtítulos activados"
        : "📝 Subtítulos desactivados"
    );
  }

  restartVideo() {
    this.video.currentTime = 0;
    this.video.play();
    this.showNotification("🔄 Video reiniciado");
    this.closeSettings();
  }

  downloadVideo() {
    const currentVideo = this.videoList[this.currentVideoIndex];
    const link = document.createElement("a");
    link.href = currentVideo.src;
    link.download = `serakdep-ms-${currentVideo.title
      .toLowerCase()
      .replace(/\s+/g, "-")}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showNotification("📥 Descargando video...");
    this.closeSettings();
  }

  shareVideo() {
    const currentVideo = this.videoList[this.currentVideoIndex];
    const shareText = `Mira este video de Serakdep MS: ${currentVideo.title}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: currentVideo.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
      this.showNotification("📋 Enlace copiado al portapapeles");
    }

    this.closeSettings();
  }

  onMetadataLoaded() {
    this.updateTimeDisplay();
  }

  updateProgress() {
    if (!this.video.duration) return;

    const currentTime = this.video.currentTime;
    const duration = this.video.duration;
    const progress = (currentTime / duration) * 100;

    this.progressSlider.style.width = `${progress}%`;
    this.updateTimeDisplay();
  }

  updateTimeDisplay() {
    if (!this.video.duration) return;

    const currentTime = this.formatTime(this.video.currentTime);
    const totalTime = this.formatTime(this.video.duration);

    this.currentTime.textContent = currentTime;
    this.totalTime.textContent = totalTime;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  seekVideo(e) {
    if (!this.video.duration) return;

    const rect = this.progressTrack.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.video.currentTime = pos * this.video.duration;
  }

  handleTouchProgress(e) {
    e.preventDefault();
    if (!this.video.duration) return;

    const rect = this.progressTrack.getBoundingClientRect();
    const touch = e.touches[0];
    const pos = (touch.clientX - rect.left) / rect.width;

    const clampedPos = Math.max(0, Math.min(1, pos));
    this.video.currentTime = clampedPos * this.video.duration;
  }

  setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;

    this.video.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    this.video.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    });
  }

  handleSwipe(startX, startY, endX, endY) {
    const diffX = endX - startX;
    const diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < -50) {
        this.nextVideo();
      } else if (diffX > 50) {
        this.previousVideo();
      }
    } else if (Math.abs(diffY) > 50) {
      if (diffY < 0) {
        const newVolume = Math.min(1, this.volume + 0.1);
        this.changeVolume(newVolume);
        this.volumeSlider.value = newVolume;
      } else {
        const newVolume = Math.max(0, this.volume - 0.1);
        this.changeVolume(newVolume);
        this.volumeSlider.value = newVolume;
      }
    }
  }

  showLoading() {
    this.videoLoading.classList.add("active");
  }

  hideLoading() {
    this.videoLoading.classList.remove("active");
  }

  showCenterPlayButton() {
    this.centerPlayBtn.classList.add("visible");
  }

  hideCenterPlayButton() {
    this.centerPlayBtn.classList.remove("visible");
  }

  showNotification(text) {
    let notification = document.querySelector(".video-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.className = "video-notification";
      notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(44, 62, 80, 0.95);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                font-size: 0.95rem;
                animation: slideInRight 0.3s ease;
                backdrop-filter: blur(10px);
                border-left: 4px solid #e74c3c;
                max-width: 300px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            `;
      document.body.appendChild(notification);
    }

    notification.textContent = text;
    notification.style.animation = "slideInRight 0.3s ease";

    if (!document.querySelector("#notification-animation")) {
      const style = document.createElement("style");
      style.id = "notification-animation";
      style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  updateCounter() {
    this.counterCurrent.textContent = this.currentVideoIndex + 1;
  }

  onVideoPlay() {
    this.mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    this.mainPlayBtn.classList.add("playing");
    this.mobilePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    this.hideCenterPlayButton();
  }

  onVideoPause() {
    this.mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.mainPlayBtn.classList.remove("playing");
    this.mobilePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    this.showCenterPlayButton();
  }

  onVideoEnded() {
    if (this.loopToggle.checked) {
      this.video.currentTime = 0;
      this.video.play();
    } else {
      setTimeout(() => this.nextVideo(), 1000);
    }
  }

  onVideoError(e) {
    console.error("Error cargando video:", e);
    this.hideLoading();
    this.showNotification("❌ Error cargando el video");

    setTimeout(() => this.nextVideo(), 2000);
  }

  handleKeyboard(e) {
    if (this.settingsOpen) return;

    switch (e.key.toLowerCase()) {
      case " ":
      case "k":
        e.preventDefault();
        this.togglePlay();
        break;

      case "arrowleft":
        e.preventDefault();
        if (e.shiftKey) {
          this.previousVideo();
        } else {
          this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        }
        break;

      case "arrowright":
        e.preventDefault();
        if (e.shiftKey) {
          this.nextVideo();
        } else {
          this.video.currentTime = Math.min(
            this.video.duration,
            this.video.currentTime + 10
          );
        }
        break;

      case "m":
        e.preventDefault();
        this.toggleMute();
        break;

      case "f":
        e.preventDefault();
        this.toggleFullscreen();
        break;

      case "c":
      case "s":
        e.preventDefault();
        this.openSettings();
        break;

      case "escape":
        if (this.volumeSliderVisible) {
          this.hideVolumeSlider();
        } else if (this.settingsOpen) {
          this.closeSettings();
        } else if (this.isFullscreen) {
          this.toggleFullscreen();
        }
        break;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;

    if (this.isMuted) {
      this.volumeToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      this.mobileVolumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      this.showNotification("🔇 Sonido silenciado");
    } else {
      this.volumeToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      this.mobileVolumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      this.showNotification("🔊 Sonido activado");
      this.video.volume = this.volume > 0 ? this.volume : 0.5;
      this.volumeSlider.value = this.video.volume;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new VideoPlayerFinal();
});
