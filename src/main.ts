import { BeatmapDecoder, SlidableObject } from "osu-parsers";
import {
	Application,
	RenderTarget,
	Assets,
	Container,
	Rectangle,
} from "pixi.js";
import DrawableSlider from "./DrawableSlider";
import YogaContainer from "./AutoContainer";
import {
	Align,
	BoxSizing,
	Display,
	Edge,
	FlexDirection,
	Gutter,
	Justify,
	Overflow,
	PositionType,
} from "yoga-layout";
import { tweenGroup } from "./AnimationController";
import { BackdropBlurFilter } from "pixi-filters";
import GameplayContainer from "./GameplayContainer";
import YogaText from "./AutoText";
import YogaSprite from "./AutoSprite";
// import "./test"

const mapFile = await (await fetch("/tanebi.osu")).text();
const decoder = new BeatmapDecoder();

const beatmap = decoder.decodeFromString(mapFile);

// MyGO! slider
const sliders = beatmap.hitObjects
	.filter((object) => object instanceof SlidableObject)
	.slice(-2);

RenderTarget.defaultOptions.depth = true;
RenderTarget.defaultOptions.stencil = true;

const app = new Application();
await app.init({
	resizeTo: document.querySelector<HTMLDivElement>("#app") ?? window,
	antialias: true,
	backgroundAlpha: 0,
	useBackBuffer: true,
	clearBeforeRender: true,
	depth: true,
});

// @ts-ignore
globalThis.__PIXI_APP__ = app;

const bgTexture = await Assets.load({
	src: "./anon.jpg",
	loadParser: "loadTextures",
});
// const bgSprite = Sprite.from(bgTexture);
// bgSprite.alpha = 0.5;

// app.stage.addChild(bgSprite);

const sliderMeshes = sliders.map((slider) => new DrawableSlider(slider));

const container = new Container();
container.boundsArea = new Rectangle(0, 0, 512, 384);
container.addChild(...sliderMeshes.map((slider) => slider.obj));

const yogaContainer = new YogaContainer({
	id: "main",
	styles: {
		width: 800,
		height: 300,
		display: Display.Flex,
		flexDirection: FlexDirection.Row,
		alignItems: Align.Center,
		justifyContent: Justify.Center,
		gap: {
			gutter: Gutter.All,
			gapLength: 0,
		},
		boxSizing: BoxSizing.BorderBox,
	},
});

export { yogaContainer };

const child0 = new YogaContainer({
	id: "child0",
	styles: {
		width: 0,
		height: "100%",
		backgroundColor: {
			color: 0x1e1e2e,
			alpha: 1,
		},
		overflow: Overflow.Hidden,
		borderRadius: 20,
		border: {
			width: 1,
			color: 0x313244,
		},
		flexDirection: FlexDirection.Column
	},
});

const c2 = new YogaContainer({
	id: "main",
	styles: {
		height: "100%",
		flex: 1,
		overflow: Overflow.Hidden,
		flexDirection: FlexDirection.Column,
		gap: {
			gutter: Gutter.All,
			gapLength: 10
		},
	},
});

const t = new YogaContainer({
	id: "timeline",
	styles: {
		width: "100%",
		height: 80,
		backgroundColor: {
			color: 0x1e1e2e,
			alpha: 0.6,
		},
		padding: {
			edge: Edge.Horizontal,
			padding: 20,
		},
		alignItems: Align.FlexStart,
		justifyContent: Justify.Center,
		flexDirection: FlexDirection.Row,
		overflow: Overflow.Hidden,
		gap: {
			gutter: Gutter.All,
			gapLength: 10,
		},
	},
});

const cs = new YogaContainer({
	id: "controls",
	styles: {
		width: "100%",
		height: 50,
		backgroundColor: {
			color: 0x1e1e2e,
			alpha: 1,
		},
		borderRadius: 20,
		border: {
			width: 1,
			color: 0x313244,
		},
	},
});

const child1 = new GameplayContainer({
	id: "child1",
	styles: {
		width: "100%",
		flex: 1,
	},
	gameContainer: container,
});

// const f = new BackdropBlurFilter({ strength: 10, quality: 7 });
// child0.filters = [f];
// c2.filters = [f];

const bg = new YogaSprite({
	id: "bg",
	styles: {
		position: PositionType.Absolute,
		width: "100%",
		height: "100%"
	},
	texture: bgTexture 
});

