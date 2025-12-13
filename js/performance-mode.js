// performance-mode.js - Centralized management of display modes

// Function to detect device type
function detectDevice() {
  // Always returns 'light' as default mode
  return 'light';
}

// Function to adjust particles based on mode
function adjustParticles(mode) {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  let particleCount;
  switch (mode) {
    case 'light':
      particleCount = 0; // No particles in light mode
      break;
    case 'high-performance':
      particleCount = 30;
      break;
    default:
      particleCount = 0;
  }
  
  // Remove all existing particles
  particlesContainer.innerHTML = '';
  
  // Create new particles only if we're not in light mode
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

// Function to adjust dynamic effects based on mode
function adjustDynamicEffects(mode) {
  // Energy waves management
  const wavesContainer = document.getElementById('energy-waves');
  if (wavesContainer) {
    if (mode === 'light') {
      wavesContainer.style.display = 'none';
    } else {
      wavesContainer.style.display = 'block';
      wavesContainer.style.opacity = '0.3';
    }
  }
  
  // Mouse follow management (if it exists)
  // IMPORTANT: Make sure the HTML element of mouse follow has the ID "mouse-follow"
  const mouseFollow = document.getElementById('mouse-follow');
  if (mouseFollow) {
    if (mode === 'light') {
      mouseFollow.style.display = 'none';
      // Also disable mouse follow event listeners if they exist
      if (typeof disableMouseFollow === 'function') {
        disableMouseFollow();
      }
    } else {
      mouseFollow.style.display = 'block';
      mouseFollow.style.opacity = '1';
      // Re-enable mouse follow event listeners if they exist
      if (typeof enableMouseFollow === 'function') {
        enableMouseFollow();
      }
    }
  }
  
  // Management of other dynamic effects that might be present
  // Add the "dynamic-effect" class to any element that should be hidden in light mode
  const dynamicElements = document.querySelectorAll('.dynamic-effect');
  dynamicElements.forEach(element => {
    if (mode === 'light') {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
      element.style.opacity = '1';
    }
  });
}

// Function to set performance mode
function setPerformanceMode(mode) {
  // Remove all mode classes
  document.body.classList.remove('light-mode', 'high-performance-mode');
  
  // Add the class corresponding to the mode
  document.body.classList.add(mode + '-mode');
  
  // Save user preference
  localStorage.setItem('performanceMode', mode);
  
  // Update mode indicator
  updateModeIndicator(mode);
  
  // Adjust the number of particles based on the mode
  adjustParticles(mode);
  
  // Adjust dynamic effects based on the mode
  adjustDynamicEffects(mode);
  
  // Show a notification
  showNotification(`${mode === 'light' ? 'Light' : 'High performance'} mode activated`);
  
  // Execute page-specific functions if defined
  if (typeof window.onPerformanceModeChange === 'function') {
    window.onPerformanceModeChange(mode);
  }
}

// Function to update mode indicator
function updateModeIndicator(mode) {
  const indicator = document.getElementById('performance-indicator');
  if (indicator) {
    indicator.textContent = mode === 'light' ? 'LIGHT' : 'HIGH PERFORMANCE';
  }
}

// Function to show a notification
function showNotification(message) {
  // Remove existing notifications
  const existingNotification = document.querySelector('.performance-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create a new notification
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
  
  // Show the notification
  setTimeout(() => {
    notification.style.opacity = '1';
  }, 10);
  
  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Create mode indicator
function createModeIndicator() {
  // Check if the indicator already exists
  if (document.getElementById('performance-indicator')) {
    return;
  }
  
  const indicator = document.createElement('div');
  indicator.id = 'performance-indicator';
  indicator.textContent = 'LIGHT';
  indicator.addEventListener('click', function() {
    const selector = document.getElementById('performance-mode-selector');
    if (selector) {
      selector.classList.toggle('show');
    }
  });
  document.body.appendChild(indicator);
}

// Create initial mode selection popup
function createInitialModePopup() {
  // Check if the popup already exists
  if (document.getElementById('initial-mode-popup')) {
    return;
  }
  
  const popup = document.createElement('div');
  popup.id = 'initial-mode-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Select Display Mode</h3>
      <p>Choose your preferred mode to optimize site performance</p>
      <div class="performance-modes">
        <div class="performance-mode" data-mode="light">
          <div class="mode-icon">⚡</div>
          <div class="mode-name">Light</div>
          <div class="mode-desc">No animations</div>
        </div>
        <div class="performance-mode" data-mode="high-performance">
          <div class="mode-icon">🚀</div>
          <div class="mode-name">High Performance</div>
          <div class="mode-desc">Full animations</div>
        </div>
      </div>
      <div class="popup-footer">
        <span id="popup-timer">10</span> seconds to automatic selection
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Show the popup with a small animation
  setTimeout(() => {
    popup.classList.add('show');
  }, 100);
  
  // Add event listeners for mode buttons
  const modeButtons = popup.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Set the corresponding mode
      setPerformanceMode(this.getAttribute('data-mode'));
      
      // Remove the popup
      popup.style.opacity = '0';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    });
  });
  
  // Timer for automatic selection
  let countdown = 10;
  const timerElement = document.getElementById('popup-timer');
  const countdownInterval = setInterval(() => {
    countdown--;
    if (timerElement) {
      timerElement.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      
      // Always use light mode as default
      setPerformanceMode('light');
      
      // Remove the popup
      popup.style.opacity = '0';
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    }
  }, 1000);
}

// Create mode selector
function createModeSelector() {
  // Check if the selector already exists
  if (document.getElementById('performance-mode-selector')) {
    return;
  }
  
  const selector = document.createElement('div');
  selector.id = 'performance-mode-selector';
  selector.innerHTML = `
    <h4>Display Mode</h4>
    <p>Select your preferred mode to optimize site performance</p>
    <div class="performance-modes">
      <div class="performance-mode" data-mode="light">Light</div>
      <div class="performance-mode" data-mode="high-performance">High Performance</div>
    </div>
    <button id="save-performance-mode">Save Preference</button>
  `;
  document.body.appendChild(selector);
  
  // Add event listeners for mode buttons
  const modeButtons = selector.querySelectorAll('.performance-mode');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      modeButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to the clicked button
      this.classList.add('active');
      
      // Set the corresponding mode
      setPerformanceMode(this.getAttribute('data-mode'));
    });
  });
  
  // Add event listener for save button
  document.getElementById('save-performance-mode').addEventListener('click', function() {
    selector.classList.remove('show');
    showNotification('Preference saved successfully');
  });
}

// Initialize the mode system
function initPerformanceMode() {
  // Create the indicator and mode selector
  createModeIndicator();
  createModeSelector();
  
  // Always set light mode as default
  setPerformanceMode('light');
}

// Initialize the system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initPerformanceMode();
});

// Expose functions globally for use in other parts of the code
window.PerformanceMode = {
  setMode: setPerformanceMode,
  getCurrentMode: function() {
    return localStorage.getItem('performanceMode') || 'light';
  },
  adjustParticles: adjustParticles,
  adjustDynamicEffects: adjustDynamicEffects
};