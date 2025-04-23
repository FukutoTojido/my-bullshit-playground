import { Container, Graphics } from "pixi.js";
import Yoga, {
	type Align,
	type BoxSizing,
	Direction,
	type Display,
	Edge,
	type FlexDirection,
	type Gutter,
	type Justify,
	type Node,
	type Overflow,
	type PositionType,
	type Wrap,
} from "yoga-layout";

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
		gapLength: number | `${number}%` | undefined;
	};
	height?: number | "auto" | `${number}%` | undefined;
	justifyContent?: Justify;
	margin?: number | `${number}%` | undefined;
	maxHeight?: number | `${number}%` | undefined;
	maxWidth?: number | `${number}%` | undefined;
	minHeight?: number | `${number}%` | undefined;
	minWidth?: number | `${number}%` | undefined;
	overflow?: Overflow;
	padding?: number | `${number}%` | undefined;
	position?: PositionType;
	boxSizing?: BoxSizing;
	width?: number | "auto" | `${number}%` | undefined;
};

type YogaContainerOptions = {
	styles?: Styles;
	id?: string;
};

export default class YogaContainer extends Container {
	yogaNode: Node;

	background: Graphics;
	color = Math.random() * 0xffffff;

	constructor({ styles, id }: YogaContainerOptions) {
		super();
		this.yogaNode = Yoga.Node.create();

		this.background = new Graphics();
		this.addChild(this.background);

		if (id) {
			this.label = id;
		}

		if (styles) this.setStyles(styles);
	}

	setStyles(styles: Styles) {
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
					this.yogaNode.setMargin(
						Edge.All,
						value as number | `${number}%` | undefined,
					);
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
					this.yogaNode.setPadding(
						Edge.All,
						value as number | `${number}%` | undefined,
					);
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
			}
		}

		const ancestor = this.findAncestor();
		ancestor.yogaNode.calculateLayout(undefined, undefined, Direction.LTR);
		ancestor.updateSelf();
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

	updateSelf(level = "") {
		const x = this.yogaNode.getComputedLeft();
		const y = this.yogaNode.getComputedTop();
		const width = this.yogaNode.getComputedWidth();
		const height = this.yogaNode.getComputedHeight();

		this.x = x;
		this.y = y;
		// this.width = width;
		// this.height = height;

		this.background
			.clear()
			.rect(0, 0, width, height)
			.fill(this.color);
		// console.log(
		// 	`${level}${this.label}, ${x}, ${y}, ${width}, ${height}`,
		// );

		const children = this.children.filter(
			(child) => child instanceof YogaContainer,
		);
		for (const child of children) {
			// console.log(`${level}Calculating for child: ${child.label}`);
			child.updateSelf(`${level}\t`);
		}
	}
}
