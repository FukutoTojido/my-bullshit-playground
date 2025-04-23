import { BeatmapDecoder, SlidableObject } from "osu-parsers";
import { Application, RenderTarget, Assets, Sprite, Container } from "pixi.js";
import DrawableSlider from "./DrawableSlider";
import YogaContainer from "./AutoContainer";
import { Align, Display, FlexDirection, Gutter, Justify } from "yoga-layout";
import { tweenGroup } from "./AnimationController";

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
	src: "https://pbs.twimg.com/media/GdmkfEDXYAAxjGO?format=jpg&name=large",
	loadParser: "loadTextures",
});
const bgSprite = Sprite.from(bgTexture);
bgSprite.alpha = 0.5;

app.stage.addChild(bgSprite);

const sliderMeshes = sliders.map((slider) => new DrawableSlider(slider));

let PROGRESS = 0.0;
const animate = (p = 1.0) => {
	PROGRESS += 0.01;
	PROGRESS %= 2;
	// PROGRESS = p;

	const pHead = Math.max(0, PROGRESS - 1);
	const pTail = Math.min(1, PROGRESS);

	for (const mesh of sliderMeshes) mesh.update(pHead, pTail);
	tweenGroup.update();

	// if (PROGRESS > 1) return;
	requestAnimationFrame(() => animate());
};

// requestAnimationFrame(() => animate(0.99));
requestAnimationFrame(() => animate(1.0));

const container = new Container();
container.addChild(...sliderMeshes.map((slider) => slider.obj));
container.width = 512;
container.height = 384;
container.scale.set(2);
container.x = 0;
container.y = 0;

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
			gapLength: 0
		}
	},
});

const child0 = new YogaContainer({
	id: "child0",
	styles: {
		width: 0,
		height: "100%",
	},
});

const child1 = new YogaContainer({
	id: "child1",
	styles: {
		height: "100%",
		flex: 1,
	},
});

yogaContainer.addFlexChildren(child1, child0);

app.stage.addChild(container);

const c = new Container();
c.addChild(yogaContainer);
c.y = 700;

app.stage.addChild(c);
document.body.append(app.canvas);

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
					width: 300,
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
