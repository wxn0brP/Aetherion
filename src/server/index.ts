import { FF_VQL } from "@wxn0brp/vql";
import { app, oneWindow, port } from "@wxn0brp/zhiva-base-lib/server";
import { VQL } from "./api";

app.static("public");
app.static("dist");

FF_VQL(app, VQL);

console.log(`Server listening on http://localhost:${port}`);

if (process.env.NO_ZHIVA !== "true") {
    oneWindow();
}