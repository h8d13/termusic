let blockEnabled = false;

// Load initial state
browser.storage.local.get(['blockEnabled'], function(result) {
  blockEnabled = result.blockEnabled || false;
  if (blockEnabled) {
    blockVideos();
  }
});

// Listen for toggle changes
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggleBlock') {
    blockEnabled = message.enabled;
    if (blockEnabled) {
      blockVideos();
    } else {
      unblockVideos();
    }
  }
});

function blockVideos() {
  // Stop all video elements
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.src = '';
    video.load();
  });

  // Prevent videos from loading by removing src
  const observer = new MutationObserver(function(mutations) {
    if (!blockEnabled) return;

    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeName === 'VIDEO') {
          node.pause();
          node.src = '';
          node.load();
        }
        if (node.querySelectorAll) {
          const videos = node.querySelectorAll('video');
          videos.forEach(video => {
            video.pause();
            video.src = '';
            video.load();
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also intercept play events
  document.addEventListener('play', function(e) {
    if (blockEnabled && e.target.tagName === 'VIDEO') {
      e.target.pause();
      e.target.src = '';
      e.target.load();
    }
  }, true);

  // Block the YouTube player API
  if (window.onYouTubePlayerReady) {
    window.onYouTubePlayerReady = function() {};
  }
}

function unblockVideos() {
  // Reload the page to restore normal functionality
  location.reload();
}
