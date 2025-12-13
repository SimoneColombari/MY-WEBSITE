// popup-video.js - Management of the popup for the Meshtastic video

document.addEventListener('DOMContentLoaded', function() {
  // Create the popup
  createVideoPopup();
  
  // Show the popup after a short delay
  setTimeout(showVideoPopup, 1000);
});

function createVideoPopup() {
  // Check if the popup already exists
  if (document.getElementById('meshtastic-video-popup')) {
    return;
  }
  
  // Create the popup element
  const popup = document.createElement('div');
  popup.id = 'meshtastic-video-popup';
  popup.className = 'video-popup';
  
  popup.innerHTML = `
    <div class="close-btn">×</div>
    <div class="popup-content">
      <img src="https://img.youtube.com/vi/nkp3-EzIssU/mqdefault.jpg" alt="Meshtastic video cover" class="popup-thumbnail">
      <div class="popup-text">
        <p class="popup-title"><span class="popup-icon">📹</span>WATCH MY VIDEO ON MESHTASTIC NOW!!!</p>
      </div>
    </div>
  `;
  
  // Add the popup to the body
  document.body.appendChild(popup);
  
  // Event listener to close the popup
  const closeBtn = popup.querySelector('.close-btn');
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    hideVideoPopup();
  });
  
  // Event listener to open the video
  popup.addEventListener('click', function() {
    openVideoOverlay();
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
    popup.classList.add('show');
    
    // Save that the user has seen the popup in this session
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
    // Pause any page animations
    document.body.style.overflow = 'hidden';
  }
}

function closeVideoOverlay() {
  const overlay = document.getElementById('video-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    // Restore page scrolling
    document.body.style.overflow = '';
    
    // Stop the video when the overlay is closed
    const iframe = overlay.querySelector('iframe');
    if (iframe) {
      const src = iframe.src;
      iframe.src = src; // Reload the iframe to stop the video
    }
  }
}

// Function to check whether to show the popup based on the session
function shouldShowPopup() {
  // If the user has already seen the popup in this session, don't show it again
  return sessionStorage.getItem('meshtasticPopupShown') !== 'true';
}

// Expose functions globally
window.MeshtasticVideoPopup = {
  show: showVideoPopup,
  hide: hideVideoPopup,
  shouldShow: shouldShowPopup
};