import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-gl';
import { Tween, Group, Easing } from '@tweenjs/tween.js';
import { HierarchicalGridObjects } from './HierarchicalGridObjects';
import { resetUpdatedMatrices, updatedMatrices, resetUpdatedWorldMatrices, updatedWorldMatrices, patchObject3DChangeListener } from './MatrixAutoUpdate';

const stats = new Stats({
	trackGPU: true,
	trackHz: true,
	trackCPT: true,
	logsPerSecond: 4,
	graphsPerSecond: 30,
	samplesLog: 40,
	samplesGraph: 10,
	precision: 2,
	horizontal: true,
	minimal: false,
	mode: 0
});
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);
const hierarchicalGridObjects = new HierarchicalGridObjects({
	objectCount: 20000,
	groundPlane: true,
});
scene.add(hierarchicalGridObjects);

const ambientLight = new THREE.AmbientLight(0x6f6f6f, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.zoomToCursor = true;
delete controls.mouseButtons.LEFT;
controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const objectsToAnimate = hierarchicalGridObjects.getGridObjects();

const objectAnimations: {
	object: THREE.Object3D;
	originalY: number;
	isAnimating: boolean;
}[][] = [];

const tweenGroup = new Group();
objectsToAnimate.forEach((row) =>
{
	objectAnimations.push([]);
	row.forEach((object) =>
	{
		objectAnimations[objectAnimations.length - 1].push({
			object,
			originalY: object.position.y,
			isAnimating: false
		});
	});
});

let currentRowIndex = 0;
let lastWaveTime = 0;
const waveInterval = 500;


function createJumpAnimation(animation: typeof objectAnimations[0][0], onComplete?: () => void)
{
	// Create new tween1 for the upward movement
	const tween1 = new Tween({ y: animation.originalY }, tweenGroup)
		.to({ y: animation.originalY + 3 }, 300)
		.easing(Easing.Quadratic.Out)
		.onUpdate((coords) =>
		{
			animation.object.position.y = coords.y;
		})
		.onComplete(() =>
		{
			// Create new tween2 for the downward movement
			const tween2 = new Tween({ y: animation.object.position.y }, tweenGroup)
				.to({ y: animation.originalY }, 300)
				.easing(Easing.Quadratic.In)
				.onUpdate((coords) =>
				{
					animation.object.position.y = coords.y;
				})
				.onComplete(() =>
				{
					// Call the completion callback when the entire jump animation is done
					if (onComplete) onComplete();
				})
				.start();
		})
		.start();
}

let topPosition = 10;
function createDisplayDiv()
{
	const displayDiv = document.createElement('div');
	displayDiv.style.position = 'absolute';
	displayDiv.style.top = `${topPosition}px`;
	displayDiv.style.right = '10px';
	displayDiv.style.color = 'white';
	displayDiv.style.fontFamily = 'monospace';
	displayDiv.style.fontSize = '14px';
	displayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
	displayDiv.style.padding = '8px 12px';
	displayDiv.style.borderRadius = '4px';
	displayDiv.style.border = '1px solid white';
	displayDiv.style.zIndex = '1000';
	displayDiv.style.userSelect = 'none';
	document.body.appendChild(displayDiv);

	topPosition += 40;

	return displayDiv;
}

const displayDiv1 = createDisplayDiv();
const displayDiv2 = createDisplayDiv();
const displayDiv3 = createDisplayDiv(); // Add memory monitoring

/* scene.traverse(object =>
{
	patchObject3DChangeListener(object);
}); */

renderer.setAnimationLoop(animate);

// Add periodic cleanup to prevent memory leaks
setInterval(() =>
{
	// Clean up any completed tweens
	tweenGroup.update();

	// Force garbage collection if available (for debugging)
	if (window.gc)
	{
		window.gc();
	}
}, 5000); // Every 5 seconds

function animate()
{
	stats.begin();

	const currentTime = performance.now();

	// Control wave timing in the animation loop instead of setInterval
	/* if (currentTime - lastWaveTime >= waveInterval)
	{
		if (currentRowIndex < objectAnimations.length)
		{
			const animations = objectAnimations[currentRowIndex];

			for (const animation of animations)
			{
				if (!animation.isAnimating)
				{
					animation.isAnimating = true;
					createJumpAnimation(animation, () =>
					{
						animation.isAnimating = false;
					});
				}
			}
			currentRowIndex++;
		} else
		{
			currentRowIndex = 0;
		}
		lastWaveTime = currentTime;
	} */

	tweenGroup.update();

	controls.update();
	renderer.render(scene, camera);
	stats.end();
	stats.update();

	displayDiv1.textContent = `Updated Matrices: ${updatedMatrices}`;
	displayDiv2.textContent = `Updated World Matrices: ${updatedWorldMatrices}`;

	// Add memory monitoring
	if ('memory' in performance)
	{
		const memory = (performance as any).memory;
		const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
		const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
		displayDiv3.textContent = `Memory: ${usedMB}MB / ${totalMB}MB`;
	}

	resetUpdatedMatrices();
	resetUpdatedWorldMatrices();
}

window.addEventListener('resize', () =>
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
