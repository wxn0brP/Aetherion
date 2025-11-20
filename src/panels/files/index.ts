import { fetchVQL } from "@wxn0brp/vql-client";
import "./style.scss";

const panel = qs(".filesPanel");
const home = await fetchVQL("api home!");
let currentPath = home;

interface List {
    name: string;
    d: boolean;
}

export async function init() {
    load(home);
}

async function load(path: string) {
    panel.innerHTML = render(await getFiles(path));
}

function render(list: List[]) {
    return [{ name: "..", d: true }, ...list]
        .map(({ name, d }) => {
            let html = "";
            const className = d ? "dir" : "file";
            html += `<div class="entry" data-dir="${d}" data-name="${name}">`;
            html += `<img class="${className}" src="img/${className}.svg" alt="${className}: ">`;
            html += name;
            html += `</div>`;
            return html;
        })
        .join("");
}

async function getFiles(path: string) {
    return fetchVQL<List[]>("api list-files s.path=$path", { path });
}

function joinPath(...parts: string[]) {
    const cleanParts = parts
        .filter(part => part !== "")
        .map(part => part.replace(/[\/\\]+/g, "/"))
        .map(part => part.replace(/^\/+|\/+$/g, ""));

    let joined = cleanParts.join("/");

    if (parts.length > 0 && parts[0].startsWith("/")) {
        joined = "/" + joined;
    }

    if (parts.length > 0 && parts[parts.length - 1].endsWith("/")) {
        joined = joined + "/";
    }

    return joined;
}

panel.addEventListener("click", (e) => {
    const target = e.target as HTMLDivElement;
    const entry = target.closest(".entry") as HTMLDivElement;
    if (!entry) return;

    const isDir = !!entry.dataset.dir;
    if (isDir) {
        currentPath = joinPath(currentPath, entry.dataset.name);
        load(currentPath);
    }
});