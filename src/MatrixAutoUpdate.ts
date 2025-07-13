import * as THREE from 'three';
import { addVector3ChangeListener } from './addVector3ChangeListener';

declare module 'three'
{
	interface Object3D
	{
		matrixNeedsUpdate: boolean;
	}

	interface Object3DEventMap
	{
		matrixUpdated: THREE.Event<'matrixUpdated', THREE.Object3D>;
		matrixWorldUpdated: THREE.Event<'matrixWorldUpdated', THREE.Object3D>;
	}
}

export let updatedMatrices = 0;
export function resetUpdatedMatrices()
{
	updatedMatrices = 0;
}
export let updatedWorldMatrices = 0;
export function resetUpdatedWorldMatrices()
{
	updatedWorldMatrices = 0;
}

export function patchObject3DChangeListener(object: THREE.Object3D): void
{
	object.matrixNeedsUpdate = true;
	object.matrixWorldNeedsUpdate = true;

	const onChangeCallback = (): void =>
	{
		object.matrixNeedsUpdate = true;
	}

	addVector3ChangeListener(object.position, onChangeCallback);
	addVector3ChangeListener(object.scale, onChangeCallback);
	const originalQuaternionOnChangeCallback = THREE.Quaternion.prototype._onChangeCallback;
	object.quaternion._onChangeCallback = (): void =>
	{
		originalQuaternionOnChangeCallback.call(object.quaternion);
		onChangeCallback();
	}

	const originalEulerOnChangeCallback = THREE.Euler.prototype._onChangeCallback;
	object.rotation._onChangeCallback = (): void =>
	{
		originalEulerOnChangeCallback.call(object.rotation);
		onChangeCallback();
	}

	object.updateMatrix = function ()
	{
		if (this.matrixNeedsUpdate)
		{
			this.matrixNeedsUpdate = false;
			this.matrix.compose(this.position, this.quaternion, this.scale);
			this.matrixWorldNeedsUpdate = true;
			updatedMatrices++;
			this.dispatchEvent({ type: 'matrixUpdated', target: this });
		}
	}

	object.updateMatrixWorld = function (force?: boolean)
	{
		if (this.matrixAutoUpdate) this.updateMatrix();
		if (this.matrixWorldNeedsUpdate || force)
		{
			if (this.matrixWorldAutoUpdate === true)
			{
				if (this.parent === null)
				{
					this.matrixWorld.copy(this.matrix);
				} else
				{
					this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
				}
				updatedWorldMatrices++;
				this.dispatchEvent({ type: 'matrixWorldUpdated', target: this });
			}
			this.matrixWorldNeedsUpdate = false;
			force = true;
		}

		const children = this.children;
		for (let i = 0, l = children.length; i < l; i++)
		{
			const child = children[i];
			child.updateMatrixWorld(force);
		}
	}
}