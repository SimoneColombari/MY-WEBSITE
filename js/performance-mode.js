/**
 * Sistema di Gestione delle Modalità di Performance
 * Gestisce tre modalità: leggero, base, performance
 * - Parte sempre da modalità "leggero" per i primi 15 secondi
 * - Mostra un popup di selezione solo in index.html
 * - Mantiene la modalità selezionata tra le pagine
 */

(function() {
  'use strict';
  
  // Configurazione
  const CONFIG = {
    STORAGE_KEY: 'performance_mode',
    DEFAULT_MODE: 'light',
    AUTO_SWITCH_DELAY: 15000, // 15 secondi
    MODES: {
      light: {
        name: 'Leggero',
        description: 'Effetti minimi per massima compatibilità',
        particles: 10
      },
      base: {
        name: 'Base',
        description: 'Bilanciamento tra effetti e performance',
        particles: 30
      },
      performance: {
        name: 'Performance',
        description: 'Tutti gli effetti visivi attivi',
        particles: 50
      }
    }
  };
  
  // Stato globale
  let currentMode = CONFIG.DEFAULT_MODE;
  let hasShownPopup = false;
  let autoSwitchTimer = null;
  
  /**
   * Inizializza il sistema di modalità
   */
  function initPerformanceMode() {
    // Carica la modalità salvata o usa quella di default
    const savedMode = localStorage.getItem(CONFIG.STORAGE_KEY);
    
    // Se siamo in index.html e non c'è una modalità salvata, mostra il popup
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname.endsWith('/');
    
    if (isIndexPage && !savedMode) {
      // Inizia con modalità leggera
      currentMode = 'light';
      applyMode(currentMode);
      
      // Mostra il popup dopo 15 secondi
      autoSwitchTimer = setTimeout(() => {
        showModePopup();
      }, CONFIG.AUTO_SWITCH_DELAY);
    } else {
      // Usa la modalità salvata o quella di default
      currentMode = savedMode || CONFIG.DEFAULT_MODE;
      applyMode(currentMode);
    }
    
    // Crea gli elementi UI
    createModeSelector();
    createModeIndicator();
    
    // Aggiorna particelle
    adjustParticles(currentMode);
  }
  
  /**
   * Mostra il popup di selezione modalità
   */
  function showModePopup() {
    if (hasShownPopup) return;
    hasShownPopup = true;
    
    // Crea il popup
    const popup = document.createElement('div');
    popup.className = 'performance-mode-popup';
    popup.innerHTML = `
      <div class="performance-mode-popup-content">
        <h2>⚡ Modalità Performance</h2>
        <p>Scegli la modalità di visualizzazione che preferisci per un'esperienza ottimale:</p>
        <div class="performance-mode-options">
          <div class="performance-mode-option" data-mode="light">
            <h3>🌙 Leggero</h3>
            <p>Effetti minimi, massima compatibilità</p>
          </div>
          <div class="performance-mode-option" data-mode="base">
            <h3>⚖️ Base</h3>
            <p>Bilanciamento ottimale</p>
          </div>
          <div class="performance-mode-option" data-mode="performance">
            <h3>🚀 Performance</h3>
            <p>Esperienza completa</p>
          </div>
        </div>
        <button class="performance-mode-popup-button">Conferma Selezione</button>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    // Mostra il popup con animazione
    setTimeout(() => {
      popup.classList.add('show');
    }, 100);
    
    // Gestione selezione modalità
    const options = popup.querySelectorAll('.performance-mode-option');
    let selectedMode = currentMode;
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedMode = option.getAttribute('data-mode');
      });
    });
    
    // Seleziona la modalità corrente
    popup.querySelector(`[data-mode="${currentMode}"]`).classList.add('selected');
    
    // Gestione conferma
    const confirmButton = popup.querySelector('.performance-mode-popup-button');
    confirmButton.addEventListener('click', () => {
      currentMode = selectedMode;
      saveMode(currentMode);
      applyMode(currentMode);
      adjustParticles(currentMode);
      updateModeIndicator();
      updateModeSelector();
      
      // Chiudi il popup
      popup.classList.remove('show');
      setTimeout(() => {
        popup.remove();
      }, 500);
    });
  }
  
  /**
   * Crea il selettore di modalità (visibile solo in index.html)
   */
  function createModeSelector() {
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname.endsWith('/');
    
    if (!isIndexPage) return;
    
    const selector = document.createElement('div');
    selector.className = 'performance-mode-selector';
    selector.innerHTML = `
      <h4>⚙️ Modalità</h4>
      <p>Regola gli effetti visivi del sito</p>
      <div class="performance-modes">
        <div class="performance-mode" data-mode="light">Leggero</div>
        <div class="performance-mode" data-mode="base">Base</div>
        <div class="performance-mode" data-mode="performance">Performance</div>
      </div>
      <button>Applica</button>
    `;
    
    document.body.appendChild(selector);
    
    // Gestione selezione
    const modes = selector.querySelectorAll('.performance-mode');
    const applyButton = selector.querySelector('button');
    
    modes.forEach(mode => {
      mode.addEventListener('click', () => {
        modes.forEach(m => m.classList.remove('active'));
        mode.classList.add('active');
      });
    });
    
    // Seleziona la modalità corrente
    selector.querySelector(`[data-mode="${currentMode}"]`).classList.add('active');
    
    // Gestione applicazione
    applyButton.addEventListener('click', () => {
      const selectedMode = selector.querySelector('.performance-mode.active').getAttribute('data-mode');
      currentMode = selectedMode;
      saveMode(currentMode);
      applyMode(currentMode);
      adjustParticles(currentMode);
      updateModeIndicator();
      
      // Cancella il timer di auto-switch se esiste
      if (autoSwitchTimer) {
        clearTimeout(autoSwitchTimer);
        autoSwitchTimer = null;
      }
    });
  }
  
  /**
   * Crea l'indicatore di modalità
   */
  function createModeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'performance-indicator';
    indicator.id = 'performance-indicator';
    indicator.textContent = `Modalità: ${CONFIG.MODES[currentMode].name}`;
    
    document.body.appendChild(indicator);
    
    // Click per aprire il selettore (solo in index.html)
    indicator.addEventListener('click', () => {
      const selector = document.querySelector('.performance-mode-selector');
      if (selector) {
        selector.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });
  }
  
  /**
   * Aggiorna l'indicatore di modalità
   */
  function updateModeIndicator() {
    const indicator = document.getElementById('performance-indicator');
    if (indicator) {
      indicator.textContent = `Modalità: ${CONFIG.MODES[currentMode].name}`;
    }
  }
  
  /**
   * Aggiorna il selettore di modalità
   */
  function updateModeSelector() {
    const selector = document.querySelector('.performance-mode-selector');
    if (!selector) return;
    
    const modes = selector.querySelectorAll('.performance-mode');
    modes.forEach(mode => {
      mode.classList.remove('active');
      if (mode.getAttribute('data-mode') === currentMode) {
        mode.classList.add('active');
      }
    });
  }
  
  /**
   * Applica la modalità selezionata
   */
  function applyMode(mode) {
    // Rimuovi tutte le classi di modalità dal body
    document.body.classList.remove('light-mode', 'base-mode', 'performance-mode');
    
    // Aggiungi la classe corrispondente
    document.body.classList.add(`${mode}-mode`);
    
    // Notifica il cambio di modalità alla pagina
    if (typeof window.onPerformanceModeChange === 'function') {
      window.onPerformanceModeChange(mode);
    }
    
    console.log(`Modalità applicata: ${CONFIG.MODES[mode].name}`);
  }
  
  /**
   * Salva la modalità nel localStorage
   */
  function saveMode(mode) {
    localStorage.setItem(CONFIG.STORAGE_KEY, mode);
  }
  
  /**
   * Regola il numero di particelle in base alla modalità
   */
  function adjustParticles(mode) {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Rimuovi particelle esistenti
    particlesContainer.innerHTML = '';
    
    // Crea nuove particelle in base alla modalità
    const particleCount = CONFIG.MODES[mode].particles;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      particlesContainer.appendChild(particle);
    }
  }
  
  // Esporta la funzione di inizializzazione
  window.initPerformanceMode = initPerformanceMode;
  
  // Inizializza automaticamente quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMode);
  } else {
    initPerformanceMode();
  }
})();