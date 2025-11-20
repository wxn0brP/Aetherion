import { createValtheraAdapter } from "@wxn0brp/vql";
import * as fs from "fs";
import { homedir } from "os";
import { startupLogs } from "./log";

export const VqlApi = createValtheraAdapter({
    async find(collection, search, context, options, findOpts) {
        try {
            switch (collection) {
                case "startup-logs": return startupLogs;
                case "list-files": return fs.readdirSync(search.path, { withFileTypes: true }).map(f => ({ name: f.name, d: f.isDirectory() }));
            }
        } catch { }
        return [];
    },

    async findOne(collection, search, context, findOpts) {
        try {
            switch (collection) {
                case "home": return homedir();
            }
        } catch { }
        return null;
    }
}, true);

import VQLProcessor from "@wxn0brp/vql";

export const VQL = new VQLProcessor({
    api: VqlApi
});