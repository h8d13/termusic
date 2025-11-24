# TermTube

`sudo pacman -S mpv cava yt-dlp`

And a FireFox based browser.

Playing with `--no-video` and `cava` visuals in MPV uses about 50mb RAM. Built-in channel autoplay and bar visualiser: modifify in `~/.config/cava/*`

## Firefox Extension

Simple YouTube auto-play locker extension with mpv integration. (Loads much faster without videos!)

**Features:**
- Toggle to block/unblock YouTube videos
- Copy current video URL
- Send audio/video to mpv/terminal player
- Send & close Firefox

Adapt the `path` to termtube folder in `mpv_bridge.json`

**Install:**
```bash
./install_bridge.sh
```

Then load extension in Firefox from:

`about:debugging#/runtime/this-firefox`

---

Want to keep it forever?

Install `firefox-nightly` or any dev version.

https://www.firefox.com/en-US/channel/desktop/

Go to `about:config` then `xpinstall.signatures.required`

Set to false. Drag the file in the repo into addons. 

Enjoy <3

---

You can also modify and build it from source yourself:

`sudo pacman -S npm && sudo npm install -g web-ext`

Then in `extension/` run `web-ext build`

---

![Preview](preview.png) 

![Preview2](preview2.png)


