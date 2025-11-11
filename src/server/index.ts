import FalconFrame from "@wxn0brp/falcon-frame";
import { FF_VQL } from "@wxn0brp/vql";
import { VQL } from "./api";

const app = new FalconFrame();

app.static("public");
app.static("dist");

FF_VQL(app, VQL);

app.l(16586);