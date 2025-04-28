import {
	Text,
	type TextStyleOptions,
	type TextOptions,
	Rectangle,
} from "pixi.js";
import YogaContainer from "./AutoContainer";
import { Direction, Overflow } from "yoga-layout";

type YogaTextOptions = {
	id?: string;
	styles?: {
		width?: number | "auto" | `${number}%` | undefined;
	};
	options: TextOptions;
};

export default class YogaText extends YogaContainer {
	textContainer: Text;

	constructor({ id, styles, options }: YogaTextOptions) {
		super({
			id,
			styles: {
				...styles,
				flexShrink: 0,
			},
		});
		this.interactive = false;

		this.textContainer = new Text(options);
		this.textContainer.interactive = false;

		this.addChild(this.textContainer);

		this.updateSelf();
	}

	addFlexChildren(): void {}
	removeFlexChildren(): void {}

	setText(s: string) {
		this.textContainer.text = s;
		this.updateSelf();
	}

	setTextStyles(styles: TextStyleOptions) {
		for (const [key, value] of Object.entries(styles)) {
			// biome-ignore lint/suspicious/noExplicitAny: I don't even know what the fuck I am doing bro
			(this.textContainer.style[key as keyof TextStyleOptions] as any) = value;
		}

		this.updateSelf();
	}

	updateBounds() {
		const width = this.yogaNode.getComputedWidth();
		const height = this.yogaNode.getComputedHeight();
		const overflow = this.yogaNode.getOverflow();

		this.maskGraphics
			.clear()
			.roundRect(0, 0, width, height, this.borderRadius)
			.fill({ color: 0xffffff, alpha: 1 });
		this.boundsArea = new Rectangle(0, 0, width, height);

		switch (overflow) {
			case Overflow.Hidden: {
				this.addChild(this.maskGraphics);
				this.mask = this.maskGraphics;
				break;
			}
			default: {
				this.mask = null;
				this.removeChild(this.maskGraphics);
			}
		}
	}

	updateSelf(level = "") {
		const x = this.yogaNode.getComputedLeft();
		const y = this.yogaNode.getComputedTop();

		this.x = x;
		this.y = y;

		const log = `${level}${this.label}`;
		// if (level === "") console.log(log);

		if (
			this.cache.width === this.yogaNode.getComputedWidth() &&
			this.cache.height === this.yogaNode.getComputedHeight()
		)
			return log;

		if (!this.textContainer) return log;

		if (this.textContainer.style.wordWrap === false) {
			this.yogaNode.setWidth(this._styles.width ?? this.textContainer.width);
			this.yogaNode.setHeight(this.textContainer.height);

			const ancestor = this.findAncestor();
			ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);

			if (
				this.cache.width !== this.yogaNode.getComputedWidth() ||
				this.cache.height !== this.yogaNode.getComputedHeight()
			) {
				this.cache.width = this.yogaNode.getComputedWidth();
				this.cache.height = this.yogaNode.getComputedHeight();
				this.updateBounds();

				ancestor.updateSelf();
				return log;
			}
		}

		if (typeof this._styles.width === "number") {
			this.yogaNode.setWidth(this._styles.width);
			this.textContainer.style.wordWrapWidth = this._styles.width;

			this.yogaNode.setHeight(this.textContainer.height);

			const ancestor = this.findAncestor();
			ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);

			if (
				this.cache.width !== this.yogaNode.getComputedWidth() ||
				this.cache.height !== this.yogaNode.getComputedHeight()
			) {
				this.cache.width = this.yogaNode.getComputedWidth();
				this.cache.height = this.yogaNode.getComputedHeight();
				this.updateBounds();

				ancestor.updateSelf();
				return log;
			}
		}

		this.yogaNode.setWidth(this._styles.width);

		const ancestor = this.findAncestor();
		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);

		this.textContainer.style.wordWrapWidth = this.yogaNode.getComputedWidth();
		this.yogaNode.setHeight(this.textContainer.height);

		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);

		if (
			this.cache.width !== this.yogaNode.getComputedWidth() ||
			this.cache.height !== this.yogaNode.getComputedHeight()
		) {
			this.cache.width = this.yogaNode.getComputedWidth();
			this.cache.height = this.yogaNode.getComputedHeight();
			this.updateBounds();

			ancestor.updateSelf();
		}
		return log;
	}
}
