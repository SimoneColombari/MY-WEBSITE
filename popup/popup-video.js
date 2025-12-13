// popup-video.js - Management of the popup for the Meshtastic video

document.addEventListener('DOMContentLoaded', function() {
  // Create the popup and the tab
  createVideoPopupAndTab();
  
  // Show the popup after a short delay
  setTimeout(showVideoPopup, 1000);
});

function isMobileDevice() {
  // A simple check for mobile devices
  return window.innerWidth <= 768;
}

function createVideoPopupAndTab() {
  // Check if the elements already exist
  if (document.getElementById('meshtastic-video-popup')) {
    return;
  }

  // 1. Create the main popup element
  const popup = document.createElement('div');
  popup.id = 'meshtastic-video-popup';
  popup.className = 'video-popup'; // It starts hidden
  
  popup.innerHTML = `
    <div class="popup-content">
      <img src="https://img.youtube.com/vi/nkp3-EzIssU/mqdefault.jpg" alt="Meshtastic video cover" class="popup-thumbnail">
      <div class="popup-text">
        <p class="popup-title"><span class="popup-icon">📹</span>WATCH MY VIDEO ON MESHTASTIC NOW!!!</p>
      </div>
    </div>
  `;
  
  // Add the popup to the body
  document.body.appendChild(popup);
  
  // Event listener to open the video
  popup.addEventListener('click', function(e) {
    e.stopPropagation();
    openVideoOverlay();
  });

  // 2. Create the tab element (SEPARATE from the popup)
  const tab = document.createElement('div');
  tab.id = 'meshtastic-video-tab';
  tab.className = 'popup-tab';
  tab.innerHTML = '📹';
  
  // Add the tab to the body
  document.body.appendChild(tab);

  // Event listener for the tab to reopen the popup
  tab.addEventListener('click', function(e) {
    e.stopPropagation();
    showVideoPopup();
  });
  
  // Create the video overlay
  createVideoOverlay();
}

function createVideoOverlay() {
  // Check if the overlay already exists
  if (document.getElementById('video-overlay')) {
    return;
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'video-overlay';
  overlay.className = 'video-overlay';
  
  overlay.innerHTML = `
    <div class="video-container">
      <button class="close-video">×</button>
      <iframe src="https://www.youtube.com/embed/nkp3-EzIssU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  const closeVideoBtn = overlay.querySelector('.close-video');
  closeVideoBtn.addEventListener('click', closeVideoOverlay);
  
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeVideoOverlay();
    }
  });
}

function showVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  const tab = document.getElementById('meshtastic-video-tab');

  if (popup) {
    popup.classList.add('show');
    
    // On mobile, hide the tab when the popup is visible
    if (isMobileDevice() && tab) {
      tab.style.display = 'none';
    }
    
    sessionStorage.setItem('meshtasticPopupShown', 'true');
    
    // On mobile, auto-hide the popup after 2 seconds
    if (isMobileDevice()) {
      setTimeout(() => {
        // Only hide if it's currently shown
        if (popup.classList.contains('show')) {
          hideVideoPopup();
        }
      }, 2000);
    }
  }
}

function hideVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  const tab = document.getElementById('meshtastic-video-tab');

  if (popup) {
    popup.classList.remove('show');
    
    // On mobile, show the tab again when the popup is hidden
    if (isMobileDevice() && tab) {
      tab.style.display = 'flex';
    }
  }
}

function openVideoOverlay() {
  const overlay = document.getElementById('video-overlay');
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoOverlay() {
  const overlay = document.getElementById('video-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src;
    }
  }
}

function shouldShowPopup() {
  return sessionStorage.getItem('meshtasticPopupShown') !== 'true';
}

// Expose functions globally
window.MeshtasticVideoPopup = {
  show: showVideoPopup,
  hide: hideVideoPopup,
  shouldShow: shouldShowPopup
};