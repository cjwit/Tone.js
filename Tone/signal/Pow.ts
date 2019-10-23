import { WaveShaper, WaveShaperMappingFn } from "./WaveShaper";
import { optionsFromArguments } from "Tone";
import { SignalOperator } from "./SignalOperator";
import { ToneAudioNodeOptions } from "Tone/core/context/ToneAudioNode";

export interface PowOptions extends ToneAudioNodeOptions {
	value: number;
}

/**
 * Pow applies an exponent to the incoming signal. The incoming signal must be AudioRange [-1, 1]
 *
 * @example
 * var pow = new Pow(2);
 * var sig = new Signal(0.5).connect(pow);
 * //output of pow is 0.25. 
 * @category Signal
 */
export class Pow extends SignalOperator<PowOptions> {
	
	readonly name: string = "Pow";
	
	private _exponent!: number;

	private _exponentScaler: WaveShaper;

	input: WaveShaper;

	output: WaveShaper;
	
	/**
	 * @param value Constant exponent value to use
	 */
	constructor(value?: number);
	constructor(options?: Partial<PowOptions>);
	constructor() {
		super(Object.assign(optionsFromArguments(Pow.getDefaults(), arguments, ["value"])));
		const options = optionsFromArguments(Pow.getDefaults(), arguments, ["value"]);

		this._exponentScaler = this.input = this.output = new WaveShaper({
			context: this.context,
			mapping: this._expFunc(this._exponent),
			length: 8192,
		});

		this.value = options.value;
	}

	static getDefaults(): PowOptions {
		return Object.assign(SignalOperator.getDefaults(), {
			value: 1,
		});
	}

	/**
	 * the function which maps the waveshaper
	 * @param exponent exponent value
	 */
	private _expFunc(exponent: number): WaveShaperMappingFn {
		return (val: number) => {
			return Math.pow(Math.abs(val), exponent);
		};
	}

	/**
	 * The value of the exponent.
	 */
	get value(): number {
		return this._exponent;
	}
	set value(exponent: number) {
		this._exponent = exponent;
		this._exponentScaler.setMap(this._expFunc(this._exponent));
	}

	/**
	 * Clean up.
	 */
	dispose(): this {
		super.dispose();
		this._exponentScaler.dispose();
		return this;
	}
}
