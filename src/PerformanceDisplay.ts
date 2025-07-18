export class PerformanceDisplay
{
	private displayDivs: HTMLDivElement[] = [];
	private yPosition: number = 10;

	constructor()
	{
		this.createDisplayDivs();
	}

	private createDisplayDiv(): HTMLDivElement
	{
		const displayDiv = document.createElement('div');
		displayDiv.style.position = 'absolute';
		displayDiv.style.bottom = `${this.yPosition}px`;
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

		this.yPosition += 40;
		return displayDiv;
	}

	private createDisplayDivs(): void
	{
		for (let i = 0; i < 4; i++)
		{
			this.displayDivs.push(this.createDisplayDiv());
		}
	}

	public updateMatrixStats(updatedMatrices: number, updatedWorldMatrices: number): void
	{
		this.displayDivs[0].textContent = `Updated Matrices: ${updatedMatrices}`;
		this.displayDivs[1].textContent = `Updated World Matrices: ${updatedWorldMatrices}`;
	}

	public updateMemoryStats(): void
	{
		if ('memory' in performance)
		{
			const memory = (performance as any).memory;
			const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
			const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
			this.displayDivs[2].textContent = `Memory: ${usedMB}MB / ${totalMB}MB`;
		}
	}

	public updateAnimationStats(animatingObjects: number, totalObjects: number): void
	{
		this.displayDivs[3].textContent = `Animating: ${animatingObjects}/${totalObjects}`;
	}

	public updateAllStats(
		updatedMatrices: number,
		updatedWorldMatrices: number,
		animatingObjects: number,
		totalObjects: number
	): void
	{
		this.updateMatrixStats(updatedMatrices, updatedWorldMatrices);
		this.updateMemoryStats();
		this.updateAnimationStats(animatingObjects, totalObjects);
	}

	public getDisplayDivs(): HTMLDivElement[]
	{
		return this.displayDivs;
	}
} 