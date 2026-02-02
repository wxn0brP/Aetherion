import { delay } from "@wxn0brp/flanker-ui/utils";

export { }

const hiDiv = qs("#startup-hi");

hiDiv.css("display", "");
await delay(3000);
await hiDiv.fadeOutP();