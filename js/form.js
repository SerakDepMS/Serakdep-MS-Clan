// form.js - Configurado con EmailJS
document.addEventListener("DOMContentLoaded", function () {
  // INICIALIZAR EMAILJS - REEMPLAZA CON TU PUBLIC KEY
  emailjs.init("KZquan0PhqC35uDYw"); // Cambia esto por tu Public Key de EmailJS

  // Formulario de inscripción
  const inscriptionForm = document.getElementById("inscription-form");
  if (inscriptionForm) {
    setupInscriptionForm();
  }

  // Formulario de reporte
  const reportForm = document.getElementById("report-form");
  if (reportForm) {
    setupReportForm();
  }

  // Formulario de sugerencias
  const suggestionForm = document.getElementById("suggestion-form");
  if (suggestionForm) {
    setupSuggestionForm();
  }

  // Configurar contador de caracteres
  setupCharacterCounter();

  // Configurar validación de edad
  setupAgeValidation();
});

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

// ============================================
// FORMULARIO DE INSCRIPCIÓN
// ============================================
function setupInscriptionForm() {
  const form = document.getElementById("inscription-form");
  const submitBtn = document.getElementById("submit-btn");
  const successMessage = document.getElementById("success-message");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validar formulario
    if (!validateInscriptionForm()) {
      return;
    }

    // Deshabilitar botón y mostrar loading
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      // Obtener datos del formulario
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

      // Obtener IP del usuario
      const ip = await getIPAddress();

      // ENVIAR EMAIL A TI (ADMIN) usando template_bso642c
      await sendInscriptionEmailToAdmin(formData, ip);

      // ENVIAR CONFIRMACIÓN AL USUARIO (OPCIONAL) usando template_xqur3ed
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

      // Mostrar mensaje de éxito
      form.style.display = "none";
      successMessage.style.display = "block";
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      showMessage(
        "❌ Error al enviar la solicitud. Por favor, inténtalo de nuevo o contáctanos por WhatsApp directamente.",
        "error"
      );

      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function sendInscriptionEmailToAdmin(data, ip) {
  const templateParams = {
    roblox_name: data.robloxName,
    age: data.age,
    country: data.country,
    timezone: data.timezone,
    games: data.games,
    experience: data.experience,
    play_hours: data.playHours,
    why_join: data.whyJoin,
    referral: data.referral,
    whatsapp: data.whatsapp,
    whatsapp_consent: data.whatsappConsent ? "Sí" : "No",
    newsletter: data.newsletter ? "Sí" : "No",
    ip: ip,
    date: new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return emailjs.send(
    "service_sjea029", // REEMPLAZA con tu Service ID
    "template_bso642c", // Template para recibir inscripciones
    templateParams
  );
}

async function sendConfirmationEmailToUser(data) {
  // Solo si el usuario proporcionó WhatsApp (lo usamos como email de contacto)
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

  return emailjs.send(
    "service_sjea029", // Mismo Service ID
    "template_xqur3ed", // Template de confirmación
    templateParams
  );
}

// ============================================
// FORMULARIO DE REPORTE
// ============================================
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

  return emailjs.send(
    "service_sjea029", // Mismo Service ID
    "template_bso642c", // Mismo template, contenido diferente
    templateParams
  );
}

// ============================================
// FORMULARIO DE SUGERENCIAS
// ============================================
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

  return emailjs.send(
    "service_sjea029", // Mismo Service ID
    "template_bso642c", // Mismo template, contenido diferente
    templateParams
  );
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================
function validateInscriptionForm() {
  // Validar edad
  const age = parseInt(document.getElementById("age").value);
  if (age < 13) {
    showMessage("❌ La edad mínima para ingresar al clan es 13 años.", "error");
    return false;
  }

  // Validar términos
  if (!document.getElementById("terms").checked) {
    showMessage(
      "❌ Debes aceptar el reglamento del clan para continuar.",
      "error"
    );
    return false;
  }

  // Validar campo "Por qué quieres unirte"
  const whyJoin = document.getElementById("why-join").value;
  if (whyJoin.length < 20) {
    showMessage(
      "❌ Por favor, explica con más detalle por qué quieres unirte (mínimo 20 caracteres).",
      "error"
    );
    return false;
  }

  // Validar campos requeridos
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
  // Validar checkbox de confidencialidad
  if (!document.getElementById("report-confidential").checked) {
    showMessage(
      "❌ Debes confirmar que entiendes cómo se manejará tu reporte.",
      "error"
    );
    return false;
  }

  // Validar campo de descripción
  const details = document.getElementById("report-details").value;
  if (details.length < 10) {
    showMessage("❌ Por favor, describe el problema con más detalle.", "error");
    return false;
  }

  return true;
}

function validateSuggestionForm() {
  // Validar campo de sugerencia
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

// ============================================
// FUNCIONES AUXILIARES
// ============================================
async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn("No se pudo obtener la IP:", error);
    return "No disponible";
  }
}

function showMessage(text, type, form = null) {
  // Crear o encontrar contenedor de mensajes
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

  // Limpiar mensajes anteriores
  messageContainer.innerHTML = "";

  // Determinar clase según tipo
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

  // Crear mensaje
  const messageDiv = document.createElement("div");
  messageDiv.className = `alert ${alertClass}`;
  messageDiv.innerHTML = text;

  messageContainer.appendChild(messageDiv);

  // Remover después de 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// ============================================
// FUNCIONES PARA ACTUALIZAR ENLACE DE WHATSAPP DINÁMICAMENTE
// ============================================
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
    // REEMPLAZA con tu número de WhatsApp
    whatsappLink.href = `https://wa.me/573116546484?text=${encodedMessage}`;
  }
}

