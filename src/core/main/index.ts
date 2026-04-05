import { init as init_files } from "#panels/files";
import { init as init_keyboard } from "#panels/keyboard";
import { init as init_network } from "#panels/network";
import { init as init_terminal } from "#panels/terminal";
import "./style.scss";

await qs("main").fadeInP("");

init_files();
init_keyboard();
init_network();
init_terminal();
