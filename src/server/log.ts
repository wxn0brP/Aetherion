import { execSync } from "child_process";
import os from "os";

const hex = (max = 0xFFFFFFF) => "0x" + Math.floor(Math.random() * max).toString(16);
const cpuList = os.cpus();
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const log: (string | number)[] = [];
log.push(35, "Welcome to Aetherion-UI!\n");
log.push(30, `vm_page_bootstrap: ${Math.floor(os.freemem() / 4096)} free pages and ${Math.floor(os.totalmem() / 4096 - os.freemem() / 4096)} wired pages`);
log.push(30, `kext submap [${hex()} - ${hex()}], kernel text [${hex()} - ${hex()}]`);
log.push(30, "zone leak detection enabled");
log.push(30, "standard timeslicing quantum is 10000 us");
log.push(30, "TSC Deadline Timer supported and enabled");

cpuList.forEach((_, idx) => {
    const status = Math.random() > 0.2 ? "Enabled" : "Disabled";
    log.push(10, `AetherionACPICPU: ProcessorId=${idx} LocalApicId=${idx} ${status}`);
});

log.push(30, "calling mpo_policy_init for TMSafetyNet");
log.push(30, "Security policy loaded: Safety net for Rollback (TMSafetyNet)");
log.push(30, "calling mpo_policy_init for Sandbox");
log.push(30, "Security policy loaded: Seatbelt sandbox policy (Sandbox)");
log.push(30, "calling mpo_policy_init for Quarantine");
log.push(30, "Security policy loaded: Quarantine policy (Quarantine)");

log.push(17, "Booting Platform...");

function tryRun(cmd: string, time = 15, prefix = "") {
    try {
        const results = execSync(cmd).toString();
        const split = results.split("\n");
        const steps = random(1, 4);

        for (let i = 0; i < split.length; i++) {
            const result = split[i];

            const trimmed = result.trim();
            if (trimmed === "") continue;

            const stop = i % steps === 0 ? 0 : random(0, time);
            log.push(stop, prefix + trimmed);
        }
    } catch {
        log.push(17 + random(0, 5), `Failed Invoking ${cmd}`);
    }
}

tryRun("lspci");
tryRun("lsusb");
tryRun(`ls /usr/lib/*.so | shuf | head -n 100`, 3, "Loading kexts: ");
log.push(17, "Loading Modules:");
tryRun("journalctl -b | head -n 100", 8);

log.push(23, "\nBoot Complete!");

export const startupLogs = [];

for (let i = 0; i < log.length; i++) {
    const logTime = log[i];
    const logMsg = log[++i];
    startupLogs.push({ msg: logMsg, time: logTime });
}