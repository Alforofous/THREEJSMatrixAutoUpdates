import * as THREE from 'three';

export function addVector3ChangeListener(vector: THREE.Vector3, onUpdateCallback: () => void): void
{
	let x = vector.x;
	let y = vector.y;
	let z = vector.z;

	Object.defineProperty(vector, 'x', {
		get: () => x,
		set: (value: number) =>
		{
			x = value;
			onUpdateCallback();
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(vector, 'y', {
		get: () => y,
		set: (value: number) =>
		{
			y = value;
			onUpdateCallback();
		},
		enumerable: true,
		configurable: true
	});

	Object.defineProperty(vector, 'z', {
		get: () => z,
		set: (value: number) =>
		{
			z = value;
			onUpdateCallback();
		},
		enumerable: true,
		configurable: true
	});
}