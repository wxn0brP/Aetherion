import "./vql";

const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has("skip-startup"))
    await import("./startup");
await import("./main");