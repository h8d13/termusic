const blockToggle = document.getElementById('blockToggle');
const status = document.getElementById('status');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const modeToggle = document.getElementById('modeToggle');
const mpvSendBtn = document.getElementById('mpvSendBtn');
const mpvCloseBtn = document.getElementById('mpvCloseBtn');

// Load saved state
browser.storage.local.get(['blockEnabled'], function(result) {
  blockToggle.checked = result.blockEnabled || false;
  updateStatus(result.blockEnabled || false);
});

// Handle toggle changes
blockToggle.addEventListener('change', function() {
  const isEnabled = blockToggle.checked;

  // Save state
  browser.storage.local.set({ blockEnabled: isEnabled }, function() {
    updateStatus(isEnabled);

    // Notify content scripts to update
    browser.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          action: 'toggleBlock',
          enabled: isEnabled
        }).catch(() => {
          // Ignore errors for tabs without content script
        });
      });
    });
  });
});

function updateStatus(enabled) {
  status.textContent = enabled ? 'Videos blocked' : 'Videos allowed';
  status.style.color = enabled ? '#f44336' : '#4CAF50';
}

// Handle copy URL button
copyUrlBtn.addEventListener('click', function() {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];

    if (currentTab && currentTab.url) {
      // Check if it's a YouTube page
      if (currentTab.url.includes('youtube.com')) {
        navigator.clipboard.writeText(currentTab.url).then(() => {
          // Visual feedback
          const originalText = copyUrlBtn.textContent;
          copyUrlBtn.textContent = 'Copied!';
          copyUrlBtn.classList.add('copied');

          setTimeout(() => {
            copyUrlBtn.textContent = originalText;
            copyUrlBtn.classList.remove('copied');
          }, 1500);
        }).catch(err => {
          copyUrlBtn.textContent = 'Error';
          setTimeout(() => {
            copyUrlBtn.textContent = 'Copy Video URL';
          }, 1500);
        });
      } else {
        copyUrlBtn.textContent = 'Not on YouTube';
        setTimeout(() => {
          copyUrlBtn.textContent = 'Copy Video URL';
        }, 1500);
      }
    }
  });
});

// Helper function to send to mpv
function sendToMpv(button, mode, originalText) {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];

    if (currentTab && currentTab.url) {
      // Check if it's a YouTube page
      if (currentTab.url.includes('youtube.com')) {
        // Connect to native messaging host
        const port = browser.runtime.connectNative('mpv_bridge');

        port.onMessage.addListener((response) => {
          if (response.status === 'success') {
            button.textContent = 'Playing!';
            button.classList.add('playing');
            setTimeout(() => {
              button.textContent = originalText;
              button.classList.remove('playing');
            }, 2000);
          } else {
            button.textContent = 'Error: ' + response.message;
            setTimeout(() => {
              button.textContent = originalText;
            }, 3000);
          }
        });

        port.onDisconnect.addListener(() => {
          if (browser.runtime.lastError) {
            button.textContent = 'Bridge Error';
            setTimeout(() => {
              button.textContent = originalText;
            }, 3000);
          }
        });

        // Send the URL to the native app with mode
        port.postMessage({ url: currentTab.url, mode: mode });
      } else {
        button.textContent = 'Not on YouTube';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }
    }
  });
}

// Handle send to mpv button with mode toggle
mpvSendBtn.addEventListener('click', function() {
  const mode = modeToggle.checked ? 'video' : 'audio';
  sendToMpv(mpvSendBtn, mode, 'Send to mpv');
});

// Handle send to mpv and close Firefox button
mpvCloseBtn.addEventListener('click', function() {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];

    if (currentTab && currentTab.url) {
      // Check if it's a YouTube page
      if (currentTab.url.includes('youtube.com')) {
        // Connect to native messaging host
        const port = browser.runtime.connectNative('mpv_bridge');

        port.onMessage.addListener((response) => {
          if (response.status === 'success') {
            mpvCloseBtn.textContent = 'Closing...';
            mpvCloseBtn.classList.add('playing');
            // Firefox will close from the native bridge
          } else {
            mpvCloseBtn.textContent = 'Error: ' + response.message;
            setTimeout(() => {
              mpvCloseBtn.textContent = 'Send & Close Firefox';
            }, 3000);
          }
        });

        port.onDisconnect.addListener(() => {
          if (browser.runtime.lastError) {
            mpvCloseBtn.textContent = 'Bridge Error';
            setTimeout(() => {
              mpvCloseBtn.textContent = 'Send & Close Firefox';
            }, 3000);
          }
        });

        // Send the URL to the native app with close_firefox flag and selected mode
        const mode = modeToggle.checked ? 'video' : 'audio';
        port.postMessage({ url: currentTab.url, mode: mode, close_firefox: true });
      } else {
        mpvCloseBtn.textContent = 'Not on YouTube';
        setTimeout(() => {
          mpvCloseBtn.textContent = 'Send & Close Firefox';
        }, 1500);
      }
    }
  });
});
