// performance-mode.js - Gestione centralizzata delle modalità di visualizzazione

// Funzione per rilevare il tipo di dispositivo
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Rileva dispositivi Apple
  if (/iPad|iPhone|iPod/.test(userAgent) || /Mac/.test(userAgent)) {
    return 'performance';
  }
  
  // Rileva Android
  if (/android/i.test(userAgent)) {
    // Controlla la versione di Android per determinare la modalità
    const match = userAgent.match(/Android (\d+(?:\.\d+)?)/);
    if (match) {
      const version = parseFloat(match[1]);
      // Android 10 o più recente potrebbe gestire meglio le animazioni
      return version >= 10 ? 'base' : 'light';
    }
    return 'light';
  }
  
  // Rileva Windows
  if (/Win/.test(userAgent)) {
    // Controlla se è un dispositivo Windows meno recente
    // Questa è una stima approssimativa
    return 'base';
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
    
    // Mostra il selettore per un breve periodo per permettere all'utente di cambiare
    setTimeout(() => {
      const selector = document.getElementById('performance-mode-selector');
      if (selector) {
        selector.classList.add('show');
        
        // Imposta il pulsante corretto come attivo
        const modeButton = selector.querySelector(`.performance-mode[data-mode="${savedMode}"]`);
        if (modeButton) {
          modeButton.classList.add('active');
        }
        
        // Nascondi il selettore dopo 10 secondi
        setTimeout(() => {
          selector.classList.remove('show');
        }, 10000);
      }
    }, 2000);
  } else {
    // Rileva automaticamente il dispositivo e imposta la modalità appropriata
    const detectedMode = detectDevice();
    setPerformanceMode(detectedMode);
    
    // Mostra il selettore per permettere all'utente di cambiare
    setTimeout(() => {
      const selector = document.getElementById('performance-mode-selector');
      if (selector) {
        selector.classList.add('show');
        
        // Imposta il pulsante corretto come attivo
        const modeButton = selector.querySelector(`.performance-mode[data-mode="${detectedMode}"]`);
        if (modeButton) {
          modeButton.classList.add('active');
        }
        
        // Nascondi il selettore dopo 10 secondi
        setTimeout(() => {
          selector.classList.remove('show');
        }, 10000);
      }
    }, 2000);
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
  adjustParticles: adjustParticles
};