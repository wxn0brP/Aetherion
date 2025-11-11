import { createValtheraAdapter } from "@wxn0brp/vql";
import { startupLogs } from "./log";

export const VqlApi = createValtheraAdapter({
    async find(collection, search, context, options, findOpts) {
        try {
            switch (collection) {
                case "startup-logs": return startupLogs;
                default:
            }
        } finally { }
        return [];
    },

    async findOne(collection, search, context, findOpts) {
        try {


            throw new Error("Unknown collection");
        } catch {
            return null;
        }
    }
}, true);

import VQLProcessor from "@wxn0brp/vql";

export const VQL = new VQLProcessor({
    api: VqlApi
});