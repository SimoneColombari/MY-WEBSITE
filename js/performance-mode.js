/**
 * PERFORMANCE-MODE.JS - Gestione delle modalità di visualizzazione del sito
 * 
 * Questo script gestisce tre modalità di visualizzazione:
 * - Leggero: Effetti minimi per dispositivi meno potenti
 * - Base: Effetti moderati per la maggior parte degli utenti
 * - Performance: Effetti completi per dispositivi potenti
 * 
 * La modalità leggera viene applicata automaticamente per i primi 15 secondi
 * dopo il caricamento della pagina, dopodiché l'utente può scegliere la modalità preferita.
 */

// Variabili globali per la gestione delle modalità
let currentMode = 'light';
let initialModeTimer = null;
let modeSelector = null;
let modeIndicator = null;

// Inizializza il sistema di modalità di visualizzazione
function initPerformanceMode() {
  // Crea l'indicatore di modalità in alto a destra
  createModeIndicator();
  
  // Crea il selettore di modalità in fondo alla pagina (solo su index.html)
  if (isIndexPage()) {
    createModeSelector();
  }
  
  // Carica la modalità salvata o usa la modalità leggera di default
  const savedMode = localStorage.getItem('performanceMode');
  
  // Se non c'è una modalità salvata o se è passato meno di 15 secondi dal primo caricamento,
  // usa la modalità leggera
  const firstVisitTime = localStorage.getItem('firstVisitTime');
  const now = new Date().getTime();
  
  if (!savedMode || (firstVisitTime && (now - parseInt(firstVisitTime)) < 15000)) {
    // Salva il tempo del primo caricamento se non è già stato salvato
    if (!firstVisitTime) {
      localStorage.setItem('firstVisitTime', now.toString());
    }
    
    // Imposta la modalità leggera
    setPerformanceMode('light');
    
    // Mostra il selettore dopo 15 secondi
    initialModeTimer = setTimeout(() => {
      if (isIndexPage() && modeSelector) {
        modeSelector.classList.add('show');
      }
    }, 15000);
  } else {
    // Usa la modalità salvata
    setPerformanceMode(savedMode);
    
    // Mostra subito il selettore se siamo sulla pagina index
    if (isIndexPage() && modeSelector) {
      modeSelector.classList.add('show');
    }
  }
}

// Verifica se la pagina corrente è index.html
function isIndexPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  return filename === 'index.html' || filename === '' || filename === '/';
}

// Crea l'indicatore di modalità in alto a destra
function createModeIndicator() {
  modeIndicator = document.createElement('div');
  modeIndicator.className = 'performance-indicator';
  modeIndicator.id = 'performance-indicator';
  
  // Aggiungi un evento click per mostrare/nascondere il selettore
  modeIndicator.addEventListener('click', function() {
    if (modeSelector) {
      modeSelector.classList.toggle('show');
    }
  });
  
  document.body.appendChild(modeIndicator);
}

// Crea il selettore di modalità in fondo alla pagina
function createModeSelector() {
  modeSelector = document.createElement('div');
  modeSelector.className = 'performance-mode-selector';
  modeSelector.id = 'performance-mode-selector';
  
  modeSelector.innerHTML = `
    <h4>MODALITÀ VISUALIZZAZIONE</h4>
    <p>Seleziona la modalità preferita per ottimizzare la tua esperienza:</p>
    <div class="performance-modes">
      <div class="performance-mode" data-mode="light">LEGGERO</div>
      <div class="performance-mode" data-mode="base">BASE</div>
      <div class="performance-mode" data-mode="performance">PERFORMANCE</div>
    </div>
    <button id="save-mode">SALVA PREFERENZA</button>
  `;
  
  document.body.appendChild(modeSelector);
  
  // Aggiungi gli eventi click per le modalità
  const modeButtons = modeSelector.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const mode = this.getAttribute('data-mode');
      setPerformanceMode(mode);
      
      // Aggiorna la classe active
      modeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Aggiungi l'evento click per il pulsante di salvataggio
  const saveButton = modeSelector.querySelector('#save-mode');
  saveButton.addEventListener('click', function() {
    savePerformanceMode();
  });
}

