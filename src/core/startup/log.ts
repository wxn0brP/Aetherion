import { delay } from "@wxn0brp/flanker-ui/utils";
import { fetchVQL } from "@wxn0brp/vql-client";

interface Log {
    msg: string;
    time: number;
}
const startupLogs = await fetchVQL<Log[]>(`api startup-logs`);
const logsDiv = qs("#startup-logs");
logsDiv.style.display = "";

for (const log of startupLogs) {
    await new Promise(resolve => setTimeout(resolve, log.time * 10));
    const msg = document.createElement("div");
    msg.innerHTML = log.msg.replace(/\n/g, "<br/>");
    logsDiv.appendChild(msg);
    logsDiv.scrollTop = logsDiv.scrollHeight;
}

const msg = document.createElement("div");
logsDiv.appendChild(msg);
logsDiv.scrollTop = logsDiv.scrollHeight;
for (let i = 0; i < 4; i++) {
    await delay(300);
    msg.innerHTML += ".";
}

await delay(300);
msg.innerHTML = "Ready!";
await delay(430);
logsDiv.style.display = "none";
logsDiv.innerHTML = "";