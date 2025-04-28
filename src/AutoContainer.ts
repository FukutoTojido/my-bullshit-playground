import {
	Container,
	type FillInput,
	Graphics,
	Rectangle,
	type StrokeStyle,
} from "pixi.js";
import Yoga, {
	type Align,
	type BoxSizing,
	Direction,
	type Display,
	type Edge,
	type FlexDirection,
	Gutter,
	type Justify,
	type Node,
	Overflow,
	type PositionType,
	type Wrap,
} from "yoga-layout";
import AnimationController, {
	type AnimationOptions,
} from "./AnimationController";

export type Styles = {
	alignContent?: Align;
	alignItems?: Align;
	alignSelf?: Align;
	aspectRatio?: number | undefined;
	display?: Display;
	flex?: number | undefined;
	flexBasis?: number | "auto" | `${number}%` | undefined;
	flexDirection?: FlexDirection;
	flexGrow?: number | undefined;
	flexShrink?: number | undefined;
	flexWrap?: Wrap;
	gap?: {
		gutter: Gutter;
		gapLength: number | "auto" | `${number}%` | undefined;
	};
	height?: number | "auto" | `${number}%` | undefined;
	justifyContent?: Justify;
	margin?: {
		edge: Edge;
		margin: number | `${number}%` | undefined;
	};
	maxHeight?: number | `${number}%` | undefined;
	maxWidth?: number | `${number}%` | undefined;
	minHeight?: number | `${number}%` | undefined;
	minWidth?: number | `${number}%` | undefined;
	overflow?: Overflow;
	padding?: {
		edge: Edge;
		padding: number | `${number}%` | undefined;
	};
	position?: PositionType;
	boxSizing?: BoxSizing;
	width?: number | "auto" | `${number}%` | undefined;
	backgroundColor?: FillInput;
	borderRadius?: number;
	border?: StrokeStyle;
};

export type YogaContainerOptions = {
	styles?: Styles;
	id?: string;
};

export default class YogaContainer extends Container {
	yogaNode: Node;
	protected _styles: Styles;

	protected background: Graphics;
	protected maskGraphics: Graphics;
	protected borderGraphics: Graphics;

	color: FillInput = {
		color: 0x000000,
		alpha: 0,
	};

	border: StrokeStyle = {
		color: 0x000000,
		alpha: 0,
		width: 0,
	};

	borderRadius = 0;

	animations = new AnimationController();

	cache = {
		width: 0,
		height: 0
	}

	constructor({ styles, id }: YogaContainerOptions) {
		super();
		this._styles = { ...styles };
		this.yogaNode = Yoga.Node.create();

		this.background = new Graphics();
		this.maskGraphics = new Graphics();
		this.borderGraphics = new Graphics();
		this.borderGraphics.interactive = false;
		this.borderGraphics.zIndex = 999999;

		this.addChild(this.background, this.borderGraphics);

		if (id) {
			this.label = id;
		}

		if (styles) this._setStyles(styles);
	}

	private _setStyles(styles: Styles) {
		this._styles = { ...this._styles, ...styles };
		if (Object.entries(styles).length === 0) return;

		for (const key of Object.keys(styles) as (keyof Styles)[]) {
			const value = styles[key];
			switch (key) {
				case "alignContent": {
					this.yogaNode.setAlignContent(value as Align);
					break;
				}
				case "alignItems": {
					this.yogaNode.setAlignItems(value as Align);
					break;
				}
				case "alignSelf": {
					this.yogaNode.setAlignSelf(value as Align);
					break;
				}
				case "aspectRatio": {
					this.yogaNode.setAspectRatio(value as number | undefined);
					break;
				}
				case "display": {
					this.yogaNode.setDisplay(value as Display);
					break;
				}
				case "flex": {
					this.yogaNode.setFlex(value as number | undefined);
					break;
				}
				case "flexBasis": {
					this.yogaNode.setFlexBasis(
						value as number | "auto" | `${number}%` | undefined,
					);
					break;
				}
				case "flexDirection": {
					this.yogaNode.setFlexDirection(value as FlexDirection);
					break;
				}
				case "flexGrow": {
					this.yogaNode.setFlexGrow(value as number | undefined);
					break;
				}
				case "flexShrink": {
					this.yogaNode.setFlexShrink(value as number | undefined);
					break;
				}
				case "flexWrap": {
					this.yogaNode.setFlexWrap(value as Wrap);
					break;
				}
				case "gap": {
					const { gutter, gapLength } = value as {
						gutter: Gutter;
						gapLength: number | `${number}%` | undefined;
					};
					this.yogaNode.setGap(gutter, gapLength);
					break;
				}
				case "height": {
					this.yogaNode.setHeight(
						value as number | "auto" | `${number}%` | undefined,
					);
					break;
				}
				case "justifyContent": {
					this.yogaNode.setJustifyContent(value as Justify);
					break;
				}
				case "maxHeight": {
					this.yogaNode.setMaxHeight(
						value as number | `${number}%` | undefined,
					);
					break;
				}
				case "margin": {
					const { margin, edge } = value as {
						edge: Edge;
						margin: number | "auto" | `${number}%` | undefined;
					};
					this.yogaNode.setMargin(edge, margin);
					break;
				}
				case "maxWidth": {
					this.yogaNode.setMaxWidth(value as number | `${number}%` | undefined);
					break;
				}
				case "minHeight": {
					this.yogaNode.setMinHeight(
						value as number | `${number}%` | undefined,
					);
					break;
				}
				case "minWidth": {
					this.yogaNode.setMinWidth(value as number | `${number}%` | undefined);
					break;
				}
				case "overflow": {
					this.yogaNode.setOverflow(value as Overflow);
					break;
				}
				case "padding": {
					const { padding, edge } = value as {
						edge: Edge;
						padding: number | `${number}%` | undefined;
					};
					this.yogaNode.setPadding(edge, padding);
					break;
				}
				case "position": {
					this.yogaNode.setPositionType(value as PositionType);
					break;
				}
				case "boxSizing": {
					this.yogaNode.setBoxSizing(value as BoxSizing);
					break;
				}
				case "width": {
					this.yogaNode.setWidth(
						value as number | "auto" | `${number}%` | undefined,
					);
					break;
				}
				case "backgroundColor": {
					this.color = value as FillInput;
					break;
				}
				case "borderRadius": {
					this.borderRadius = value as number;
					break;
				}
				case "border": {
					this.border = { ...(value as StrokeStyle) };
					break;
				}
			}
		}

		const ancestor = this.findAncestor();
		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
		ancestor.updateSelf();
	}

