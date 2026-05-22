/**
 * Privacy for WhatsApp - Popup Script
 * Manages toggle states and syncs with chrome.storage
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  blurNames: true,
  blurPreview: true
};

// DOM Elements
const toggleEnabled = document.getElementById('toggle-enabled');
const toggleBlurNames = document.getElementById('toggle-blur-names');
const toggleBlurPreview = document.getElementById('toggle-blur-preview');

const settingBlurNames = document.getElementById('setting-blur-names');
const settingBlurPreview = document.getElementById('setting-blur-preview');

/**
 * Load saved settings and update UI
 */
function loadSettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
    toggleEnabled.checked = result.enabled;
    toggleBlurNames.checked = result.blurNames;
    toggleBlurPreview.checked = result.blurPreview;
    updateSubToggleState(result.enabled);
  });
}

/**
 * Save a setting to chrome.storage
 */
function saveSetting(key, value) {
  chrome.storage.local.set({ [key]: value });
}

/**
 * Enable/disable sub-toggles based on master toggle
 */
function updateSubToggleState(enabled) {
  if (enabled) {
    settingBlurNames.classList.remove('disabled');
    settingBlurPreview.classList.remove('disabled');
  } else {
    settingBlurNames.classList.add('disabled');
    settingBlurPreview.classList.add('disabled');
  }
}

// Event Listeners
toggleEnabled.addEventListener('change', (e) => {
  const enabled = e.target.checked;
  saveSetting('enabled', enabled);
  updateSubToggleState(enabled);
});

toggleBlurNames.addEventListener('change', (e) => {
  saveSetting('blurNames', e.target.checked);
});

toggleBlurPreview.addEventListener('change', (e) => {
  saveSetting('blurPreview', e.target.checked);
});

// Initialize
document.addEventListener('DOMContentLoaded', loadSettings);
