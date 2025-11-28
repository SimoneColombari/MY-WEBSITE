// performance-mode.js - Gestione centralizzata delle modalità di visualizzazione

// Funzione per rilevare il tipo di dispositivo
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Rileva dispositivi mobili
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    // Per i dispositivi mobili, usa la modalità leggera di default
    return 'light';
  }
  
  // Default per altri dispositivi
  return 'base';
}

// Funzione per regolare le particelle in base alla modalità
function adjustParticles(mode) {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  let particleCount;
  switch (mode) {
    case 'light':
      particleCount = 0; // Nessuna particella in modalità leggera
      break;
    case 'base':
      particleCount = 15;
      break;
    case 'performance':
      particleCount = 30;
      break;
    default:
      particleCount = 15;
  }
  
  // Rimuovi tutte le particelle esistenti
  particlesContainer.innerHTML = '';
  
  // Crea nuove particelle solo se non siamo in modalità leggera
  if (particleCount > 0) {
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);
    }
  }
}

// Funzione per regolare gli effetti dinamici in base alla modalità
function adjustDynamicEffects(mode) {
  // Gestione delle onde energetiche
  const wavesContainer = document.getElementById('energy-waves');
  if (wavesContainer) {
    if (mode === 'light') {
      wavesContainer.style.display = 'none';
    } else {
      wavesContainer.style.display = 'block';
      if (mode === 'base') {
        wavesContainer.style.opacity = '0.1';
      } else { // performance
        wavesContainer.style.opacity = '0.3';
      }
    }
  }
  
  // Gestione del mouse follow (se esiste)
  // IMPORTANTE: Assicurati che l'elemento HTML del mouse follow abbia l'ID "mouse-follow"
  const mouseFollow = document.getElementById('mouse-follow');
  if (mouseFollow) {
    if (mode === 'light') {
      mouseFollow.style.display = 'none';
      // Disabilita anche gli event listener del mouse follow se esistono
      if (typeof disableMouseFollow === 'function') {
        disableMouseFollow();
      }
    } else {
      mouseFollow.style.display = 'block';
      if (mode === 'base') {
        mouseFollow.style.opacity = '0.5';
      } else { // performance
        mouseFollow.style.opacity = '1';
      }
      // Riabilita gli event listener del mouse follow se esistono
      if (typeof enableMouseFollow === 'function') {
        enableMouseFollow();
      }
    }
  }
  
  // Gestione di altri effetti dinamici che potrebbero essere presenti
  // Aggiungi la classe "dynamic-effect" a qualsiasi elemento che debba essere nascosto in modalità leggera
  const dynamicElements = document.querySelectorAll('.dynamic-effect');
  dynamicElements.forEach(element => {
    if (mode === 'light') {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
      if (mode === 'base') {
        element.style.opacity = '0.5';
      } else { // performance
        element.style.opacity = '1';
      }
    }
  });
}

// Funzione per impostare la modalità di performance
function setPerformanceMode(mode) {
  // Rimuovi tutte le classi di modalità
  document.body.classList.remove('light-mode', 'base-mode', 'performance-mode');
  
  // Aggiungi la classe corrispondente alla modalità
  document.body.classList.add(mode + '-mode');
  
  // Salva la preferenza dell'utente
  localStorage.setItem('performanceMode', mode);
  
  // Aggiorna l'indicatore di modalità
  updateModeIndicator(mode);
  
  // Regola il numero di particelle in base alla modalità
  adjustParticles(mode);
  
  // Regola gli effetti dinamici in base alla modalità
  adjustDynamicEffects(mode);
  
  // Mostra una notifica
  showNotification(`Modalità ${mode === 'light' ? 'leggera' : mode === 'base' ? 'base' : 'performance'} attivata`);
  
  // Esegui funzioni specifiche della pagina se definite
  if (typeof window.onPerformanceModeChange === 'function') {
    window.onPerformanceModeChange(mode);
  }
}

// Funzione per aggiornare l'indicatore di modalità
function updateModeIndicator(mode) {
  const indicator = document.getElementById('performance-indicator');
  if (indicator) {
    indicator.textContent = mode === 'light' ? 'LEGGERA' : mode === 'base' ? 'BASE' : 'PERFORMANCE';
  }
}

