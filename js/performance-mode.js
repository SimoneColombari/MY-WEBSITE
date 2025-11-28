// Crea il popup di selezione modalità iniziale
function createInitialModePopup() {
  // Verifica se il popup esiste già
  if (document.getElementById('initial-mode-popup')) {
    return;
  }
  
  let selectedMode = 'light'; // Modalità predefinita - il sito parte sempre in light
  
  const popup = document.createElement('div');
  popup.id = 'initial-mode-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Seleziona la Modalità di Visualizzazione</h3>
      <p>Scegli la modalità preferita per ottimizzare le prestazioni del sito</p>
      <div class="performance-modes">
        <div class="performance-mode active" data-mode="light">
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
        Tra <span id="popup-timer">15</span> secondi verrà applicata la modalità selezionata
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Mostra il popup con una piccola animazione
  setTimeout(() => {
    popup.classList.add('show');
  }, 100);
  
  // Aggiungi event listener per i pulsanti di modalità
  const modeButtons = popup.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Rimuovi la classe active da tutti i pulsanti
      modeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Aggiungi la classe active al pulsante cliccato
      this.classList.add('active');
      
      // Salva la modalità selezionata
      selectedMode = this.getAttribute('data-mode');
      
      // Mostra una notifica per la selezione
      const modeName = selectedMode === 'light' ? 'leggera' : selectedMode === 'base' ? 'base' : 'performance';
      showNotification(`Modalità ${modeName} selezionata - verrà applicata tra ${countdown} secondi`);
    });
  });
  
  // Timer per l'applicazione automatica dopo 15 secondi
  let countdown = 15;
  const timerElement = document.getElementById('popup-timer');
  const countdownInterval = setInterval(() => {
    countdown--;
    if (timerElement) {
      timerElement.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      
      // Applica la modalità selezionata
      // IMPORTANTE: Questo passerà dalla modalità light a quella selezionata
      setPerformanceMode(selectedMode);
      
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