# TermTube

`sudo pacman -S mpv cava yt-dlp`

And a FireFox based browser.

Playing with `--no-video` and `cava` visuals in MPV uses about 50mb RAM. Built-in channel autoplay and bar visualiser: modifify in `~/.config/cava/*`

## Firefox Extension

Simple YouTube auto-play locker extension with mpv integration. (Loads much faster without videos! Laos can't load ads hehe). ![Preview](preview.png) 

**Install:**

Adapt the `path` to termtube folder (where you cloned) in `mpv_bridge.json`

```bash
./install_bridge.sh
```
This creates: 

```
~/.mozilla/native-messaging-hosts/mpv_bridge.json
```
Then load extension in Firefox from:

`about:debugging#/runtime/this-firefox`

---

Want to keep it forever?

Install `firefox-nightly` or any dev version.

https://www.firefox.com/en-US/channel/desktop/

Go to `about:config` then `xpinstall.signatures.required`

Set to `false`. Drag the `.zip` file in the repo into addons. 

Enjoy <3

---

You can also modify and build it from source yourself:

`sudo pacman -S npm && sudo npm install -g web-ext`

Then in `extension/` run `web-ext build`

---

![Preview2](preview2.png)


