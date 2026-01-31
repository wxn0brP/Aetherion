import "./style.scss";

const panel = qs("#keyboardPanel");

const keysMap = {
    control: "ctrl",
    " ": "___",
    "escape": "esc",
    "capslock": "caps",
    "altgraph": "altg",
}

export async function init() {
    genRows();
}

function genRow(chars: string[]) {
    const row = document.createElement("div");
    row.classList.add("row");

    for (const char of chars) {
        const div = document.createElement("div");
        div.innerHTML = char;
        row.appendChild(div);
    }
    return row;
}

function genRows() {
    panel.innerHTML = "";
    panel.appendChild(genRow(['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']));
    panel.appendChild(genRow(['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace']));
    panel.appendChild(genRow(['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\']));
    panel.appendChild(genRow(['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter']));
    panel.appendChild(genRow(['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift']));
    panel.appendChild(genRow(['Ctrl', 'Meta', 'Alt', '___', 'AltG', 'Ctrl']));

    addKeyWidth(110, 1, -1); // Backspace
    addKeyWidth(30, 2, 0); // Tab
    addKeyWidth(60, 2, -1); // Pipe
    addKeyWidth(50, 3, 0); // Caps lock
    addKeyWidth(160, 3, -1); // Enter
    addKeyWidth(140, 4, 0); // Shift
    addKeyWidth(200, 4, -1); // Shift
    addKeyWidth(500, 5, 3); // Space

}

function getKeyDiv(...indexes: number[]) {
    let div = panel.children[indexes[0]];
    for (let i = 1; i < indexes.length; i++) {
        div = [...div.children].at(indexes[i]);
    }
    return div as HTMLDivElement;
}

function addKeyWidth(count: number, ...indexes: number[]) {
    getKeyDiv(...indexes).style.width = (100 + count) + "%";
}

document.addEventListener("keydown", (e) => {
    const key = mapKey(e.key.toLowerCase());
    console.log(key);
    specialKeys(key);
    togglePressed(key, true);
});

document.addEventListener("keyup", (e) => {
    const key = mapKey(e.key.toLowerCase());
    togglePressed(key, false);
});

function togglePressed(key: string, press: boolean) {
    panel.querySelectorAll(".row div").forEach(div => {
        if (div.innerHTML.toLowerCase() === key)
            div.classList.toggle("pressed", press);
    });
}

function mapKey(key: string) {
    return keysMap[key] || key;
}

function specialKeys(key: string) {
    if (key === "meta") {
        setTimeout(() => {
            togglePressed("meta", false);
        }, 1000);
    }
}