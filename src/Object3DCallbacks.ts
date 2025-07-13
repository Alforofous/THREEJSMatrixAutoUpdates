import * as THREE from "three";

declare module "three" {
	interface Object3D
	{
		callbacks?: Object3DCallbacks;
	}
}

export type OnRenderCallback = (
	renderer: THREE.WebGLRenderer,
	scene: THREE.Scene,
	camera: THREE.Camera,
	geometry: THREE.BufferGeometry,
	material: THREE.Material,
	group: THREE.Group
) => void;

export class Object3DCallbacks
{
	#object3d: THREE.Object3D;
	#onBeforeRenderCallbacks: Map<string, OnRenderCallback> = new Map();
	#onAfterRenderCallbacks: Map<string, OnRenderCallback> = new Map();
	#onBeforeMatrixWorldUpdateCallbacks: Map<string, () => void> = new Map();
	#onAfterMatrixWorldUpdateCallbacks: Map<string, () => void> = new Map();

	constructor(object3d: THREE.Object3D)
	{
		this.#object3d = object3d;
		const originalOnBeforeRender = this.#object3d.onBeforeRender;
		this.#object3d.onBeforeRender = (renderer, scene, camera, geometry, material, group): void =>
		{
			for (const callback of this.#onBeforeRenderCallbacks.values())
			{
				callback(renderer, scene, camera, geometry, material, group);
			}
			originalOnBeforeRender?.(renderer, scene, camera, geometry, material, group);
		};
		const originalOnAfterRender = this.#object3d.onAfterRender;
		this.#object3d.onAfterRender = (renderer, scene, camera, geometry, material, group): void =>
		{
			for (const callback of this.#onAfterRenderCallbacks.values())
			{
				callback(renderer, scene, camera, geometry, material, group);
			}
			originalOnAfterRender?.(renderer, scene, camera, geometry, material, group);
		};
		const originalUpdateMatrixWorld = this.#object3d.updateMatrixWorld.bind(
			this.#object3d
		);
		this.#object3d.updateMatrixWorld = (force?: boolean): void =>
		{
			for (const callback of this.#onBeforeMatrixWorldUpdateCallbacks.values())
			{
				callback();
			}
			originalUpdateMatrixWorld?.(force);
			for (const callback of this.#onAfterMatrixWorldUpdateCallbacks.values())
			{
				callback();
			}
		};
	}

	get onBeforeRender(): Map<string, OnRenderCallback>
	{
		return this.#onBeforeRenderCallbacks;
	}

	get onAfterRender(): Map<string, OnRenderCallback>
	{
		return this.#onAfterRenderCallbacks;
	}

	get onBeforeMatrixWorldUpdate(): Map<string, () => void>
	{
		return this.#onBeforeMatrixWorldUpdateCallbacks;
	}

	get onAfterMatrixWorldUpdate(): Map<string, () => void>
	{
		return this.#onAfterMatrixWorldUpdateCallbacks;
	}

	dispose(): void
	{
		this.#onBeforeRenderCallbacks.clear();
		this.#onAfterRenderCallbacks.clear();
		this.#onBeforeMatrixWorldUpdateCallbacks.clear();
		this.#onAfterMatrixWorldUpdateCallbacks.clear();
	}
}