import * as THREE from 'three';
import { InstanceTracker3D } from './InstanceTracker3D';

export interface HierarchicalGridObjectsConfig
{
	objectCount?: number;
	groundPlane?: boolean;
}

export class HierarchicalGridObjects extends THREE.Object3D
{
	private config: Required<HierarchicalGridObjectsConfig>;
	private spacing = 2.5;
	private gridObjects: THREE.Object3D[][] = [];
	private instancedMesh1: THREE.InstancedMesh;
	private instancedMesh2: THREE.InstancedMesh;
	private instancedMesh3: THREE.InstancedMesh;

	constructor(config: HierarchicalGridObjectsConfig = {})
	{
		super();
		this.config = {
			objectCount: 1000,
			groundPlane: true,
			...config
		};
		this.instancedMesh1 = InstanceTracker3D.createInstancedMesh(
			new THREE.BoxGeometry(1, 1, 1),
			new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
			this.config.objectCount
		);
		this.add(this.instancedMesh1);
		this.instancedMesh2 = InstanceTracker3D.createInstancedMesh(
			new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
			new THREE.MeshLambertMaterial({ color: 0xff0000 }),
			this.config.objectCount
		);
		this.add(this.instancedMesh2);
		this.instancedMesh3 = InstanceTracker3D.createInstancedMesh(
			new THREE.ConeGeometry(0.5, 1, 32),
			new THREE.MeshLambertMaterial({ color: 0x0000ff }),
			this.config.objectCount
		);
		this.add(this.instancedMesh3);
		this.build();
	}

	build(): void
	{
		if (this.config.groundPlane)
		{
			this.addGroundPlane();
		}

		this.createGridObjects();
	}

	private addGroundPlane(): void
	{
		const gridSize = this.gridSize * this.spacing;
		const gridHelper = new THREE.GridHelper(gridSize, gridSize, 0x6a6a6a, 0x222225); 0
		gridHelper.position.y = 0;
		this.add(gridHelper);

		const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
		const planeMaterial = new THREE.MeshLambertMaterial({
			color: 0x2c2c2c,
			transparent: true,
			opacity: 0.6,
			side: THREE.DoubleSide
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -0.01;
		this.add(plane);
	}

	public get gridSize(): number
	{
		return Math.ceil(Math.sqrt(this.config.objectCount));
	}

	private createGridObjects(): void
	{
		const childSpawnChance = 0.3;
		const gridSize = this.gridSize;
		let level0Count = 0;

		this.gridObjects = [];
		for (let i = 1; i < gridSize && level0Count <= this.config.objectCount; i++)
		{
			this.gridObjects.push([]);
			for (let j = 1; j < gridSize && level0Count <= this.config.objectCount; j++)
			{
				const x = (i - gridSize / 2) * this.spacing;
				const z = (j - gridSize / 2) * this.spacing;

				const rootObject = this.createObject(0);
				this.add(rootObject);
				rootObject.position.set(x, 0.5, z);
				level0Count++;

				let currentParent = rootObject;
				let currentLevel = 1;

				while (Math.random() < childSpawnChance && currentLevel <= 2)
				{
					const childObject = this.createObject(currentLevel);
					currentParent.add(childObject);
					childObject.position.set(0, 1, 0);

					currentParent = childObject;
					currentLevel++;
				}

				this.gridObjects[i - 1][j - 1] = rootObject;
			}
		}
	}

	public traverseGridObjects(callback: (object: THREE.Object3D, x: number, y: number) => void): void
	{
		this.gridObjects.forEach((row, x) =>
		{
			row.forEach((object, y) => callback(object, x, y));
		});
	}

	public getGridObject(x: number, y: number): THREE.Object3D
	{
		return this.gridObjects[x][y];
	}

	public getGridObjects(): THREE.Object3D[][]
	{
		return this.gridObjects;
	}

	private createObject(hierarchyLevel: number): THREE.Object3D
	{
		let instancedMesh: THREE.InstancedMesh;
		if (hierarchyLevel === 0)
		{
			instancedMesh = this.instancedMesh1;
		}
		else if (hierarchyLevel === 1)
		{
			instancedMesh = this.instancedMesh2;
		}
		else
		{
			instancedMesh = this.instancedMesh3;
		}

		const object = ObjectFactory.createInstanceTracker(instancedMesh);

		return object;
	}

	static isGridObject(object: THREE.Object3D): object is THREE.Mesh
	{
		return object.userData.isGridObject;
	}
}

class ObjectFactory
{
	static readonly geometries = {
		box: new THREE.BoxGeometry(1, 1, 1),
		cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
		pyramid: new THREE.ConeGeometry(0.5, 1, 32)
	};

	static createInstanceTracker(instancedMesh: THREE.InstancedMesh): InstanceTracker3D
	{
		const instanceTracker = new InstanceTracker3D(instancedMesh);
		instanceTracker.userData.isGridObject = true;

		return instanceTracker;
	}
} 