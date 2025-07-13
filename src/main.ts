import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats-gl';
import { HierarchicalGridObjects } from './HierarchicalGridObjects';
import { resetUpdatedMatrices, updatedMatrices, resetUpdatedWorldMatrices, updatedWorldMatrices, patchObject3DChangeListener } from './MatrixAutoUpdate';
import { AnimationController } from './AnimationController';
import { PerformanceDisplay } from './PerformanceDisplay';
import { GUI } from 'lil-gui';

const stats = new Stats();
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f0f);
const hierarchicalGridObjects = new HierarchicalGridObjects({
	objectCount: 20000,
	groundPlane: true,
});

const config = {
	patchObject3DChangeListener: true,
	animationInterval: 500,
	maxConcurrentAnimations: 100,
};

const gui = new GUI();
gui.add(config, 'patchObject3DChangeListener').onChange(() =>
{
	init();
});
gui.add(config, 'animationInterval', 10, 2000).onChange(() =>
{
	animationController.setWaveInterval(config.animationInterval);
});
gui.add(config, 'maxConcurrentAnimations', 10, 500).onChange(() =>
{
	animationController.setMaxConcurrentAnimations(config.maxConcurrentAnimations);
});
gui.add(hierarchicalGridObjects.config, 'objectCount', 1000, 100000).onFinishChange(() =>
{
	init();
});


const animationController = new AnimationController();
init();

function init(): void
{
	hierarchicalGridObjects.build();
	animationController.initializeAnimations(hierarchicalGridObjects.getGridObjects());
	animationController.setWaveInterval(config.animationInterval);
	animationController.setMaxConcurrentAnimations(config.maxConcurrentAnimations);
	animationController.startWaveAnimation();
	scene.add(hierarchicalGridObjects);
	if (config.patchObject3DChangeListener)
	{
		scene.traverse(child =>
		{
			patchObject3DChangeListener(child);
		});
	}
}


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
controls.panSpeed = 0.8;
controls.rotateSpeed = 0.7;

const performanceDisplay = new PerformanceDisplay();

renderer.setAnimationLoop(animate);

function animate()
{
	stats.begin();

	const currentTime = performance.now();

	animationController.update(currentTime);

	controls.update();
	renderer.render(scene, camera);
	stats.end();
	stats.update();

	const animationStats = animationController.getAnimationStats();
	performanceDisplay.updateAllStats(
		config.patchObject3DChangeListener ? updatedMatrices : Infinity,
		config.patchObject3DChangeListener ? updatedWorldMatrices : Infinity,
		animationStats.animatingObjects,
		animationStats.totalObjects
	);

	resetUpdatedMatrices();
	resetUpdatedWorldMatrices();
}

window.addEventListener('resize', () =>
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('beforeunload', () =>
{
	renderer.dispose();
	controls.dispose();
	stats.dom.remove();
});