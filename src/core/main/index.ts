import { init as init_files } from "#panels/files";
import { init as init_keyboard } from "#panels/keyboard";
import "./style.scss";

await qs("main").fadeInP("");

init_files();
init_keyboard();