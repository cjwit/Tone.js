import { readOnly } from "../../core/util/Interface";
import { Param } from "../../core/context/Param";
import { InputNode, OutputNode, ToneAudioNode, ToneAudioNodeOptions } from "../../core/context/ToneAudioNode";
import { AudioRange, Decibels } from "../../core/type/Units";
import { optionsFromArguments } from "../../core/util/Defaults";
import { Panner } from "./Panner";
import { Volume } from "./Volume";

export interface PanVolOptions extends ToneAudioNodeOptions {
	pan: AudioRange;
	volume: Decibels;
	mute: boolean;
}

/**
 * PanVol is a Tone.Panner and Tone.Volume in one.
 * @example
 * // pan the incoming signal left and drop the volume
 * const panVol = new PanVol(-0.25, -12).toDestination();
 * const osc = new Oscillator().connect(panVol).start();
 * @category Component
 */
export class PanVol extends ToneAudioNode<PanVolOptions> {

	readonly name: string = "PanVol";

	readonly input: InputNode;
	readonly output: OutputNode;

	/**
	 * The panning node
	 */
	private _panner: Panner;

	/**
	 * The L/R panning control.
	 */
	readonly pan: Param<AudioRange>;

	/**
	 * The volume node
	 */
	private _volume: Volume;

	/**
	 * The volume control in decibels.
	 */
	readonly volume: Param<Decibels>;

	/**
	 * @param pan the initial pan
	 * @param volume The output volume.
	 */
	constructor(pan?: AudioRange, volume?: Decibels);
	constructor(options?: Partial<PanVolOptions>);
	constructor() {

		super(optionsFromArguments(PanVol.getDefaults(), arguments, ["pan", "volume"]));
		const options = optionsFromArguments(PanVol.getDefaults(), arguments, ["pan", "volume"]);

		this._panner = this.input = new Panner({
			context: this.context,
			pan: options.pan,
		});
		this.pan = this._panner.pan;
		this._volume = this.output = new Volume({
			context: this.context,
			volume: options.volume,
		});
		this.volume = this._volume.volume;

		// connections
		this._panner.connect(this._volume);
		this.mute = options.mute;

		readOnly(this, ["pan", "volume"]);
	}

	static getDefaults(): PanVolOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			mute: false,
			pan: 0,
			volume: 0,
		});
	}

	/**
	 * Mute/unmute the volume
	 */
	get mute(): boolean {
		return this._volume.mute;
	}
	set mute(mute) {
		this._volume.mute = mute;
	}

	dispose(): this {
		super.dispose();
		this._panner.dispose();
		this.pan.dispose();
		this._volume.dispose();
		this.volume.dispose();
		return this;
	}
}
