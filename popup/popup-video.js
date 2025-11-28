// popup-video.js - Gestione del popup per il video di Meshtastic

document.addEventListener('DOMContentLoaded', function() {
  // Crea il popup
  createVideoPopup();
  
  // Mostra il popup dopo un breve ritardo
  setTimeout(showVideoPopup, 1000);
});

function createVideoPopup() {
  // Controlla se il popup esiste già
  if (document.getElementById('meshtastic-video-popup')) {
    return;
  }
  
  // Crea l'elemento del popup
  const popup = document.createElement('div');
  popup.id = 'meshtastic-video-popup';
  popup.className = 'video-popup';
  
  popup.innerHTML = `
    <div class="close-btn">×</div>
    <div class="popup-content">
      <p class="popup-title"><span class="popup-icon">📹</span>GUARDA ORA IL MIO VIDEO SU MESHTASTIC!!!</p>
    </div>
  `;
  
  // Aggiungi il popup al body
  document.body.appendChild(popup);
  
  // Event listener per chiudere il popup
  const closeBtn = popup.querySelector('.close-btn');
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    hideVideoPopup();
  });
  
  // Event listener per aprire il video
  popup.addEventListener('click', function() {
    openVideoOverlay();
  });
  
  // Crea l'overlay per il video
  createVideoOverlay();
}

function createVideoOverlay() {
  // Controlla se l'overlay esiste già
  if (document.getElementById('video-overlay')) {
    return;
  }
  
  // Crea l'elemento overlay
  const overlay = document.createElement('div');
  overlay.id = 'video-overlay';
  overlay.className = 'video-overlay';
  
  overlay.innerHTML = `
    <div class="video-container">
      <button class="close-video">×</button>
      <iframe src="https://www.youtube.com/embed/nkp3-EzIssU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  
  // Aggiungi l'overlay al body
  document.body.appendChild(overlay);
  
  // Event listener per chiudere l'overlay
  const closeVideoBtn = overlay.querySelector('.close-video');
  closeVideoBtn.addEventListener('click', function() {
    closeVideoOverlay();
  });
  
  // Chiudi l'overlay cliccando fuori dal video
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeVideoOverlay();
    }
  });
}

function showVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  if (popup) {
    popup.classList.add('show');
    
    // Salva che l'utente ha visto il popup in questa sessione
    sessionStorage.setItem('meshtasticPopupShown', 'true');
  }
}

function hideVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  if (popup) {
    popup.classList.remove('show');
  }
}

function openVideoOverlay() {
  const overlay = document.getElementById('video-overlay');
  if (overlay) {
    overlay.classList.add('show');
    // Metti in pausa eventuali animazioni della pagina
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoOverlay() {
  const overlay = document.getElementById('video-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    // Ripristina lo scroll della pagina
    document.body.style.overflow = '';
    
    // Ferma il video quando l'overlay viene chiuso
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src; // Ricarica l'iframe per fermare il video
    }
  }
}

// Funzione per controllare se mostrare il popup basandosi sulla sessione
function shouldShowPopup() {
  // Se l'utente ha già visto il popup in questa sessione, non mostrarlo di nuovo
  return sessionStorage.getItem('meshtasticPopupShown') !== 'true';
}

// Esponi le funzioni globalmente
window.MeshtasticVideoPopup = {
  show: showVideoPopup,
  hide: hideVideoPopup,
  shouldShow: shouldShowPopup
};