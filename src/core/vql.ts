import { VConfig } from "@wxn0brp/vql-client";
import { initVQL } from "@wxn0brp/zhiva-base-lib/front/vql";

VConfig.hooks = {
	onEnd(query, durationMs, result, hookContext) {
		console.log("[VQL]", query, durationMs, result, hookContext);
	},
	onError(query, error, result, hookContext) {
		console.error("[VQL]", query, error, result, hookContext);
	},
};

initVQL();
