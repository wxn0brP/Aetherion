import { keydown, keyup } from "#panels/keyboard";
import { fetchVQL } from "@wxn0brp/vql-client";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export async function init() {
    const auth = await fetchVQL("api terminal!");

    const term = new Terminal({
        cursorBlink: true,
        cursorStyle: "block",
        scrollback: 10000,
        rows: 30,
        cols: 80,
        theme: {
            background: "#000000",
            foreground: "#ffffff",
            cursor: "#ffffff",
            cursorAccent: "#ffffff",
        },
    });

    const ws = new WebSocket(`ws://localhost:${auth.port}`);
    ws.onmessage = (e) => term.write(e.data);

    ws.onopen = () => {
        ws.send(auth.auth);
    }

    term.onData(data => {
        if (!ws.readyState) return;
        ws.send(data);
    });

    ws.onclose = () => {
        term.dispose();
    }

    const panel = qs("#mainPanel");
    term.open(panel);

    panel.qs(".xterm-helper-textarea").addEventListener("keyup", e => keyup(e));
    panel.qs(".xterm-helper-textarea").addEventListener("keydown", e => keydown(e));
}