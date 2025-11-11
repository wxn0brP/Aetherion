import { delay } from "@wxn0brp/flanker-ui/utils";
import "./style.scss";

await new Promise(resolve => {
    document.addEventListener("click", resolve, { once: true });
});
await delay(500);
await import("./log");
await import("./hi");

export { }