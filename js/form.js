document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("KZquan0PhqC35uDYw");

  const inscriptionForm = document.getElementById("inscription-form");
  if (inscriptionForm) {
    setupInscriptionForm();
  }

  const reportForm = document.getElementById("report-form");
  if (reportForm) {
    setupReportForm();
  }

  const suggestionForm = document.getElementById("suggestion-form");
  if (suggestionForm) {
    setupSuggestionForm();
  }

  const adminForm = document.getElementById("admin-application-form");
  if (adminForm) {
    setupAdminApplicationForm();
  }

  setupCharacterCounter();

  setupAgeValidation();

  setupAdminNavigation();

  setupEvaluationQuiz();
});

// FUNCIONES DE CONFIGURACIÓN INICIAL

function setupCharacterCounter() {
  const whyJoinTextarea = document.getElementById("why-join");
  const charCount = document.getElementById("char-count");

  if (whyJoinTextarea && charCount) {
    whyJoinTextarea.addEventListener("input", function () {
      const count = this.value.length;
      charCount.textContent = count;

      if (count > 500) {
        this.value = this.value.substring(0, 500);
        charCount.textContent = 500;
        charCount.style.color = "#e74c3c";
      } else if (count > 450) {
        charCount.style.color = "#e67e22";
      } else {
        charCount.style.color = "#666";
      }
    });
  }
}

function setupAgeValidation() {
  const ageInput = document.getElementById("age");
  if (ageInput) {
    ageInput.addEventListener("change", function () {
      const age = parseInt(this.value);
      if (age < 13) {
        showMessage(
          "La edad mínima para ingresar al clan es 13 años.",
          "error"
        );
        this.value = 13;
      }
    });
  }
}

function setupEvaluationQuiz() {
  const calculateBtn = document.getElementById("calculate-score");

  if (calculateBtn) {
    calculateBtn.addEventListener("click", function () {
      calculateEvaluationScore();
    });
  }
}

// NAVEGACIÓN PARA ASPIRANTES A ADMINISTRADOR

function setupAdminNavigation() {
  function smoothScrollToSection(sectionId, focusFirstInput = false) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    const sectionTop = section.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: sectionTop,
      behavior: "smooth",
    });

    section.classList.add("section-highlight");
    setTimeout(() => {
      section.classList.remove("section-highlight");
    }, 2000);

    if (focusFirstInput && sectionId === "aspirantes-admin") {
      setTimeout(() => {
        const firstInput = section.querySelector("input, textarea, select");
        if (firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 800);
    }
  }

  const continueBtn = document.querySelector(".requirements-continue-btn");
  if (continueBtn) {
    if (continueBtn.tagName === "A") {
      continueBtn.addEventListener("click", function (e) {
        e.preventDefault();
        smoothScrollToSection("aspirantes-admin", true);
      });
    } else if (continueBtn.tagName === "BUTTON") {
      continueBtn.addEventListener("click", function () {
        smoothScrollToSection("aspirantes-admin", true);
      });
    }
  }

  document.querySelectorAll('a[href*="#requisitos-admin"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.location.pathname.includes("contacto.html")) {
        e.preventDefault();
        smoothScrollToSection("requisitos-admin");
      }
    });
  });

  document.querySelectorAll('a[href*="#aspirantes-admin"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.location.pathname.includes("contacto.html")) {
        e.preventDefault();
        smoothScrollToSection("aspirantes-admin", true);
      }
    });
  });

  function handleHashOnLoad() {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);

      setTimeout(() => {
        if (hash === "requisitos-admin" || hash === "aspirantes-admin") {
          smoothScrollToSection(hash, hash === "aspirantes-admin");
        }
      }, 300);
    }
  }

  handleHashOnLoad();

  window.addEventListener("hashchange", handleHashOnLoad);

  const adminForm = document.getElementById("aspirantes-admin");
  if (adminForm) {
    const existingBackBtn = adminForm.querySelector(".back-to-requisitos-btn");
    if (!existingBackBtn) {
      const backToRequisitosBtn = document.createElement("button");
      backToRequisitosBtn.type = "button";
      backToRequisitosBtn.className = "btn btn-small back-to-requisitos-btn";
      backToRequisitosBtn.innerHTML =
        '<i class="fas fa-arrow-up"></i> Volver a Requisitos';

      const submitBtn = adminForm.querySelector(".form-submit-btn");
      if (submitBtn) {
        submitBtn.parentNode.insertBefore(backToRequisitosBtn, submitBtn);

        backToRequisitosBtn.addEventListener("click", function () {
          smoothScrollToSection("requisitos-admin");
        });
      }
    }
  }
}

