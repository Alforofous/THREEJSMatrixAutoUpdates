import * as THREE from 'three';
import { Object3DCallbacks } from './Object3DCallbacks';

type DisposableEventMap = {
	dispose: THREE.Event<'dispose', InstanceTracker3D>;
};

type InstanceTrackerEventMap = DisposableEventMap & THREE.Object3DEventMap;

/**
 * A tracker object which updates the instance matrix of the tracked instance when its matrixWorld is updated.
 * When the tracker is removed from the scene, the instance is removed from the instanced mesh.
 */
export class InstanceTracker3D<TEventMap extends InstanceTrackerEventMap = InstanceTrackerEventMap> extends THREE.Object3D<TEventMap>
{
	#mesh: THREE.InstancedMesh;
	#index: number = -1;
	#color: THREE.Color | null = null;
	#boundingAreasNeedUpdate: boolean = false;
	#visible: boolean = true;

	constructor(mesh: THREE.InstancedMesh)
	{
		super();

		this.#mesh = mesh;
		const updateBoundingAreasKey = 'InstanceTrackerUpdateBoundingAreas';
		if (this.#mesh.callbacks === undefined)
		{
			this.#mesh.callbacks = new Object3DCallbacks(this.#mesh);
		}
		this.addEventListener('added', () =>
		{
			this.#mesh.callbacks?.onBeforeMatrixWorldUpdate.set(updateBoundingAreasKey, () =>
			{
				if (this.#boundingAreasNeedUpdate)
				{
					this.#mesh.computeBoundingBox();
					this.#mesh.computeBoundingSphere();
					this.#boundingAreasNeedUpdate = false;
				}
			});

			if (this.#index !== -1 || this.visible === false)
			{
				return;
			}
			this.#index = this.#assignInstance();
		});
		Object.defineProperty(this, "visible", {
			get: () =>
			{
				return this.#visible;
			},
			set: (value: boolean) =>
			{
				this.#visible = value;
				if (value)
				{
					this.#index = this.#assignInstance();
					if (this.#color)
					{
						this.setColor(this.#color.getHex());
					}
				}
				else
				{
					this.#freeInstance();
				}
			}
		});
		this.addEventListener('matrixWorldUpdated', () =>
		{
			this.updateInstanceMatrix();
		});
	}

	updateInstanceMatrix(): void
	{
		const oldMatrix = new THREE.Matrix4();
		this.#mesh.getMatrixAt(this.#index, oldMatrix);
		if (!oldMatrix.equals(this.matrixWorld))
		{
			this.#mesh.setMatrixAt(this.#index, this.matrixWorld);
			this.#mesh.instanceMatrix.needsUpdate = true;
			this.#boundingAreasNeedUpdate = true;
		}
	}

	updateMatrixWorld(force: boolean = false): void
	{
		super.updateMatrixWorld(force);
		const oldMatrix = new THREE.Matrix4();
		this.#mesh.getMatrixAt(this.#index, oldMatrix);
		if (!oldMatrix.equals(this.matrixWorld))
		{
			this.#mesh.setMatrixAt(this.#index, this.matrixWorld);
			this.#mesh.instanceMatrix.needsUpdate = true;
			this.#boundingAreasNeedUpdate = true;
		}
	}

	dispose(): void
	{
		this.#freeInstance();
		this.remove(...this.children);
		this.removeFromParent();
		this.dispatchEvent({ type: 'dispose', target: this } as unknown as Parameters<typeof this.dispatchEvent>[0]);
	}

	static getTrackerFromInstancedMesh(mesh: THREE.InstancedMesh, index: number): InstanceTracker3D
	{
		const tracker = mesh.userData.trackerObjects.get(index) as InstanceTracker3D | undefined;
		if (!tracker)
		{
			throw new Error('Tracker not found.');
		}

		return tracker;
	}

	#assignInstance(): number
	{
		if (this.#index !== -1)
		{
			return this.#index;
		}
		const maxCount = this.#mesh.instanceMatrix.count;
		if (this.#mesh.count >= maxCount)
		{
			throw new Error('Instance count exceeds the maximum count.');
		}
		this.#mesh.count++;
		if (!this.#mesh.userData.trackerObjects)
		{
			this.#mesh.userData.trackerObjects = new Map<number, InstanceTracker3D>();
		}
		const index = this.#mesh.count - 1;
		this.#mesh.userData.trackerObjects.set(index, this);

		return index;
	}

	#freeInstance(): void
	{
		if (this.#index === -1)
		{
			return;
		}
		const lastIndex = this.#mesh.count - 1;
		if (this.#index !== lastIndex)
		{
			const lastTracker = this.#mesh.userData.trackerObjects.get(lastIndex) as InstanceTracker3D;
			lastTracker.#index = this.#index;
			this.#swapInstanceMatrices(this.#index, lastIndex);
			this.#swapAttributes(this.#index, lastIndex);
			this.#mesh.userData.trackerObjects.set(this.#index, lastTracker);
		}
		this.#mesh.userData.trackerObjects.delete(lastIndex);
		this.#mesh.count--;
		this.#index = -1;
	}

	#swapInstanceMatrices(index1: number, index2: number): void
	{
		const matrix1 = new THREE.Matrix4();
		const matrix2 = new THREE.Matrix4();
		this.#mesh.getMatrixAt(index1, matrix1);
		this.#mesh.getMatrixAt(index2, matrix2);
		this.#mesh.setMatrixAt(index1, matrix2);
		this.#mesh.setMatrixAt(index2, matrix1);
		this.#mesh.instanceMatrix.needsUpdate = true;
	}

	#swapAttributes(index1: number, index2: number): void
	{
		const defaultAttributes = [
			'position', 'normal', 'uv', 'instanceIndex'
		];

		for (const attributeName of Object.keys(this.#mesh.geometry.attributes))
		{
			if (defaultAttributes.includes(attributeName))
			{
				continue;
			}
			const attribute = this.#mesh.geometry.getAttribute(attributeName);
			const itemSize = attribute.itemSize;

			for (let i = 0; i < itemSize; i++)
			{
				const i1 = index1 * itemSize + i;
				const i2 = index2 * itemSize + i;
				[attribute.array[i1], attribute.array[i2]] = [attribute.array[i2], attribute.array[i1]];
			}

			attribute.needsUpdate = true;

		}
		if (this.#mesh.instanceColor)
		{
			const color1 = new THREE.Color();
			const color2 = new THREE.Color();
			this.#mesh.getColorAt(index1, color1);
			this.#mesh.getColorAt(index2, color2);
			this.#mesh.setColorAt(index1, color2);
			this.#mesh.setColorAt(index2, color1);
			this.#mesh.instanceColor.needsUpdate = true;
		}
	}

	setColor(color: THREE.ColorRepresentation): void
	{
		if (this.#color === null)
		{
			this.#color = new THREE.Color(color);
		}
		this.#color.set(color);
		if (this.#index === -1 || !this.#mesh.instanceColor)
		{
			return;
		}
		this.#mesh.setColorAt(this.#index, this.#color);
		this.#mesh.instanceColor.needsUpdate = true;
	}

	getColor(): THREE.Color | null
	{
		if (this.#index === -1 || !this.#mesh.instanceColor)
		{
			return null;
		}

		const color = new THREE.Color();
		this.#mesh.getColorAt(this.#index, color);

		return color;
	}

	get instancedMesh(): THREE.InstancedMesh
	{
		return this.#mesh;
	}

	get instanceIndex(): number
	{
		return this.#index;
	}

	get isAssigned(): boolean
	{
		return this.#index !== -1;
	}

	static createInstancedMesh(geometry: THREE.BufferGeometry, material: THREE.Material, count: number): THREE.InstancedMesh
	{
		const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
		instancedMesh.count = 0;
		return instancedMesh;
	}
}