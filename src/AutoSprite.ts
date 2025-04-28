import { Sprite, type Texture } from "pixi.js";
import YogaContainer, { type Styles } from "./AutoContainer";
import { Unit } from "yoga-layout";

enum ObjectSize {
	Cover = 0,
	Contain = 1,
	Stretch = 2,
}

enum ObjectPosition {
	Top = 0,
	Center = 1,
	Bottom = 2,
	TopLeft = 3,
	TopRight = 4,
	CenterLeft = 5,
	CenterRight = 6,
	BottomLeft = 7,
	BottomRight = 8,
}

type YogaSpriteStyles = Styles & {
	objectSize?: ObjectSize;
	objectPosition?: ObjectPosition;
};

type YogaSpriteOptions = {
	id?: string;
	styles?: YogaSpriteStyles;
	texture: Texture;
};

export default class YogaSprite extends YogaContainer {
	spriteContainer: Sprite;
	texture: Texture;

	constructor({ id, styles, texture }: YogaSpriteOptions) {
		super({ id, styles });
		this.texture = texture;

		if (!styles?.objectPosition)
			(this._styles as YogaSpriteStyles).objectPosition = ObjectPosition.Center;
		if (!styles?.objectSize)
			(this._styles as YogaSpriteStyles).objectSize = ObjectSize.Cover;

		this.spriteContainer = new Sprite({
			texture,
		});
		this.addChild(this.spriteContainer);
	}

	addFlexChildren(): void {}
	removeFlexChildren(): void {}

	updateSelf(level = "") {
		const x = this.yogaNode.getComputedLeft();
		const y = this.yogaNode.getComputedTop();

		this.x = x;
		this.y = y;

		const log = `${level}${this.label}`;
		if (
			this.cache.width === this.yogaNode.getComputedWidth() &&
			this.cache.height === this.yogaNode.getComputedHeight()
		)
			return log;

		this.cache.width = this.yogaNode.getComputedWidth();
		this.cache.height = this.yogaNode.getComputedHeight();

		if (!this.spriteContainer) return log;

		const width = this.yogaNode.getComputedWidth();
		const height = this.yogaNode.getComputedHeight();

		let scale = [1, 1];
		switch ((this._styles as YogaSpriteStyles).objectSize) {
			case ObjectSize.Cover: {
				const s = Math.max(
					width / this.texture.width,
					height / this.texture.height,
				);
				scale = [s, s];
				break;
			}
			case ObjectSize.Contain: {
				const s = Math.min(
					width / this.texture.width,
					height / this.texture.height,
				);
				scale = [s, s];
				break;
			}
			case ObjectSize.Stretch: {
				scale = [
					width / this.texture.width,
					height / this.texture.height,
				];
			}
		}

		this.spriteContainer.scale.set(...scale);

		switch ((this._styles as YogaSpriteStyles).objectPosition) {
			case ObjectPosition.Top: {
				this.spriteContainer.anchor.set(0.5, 0);
				this.spriteContainer.position.set(width / 2, 0);
				break;
			}
			case ObjectPosition.Center: {
				this.spriteContainer.anchor.set(0.5, 0.5);
				this.spriteContainer.position.set(width / 2, height / 2);
				break;
			}
			case ObjectPosition.Bottom: {
				this.spriteContainer.anchor.set(0.5, 1);
				this.spriteContainer.position.set(width / 2, height);
				break;
			}
			case ObjectPosition.TopLeft: {
				this.spriteContainer.anchor.set(0, 0);
				this.spriteContainer.position.set(0, 0);
				break;
			}
			case ObjectPosition.TopRight: {
				this.spriteContainer.anchor.set(1, 0);
				this.spriteContainer.position.set(width, 0);
				break;
			}
			case ObjectPosition.CenterLeft: {
				this.spriteContainer.anchor.set(0, 0.5);
				this.spriteContainer.position.set(0, height / 2);
				break;
			}
			case ObjectPosition.CenterRight: {
				this.spriteContainer.anchor.set(1, 0.5);
				this.spriteContainer.position.set(width, height / 2);
				break;
			}
			case ObjectPosition.BottomLeft: {
				this.spriteContainer.anchor.set(0, 1);
				this.spriteContainer.position.set(0, height);
				break;
			}
			case ObjectPosition.BottomRight: {
				this.spriteContainer.anchor.set(1, 1);
				this.spriteContainer.position.set(width, height);
				break;
			}
		}

		return log;
	}
}
