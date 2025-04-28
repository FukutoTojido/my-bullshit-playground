import type { Container } from "pixi.js";
import YogaContainer, { type YogaContainerOptions } from "./AutoContainer";

export default class GameplayContainer extends YogaContainer {
	gameContainer: Container;

	constructor({ gameContainer, ...options }: YogaContainerOptions & { gameContainer: Container }) {
        super(options);

        this.gameContainer = gameContainer;
        this.addChild(gameContainer);
        this.updateSelf();
    }

	updateSelf(level = "") {
		const log = super.updateSelf(level);
        if (!this.gameContainer) return log;

        const w = this.yogaNode.getComputedWidth();
		const h = this.yogaNode.getComputedHeight();

		const scale = Math.min(w / 640, h / 480);
		this.gameContainer.scale.set(scale);

        const _w = 512 * scale;
        const _h = 384 * scale;

        this.gameContainer.x = (w - _w) / 2;
        this.gameContainer.y = (h - _h) / 2;

        return log;
	}
}
