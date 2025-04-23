import type { SlidableObject } from "osu-parsers";
import { AlphaFilter, Geometry, Mesh, Shader } from "pixi.js";
import createGeometry from "./createGeometry";
import vertex from "./shaders/shader.vert?raw";
import fragment from "./shaders/shader.frag?raw";
import { darken, lighten } from "./utils";
import calculateSliderProgress from "./CalculateSliderProgress";
import { BackdropBlurFilter } from "pixi-filters";

const GL = { vertex, fragment };
const COLOR = [0.21176470588, 0.52156862745, 0.72549019607, 0];
// const COLOR = [0, 0, 0, 0];

export default class DrawableSlider {
	obj: Mesh<Geometry, Shader>;
	geometry: Geometry;
	shader: Shader;
	alphaFilter: AlphaFilter;
	backdropBlurFilter: BackdropBlurFilter;

	slider;

	constructor(slider: SlidableObject) {
		this.slider = slider;
		this.geometry = new Geometry({
			attributes: {
				aPosition: new Float32Array([]),
			},
			indexBuffer: [],
		});
		this.shader = Shader.from({
			gl: GL,
			resources: {
				customUniforms: {
					borderColor: { value: [1.0, 1.0, 1.0, 1.0], type: "vec4<f32>" },
					innerColor: { value: lighten(COLOR, 0.5), type: "vec4<f32>" },
					outerColor: { value: darken(COLOR, 0.1), type: "vec4<f32>" },
					borderWidth: { value: 0.128, type: "f32" },
				},
			},
		});
		this.alphaFilter = new AlphaFilter();
		this.backdropBlurFilter = new BackdropBlurFilter({
			strength: 10,
			quality: 7,
		});
		this.obj = new Mesh({
			geometry: this.geometry,
			shader: this.shader,
			filters: [
				this.alphaFilter,
				// this.backdropBlurFilter,
			],
			x: slider.startPosition.x,
			y: slider.startPosition.y,
			blendMode: "none",
		});
		// this.obj.scale.set(2);
		this.obj.state.depthTest = true;
	}

	update(pHead: number, pTail: number) {
		const path = calculateSliderProgress(this.slider.path, pHead, pTail);
		const { aPosition, indexBuffer } = createGeometry(path);

		this.geometry.attributes.aPosition.buffer.data = new Float32Array(
			aPosition,
		);
		this.geometry.indexBuffer.data = new Uint32Array(indexBuffer);
		this.alphaFilter.alpha = pTail;
	}
}