const bgDim = new YogaContainer({
	id: "bgDim",
	styles: {
		position: PositionType.Absolute,
		width: "100%",
		height: "100%",
		backgroundColor: {
			color: 0,
			alpha: 0.4
		}
	}
})

const cc = new YogaContainer({
	id: "cc",
	styles: {
		width: "100%",
		flex: 1,
		overflow: Overflow.Hidden,
		flexDirection: FlexDirection.Column,
		backgroundColor: {
			color: 0,
			alpha: 0.4,
		},
		borderRadius: 20,
		border: {
			width: 1,
			color: 0x313244,
		},
	}
});

cc.addFlexChildren(bg, bgDim, t, child1);
c2.addFlexChildren(cc, cs);
yogaContainer.addFlexChildren(c2, child0);

const c = new Container();
c.addChild(yogaContainer);

app.stage.addChild(c);
document.querySelector<HTMLDivElement>("#app")?.append(app.canvas);

let toggle = false;
document
	.querySelector<HTMLButtonElement>("button")
	?.addEventListener("click", () => {
		if (!toggle) {
			yogaContainer.setStyles(
				{
					gap: { gutter: Gutter.All, gapLength: 10 },
				},
				{
					duration: 200,
				},
			);
			child0.setStyles(
				{
					width: 400,
				},
				{
					duration: 200,
				},
			);
		}

		if (toggle) {
			yogaContainer.setStyles(
				{
					gap: { gutter: Gutter.All, gapLength: 0 },
				},
				{
					duration: 200,
				},
			);
			child0.setStyles(
				{
					width: 0,
				},
				{
					duration: 200,
				},
			);
		}

		toggle = !toggle;
	});

for (const mesh of sliderMeshes) mesh.update(0, 1);

let ct = 0;
let prev = performance.now();

const animate = (p = 1.0) => {
	const PROGRESS = (ct / 800) % 2;
	const pHead = Math.max(0, PROGRESS - 1);
	const pTail = Math.min(1, PROGRESS);

	for (const mesh of sliderMeshes) mesh.update(pHead, pTail);
	// for (const mesh of sliderMeshes) mesh.update(0, 1);
	tweenGroup.update();

	const { width, height } = app.canvas;
	const _width = yogaContainer.yogaNode.getComputedWidth();
	const _height = yogaContainer.yogaNode.getComputedHeight();
	if (_width !== width || _height !== height) {
		yogaContainer.setStyles({
			width,
			height,
		});
	}

	// if (PROGRESS > 1) return;
	ct += performance.now() - prev;
	prev = performance.now();

	requestAnimationFrame(() => animate());
};

requestAnimationFrame(() => animate(1.0));

const x = new YogaContainer({
	id: "x",
	styles: {
		width: 400,
		height: "100%",
		flex: 1,
		// backgroundColor: 0x202020,
		gap: {
			gutter: Gutter.All,
			gapLength: 10,
		},
		padding: {
			edge: Edge.All,
			padding: 20,
		},
	},
});

const texts = [
	"artist",
	"MyGO!!!!!",
	"romanized artist",
	"MyGO!!!!!",
	"title",
	"春日影 (MyGO!!!!! Ver.)",
	"romanized title",
	"Haruhikage (MyGO!!!! Ver.)",
	"difficulty name",
	"Past",
	"source",
	"BanG Dream! It's MyGO!!!!!",
	"tags",
	"crychic 1st album 迷跡波 meisekiha bushiroad gbp garupa girls band party! bandori バンドリ！ ガールズバンドパーティ！ 高松燈 千早愛音 要楽奈 長崎そよ 椎名立希 羊宮妃那 立石凛 青木陽菜 小日向美香 林鼓子 tomori takamatsu anon chihaya raana kaname soyo nagasaki taki shiina hina youmiya rin tateishi hina aoki mika kohinata koko hayashi rock japanese anime jrock j-rock kalibe hey lululu hey_lululu lu^3 coco",
].map(
	(text, idx) =>
		new YogaText({
			id: `text-${idx}`,
			styles: {
				// width: 360,
				width: "100%",
				// backgroundColor: 0x181825,
			},
			options: {
				text,
				style: {
					fontFamily: "Rubik",
					fontSize: 16,
					fill: 0xcdd6f4,
					fontWeight: idx % 2 === 1 ? "500" : "400",
					align: "left",
					wordWrap: true,
				},
			},
		}),
);

child0.addFlexChildren(x);
x.addFlexChildren(...texts);
// child0.addFlexChildren(...texts);

