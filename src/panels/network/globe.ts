import { canvas, networkPanel } from "./html";

interface Point3D {
	x: number;
	y: number;
	z: number;
}

interface Point2D {
	x: number;
	y: number;
}

interface SphereCoord {
	phi: number;
	theta: number;
}

const RADIUS_FINAL: number = 120;
const CENTER: Point3D = {
	x: 0,
	y: 0,
	z: 0,
};
const CAMERA_DIST: number = 800;

const MERIDIANS: number = 24;
const PARALLELS: number = 12;

let rotationY: number = 0;
const ROTATION_SPEED: number = 0.006;

let scaleProgress: number = 0;
let isAnimating: boolean = true;
let animStartTime: number = 0;
const ANIM_DURATION: number = 1200;

const ctx = canvas.getContext("2d");
canvas.height = 240;

export function resizeCanvas() {
	canvas.width = networkPanel.offsetWidth - 12;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const meridiansPoints: SphereCoord[][] = [];
for (let i = 0; i < MERIDIANS; i++) {
	const phi = (i / MERIDIANS) * 2 * Math.PI;
	const points: SphereCoord[] = [];
	const steps = 36;

	for (let j = 0; j <= steps; j++) {
		const theta = (j / steps) * Math.PI;
		points.push({
			phi,
			theta,
		});
	}

	meridiansPoints.push(points);
}

const parallelsPoints: SphereCoord[][] = [];
for (let i = 1; i <= PARALLELS; i++) {
	const theta = (i / (PARALLELS + 1)) * Math.PI;
	const points: SphereCoord[] = [];
	const steps = MERIDIANS * 2;

	for (let j = 0; j <= steps; j++) {
		const phi = (j / steps) * 2 * Math.PI;
		points.push({
			phi,
			theta,
		});
	}

	parallelsPoints.push(points);
}

function project(x: number, y: number, z: number): Point2D {
	const xRel = x - CENTER.x;
	const yRel = y - CENTER.y;
	const zRel = z - CENTER.z;
	const factor = CAMERA_DIST / (CAMERA_DIST + zRel);
	const screenX = xRel * factor;
	const screenY = yRel * factor;

	return {
		x: canvas.width / 2 + screenX,
		y: canvas.height / 2 - screenY,
	};
}

function rotateY(p: Point3D, angle: number): Point3D {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);

	return {
		x: p.x * cos + p.z * sin,
		y: p.y,
		z: -p.x * sin + p.z * cos,
	};
}

function spherePoint(phi: number, theta: number, radius: number): Point3D {
	return {
		x: radius * Math.sin(theta) * Math.cos(phi),
		y: radius * Math.cos(theta),
		z: radius * Math.sin(theta) * Math.sin(phi),
	};
}

function draw() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = "green";
	ctx.lineWidth = 1.8;
	ctx.lineCap = "round";

	const currentRadius = RADIUS_FINAL * scaleProgress;

	for (const meridian of meridiansPoints) {
		const points3d = meridian.map(({ phi, theta }) =>
			spherePoint(phi, theta, currentRadius),
		);
		const projected = points3d
			.map(p => rotateY(p, rotationY))
			.map(p => project(p.x, p.y, p.z));

		ctx.beginPath();
		for (let i = 0; i < projected.length; i++) {
			const pt = projected[i];
			if (i === 0) ctx.moveTo(pt.x, pt.y);
			else ctx.lineTo(pt.x, pt.y);
		}
		ctx.stroke();
	}

	for (const parallel of parallelsPoints) {
		const points3d = parallel.map(({ phi, theta }) =>
			spherePoint(phi, theta, currentRadius),
		);
		const projected = points3d
			.map(p => rotateY(p, rotationY))
			.map(p => project(p.x, p.y, p.z));

		ctx.beginPath();
		for (let i = 0; i < projected.length; i++) {
			const pt = projected[i];
			if (i === 0) ctx.moveTo(pt.x, pt.y);
			else ctx.lineTo(pt.x, pt.y);
		}
		ctx.stroke();
	}

	if (isAnimating) {
		const now = performance.now();
		const elapsed = now - animStartTime;
		let newProgress = elapsed / ANIM_DURATION;
		if (newProgress >= 1) {
			newProgress = 1;
			isAnimating = false;
		}
		scaleProgress = newProgress;
	}
}

export function animate() {
	rotationY += ROTATION_SPEED;
	if (rotationY > Math.PI * 2) rotationY -= Math.PI * 2;
	draw();
	requestAnimationFrame(animate);
}

export function startAnimation() {
	isAnimating = true;
	animStartTime = performance.now();
	scaleProgress = 0;
}
