import VQLProcessor from "@wxn0brp/vql";
import { AdapterBuilder } from "@wxn0brp/vql/helpers/apiAbstract";
import * as fs from "fs";
import { homedir } from "os";
import { startupLogs } from "./log";
import { exec, spawn } from "child_process";
import { randomBytes } from "crypto";

const adapter = new AdapterBuilder();

adapter.find("startup-logs", async () => startupLogs);
adapter.find("list-files", async (search) => {
    const entries = await fs.promises.readdir(search.path, { withFileTypes: true });
    return entries.map(f => ({ name: f.name, d: f.isDirectory() }));
});

adapter.findOne("home", async () => homedir());

adapter.findOne("terminal", async () => {
    const { resolve, reject, promise } = Promise.withResolvers();
    const key = randomBytes(32).toString("hex");

    const child = spawn("node", ["dist/terminal.js"], {
        env: {
            ATO_TERMINAL_AUTH_KEY: key,
            ...process.env
        },
        stdio: "pipe"
    });

    child.stdout.on("data", data => {
        const msg = data.toString();
        console.log(msg);
        if (msg.includes(":::")) {
            const [_, port] = msg.split(":::");
            resolve({ port: +port, auth: key });
        }
    });

    child.stderr.on("data", data => {
        const msg = data.toString();
        console.error(msg);
        reject(msg);
    });

    return await promise;
});

export const VQL = new VQLProcessor({
    api: adapter.getAdapter()
});