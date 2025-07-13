import * as THREE from 'three';
import { addVector3ChangeListener } from '../src/addVector3ChangeListener';

describe('addVector3ChangeListener', () =>
{
	let vector: THREE.Vector3;
	let callback: jest.Mock;

	beforeEach(() =>
	{
		vector = new THREE.Vector3(1, 2, 3);
		callback = jest.fn();
		addVector3ChangeListener(vector, callback);
	});

	afterEach(() =>
	{
		jest.clearAllMocks();
	});

	describe('set method', () =>
	{
		it('should call callback when set is called', () =>
		{
			vector.set(4, 5, 6);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(4);
			expect(vector.y).toBe(5);
			expect(vector.z).toBe(6);
		});

		it('should call callback when setX is called', () =>
		{
			vector.setX(10);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(vector.x).toBe(10);
		});

		it('should call callback when setY is called', () =>
		{
			vector.setY(20);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(vector.y).toBe(20);
		});

		it('should call callback when setZ is called', () =>
		{
			vector.setZ(30);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(vector.z).toBe(30);
		});

		it('should call callback when setScalar is called', () =>
		{
			vector.setScalar(5);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(5);
			expect(vector.y).toBe(5);
			expect(vector.z).toBe(5);
		});

		it('should call callback when setComponent is called', () =>
		{
			vector.setComponent(0, 100);
			expect(callback).toHaveBeenCalledTimes(1);
			expect(vector.x).toBe(100);
		});
	});

	describe('copy method', () =>
	{
		it('should call callback when copy is called', () =>
		{
			const otherVector = new THREE.Vector3(10, 20, 30);
			vector.copy(otherVector);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(10);
			expect(vector.y).toBe(20);
			expect(vector.z).toBe(30);
		});
	});

	describe('add methods', () =>
	{
		it('should call callback when add is called', () =>
		{
			const otherVector = new THREE.Vector3(1, 1, 1);
			vector.add(otherVector);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(2);
			expect(vector.y).toBe(3);
			expect(vector.z).toBe(4);
		});

		it('should call callback when addScalar is called', () =>
		{
			vector.addScalar(5);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(6);
			expect(vector.y).toBe(7);
			expect(vector.z).toBe(8);
		});

		it('should call callback when addVectors is called', () =>
		{
			const a = new THREE.Vector3(1, 1, 1);
			const b = new THREE.Vector3(2, 2, 2);
			vector.addVectors(a, b);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(3);
			expect(vector.y).toBe(3);
			expect(vector.z).toBe(3);
		});

		it('should call callback when addScaledVector is called', () =>
		{
			const otherVector = new THREE.Vector3(1, 1, 1);
			vector.addScaledVector(otherVector, 2);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(3);
			expect(vector.y).toBe(4);
			expect(vector.z).toBe(5);
		});
	});

	describe('subtract methods', () =>
	{
		it('should call callback when sub is called', () =>
		{
			const otherVector = new THREE.Vector3(1, 1, 1);
			vector.sub(otherVector);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(0);
			expect(vector.y).toBe(1);
			expect(vector.z).toBe(2);
		});

		it('should call callback when subScalar is called', () =>
		{
			vector.subScalar(1);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(0);
			expect(vector.y).toBe(1);
			expect(vector.z).toBe(2);
		});

		it('should call callback when subVectors is called', () =>
		{
			const a = new THREE.Vector3(5, 5, 5);
			const b = new THREE.Vector3(1, 1, 1);
			vector.subVectors(a, b);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(4);
			expect(vector.y).toBe(4);
			expect(vector.z).toBe(4);
		});
	});

	describe('multiply methods', () =>
	{
		it('should call callback when multiply is called', () =>
		{
			const otherVector = new THREE.Vector3(2, 2, 2);
			vector.multiply(otherVector);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(2);
			expect(vector.y).toBe(4);
			expect(vector.z).toBe(6);
		});

		it('should call callback when multiplyScalar is called', () =>
		{
			vector.multiplyScalar(3);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(3);
			expect(vector.y).toBe(6);
			expect(vector.z).toBe(9);
		});

		it('should call callback when multiplyVectors is called', () =>
		{
			const a = new THREE.Vector3(2, 2, 2);
			const b = new THREE.Vector3(3, 3, 3);
			vector.multiplyVectors(a, b);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(6);
			expect(vector.y).toBe(6);
			expect(vector.z).toBe(6);
		});
	});

	describe('divide methods', () =>
	{
		it('should call callback when divide is called', () =>
		{
			const otherVector = new THREE.Vector3(2, 2, 2);
			vector.divide(otherVector);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(0.5);
			expect(vector.y).toBe(1);
			expect(vector.z).toBe(1.5);
		});

		it('should call callback when divideScalar is called', () =>
		{
			vector.divideScalar(2);
			expect(callback).toHaveBeenCalledTimes(3);
			expect(vector.x).toBe(0.5);
			expect(vector.y).toBe(1);
			expect(vector.z).toBe(1.5);
		});
	});

	describe('multiple operations', () =>
	{
		it('should call callback for each operation', () =>
		{
			vector.set(0, 0, 0);
			vector.addScalar(1);
			vector.multiplyScalar(2);
			vector.add(new THREE.Vector3(1, 1, 1));

			expect(callback).toHaveBeenCalledTimes(12);
			expect(vector.x).toBe(3);
			expect(vector.y).toBe(3);
			expect(vector.z).toBe(3);
		});
	});

	describe('chaining', () =>
	{
		it('should support method chaining', () =>
		{
			const result = vector
				.set(0, 0, 0)
				.addScalar(1)
				.multiplyScalar(2);

			expect(result).toBe(vector);
			expect(callback).toHaveBeenCalledTimes(9);
			expect(vector.x).toBe(2);
			expect(vector.y).toBe(2);
			expect(vector.z).toBe(2);
		});
	});
}); 