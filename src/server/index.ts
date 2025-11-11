import { FF_VQL } from "@wxn0brp/vql";
import { VQL } from "./api";
import { app, oneWindow } from "@wxn0brp/zhiva-base-lib/server";

app.static("public");
app.static("dist");

FF_VQL(app, VQL);

oneWindow();