/**
 * ==========================================================================
 * MAIN.JS - Lógica Global del Portafolio
 * Portafolio Profesional de Carolina Robles (Tema Cinematográfico)
 * 1. Control del Menú Móvil (Hamburguesa)
 * 2. Resaltado automático del enlace activo en la Navegación Superior
 * 3. Actualización dinámica del año en el Footer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar funciones globales
  initMobileMenu();
  setActiveNavLink();
  setCurrentYear();
});

/**
 * 1. Control del Menú Móvil
 * Abre y cierra la navegación en dispositivos móviles al hacer clic en el botón hamburguesa.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!menuToggle || !navMenu) return;

  // Alternar apertura y cierre del menú
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Cerrar el menú al hacer clic en cualquiera de los enlaces de navegación
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar el menú al hacer clic fuera del header
  document.addEventListener('click', (event) => {
    const isClickInside = menuToggle.contains(event.target) || navMenu.contains(event.target);
    if (!isClickInside && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 2. Enlace Activo Automático
 * Detecta la página actual y asigna .active a los botones de navegación superior (.nav-link).
 */
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  // Obtener el nombre del archivo actual
  let currentPath = window.location.pathname.split(/[/\\]/).pop();

  // Si la ruta está vacía o es la raíz, corresponde a index.html
  if (!currentPath || currentPath === 'index') {
    currentPath = 'index.html';
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * 3. Año Dinámico del Footer
 * Inserta automáticamente el año en curso en el elemento con id="current-year".
 */
function setCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
