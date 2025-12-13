// popup-video.js - Management of the popup for the Meshtastic video

document.addEventListener('DOMContentLoaded', function() {
  // Create the popup
  createVideoPopup();
  
  // Show the popup after a short delay
  setTimeout(showVideoPopup, 1000);
});

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1) || (window.innerWidth <= 768);
}

function createVideoPopup() {
  // Check if the popup already exists
  if (document.getElementById('meshtastic-video-popup')) {
    return;
  }
  
  // Create the popup element
  const popup = document.createElement('div');
  popup.id = 'meshtastic-video-popup';
  // Start in the 'tab-only' state on mobile, hidden on desktop
  popup.className = isMobileDevice() ? 'video-popup tab-only' : 'video-popup';
  
  // The close-btn has been removed from the HTML
  popup.innerHTML = `
    <div class="popup-content">
      <img src="https://img.youtube.com/vi/nkp3-EzIssU/mqdefault.jpg" alt="Meshtastic video cover" class="popup-thumbnail">
      <div class="popup-text">
        <p class="popup-title"><span class="popup-icon">📹</span>WATCH MY VIDEO ON MESHTASTIC NOW!!!</p>
      </div>
    </div>
    <div class="popup-tab">📹</div>
  `;
  
  // Add the popup to the body
  document.body.appendChild(popup);
  
  // Event listener to open the video from the main content
  const popupContent = popup.querySelector('.popup-content');
  popupContent.addEventListener('click', function(e) {
    e.stopPropagation();
    openVideoOverlay();
  });

  // Event listener for the tab to reopen the popup
  const tab = popup.querySelector('.popup-tab');
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
  
  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.id = 'video-overlay';
  overlay.className = 'video-overlay';
  
  overlay.innerHTML = `
    <div class="video-container">
      <button class="close-video">×</button>
      <iframe src="https://www.youtube.com/embed/nkp3-EzIssU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
  
  // Add the overlay to the body
  document.body.appendChild(overlay);
  
  // Event listener to close the overlay
  const closeVideoBtn = overlay.querySelector('.close-video');
  closeVideoBtn.addEventListener('click', function() {
    closeVideoOverlay();
  });
  
  // Close the overlay by clicking outside the video
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeVideoOverlay();
    }
  });
}

function showVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  if (popup) {
    // Remove the 'tab-only' class and add the 'show' class
    popup.classList.remove('tab-only');
    popup.classList.add('show');
    
    // Save that the user has seen the popup in this session
    sessionStorage.setItem('meshtasticPopupShown', 'true');
    
    // On mobile devices, auto-hide the popup after 2 seconds
    if (isMobileDevice()) {
      setTimeout(() => {
        // Only hide if it's not already in the 'tab-only' state
        if (popup.classList.contains('show')) {
          hideVideoPopup();
        }
      }, 2000);
    }
  }
}

function hideVideoPopup() {
  const popup = document.getElementById('meshtastic-video-popup');
  if (popup) {
    // Remove the 'show' class
    popup.classList.remove('show');
    
    // On mobile, add the 'tab-only' class to show the tab
    if (isMobileDevice()) {
      popup.classList.add('tab-only');
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
    
    // Stop the video when the overlay is closed
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src; // Reload the iframe to stop the video
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