#!/usr/bin/env python3
"""
Native messaging host for Firefox extension to send URLs to mpv
"""
import sys
import json
import struct
import subprocess
import os

def get_message():
    """Read a message from stdin (sent by Firefox extension)"""
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_message(message):
    """Send a message to stdout (back to Firefox extension)"""
    encoded_message = json.dumps(message).encode('utf-8')
    encoded_length = struct.pack('=I', len(encoded_message))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_message)
    sys.stdout.buffer.flush()

def main():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    mpv_script = os.path.join(script_dir, 'mpvterm')

    while True:
        message = get_message()
        if message is None:
            break

        if 'url' in message:
            url = message['url']
            close_firefox = message.get('close_firefox', False)
            mode = message.get('mode', 'audio')  # 'audio' or 'video'

            try:
                launched = False

                if mode == 'audio':
                    # Launch mpvterm script with the URL in a new terminal (audio + cava)
                    terminal_commands = [
                        ['x-terminal-emulator', '-e', mpv_script, url],
                        ['gnome-terminal', '--', mpv_script, url],
                        ['konsole', '-e', mpv_script, url],
                        ['xterm', '-e', mpv_script, url],
                        ['alacritty', '-e', mpv_script, url],
                        ['kitty', '-e', mpv_script, url],
                    ]

                    for cmd in terminal_commands:
                        try:
                            subprocess.Popen(cmd,
                                           stdout=subprocess.DEVNULL,
                                           stderr=subprocess.DEVNULL)
                            launched = True
                            break
                        except (FileNotFoundError, OSError):
                            continue

                elif mode == 'video':
                    # Launch mpv directly with video (no terminal, no cava)
                    try:
                        subprocess.Popen(['mpv', url],
                                       stdout=subprocess.DEVNULL,
                                       stderr=subprocess.DEVNULL)
                        launched = True
                    except (FileNotFoundError, OSError):
                        pass

                if launched:
                    send_message({'status': 'success', 'message': f'Playing in mpv ({mode})'})

                    # Close Firefox if requested
                    if close_firefox:
                        subprocess.Popen(['killall', 'firefox'])
                else:
                    send_message({'status': 'error', 'message': 'No terminal emulator found'})

            except Exception as e:
                send_message({'status': 'error', 'message': str(e)})
        else:
            send_message({'status': 'error', 'message': 'No URL provided'})

if __name__ == '__main__':
    main()
