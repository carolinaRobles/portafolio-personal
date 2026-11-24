/**
 * ==========================================================================
 * CONTACT.JS - Lógica de la Página de Contacto
 * Portafolio Profesional de Carolina Robles (Vanilla JS)
 * Funcionalidad:
 * 1. Copiar dirección de correo al portapapeles con feedback visual.
 * 2. Validación de campos del formulario en el navegador (Vanilla JS).
 * 3. Envío directo sin backend vía cliente de correo (mailto:).
 * 4. Envío directo sin backend vía WhatsApp Web / API (wa.me).
 * ==========================================================================
 */

// Configuración de datos de contacto de Carolina Robles
const CONTACT_CONFIG = {
  email: 'cmichell1979@gmail.com',
  phone: '593984660901' // Formato internacional Ecuador: +593 98 466 0901
};

document.addEventListener('DOMContentLoaded', () => {
  initCopyEmail();
  initContactForm();
});

/**
 * 1. Copiar Correo al Portapapeles
 * Permite al visitante copiar el correo con un solo clic y muestra retroalimentación visual.
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const originalText = copyBtn.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_CONFIG.email);
      } else {
        // Método alternativo de respaldo (fallback)
        const tempInput = document.createElement('textarea');
        tempInput.value = CONTACT_CONFIG.email;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Feedback visual temporal
      copyBtn.textContent = '¡Correo copiado!';
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-outline');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-outline');
      }, 2500);

    } catch (err) {
      console.error('Error al copiar el correo:', err);
      showFeedback('No se pudo copiar automáticamente. Por favor cópialo manualmente: ' + CONTACT_CONFIG.email, 'error');
    }
  });
}

/**
 * 2. Validación y Envíos del Formulario
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');

  if (!form) return;

  // Evento A: Envío por Correo Electrónico (Submit del formulario -> mailto)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = getFormData();
    if (!validateFormData(data)) return;

    // Construir enlace mailto: con asunto y cuerpo codificados
    const mailtoSubject = encodeURIComponent(`[Portafolio Carolina Robles] ${data.subject}`);
    const mailtoBody = encodeURIComponent(
      `Hola Carolina, mi nombre es ${data.name}.\n\n` +
      `Mensaje:\n${data.message}\n\n` +
      `Puedes responder a mi correo: ${data.email}`
    );

    const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    showFeedback('¡Abriendo tu cliente de correo para enviar el mensaje a Carolina!', 'success');
    
    // Abrir cliente de correo
    window.location.href = mailtoUrl;
  });

  // Evento B: Envío por WhatsApp
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const data = getFormData();
      if (!validateFormData(data)) return;

      // Construir mensaje estructurado para WhatsApp
      const waText = encodeURIComponent(
        `👋 *Nuevo mensaje desde tu Portafolio Profesional*\n\n` +
        `👤 *Nombre:* ${data.name}\n` +
        `📧 *Correo:* ${data.email}\n` +
        `📌 *Asunto:* ${data.subject}\n\n` +
        `💬 *Mensaje:*\n${data.message}`
      );

      const waUrl = `https://wa.me/${CONTACT_CONFIG.phone}?text=${waText}`;

      showFeedback('¡Redirigiendo a WhatsApp con tu mensaje preparado!', 'success');

      // Abrir WhatsApp en una nueva pestaña
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
}

/**
 * Obtiene los valores actuales de los campos del formulario
 */
function getFormData() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    subject: subjectInput ? subjectInput.value.trim() : '',
    message: messageInput ? messageInput.value.trim() : ''
  };
}

/**
 * Valida los datos del formulario mostrando mensajes en #form-feedback
 */
function validateFormData(data) {
  // Validación de campos vacíos
  if (!data.name) {
    showFeedback('Por favor, ingresa tu nombre completo.', 'error');
    focusField('name');
    return false;
  }

  if (!data.email) {
    showFeedback('Por favor, ingresa tu dirección de correo electrónico.', 'error');
    focusField('email');
    return false;
  }

  // Validación de formato de correo con expresión regular estándar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showFeedback('Por favor, ingresa un correo electrónico válido (ejemplo: usuario@correo.com).', 'error');
    focusField('email');
    return false;
  }

  if (!data.subject) {
    showFeedback('Por favor, ingresa el asunto de tu mensaje.', 'error');
    focusField('subject');
    return false;
  }

  if (!data.message) {
    showFeedback('Por favor, escribe el contenido de tu mensaje.', 'error');
    focusField('message');
    return false;
  }

  return true;
}

/**
 * Muestra alertas visuales de éxito o error en el contenedor #form-feedback
 */
function showFeedback(message, type) {
  const feedback = document.getElementById('form-feedback');
  if (!feedback) return;

  feedback.textContent = message;
  feedback.className = `form-feedback show ${type}`;

  // Si es mensaje de éxito, limpiarlo tras 6 segundos
  if (type === 'success') {
    setTimeout(() => {
      feedback.className = 'form-feedback';
      feedback.textContent = '';
    }, 6000);
  }
}

/**
 * Lleva el foco al campo correspondiente
 */
function focusField(id) {
  const field = document.getElementById(id);
  if (field) {
    field.focus();
  }
}
