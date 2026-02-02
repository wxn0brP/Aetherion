import { createStore } from "@wxn0brp/flanker-ui";
import { initReactiveHTML } from "@wxn0brp/flanker-ui/reactive/index";

export const $store = createStore({
    ui: {
        startup: {
            logs: true,
        }
    }
});

initReactiveHTML($store as any);