#!/bin/bash
# Install native messaging host for Firefox extension

MANIFEST_DIR="$HOME/.mozilla/native-messaging-hosts"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing native messaging host for mpv bridge..."

# Create directory if it doesn't exist
mkdir -p "$MANIFEST_DIR"

# Update the path in the manifest
cat > "$MANIFEST_DIR/mpv_bridge.json" << EOF
{
  "name": "mpv_bridge",
  "description": "Bridge to send YouTube URLs to mpv",
  "path": "$SCRIPT_DIR/mpv_bridge.py",
  "type": "stdio",
  "allowed_extensions": [
    "youtube-blocker@local"
  ]
}
EOF

echo "Native messaging host installed successfully!"
echo "Manifest location: $MANIFEST_DIR/mpv_bridge.json"
echo "Bridge script location: $SCRIPT_DIR/mpv_bridge.py"
echo ""
echo "Next steps:"
echo "1. Create a 48x48 icon.png file in $SCRIPT_DIR"
echo "2. Load the extension in Firefox from about:debugging"
echo "3. Test the 'Send to mpv' button on a YouTube video"
