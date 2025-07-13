import * as THREE from 'three';
import { patchObject3DChangeListener } from '../src/MatrixAutoUpdate';

describe('Object3D Change Event Patching', () =>
{
	let object: THREE.Object3D;

	beforeEach(() =>
	{
		object = new THREE.Object3D();

		patchObject3DChangeListener(object);
	});

	describe('Position Changes', () =>
	{
		it('should trigger callback when position.x is changed', () =>
		{
			object.position.x = 10;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.y is changed', () =>
		{
			object.position.y = 20;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.z is changed', () =>
		{
			object.position.z = 30;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.set() is called', () =>
		{
			object.position.set(1, 2, 3);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.setX() is called', () =>
		{
			object.position.setX(5);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.setY() is called', () =>
		{
			object.position.setY(5);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.setZ() is called', () =>
		{
			object.position.setZ(5);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.add() is called', () =>
		{
			object.position.add(new THREE.Vector3(1, 1, 1));
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.addScalar() is called', () =>
		{
			object.position.addScalar(5);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when position.copy() is called', () =>
		{
			const otherVector = new THREE.Vector3(10, 20, 30);
			object.position.copy(otherVector);
			expect(object.matrixNeedsUpdate).toBe(true);
		});
	});

	describe('Scale Changes', () =>
	{
		it('should trigger callback when scale.x is changed', () =>
		{
			object.scale.x = 2;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.y is changed', () =>
		{
			object.scale.y = 3;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.z is changed', () =>
		{
			object.scale.z = 4;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.set() is called', () =>
		{
			object.scale.set(2, 2, 2);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.setScalar() is called', () =>
		{
			object.scale.setScalar(3);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.multiplyScalar() is called', () =>
		{
			object.scale.multiplyScalar(2);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when scale.copy() is called', () =>
		{
			const otherVector = new THREE.Vector3(2, 3, 4);
			object.scale.copy(otherVector);
			expect(object.matrixNeedsUpdate).toBe(true);
		});
	});

	describe('Rotation Changes', () =>
	{
		it('should trigger callback when rotation.x is changed', () =>
		{
			object.rotation.x = Math.PI / 2;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when rotation.y is changed', () =>
		{
			object.rotation.y = Math.PI / 4;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when rotation.z is changed', () =>
		{
			object.rotation.z = Math.PI;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when rotation.set() is called', () =>
		{
			object.rotation.set(Math.PI / 2, Math.PI / 4, Math.PI);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when rotation.setFromVector3() is called', () =>
		{
			const vector = new THREE.Vector3(Math.PI / 2, Math.PI / 4, Math.PI);
			object.rotation.setFromVector3(vector);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when rotation.copy() is called', () =>
		{
			const otherEuler = new THREE.Euler(Math.PI / 2, Math.PI / 4, Math.PI);
			object.rotation.copy(otherEuler);
			expect(object.matrixNeedsUpdate).toBe(true);
		});
	});

	describe('Quaternion Changes', () =>
	{
		it('should trigger callback when quaternion.x is changed', () =>
		{
			object.quaternion.x = 0.5;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.y is changed', () =>
		{
			object.quaternion.y = 0.3;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.z is changed', () =>
		{
			object.quaternion.z = 0.7;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.w is changed', () =>
		{
			object.quaternion.w = 0.9;
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.set() is called', () =>
		{
			object.quaternion.set(0.5, 0.3, 0.7, 0.9);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.setFromAxisAngle() is called', () =>
		{
			const axis = new THREE.Vector3(1, 0, 0);
			object.quaternion.setFromAxisAngle(axis, Math.PI / 2);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.setFromEuler() is called', () =>
		{
			const euler = new THREE.Euler(Math.PI / 2, Math.PI / 4, Math.PI);
			object.quaternion.setFromEuler(euler);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.copy() is called', () =>
		{
			const otherQuaternion = new THREE.Quaternion(0.5, 0.3, 0.7, 0.9);
			object.quaternion.copy(otherQuaternion);
			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should trigger callback when quaternion.multiply() is called', () =>
		{
			const otherQuaternion = new THREE.Quaternion(0.5, 0.3, 0.7, 0.9);
			object.quaternion.multiply(otherQuaternion);
			expect(object.matrixNeedsUpdate).toBe(true);
		});
	});

	describe('Matrix Update Behavior', () =>
	{
		it('should reset matrixNeedsUpdate flag after updateMatrix() is called', () =>
		{
			object.position.x = 10;
			expect(object.matrixNeedsUpdate).toBe(true);

			object.updateMatrix();
			expect(object.matrixNeedsUpdate).toBe(false);
		});

		it('should increment updatedMatrices counter when updateMatrix() is called', () =>
		{
			const { updatedMatrices, resetUpdatedMatrices } = require('../src/MatrixAutoUpdate');

			resetUpdatedMatrices();
			object.position.x = 10;
			object.updateMatrix();

			expect(updatedMatrices).toBe(1);
		});

		it('should handle multiple property changes correctly', () =>
		{
			object.position.x = 10;
			object.scale.y = 2;
			object.rotation.z = Math.PI;
			object.quaternion.w = 0.5;

			expect(object.matrixNeedsUpdate).toBe(true);

			object.updateMatrix();
			expect(object.matrixNeedsUpdate).toBe(false);
		});
	});

	describe('Chaining Operations', () =>
	{
		it('should handle chained position operations', () =>
		{
			object.position
				.set(0, 0, 0)
				.addScalar(1)
				.multiplyScalar(2);

			expect(object.matrixNeedsUpdate).toBe(true);
		});

		it('should handle chained scale operations', () =>
		{
			object.scale
				.set(1, 1, 1)
				.multiplyScalar(2)
				.addScalar(1);

			expect(object.matrixNeedsUpdate).toBe(true);
		});
	});

	describe('Multiple Objects', () =>
	{
		it('should patch multiple objects independently', () =>
		{
			const object1 = new THREE.Object3D();
			const object2 = new THREE.Object3D();

			patchObject3DChangeListener(object1);
			patchObject3DChangeListener(object2);

			object1.position.x = 10;
			object2.scale.y = 2;

			expect(object1.matrixNeedsUpdate).toBe(true);
			expect(object2.matrixNeedsUpdate).toBe(true);
		});

		it('should not interfere with unpatched objects', () =>
		{
			const unpatchedObject = new THREE.Object3D();

			object.position.x = 10;
			unpatchedObject.position.x = 10;

			expect(object.matrixNeedsUpdate).toBe(true);
			expect(unpatchedObject.matrixNeedsUpdate).not.toBe(true);
		});
	});
});