	setStyles(styles: Styles, animation?: AnimationOptions) {
		if (!animation) {
			this._setStyles(styles);
			return;
		}

		const { width, height, gap, borderRadius, ...rest } = styles;
		const { easing, duration } = animation;
		this._setStyles(rest);

		if (width !== undefined) {
			const old = this.yogaNode.getComputedWidth();
			this.animations.addAnimation(
				"width",
				old,
				width,
				(value) => {
					this._setStyles({
						width: value as number | "auto" | `${number}%` | undefined,
					});
				},
				duration,
				easing,
			);
		}

		if (height !== undefined) {
			const old = this.yogaNode.getComputedHeight();
			this.animations.addAnimation("height", old, height, (value) => {
				this._setStyles({
					height: value as number | "auto" | `${number}%` | undefined,
				});
			});
		}

		if (gap !== undefined) {
			const old = this.yogaNode.getGap(Gutter.All);
			this.animations.addAnimation(
				"gap",
				old,
				gap.gapLength,
				(value) => {
					this._setStyles({
						gap: {
							gutter: Gutter.All,
							gapLength: value as number | `${number}%` | undefined,
						},
					});
				},
				duration,
			);
		}

		if (borderRadius !== undefined) {
			const old = this.borderRadius;
			this.animations.addAnimation(
				"borderRadius",
				old,
				borderRadius,
				(value) => {
					this._setStyles({
						borderRadius: value as number,
					});
				},
				duration,
			);
		}
	}

	findAncestor(): YogaContainer {
		let curr: YogaContainer = this;
		// console.log(curr.label);

		while (
			curr.parent !== null &&
			// biome-ignore lint/suspicious/noExplicitAny: Very stupid hack
			(curr.parent as any) instanceof YogaContainer
		) {
			curr = curr.parent as YogaContainer;
			// console.log(curr.label);
		}

		return curr;
	}

	addFlexChildren(...children: YogaContainer[]) {
		const childCount = this.yogaNode.getChildCount();
		let i = 0;
		for (const child of children) {
			this.addChild(child);
			this.yogaNode.insertChild(child.yogaNode, childCount + i);
			i++;
		}

		this.addChild(this.borderGraphics);

		const ancestor = this.findAncestor();
		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
		ancestor.updateSelf();
	}

	removeFlexChild(child: YogaContainer) {
		this.removeChild(child);
		this.yogaNode.removeChild(child.yogaNode);

		const ancestor = this.findAncestor();
		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
		ancestor.updateSelf();
	}

	reColor() {
		const width = this.yogaNode.getComputedWidth();
		const height = this.yogaNode.getComputedHeight();
		const overflow = this.yogaNode.getOverflow();

		this.background
			.clear()
			.roundRect(0, 0, width, height, this.borderRadius)
			.fill(this.color);
		this.borderGraphics
			.clear()
			.roundRect(0, 0, width, height, this.borderRadius)
			.stroke({ ...this.border, alignment: 1 });
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

		if (this.cache.width !== this.yogaNode.getComputedWidth() || this.cache.height !== this.yogaNode.getComputedHeight()) {
			this.reColor();
			this.cache.width = this.yogaNode.getComputedWidth();
			this.cache.height = this.yogaNode.getComputedHeight();
		}

		const children = this.children.filter(
			(child) => child instanceof YogaContainer,
		);

		let log = `${level}${this.label}`;
		for (const child of children) {
			log += `\n${child.updateSelf(`${level}\t`)}`;
		}

		// if (level === "") console.log(log);
		return log;
	}
}
