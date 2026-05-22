/**
 * Privacy for WhatsApp Web - Content Script
 * Applies blur effects to user/group names and last message previews
 * in the WhatsApp Web sidebar chat list.
 */

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  blurNames: true,
  blurPreview: true,
  blurMessagesInChatRoom: false,
};

let currentSettings = { ...DEFAULT_SETTINGS };

/**
 * Apply or remove blur CSS classes based on current settings.
 * The actual blur is handled by CSS classes on <body>.
 */
function applyBlur() {
  const body = document.body;

  if (!currentSettings.enabled) {
    body.classList.remove(
      "privacy-blur-names",
      "privacy-blur-preview",
      "privacy-blur-messages-in-chat-room",
    );
    return;
  }

  // Toggle blur for names
  if (currentSettings.blurNames) {
    body.classList.add("privacy-blur-names");
  } else {
    body.classList.remove("privacy-blur-names");
  }

  // Toggle blur for message preview
  if (currentSettings.blurPreview) {
    body.classList.add("privacy-blur-preview");
  } else {
    body.classList.remove("privacy-blur-preview");
  }

  // Toggle blur for messages in chat room
  if (currentSettings.blurMessagesInChatRoom) {
    body.classList.add("privacy-blur-messages-in-chat-room");
  } else {
    body.classList.remove("privacy-blur-messages-in-chat-room");
  }
}

/**
 * Load settings from chrome.storage and apply blur
 */
function loadSettings() {
  chrome.storage.local.get(DEFAULT_SETTINGS, (result) => {
    currentSettings = result;
    applyBlur();
  });
}

/**
 * Listen for settings changes from the popup
 */
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    for (const [key, { newValue }] of Object.entries(changes)) {
      currentSettings[key] = newValue;
    }
    applyBlur();
  }
});

/**
 * Observe DOM changes to re-apply blur when WhatsApp dynamically loads content.
 * This ensures new chat rows get the blur applied.
 */
function observeChatList() {
  const observer = new MutationObserver(() => {
    // CSS class-based approach handles new elements automatically,
    // but we re-apply in case body classes were removed.
    applyBlur();
  });

  // Observe the entire app for structural changes (WhatsApp is a SPA)
  const appRoot = document.getElementById("app") || document.body;
  observer.observe(appRoot, {
    childList: true,
    subtree: true,
  });
}

/**
 * Initialize the extension
 */
function init() {
  console.log("[Privacy for WhatsApp] Extension loaded");
  loadSettings();
  observeChatList();
}

// Wait for WhatsApp to load, then initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
