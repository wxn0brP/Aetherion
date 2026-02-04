import { spawn } from "node-pty";
import { WebSocketServer } from "ws";

if (!process.argv0.includes("node")) {
    console.error("This script must be run with node");
    process.exit(1);
}

const authKey = process.env.ATO_TERMINAL_AUTH_KEY;
if (!authKey) process.exit(1);

const wss = new WebSocketServer({ port: 0 });

console.log(`Terminal server started on port :::${wss.address().port}`);

let used = false;
let authed = false;

wss.on("connection", (ws) => {
    if (used) {
        ws.close();
        console.error("Already used");
        process.exit(2);
        return;
    }
    used = true;

    const shell = process.platform === "win32" ?
        "powershell.exe" :
        process.env.SHELL || "bash";

    const ptyProcess = spawn(shell, ["--login"], {
        name: "xterm-color",
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.onData(data => authed && ws.send(data));

    ws.on("message", (msg) => {
        if (!authed) {
            if (msg.toString() !== authKey) {
                ws.close();
                process.exit(2);
            }
            authed = true;
            return;
        }

        const data = msg.toString();
        ptyProcess.write(data);
    });

    ws.on("close", () => {
        ptyProcess.kill();
        wss.close();
        console.log("Closed");
        process.exit(0);
    });

    ptyProcess.onExit(() => {
        ws.close();
        console.log("Exited");
        process.exit(0);
    });
});
