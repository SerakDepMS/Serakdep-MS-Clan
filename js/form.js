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

// FORMULARIO DE INSCRIPCIÓN - VERSIÓN CORREGIDA Y UNIFICADA

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
        userEmail: document.getElementById("user-email").value,
        whatsappConsent: document.getElementById("whatsapp-consent").checked,
        newsletter: document.getElementById("newsletter").checked,
        terms: document.getElementById("terms").checked,
        joinWhatsapp: document.getElementById("join-whatsapp").checked,
        joinDiscord: document.getElementById("join-discord").checked,
      };

      console.log("📝 Datos del formulario capturados");

      // ========== OBTENER IP CON LA FUNCIÓN UNIFICADA ==========
      let ip = "No disponible";
      try {
        console.log("🌐 Intentando obtener IP...");
        ip = await getIPAddress();
        console.log(`✅ IP obtenida: ${ip}`);
      } catch (ipError) {
        console.warn(
          "⚠️ Error obteniendo IP, usando valor por defecto:",
          ipError
        );
      }

      // ========== 1. ENVIAR EMAIL AL ADMINISTRADOR ==========
      console.log("📤 Enviando email al administrador...");
      try {
        await sendInscriptionEmailToAdmin(formData, ip);
        console.log("✅ Email enviado exitosamente al admin");
      } catch (adminEmailError) {
        console.error(
          "❌ ERROR CRÍTICO enviando email al admin:",
          adminEmailError
        );
        throw adminEmailError;
      }

      // ========== 2. ENVIAR EMAIL DE CONFIRMACIÓN AL USUARIO ==========
      try {
        if (formData.userEmail && formData.userEmail.trim() !== "") {
          console.log("📧 Enviando confirmación al usuario...");
          await sendConfirmationEmailToUser(formData);
          console.log("✅ Email de confirmación enviado al usuario");
        } else {
          console.log(
            "ℹ️ Usuario no proporcionó email, no se envía confirmación"
          );
        }
      } catch (confirmationError) {
        console.warn(
          "⚠️ No se pudo enviar email de confirmación:",
          confirmationError
        );
        // NO detenemos el proceso si falla la confirmación
      }

      // ========== 3. MOSTRAR ÉXITO AL USUARIO ==========
      form.style.display = "none";
      successMessage.style.display = "block";
      successMessage.classList.add("success-highlight");

      // Mostrar botones según selección
      const whatsappBtn = document.getElementById("whatsapp-success-btn");
      const discordBtn = document.getElementById("discord-success-btn");
      const successButtonsContainer =
        document.getElementById("success-buttons");

      if (formData.joinWhatsapp) {
        whatsappBtn.style.display = "flex";
      }
      if (formData.joinDiscord) {
        discordBtn.href = "https://discord.gg/vts4PTHR9K";
        discordBtn.style.display = "flex";
      }

      if (!formData.joinWhatsapp && !formData.joinDiscord) {
        successButtonsContainer.style.display = "none";
      } else {
        successButtonsContainer.style.display = "flex";
      }

      // Scroll al mensaje de éxito
      setTimeout(() => {
        successMessage.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
    } catch (error) {
      console.error("❌ Error general al enviar el formulario:", error);

      let errorMessage = "❌ Error al enviar la solicitud. ";
      if (error.status === 422) {
        errorMessage += "Error de configuración del email. ";
      }
      errorMessage +=
        "Por favor, inténtalo de nuevo o contáctanos por WhatsApp directamente.";

      showMessage(errorMessage, "error");

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

async function sendInscriptionEmailToAdmin(data, ip) {
  console.log("🚀 INICIANDO sendInscriptionEmailToAdmin");
  console.log("📊 Datos recibidos para email:", data);

  // Verificar que los datos críticos existen
  if (!data.robloxName || !data.userEmail) {
    console.error("❌ DATOS CRÍTICOS FALTANTES:", {
      robloxName: data.robloxName,
      userEmail: data.userEmail,
    });
    throw new Error("Datos críticos faltantes para enviar email");
  }

  // ========== GENERAR TODAS LAS VARIABLES CONDICIONALES ==========

  // 1. WhatsApp display
  const whatsappDisplay =
    data.whatsapp === "No proporcionado"
      ? '<span style="color: #e74c3c;">No proporcionado</span>'
      : `<a href="https://wa.me/${data.whatsapp}" style="color: #25D366; text-decoration: none; font-weight: bold;">${data.whatsapp}</a>`;

  // 2. WhatsApp consent
  const whatsappConsentDisplay = data.whatsappConsent
    ? '<span style="color: #27ae60; font-weight: bold;">✓ Aceptado</span>'
    : '<span style="color: #e74c3c;">✗ No aceptado</span>';

  // 3. Newsletter
  const newsletterDisplay = data.newsletter
    ? '<span style="color: #27ae60; font-weight: bold;">✓ Suscrito</span>'
    : '<span style="color: #e74c3c;">✗ No suscrito</span>';

  // 4. WhatsApp check
  const joinWhatsappCheck = data.joinWhatsapp
    ? '<span style="color: #25D366; font-weight: bold; margin-left: 10px;">✓ Quiere unirse al grupo</span>'
    : "";

  // 5. Discord check
  const joinDiscordCheck = data.joinDiscord
    ? '<span style="color: #5865F2; font-weight: bold; margin-left: 10px;">✓ Quiere unirse al servidor</span>'
    : "";

  // 6. Join both note
  const joinBothNote =
    data.joinWhatsapp && data.joinDiscord
      ? '<div style="background: #fff3cd; padding: 12px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #ffc107;">' +
        "<strong>📝 NOTA:</strong> El jugador quiere unirse a <strong>AMBAS</strong> comunidades. Enviar invitaciones a WhatsApp y Discord." +
        "</div>"
      : "";

  // 7. WhatsApp action
  const whatsappAction = data.joinWhatsapp
    ? '<div style="background: white; padding: 12px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #25D366;">' +
      '<strong style="color: #25D366;">📱 WHATSAPP:</strong> Invitar al número <strong>' +
      data.whatsapp +
      "</strong> al grupo de nuevos miembros." +
      "</div>"
    : "";

  // 8. Discord action
  const discordAction = data.joinDiscord
    ? '<div style="background: white; padding: 12px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #5865F2;">' +
      '<strong style="color: #5865F2;">🎮 DISCORD:</strong> Enviar invitación al servidor de Discord (Usuario: <strong>' +
      data.robloxName +
      "</strong>)." +
      "</div>"
    : "";

  // 9. Contact note
  const contactNote =
    !data.joinWhatsapp && !data.joinDiscord
      ? '<div style="background: white; padding: 12px; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #f39c12;">' +
        '<strong style="color: #f39c12;">ℹ️ CONTACTO:</strong> El jugador no seleccionó comunidades. Contactar por Roblox: <strong>' +
        data.robloxName +
        "</strong>" +
        "</div>"
      : "";

  // 10. Priority
  const priority = data.joinWhatsapp
    ? '<span style="color: #e74c3c; font-weight: bold;">ALTA - Contactar inmediatamente</span>'
    : '<span style="color: #f39c12; font-weight: bold;">MEDIA - Contactar en 48 horas</span>';

  // 11. Priority background
  const priorityBackground = data.joinWhatsapp
    ? "background: #e74c3c; color: white;"
    : "background: #f39c12; color: white;";

  // 12. Priority explanation
  const priorityExplanation = data.joinWhatsapp
    ? "<strong>Contactar de inmediato</strong> vía WhatsApp para invitación al grupo."
    : "<strong>Contactar en 48 horas</strong> vía Roblox o email.";

  // 13. Classification
  const classification = data.joinWhatsapp ? "Nueva Alta" : "Regular";

  // ========== PREPARAR PARÁMETROS ==========

  const templateParams = {
    // Información básica
    roblox_name: data.robloxName || "No proporcionado",
    age: data.age || "No proporcionado",
    country: data.country || "No proporcionado",
    timezone: data.timezone || "No proporcionado",
    games: data.games || "No proporcionado",
    experience: data.experience || "No proporcionado",
    play_hours: data.playHours || "No proporcionado",
    why_join: data.whyJoin || "No proporcionado",
    referral: data.referral || "No proporcionado",

    // Contacto
    whatsapp: data.whatsapp || "No proporcionado",
    user_email: data.userEmail || "No proporcionado",

    // Variables de estado (sí/no)
    whatsapp_consent: data.whatsappConsent ? "Sí" : "No",
    newsletter: data.newsletter ? "Sí" : "No",
    join_whatsapp: data.joinWhatsapp ? "Sí" : "No",
    join_discord: data.joinDiscord ? "Sí" : "No",

    // Variables HTML generadas
    whatsapp_display: whatsappDisplay,
    whatsapp_consent_display: whatsappConsentDisplay,
    newsletter_display: newsletterDisplay,
    join_whatsapp_check: joinWhatsappCheck,
    join_discord_check: joinDiscordCheck,
    join_both_note: joinBothNote,
    whatsapp_action: whatsappAction,
    discord_action: discordAction,
    contact_note: contactNote,
    priority: priority,
    priority_background: priorityBackground,
    priority_explanation: priorityExplanation,
    classification: classification,

    // Datos técnicos
    ip: ip || "No se pudo obtener",
    date: new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: Date.now().toString(),
  };

  console.log("✅ Email preparado, enviando a EmailJS...");

  try {
    const result = await emailjs.send(
      "service_sjea029",
      "template_bso642c",
      templateParams
    );
    console.log("✅ Email enviado exitosamente a través de EmailJS");
    return result;
  } catch (emailJSError) {
    console.error("❌ Error de EmailJS:", emailJSError);
    throw emailJSError;
  }
}

async function sendConfirmationEmailToUser(data) {
  // Verificar que el usuario proporcionó un email
  if (!data.userEmail || data.userEmail.trim() === "") {
    console.log("Usuario no proporcionó email, no se envía confirmación");
    return null;
  }

  // Generar secciones condicionales para WhatsApp
  const whatsappSection = data.joinWhatsapp
    ? `<div style="background: #dcf8c6; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #25D366;">
         <h3 style="color: #075e54; margin-top: 0; margin-bottom: 15px;">📲 GRUPO DE WHATSAPP</h3>
         <p>Puedes unirte ahora mismo a nuestro grupo temporal de nuevos miembros:</p>
         <div style="text-align: center; margin: 20px 0;">
           <a href="https://chat.whatsapp.com/KMM8RYx429z9i25YINcKfG" 
              style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
             <span style="font-size: 18px; margin-right: 8px;">📱</span> Unirse al WhatsApp
           </a>
         </div>
         <div style="font-size: 14px; color: #666; text-align: center; margin-top: 15px; background: white; padding: 10px; border-radius: 3px; border: 1px solid #ddd; word-break: break-all;">
           <strong>Enlace:</strong><br>
           https://chat.whatsapp.com/KMM8RYx429z9i25YINcKfG
         </div>
       </div>`
    : "";

  // Generar secciones condicionales para Discord
  const discordSection = data.joinDiscord
    ? `<div style="background: #e6e6ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #5865F2;">
         <h3 style="color: #36393f; margin-top: 0; margin-bottom: 15px;">🎮 SERVIDOR DE DISCORD</h3>
         <p>Únete a nuestro servidor de Discord para conectar con la comunidad:</p>
         <div style="text-align: center; margin: 20px 0;">
           <a href="https://discord.gg/vts4PTHR9K"
              style="background: linear-gradient(135deg, #5865F2 0%, #3b45b5 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
             <span style="font-size: 18px; margin-right: 8px;">🎮</span> Unirse al Discord
           </a>
         </div>
         <div style="font-size: 14px; color: #666; text-align: center; margin-top: 15px; background: white; padding: 10px; border-radius: 3px; border: 1px solid #ddd; word-break: break-all;">
           <strong>Enlace:</strong><br>
           https://discord.gg/vts4PTHR9K
         </div>
       </div>`
    : "";

  // Generar sección de notas si no seleccionó ninguna comunidad
  const notesSection =
    !data.joinWhatsapp && !data.joinDiscord
      ? `<div style="background: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
         <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">ℹ️ NOTA SOBRE LAS COMUNIDADES</h3>
         <p style="margin: 0;">
           No seleccionaste unirte a ninguna comunidad. Si cambias de opinión, puedes contactarnos respondiendo a este correo o a través de Roblox.
         </p>
       </div>`
      : "";

  const templateParams = {
    // Para configuración del email (ENCABEZADOS) - USAR NOMBRES EXACTOS DE EMAILJS
    to_email: data.userEmail,
    from_name: "Serakdep MS",
    user_email: data.userEmail,

    // Para contenido del email (CUERPO HTML)
    roblox_name: data.robloxName,
    age: data.age,
    country: data.country,
    games: data.games,
    join_whatsapp: data.joinWhatsapp ? "Sí" : "No",
    join_discord: data.joinDiscord ? "Sí" : "No",
    date: new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    timestamp: Date.now(),

    // Secciones condicionales generadas en JS
    whatsapp_section: whatsappSection,
    discord_section: discordSection,
    notes_section: notesSection,
  };

  try {
    console.log("📧 Enviando auto-reply al usuario...");
    return await emailjs.send(
      "service_sjea029",
      "template_xqur3ed",
      templateParams
    );
  } catch (error) {
    console.warn("⚠️ Error enviando email de confirmación:", error);
    throw error;
  }
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

      let ip = "No disponible";
      try {
        ip = await getIPAddress();
      } catch (error) {
        console.log("No se pudo obtener IP para reporte:", error);
      }

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

      let ip = "No disponible";
      try {
        ip = await getIPAddress();
      } catch (error) {
        console.log("No se pudo obtener IP para sugerencia:", error);
      }

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

      let ip = "No disponible";
      try {
        ip = await getIPAddress();
      } catch (error) {
        console.log("No se pudo obtener IP para admin:", error);
      }

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

  const userEmail = document.getElementById("user-email").value;
  if (!userEmail || userEmail.trim() === "") {
    showMessage("❌ Por favor, introduce tu correo electrónico.", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    showMessage(
      "❌ Por favor, introduce un correo electrónico válido.",
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
    "user-email",
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

// 🎯 FUNCIÓN ÚNICA Y MEJORADA PARA OBTENER IP
async function getIPAddress() {
  console.log("🔍 Obteniendo IP del usuario...");

  const services = [
    { url: "https://checkip.amazonaws.com/", type: "text", name: "Amazon AWS" },
    { url: "https://icanhazip.com/", type: "text", name: "icanhazip" },
    {
      url: "https://api64.ipify.org?format=json",
      type: "json",
      name: "ipify64",
    },
  ];

  for (const service of services) {
    try {
      console.log(`🔄 Probando: ${service.name}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(service.url, {
        signal: controller.signal,
        headers: { Accept: "text/plain, application/json, */*" },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        if (service.type === "json") {
          const data = await response.json();
          const ip = data.ip;
          console.log(`✅ IP obtenida: ${ip}`);
          return ip;
        } else {
          const text = await response.text();
          const ip = text.trim();
          console.log(`✅ IP obtenida: ${ip}`);
          return ip;
        }
      }
    } catch (error) {
      console.log(`❌ ${service.name} falló, intentando siguiente...`);
      continue;
    }
  }

  console.log("⚠️ No se pudo obtener IP, usando valor por defecto");
  return "No disponible";
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