// FORMULARIO DE INSCRIPCIÓN - VERSIÓN FUNCIONAL

function setupInscriptionForm() {
  const form = document.getElementById("inscription-form");
  const submitBtn = document.getElementById("submit-btn");
  const successMessage = document.getElementById("success-message");

  if (!form || !submitBtn || !successMessage) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateInscriptionForm()) {
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const formData = {
        robloxName: document.getElementById("roblox-name").value,
        age: document.getElementById("age").value,
        country: document.getElementById("country").value,
        timezone: document.getElementById("timezone").value,
        games: document.getElementById("games").value,
        experience: document.getElementById("experience").value,
        playHours: document.getElementById("play-hours").value,
        whyJoin: document.getElementById("why-join").value,
        referral: document.getElementById("referral").value,
        whatsapp:
          document.getElementById("whatsapp").value || "No proporcionado",
        whatsappConsent: document.getElementById("whatsapp-consent").checked,
        newsletter: document.getElementById("newsletter").checked,
        terms: document.getElementById("terms").checked,
      };

      const ip = await getIPAddress();

      await sendInscriptionEmailToAdmin(formData, ip);

      if (
        formData.whatsappConsent &&
        formData.whatsapp !== "No proporcionado"
      ) {
        try {
          await sendConfirmationEmailToUser(formData);
        } catch (confirmationError) {
          console.warn(
            "No se pudo enviar email de confirmación:",
            confirmationError
          );
        }
      }

      form.style.display = "none";

      successMessage.style.display = "block";
      successMessage.classList.add("success-highlight");

      setTimeout(() => {
        successMessage.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });

        setTimeout(() => {
          const rect = successMessage.getBoundingClientRect();
          const isVisible =
            rect.top >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight);

          if (!isVisible) {
            window.scrollBy({
              top: rect.top - 150,
              behavior: "smooth",
            });
          }
        }, 200);
      }, 150);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      showMessage(
        "❌ Error al enviar la solicitud. Por favor, inténtalo de nuevo o contáctanos por WhatsApp directamente.",
        "error"
      );

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function sendInscriptionEmailToAdmin(data, ip) {
  const templateParams = {
    roblox_name: data.robloxName || "No proporcionado",
    age: data.age || "No proporcionado",
    country: data.country || "No proporcionado",
    timezone: data.timezone || "No proporcionado",
    games: data.games || "No proporcionado",
    experience: data.experience || "No proporcionado",
    play_hours: data.playHours || "No proporcionado",
    why_join: data.whyJoin || "No proporcionado",
    referral: data.referral || "No proporcionado",
    whatsapp: data.whatsapp || "No proporcionado",
    whatsapp_consent: data.whatsappConsent ? "Sí" : "No",
    newsletter: data.newsletter ? "Sí" : "No",
    ip: ip || "No se pudo obtener",
    date: new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return emailjs.send("service_sjea029", "template_bso642c", templateParams);
}

async function sendConfirmationEmailToUser(data) {
  if (!data.whatsapp || data.whatsapp === "No proporcionado") return;

  const templateParams = {
    roblox_name: data.robloxName,
    age: data.age,
    country: data.country,
    games: data.games,
    date: new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };

  return emailjs.send("service_sjea029", "template_xqur3ed", templateParams);
}

// FORMULARIO DE REPORTE

function setupReportForm() {
  const form = document.getElementById("report-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateReportForm()) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const formData = {
        reportType: document.getElementById("report-type").value,
        reportDetails: document.getElementById("report-details").value,
        reportEvidence:
          document.getElementById("report-evidence").value ||
          "No proporcionada",
        confidential: document.getElementById("report-confidential").checked,
      };

      const ip = await getIPAddress();

      await sendReportEmail(formData, ip);

      showMessage(
        "✅ Reporte enviado con éxito. Investigaremos el problema.",
        "success",
        form
      );
      form.reset();
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      showMessage(
        "❌ Error al enviar el reporte. Inténtalo de nuevo.",
        "error",
        form
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function sendReportEmail(data, ip) {
  const templateParams = {
    roblox_name: "REPORTE DE PROBLEMA",
    age: "N/A",
    country: "N/A",
    timezone: "N/A",
    games: "N/A",
    experience: "N/A",
    play_hours: "N/A",
    why_join: `📋 <strong>TIPO DE PROBLEMA:</strong> ${data.reportType}<br><br>
                  📝 <strong>DESCRIPCIÓN:</strong><br>${data.reportDetails}<br><br>
                  🔗 <strong>EVIDENCIA:</strong> ${data.reportEvidence}`,
    referral: "Formulario de Reportes",
    whatsapp: "N/A",
    whatsapp_consent: "N/A",
    newsletter: "N/A",
    ip: ip,
    date: new Date().toLocaleString("es-ES"),
  };

  return emailjs.send("service_sjea029", "template_bso642c", templateParams);
}

// FORMULARIO DE SUGERENCIAS

function setupSuggestionForm() {
  const form = document.getElementById("suggestion-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateSuggestionForm()) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const formData = {
        suggestionType: document.getElementById("suggestion-type").value,
        suggestionDetails: document.getElementById("suggestion-details").value,
        anonymous: document.getElementById("suggestion-anonymous").checked,
      };

      const ip = await getIPAddress();

      await sendSuggestionEmail(formData, ip);

      showMessage(
        "✅ ¡Gracias por tu sugerencia! La tomaremos en cuenta.",
        "success",
        form
      );
      form.reset();
    } catch (error) {
      console.error("Error al enviar sugerencia:", error);
      showMessage(
        "❌ Error al enviar la sugerencia. Inténtalo de nuevo.",
        "error",
        form
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function sendSuggestionEmail(data, ip) {
  const templateParams = {
    roblox_name: "SUGERENCIA PARA EL CLAN",
    age: "N/A",
    country: "N/A",
    timezone: "N/A",
    games: "N/A",
    experience: "N/A",
    play_hours: "N/A",
    why_join: `📋 <strong>ÁREA DE MEJORA:</strong> ${
      data.suggestionType
    }<br><br>
                  💡 <strong>SUGERENCIA:</strong><br>${
                    data.suggestionDetails
                  }<br><br>
                  🤫 <strong>ANÓNIMO:</strong> ${data.anonymous ? "Sí" : "No"}`,
    referral: "Formulario de Sugerencias",
    whatsapp: "N/A",
    whatsapp_consent: "N/A",
    newsletter: "N/A",
    ip: ip,
    date: new Date().toLocaleString("es-ES"),
  };

  return emailjs.send("service_sjea029", "template_bso642c", templateParams);
}

// FORMULARIO DE ASPIRANTES A ADMINISTRADOR

function setupAdminApplicationForm() {
  const form = document.getElementById("admin-application-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  let messageContainer = form.querySelector(".admin-message-container");

  if (!messageContainer) {
    messageContainer = document.createElement("div");
    messageContainer.className = "admin-message-container";

    submitBtn.parentNode.insertBefore(messageContainer, submitBtn.nextSibling);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateAdminForm()) {
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const formData = {
        robloxName: document.getElementById("admin-roblox-name").value,
        age: document.getElementById("admin-age").value,
        country: document.getElementById("admin-country").value,
        timezone: document.getElementById("admin-timezone").value,
        whatsapp: document.getElementById("admin-whatsapp").value,
        experience:
          document.getElementById("admin-experience").value ||
          "No especificada",
        whyAdmin: document.getElementById("admin-why").value,
        availability: document.getElementById("admin-availability").value,
        improvements: document.getElementById("admin-improvements").value,
        terms: document.getElementById("admin-terms").checked,
        commitment: document.getElementById("admin-commitment").checked,
      };

      const ip = await getIPAddress();

      await sendAdminApplicationEmail(formData, ip);

      showMessageInContainer(
        "✅ Solicitud enviada con éxito. Te contactaremos por WhatsApp si avanzamos con tu proceso de selección.",
        "success",
        messageContainer
      );
      form.reset();
    } catch (error) {
      console.error("Error al enviar solicitud de admin:", error);
      showMessageInContainer(
        "❌ Error al enviar la solicitud. Inténtalo de nuevo o contacta directamente por WhatsApp.",
        "error",
        messageContainer
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function showMessageInContainer(text, type, container) {
  container.innerHTML = "";

  let alertClass;
  switch (type) {
    case "success":
      alertClass = "alert-success";
      break;
    case "error":
      alertClass = "alert-danger";
      break;
    case "warning":
      alertClass = "alert-warning";
      break;
    default:
      alertClass = "alert-info";
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `alert ${alertClass}`;
  messageDiv.textContent = text;

  container.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

async function sendAdminApplicationEmail(data, ip) {
  const templateParams = {
    roblox_name: `[ASPIRANTE ADMIN] ${data.robloxName}`,
    age: data.age,
    country: data.country,
    timezone: data.timezone,
    games: "N/A",
    experience: data.availability,
    play_hours: "N/A",
    why_join: `🎯 <strong>MOTIVACIÓN PARA SER ADMIN:</strong><br>${data.whyAdmin}<br><br>
               💼 <strong>EXPERIENCIA PREVIA:</strong><br>${data.experience}<br><br>
               💡 <strong>MEJORAS PROPUESTAS:</strong><br>${data.improvements}<br><br>
               ⏰ <strong>DISPONIBILIDAD:</strong> ${data.availability} horas/semana`,
    referral: "Formulario Aspirantes a Admin",
    whatsapp: data.whatsapp,
    whatsapp_consent: "Sí",
    newsletter: "N/A",
    ip: ip,
    date: new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return emailjs.send("service_sjea029", "template_bso642c", templateParams);
}

// FUNCIONES DE VALIDACIÓN

function validateInscriptionForm() {
  const age = parseInt(document.getElementById("age").value);
  if (age < 13) {
    showMessage("❌ La edad mínima para ingresar al clan es 13 años.", "error");
    return false;
  }

  if (!document.getElementById("terms").checked) {
    showMessage(
      "❌ Debes aceptar el reglamento del clan para continuar.",
      "error"
    );
    return false;
  }

  const whyJoin = document.getElementById("why-join").value;
  if (whyJoin.length < 20) {
    showMessage(
      "❌ Por favor, explica con más detalle por qué quieres unirte (mínimo 20 caracteres).",
      "error"
    );
    return false;
  }

  const requiredFields = [
    "roblox-name",
    "age",
    "country",
    "timezone",
    "games",
    "experience",
    "play-hours",
    "why-join",
    "referral",
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (field && field.hasAttribute("required") && !field.value.trim()) {
      const label = field.previousElementSibling?.textContent || field.name;
      showMessage(`❌ Por favor, completa el campo: ${label}`, "error");
      field.focus();
      return false;
    }
  }

  return true;
}

function validateReportForm() {
  if (!document.getElementById("report-confidential").checked) {
    showMessage(
      "❌ Debes confirmar que entiendes cómo se manejará tu reporte.",
      "error"
    );
    return false;
  }

  const details = document.getElementById("report-details").value;
  if (details.length < 10) {
    showMessage("❌ Por favor, describe el problema con más detalle.", "error");
    return false;
  }

  return true;
}

function validateSuggestionForm() {
  const details = document.getElementById("suggestion-details").value;
  if (details.length < 10) {
    showMessage(
      "❌ Por favor, describe tu sugerencia con más detalle.",
      "error"
    );
    return false;
  }

  return true;
}

function validateAdminForm() {
  const age = parseInt(document.getElementById("admin-age").value);
  if (age < 15) {
    showMessage(
      "❌ La edad mínima para aspirar a administrador es 15 años.",
      "error"
    );
    return false;
  }

  // Validar checkboxes requeridos
  if (!document.getElementById("admin-terms").checked) {
    showMessage(
      "❌ Debes aceptar haber leído el reglamento y comprender las responsabilidades.",
      "error"
    );
    return false;
  }

  if (!document.getElementById("admin-commitment").checked) {
    showMessage(
      "❌ Debes comprometerte a mantener la confidencialidad de la información.",
      "error"
    );
    return false;
  }

  const requiredFields = [
    "admin-roblox-name",
    "admin-age",
    "admin-country",
    "admin-timezone",
    "admin-whatsapp",
    "admin-why",
    "admin-availability",
    "admin-improvements",
  ];

  for (const fieldId of requiredFields) {
    const field = document.getElementById(fieldId);
    if (field && field.hasAttribute("required") && !field.value.trim()) {
      const label = field.previousElementSibling?.textContent || field.name;
      showMessage(`❌ Por favor, completa el campo: ${label}`, "error");
      field.focus();
      return false;
    }
  }

  const whyAdmin = document.getElementById("admin-why").value;
  if (whyAdmin.length < 30) {
    showMessage(
      "❌ Por favor, explica con más detalle por qué quieres ser administrador (mínimo 30 caracteres).",
      "error"
    );
    return false;
  }

  return true;
}

// FUNCIONES AUXILIARES

// OBTENER IP DEL USUARIO - VERSIÓN MEJORADA

async function getIPAddress() {
  const ipServices = [
    "https://api.ipify.org?format=json",
    "https://api64.ipify.org?format=json",
    "https://api.myip.com",
    "https://ipapi.co/json/",
    "https://ipinfo.io/json",
    "https://api.ip.sb/jsonip",
  ];

  for (let i = 0; i < ipServices.length; i++) {
    try {
      const response = await fetch(ipServices[i], {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
        timeout: 3000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let ip = "";
      if (ipServices[i].includes("ipify")) {
        ip = data.ip;
      } else if (ipServices[i].includes("myip.com")) {
        ip = data.ip;
      } else if (ipServices[i].includes("ipapi.co")) {
        ip = data.ip;
      } else if (ipServices[i].includes("ipinfo.io")) {
        ip = data.ip;
      } else if (ipServices[i].includes("ip.sb")) {
        ip = data.ip;
      }

      if (ip && ip !== "undefined") {
        console.log(`IP obtenida desde: ${ipServices[i]}`, ip);
        return ip;
      }
    } catch (error) {
      console.warn(`Servicio ${i + 1} falló:`, ipServices[i], error);

      continue;
    }
  }

  try {
    const response = await fetch("https://icanhazip.com/");
    if (response.ok) {
      const ip = await response.text();
      return ip.trim();
    }
  } catch (error) {
    console.warn("Servicio simple también falló:", error);
  }

  try {
    const rtcIp = await getIPFromWebRTC();
    if (rtcIp) {
      return rtcIp + " (WebRTC)";
    }
  } catch (error) {
    console.warn("WebRTC también falló:", error);
  }

  return "No disponible - Error al obtener IP";
}

function getIPFromWebRTC() {
  return new Promise((resolve) => {
    const RTCPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;

    if (!RTCPeerConnection) {
      resolve(null);
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: [] });
    const ips = [];

    pc.createDataChannel("");

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch((err) => {
        console.warn("Error en WebRTC:", err);
        resolve(null);
      });

    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) {
        if (ips.length > 0) {
          resolve(ips[0]);
        } else {
          resolve(null);
        }
        return;
      }

      const candidate = event.candidate.candidate;
      const regex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
      const match = candidate.match(regex);

      if (match) {
        const ip = match[1];
        if (ips.indexOf(ip) === -1) {
          ips.push(ip);
        }
      }
    };

    setTimeout(() => {
      if (ips.length > 0) {
        resolve(ips[0]);
      } else {
        resolve(null);
      }
    }, 2000);
  });
}

function showMessage(text, type, form = null) {
  let messageContainer;

  if (form) {
    messageContainer = form.querySelector(".form-messages");
    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.className = "form-messages";
      form.insertBefore(messageContainer, form.firstChild);
    }
  } else {
    messageContainer = document.querySelector(".form-messages");
    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.className = "form-messages";
      const formContainer = document.querySelector(".form-container");
      if (formContainer) {
        formContainer.insertBefore(messageContainer, formContainer.firstChild);
      }
    }
  }

  messageContainer.innerHTML = "";

  let alertClass;
  switch (type) {
    case "success":
      alertClass = "alert-success";
      break;
    case "error":
      alertClass = "alert-danger";
      break;
    case "warning":
      alertClass = "alert-warning";
      break;
    default:
      alertClass = "alert-info";
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `alert ${alertClass}`;
  messageDiv.textContent = text;

  messageContainer.appendChild(messageDiv);

  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 11000);
}

// FUNCIONES PARA ACTUALIZAR ENLACE DE WHATSAPP

document.addEventListener("input", function (e) {
  if (e.target.id === "roblox-name" || e.target.id === "age") {
    updateWhatsAppLink();
  }
});

function updateWhatsAppLink() {
  const robloxName = document.getElementById("roblox-name")?.value;
  const age = document.getElementById("age")?.value;
  const whatsappLink = document.getElementById("whatsapp-link");

  if (robloxName && whatsappLink) {
    let message = `Hola Serakdep MS, quiero unirme al clan. Mi nombre en Roblox es: ${robloxName}`;
    if (age) {
      message += ` y tengo ${age} años`;
    }

    const encodedMessage = encodeURIComponent(message);
    whatsappLink.href = `https://wa.me/573116546484?text=${encodedMessage}`;
  }
}

// CUESTIONARIO DE AUTOVALORACIÓN PARA ADMIN

function calculateEvaluationScore() {
  const questions = document.querySelectorAll(".evaluation-question");
  let totalScore = 0;
  let maxScore = 0;

  const scores = {
    q1: { yes: 10, probably: 7, difficult: 4, no: 0 },
    q2: { calm: 10, breathe: 8, struggle: 3, avoid: 0 },
    q3: { "15+": 10, "10-15": 8, "5-10": 5, less5: 0 },
    q4: { warn: 10, talk: 6, consult: 7, ignore: 0 },
  };

  // Calcular puntaje
  questions.forEach((question, index) => {
    const questionNum = index + 1;
    const selected = question.querySelector('input[type="radio"]:checked');

    if (selected) {
      const value = selected.value;
      totalScore += scores[`q${questionNum}`][value];
    }

    maxScore += 10;
  });

  const percentage = (totalScore / maxScore) * 100;

  const resultDiv = document.getElementById("score-result");
  resultDiv.style.display = "block";
  resultDiv.innerHTML = "";

  let resultClass = "";
  let message = "";
  let icon = "";

  if (percentage >= 80) {
    resultClass = "good";
    icon = '<i class="fas fa-trophy"></i>';
    message = `¡Excelente! Tu puntuación es ${Math.round(
      percentage
    )}%. Tienes buen potencial para ser administrador.`;
  } else if (percentage >= 50) {
    resultClass = "medium";
    icon = '<i class="fas fa-exclamation-circle"></i>';
    message = `Tu puntuación es ${Math.round(
      percentage
    )}%. Tienes áreas de mejora, pero podrías ser considerado con capacitación adicional.`;
  } else {
    resultClass = "low";
    icon = '<i class="fas fa-times-circle"></i>';
    message = `Tu puntuación es ${Math.round(
      percentage
    )}%. Te recomendamos ganar más experiencia en el clan antes de aplicar.`;
  }

  resultDiv.className = `score-result ${resultClass}`;
  resultDiv.innerHTML = `
    <h4>${icon} Resultado de Autoevaluación</h4>
    <p>${message}</p>
    <p><strong>Puntuación:</strong> ${totalScore}/${maxScore} puntos (${Math.round(
    percentage
  )}%)</p>
  `;

  resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  const elementTop = element.offsetTop;
  const targetPosition = elementTop - headerHeight - 50;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });

  element.style.transition = "all 0.5s ease";
  element.style.boxShadow = "0 0 0 5px rgba(46, 204, 113, 0.3)";

  setTimeout(() => {
    element.style.boxShadow = "0 10px 30px rgba(46, 204, 113, 0.3)";
  }, 500);

  setTimeout(() => {
    element.style.boxShadow = "";
  }, 1500);
}
