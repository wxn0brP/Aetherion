import VQLProcessor from "@wxn0brp/vql";
import { AdapterBuilder } from "@wxn0brp/vql/helpers/apiAbstract";
import * as fs from "fs";
import { homedir } from "os";
import { startupLogs } from "./log";

const adapter = new AdapterBuilder();

adapter.find("startup-logs", async () => startupLogs);
adapter.find("list-files", async (search) => {
    const entries = await fs.promises.readdir(search.path, { withFileTypes: true });
    return entries.map(f => ({ name: f.name, d: f.isDirectory() }));
});

adapter.findOne("home", async () => homedir());

export const VQL = new VQLProcessor({
    api: adapter.getAdapter()
});