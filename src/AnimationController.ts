import * as THREE from 'three';
import { Tween, Group, Easing } from '@tweenjs/tween.js';

export interface AnimationObject
{
	object: THREE.Object3D;
	originalY: number;
	isAnimating: boolean;
}

export class AnimationController
{
	private objectAnimations: AnimationObject[][] = [];
	private tweenGroup: Group;
	private currentRowIndex: number = 0;
	private lastWaveTime: number = 0;
	private waveInterval: number = 500;
	private isWaveActive: boolean = false;

	constructor()
	{
		this.tweenGroup = new Group();
	}

	public initializeAnimations(objectsToAnimate: THREE.Object3D[][]): void
	{
		this.objectAnimations = [];
		objectsToAnimate.forEach((row) =>
		{
			this.objectAnimations.push([]);
			row.forEach((object) =>
			{
				this.objectAnimations[this.objectAnimations.length - 1].push({
					object,
					originalY: object.position.y,
					isAnimating: false
				});
			});
		});
	}

	public startWaveAnimation(): void
	{
		this.isWaveActive = true;
		this.currentRowIndex = 0;
		this.lastWaveTime = performance.now();
	}

	public stopWaveAnimation(): void
	{
		this.isWaveActive = false;
	}

	public setWaveInterval(interval: number): void
	{
		this.waveInterval = interval;
	}

	public update(currentTime: number): void
	{
		if (!this.isWaveActive) return;

		if (currentTime - this.lastWaveTime >= this.waveInterval)
		{
			if (this.currentRowIndex < this.objectAnimations.length)
			{
				const animations = this.objectAnimations[this.currentRowIndex];

				for (const animation of animations)
				{
					if (!animation.isAnimating)
					{
						animation.isAnimating = true;
						this.createJumpAnimation(animation, () =>
						{
							animation.isAnimating = false;
						});
					}
				}
				this.currentRowIndex++;
			} else
			{
				this.currentRowIndex = 0;
			}
			this.lastWaveTime = currentTime;
		}

		this.tweenGroup.update();
	}

	private createJumpAnimation(animation: AnimationObject, onComplete?: () => void): void
	{
		new Tween({ y: animation.originalY }, this.tweenGroup)
			.to({ y: animation.originalY + 3 }, 300)
			.easing(Easing.Quadratic.Out)
			.onUpdate((coords) =>
			{
				animation.object.position.y = coords.y;
			})
			.onComplete(() =>
			{
				new Tween({ y: animation.object.position.y }, this.tweenGroup)
					.to({ y: animation.originalY }, 300)
					.easing(Easing.Quadratic.In)
					.onUpdate((coords) =>
					{
						animation.object.position.y = coords.y;
					})
					.onComplete(() =>
					{
						if (onComplete) onComplete();
					})
					.start();
			})
			.start();
	}

	public cleanup(): void
	{
		// Clean up any completed tweens
		this.tweenGroup.update();
	}

	public getAnimationStats(): { totalObjects: number; animatingObjects: number }
	{
		let totalObjects = 0;
		let animatingObjects = 0;

		this.objectAnimations.forEach(row =>
		{
			row.forEach(animation =>
			{
				totalObjects++;
				if (animation.isAnimating)
				{
					animatingObjects++;
				}
			});
		});

		return { totalObjects, animatingObjects };
	}
} 