// Funzione per mostrare una notifica
function showNotification(message) {
  // Rimuovi notifiche esistenti
  const existingNotification = document.querySelector('.performance-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Crea una nuova notifica
  const notification = document.createElement('div');
  notification.className = 'performance-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #FF5722 0%, #ff8a50 100%);
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    font-family: 'Orbitron', sans-serif;
    font-weight: 700;
    font-size: 0.8em;
    z-index: 10000;
    box-shadow: 0 5px 15px rgba(255, 87, 34, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Mostra la notifica
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  // Nascondi la notifica dopo 3 secondi
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Crea l'indicatore di modalità
function createModeIndicator() {
  // Verifica se l'indicatore esiste già
  if (document.getElementById('performance-indicator')) {
    return;
  }
  
  const indicator = document.createElement('div');
  indicator.id = 'performance-indicator';
  indicator.textContent = 'BASE';
  indicator.addEventListener('click', function() {
    const selector = document.getElementById('performance-mode-selector');
    if (selector) {
      selector.classList.toggle('show');
    }
  });
  document.body.appendChild(indicator);
}

// Crea il popup di selezione modalità iniziale
function createInitialModePopup() {
  // Verifica se il popup esiste già
  if (document.getElementById('initial-mode-popup')) {
    return;
  }
  
  const popup = document.createElement('div');
  popup.id = 'initial-mode-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Seleziona la Modalità di Visualizzazione</h3>
      <p>Scegli la modalità preferita per ottimizzare le prestazioni del sito</p>
      <div class="performance-modes">
        <div class="performance-mode" data-mode="light">
          <div class="mode-icon">⚡</div>
          <div class="mode-name">Leggera</div>
          <div class="mode-desc">Nessuna animazione</div>
        </div>
        <div class="performance-mode" data-mode="base">
          <div class="mode-icon">🎯</div>
          <div class="mode-name">Base</div>
          <div class="mode-desc">Animazioni ridotte</div>
        </div>
        <div class="performance-mode" data-mode="performance">
          <div class="mode-icon">🚀</div>
          <div class="mode-name">Performance</div>
          <div class="mode-desc">Animazioni complete</div>
        </div>
      </div>
      <div class="popup-footer">
        <span id="popup-timer">5</span> secondi alla selezione automatica
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Aggiungi event listener per i pulsanti di modalità
  const modeButtons = popup.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Imposta la modalità corrispondente
      setPerformanceMode(this.getAttribute('data-mode'));
      
      // Rimuovi il popup
      popup.style.opacity = '0';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    });
  });
  
  // Timer per la selezione automatica
  let countdown = 5;
  const timerElement = document.getElementById('popup-timer');
  const countdownInterval = setInterval(() => {
    countdown--;
    if (timerElement) {
      timerElement.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      
      // Rileva automaticamente il dispositivo e imposta la modalità appropriata
      const detectedMode = detectDevice();
      setPerformanceMode(detectedMode);
      
      // Rimuovi il popup
      popup.style.opacity = '0';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    }
  }, 1000);
}

// Crea il selettore di modalità
function createModeSelector() {
  // Verifica se il selettore esiste già
  if (document.getElementById('performance-mode-selector')) {
    return;
  }
  
  const selector = document.createElement('div');
  selector.id = 'performance-mode-selector';
  selector.innerHTML = `
    <h4>Modalità Visualizzazione</h4>
    <p>Seleziona la modalità preferita per ottimizzare le prestazioni del sito</p>
    <div class="performance-modes">
      <div class="performance-mode" data-mode="light">Leggera</div>
      <div class="performance-mode" data-mode="base">Base</div>
      <div class="performance-mode" data-mode="performance">Performance</div>
    </div>
    <button id="save-performance-mode">Salva Preferenza</button>
  `;
  document.body.appendChild(selector);
  
  // Aggiungi event listener per i pulsanti di modalità
  const modeButtons = selector.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Rimuovi la classe active da tutti i pulsanti
      modeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Aggiungi la classe active al pulsante cliccato
      this.classList.add('active');
      
      // Imposta la modalità corrispondente
      setPerformanceMode(this.getAttribute('data-mode'));
    });
  });
  
  // Aggiungi event listener per il pulsante di salvataggio
  document.getElementById('save-performance-mode').addEventListener('click', function() {
    selector.classList.remove('show');
    showNotification('Preferenza salvata con successo');
  });
}

// Inizializza il sistema di modalità
function initPerformanceMode() {
  // Crea l'indicatore e il selettore di modalità
  createModeIndicator();
  createModeSelector();
  
  // Controlla se l'utente ha già una preferenza salvata
  const savedMode = localStorage.getItem('performanceMode');
  
  if (savedMode) {
    // Usa la preferenza salvata
    setPerformanceMode(savedMode);
  } else {
    // Mostra il popup iniziale per la selezione della modalità
    createInitialModePopup();
  }
}

// Inizializza il sistema quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  initPerformanceMode();
});

// Esponi le funzioni globalmente per poterle utilizzare da altre parti del codice
window.PerformanceMode = {
  setMode: setPerformanceMode,
  getCurrentMode: function() {
    return localStorage.getItem('performanceMode') || 'base';
  },
  adjustParticles: adjustParticles,
  adjustDynamicEffects: adjustDynamicEffects
};