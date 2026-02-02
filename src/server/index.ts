import { FF_VQL } from "@wxn0brp/vql";
import { app, oneWindow } from "@wxn0brp/zhiva-base-lib/server";
import { VQL } from "./api";

app.static("public");
app.static("dist");

FF_VQL(app, VQL);

if (process.env.NO_ZHIVA !== "true") {
    oneWindow();
}