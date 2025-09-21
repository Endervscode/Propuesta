// script.js
// Control de tarjetas tipo "stack", indicadores, navegación y corazones

const cards = Array.from(document.querySelectorAll('.card'));
const progress = document.querySelector('.progress');
let current = 0;

// --- Crear indicadores (puntitos) ---
function createIndicators() {
  progress.innerHTML = '';
  for (let i = 0; i < cards.length; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    progress.appendChild(dot);
  }
}
createIndicators();
const dots = Array.from(document.querySelectorAll('.progress span'));

// --- Mostrar una tarjeta por índice ---
function showCard(index) {
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next', 'final');
    if (i === index) {
      card.classList.add('active');
    } else if (i < index) {
      card.classList.add('prev');
    } else {
      card.classList.add('next');
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}
showCard(current);

// --- Navegación segura (debounce para evitar saltos) ---
let scrolling = false;
const SCROLL_DEBOUNCE_MS = 600;

function nextCard() {
  if (current < cards.length - 1) {
    current++;
    showCard(current);
  }
}
function prevCard() {
  if (current > 0) {
    current--;
    showCard(current);
  }
}

function handleWheel(e) {
  if (scrolling) return;
  scrolling = true;
  if (e.deltaY > 0) nextCard();
  else if (e.deltaY < 0) prevCard();
  setTimeout(() => scrolling = false, SCROLL_DEBOUNCE_MS);
}
window.addEventListener('wheel', handleWheel, { passive: true });

// --- Teclado ---
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextCard();
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    prevCard();
  }
});

// --- Swipe táctil (móvil) ---
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (!e.changedTouches || !e.changedTouches[0]) return;
  const endY = e.changedTouches[0].clientY;
  const diff = touchStartY - endY;
  if (Math.abs(diff) < 40) return; // umbral pequeño
  if (diff > 0) nextCard(); // swipe up -> siguiente
  else prevCard(); // swipe down -> anterior
}, { passive: true });

// --- Hacer que los puntitos sean clicables (ir a tarjeta) ---
dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    current = i;
    showCard(current);
  });
});

// --- Botones de la última tarjeta (sí/no con WhatsApp) ---
const phoneNumber = "584128289005";
const msgYes = "Sí, Quiero ser tu novia";
const msgNo  = "No...";

document.querySelector(".yes").addEventListener("click", () => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgYes)}`;
  window.open(url, "_blank");
});

document.querySelector(".no").addEventListener("click", () => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgNo)}`;
  window.open(url, "_blank");
});

// --- Corazones flotantes (fondo) ---
function randomBetween(min, max) { return Math.random() * (max - min) + min; }

// Opcional: paleta de tonos para corazones (variar color)
const heartColors = ['#fd155aff', '#fd153fff', '#ff0776ff', '#ff2155ff'];

function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerText = '❤';

  // posición y tamaño
  heart.style.left = randomBetween(5, 95) + 'vw';
  heart.style.fontSize = randomBetween(14, 34) + 'px';

  // duración y delay para variar el movimiento
  const dur = randomBetween(3500, 7000);
  heart.style.animationDuration = dur + 'ms';
  heart.style.animationDelay = randomBetween(0, 1200) + 'ms';

  // color aleatorio (sobrescribe color del CSS si se desea)
  heart.style.color = heartColors[Math.floor(randomBetween(0, heartColors.length))];

  document.body.appendChild(heart);
  // se elimina después de la animación
  setTimeout(() => {
    heart.remove();
  }, dur + 1500);
}

// intervalo (ajusta la cadencia si lo quieres más o menos frecuente)
const HEART_INTERVAL_MS = 700;
let heartInterval = setInterval(createHeart, HEART_INTERVAL_MS);

// --- prevención cuando la ventana pierde foco (evita acumulación de timers) ---
window.addEventListener('blur', () => clearInterval(heartInterval));
window.addEventListener('focus', () => {
  clearInterval(heartInterval);
  heartInterval = setInterval(createHeart, HEART_INTERVAL_MS);
});
