import * as globe from "./globe";

export function init() {
	globe.resizeCanvas();
	globe.startAnimation();
	globe.animate();
}