// Imposta la modalità di visualizzazione specificata
function setPerformanceMode(mode) {
  // Rimuovi tutte le classi di modalità dal body
  document.body.classList.remove('light-mode', 'base-mode', 'performance-mode');
  
  // Aggiungi la classe per la modalità specificata
  document.body.classList.add(mode + '-mode');
  
  // Aggiorna la variabile globale
  currentMode = mode;
  
  // Aggiorna il testo dell'indicatore
  if (modeIndicator) {
    let modeText = '';
    switch (mode) {
      case 'light':
        modeText = 'LEGGERO';
        break;
      case 'base':
        modeText = 'BASE';
        break;
      case 'performance':
        modeText = 'PERFORMANCE';
        break;
    }
    modeIndicator.textContent = modeText;
  }
  
  // Aggiorna la selezione nel selettore se esiste
  if (modeSelector) {
    const modeButtons = modeSelector.querySelectorAll('.performance-mode');
    modeButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-mode') === mode) {
        button.classList.add('active');
      }
    });
  }
  
  // Chiama la funzione specifica della pagina se esiste
  if (typeof window.onPerformanceModeChange === 'function') {
    window.onPerformanceModeChange(mode);
  }
  
  // Regola le particelle in base alla modalità
  adjustParticles(mode);
}

// Salva la modalità di visualizzazione preferita
function savePerformanceMode() {
  localStorage.setItem('performanceMode', currentMode);
  
  // Mostra un messaggio di conferma
  const confirmation = document.createElement('div');
  confirmation.style.position = 'fixed';
  confirmation.style.bottom = '20px';
  confirmation.style.left = '50%';
  confirmation.style.transform = 'translateX(-50%)';
  confirmation.style.background = 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)';
  confirmation.style.color = 'white';
  confirmation.style.padding = '10px 20px';
  confirmation.style.borderRadius = '30px';
  confirmation.style.fontFamily = 'Orbitron, sans-serif';
  confirmation.style.fontWeight = '700';
  confirmation.style.zIndex = '10000';
  confirmation.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.4)';
  confirmation.style.opacity = '0';
  confirmation.style.transition = 'opacity 0.3s ease';
  confirmation.textContent = 'Preferenza salvata con successo!';
  
  document.body.appendChild(confirmation);
  
  // Animazione di entrata
  setTimeout(() => {
    confirmation.style.opacity = '1';
  }, 10);
  
  // Rimuovi il messaggio dopo 3 secondi
  setTimeout(() => {
    confirmation.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(confirmation)) {
        document.body.removeChild(confirmation);
      }
    }, 300);
  }, 3000);
}

// Regola le particelle in base alla modalità
function adjustParticles(mode) {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  // Rimuovi tutte le particelle esistenti
  particlesContainer.innerHTML = '';
  
  // Determina il numero di particelle in base alla modalità
  let particleCount = 0;
  switch (mode) {
    case 'light':
      particleCount = 10;
      break;
    case 'base':
      particleCount = 20;
      break;
    case 'performance':
      particleCount = 30;
      break;
  }
  
  // Crea le nuove particelle
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posizione casuale
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Dimensione casuale
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Animazione casuale
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = delay + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Funzione pubblica per cambiare modalità da altre parti del codice
window.changePerformanceMode = function(mode) {
  if (['light', 'base', 'performance'].includes(mode)) {
    setPerformanceMode(mode);
  }
};

// Funzione pubblica per ottenere la modalità corrente
window.getCurrentPerformanceMode = function() {
  return currentMode;
};

// Inizializza il sistema quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  initPerformanceMode();
});

// Pulisci il timer quando la pagina viene scaricata
window.addEventListener('beforeunload', function() {
  if (initialModeTimer) {
    clearTimeout(initialModeTimer);
  }
});