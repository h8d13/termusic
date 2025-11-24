# TermTube
`sudo pacman -S mpv cava yt-dlp`
And a FireFox based browser.

Playing with `--no-video` and `cava` visuals in MPV uses about 50mb RAM. Built-in channel autoplay and bar visualiser: modifify in `~/.config/cava/*`

## Firefox Extension

Simple YouTube blocker extension with mpv integration.

**Features:**
- Toggle to block/unblock YouTube videos
- Copy current video URL
- Send audio/video to mpv/terminal player
- Send & close Firefox

Adapt the `path` to TermTube in `mpv_bridge.json`

**Install:**
```bash
./install_bridge.sh
```

Then load extension in Firefox from:

`about:debugging#/runtime/this-firefox`
