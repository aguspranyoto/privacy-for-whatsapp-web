/**
 * Privacy for WhatsApp - Popup Script
 * Manages toggle states and syncs with chrome.storage
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  blurNames: true,
  blurPreview: true,
  blurMessagesInChatRoom: false,
};

// DOM Elements
const toggleEnabled = document.getElementById("toggle-enabled");
const toggleBlurNames = document.getElementById("toggle-blur-names");
const toggleBlurPreview = document.getElementById("toggle-blur-preview");
const toggleBlurMessagesInChatRoom = document.getElementById(
  "toggle-blur-messages-in-chat-room",
);

const settingBlurNames = document.getElementById("setting-blur-names");
const settingBlurPreview = document.getElementById("setting-blur-preview");
const settingBlurMessagesInChatRoom = document.getElementById(
  "setting-blur-messages-in-chat-room",
);

/**
 * Load saved settings and update UI
 */
function loadSettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
    toggleEnabled.checked = result.enabled;
    toggleBlurNames.checked = result.blurNames;
    toggleBlurPreview.checked = result.blurPreview;
    toggleBlurMessagesInChatRoom.checked = result.blurMessagesInChatRoom;
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
    settingBlurNames.classList.remove("disabled");
    settingBlurPreview.classList.remove("disabled");
    settingBlurMessagesInChatRoom.classList.remove("disabled");
  } else {
    settingBlurNames.classList.add("disabled");
    settingBlurPreview.classList.add("disabled");
    settingBlurMessagesInChatRoom.classList.add("disabled");
  }
}

// Event Listeners
toggleEnabled.addEventListener("change", (e) => {
  const enabled = e.target.checked;
  saveSetting("enabled", enabled);
  updateSubToggleState(enabled);
});

toggleBlurNames.addEventListener("change", (e) => {
  saveSetting("blurNames", e.target.checked);
});

toggleBlurPreview.addEventListener("change", (e) => {
  saveSetting("blurPreview", e.target.checked);
});

toggleBlurMessagesInChatRoom.addEventListener("change", (e) => {
  saveSetting("blurMessagesInChatRoom", e.target.checked);
});

// Initialize
document.addEventListener("DOMContentLoaded", loadSettings);
