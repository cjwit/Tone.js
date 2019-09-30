import { expect } from "chai";
import { FMSynth } from "./FMSynth";
import { BasicTests } from "test/helper/Basic";
import { InstrumentTest } from "test/helper/InstrumentTests";
import { CompareToFile } from "test/helper/CompareToFile";

describe("FMSynth", () => {

	BasicTests(FMSynth);
	InstrumentTest(FMSynth, "C4");

	it("matches a file", () => {
		return CompareToFile(() => {
			const synth = new FMSynth().toDestination();
			synth.triggerAttackRelease("G4", 0.1, 0.05);
		}, "fmSynth.wav", 0.06);
	});

	context("API", () => {
		it("can get and set carrier attributes", () => {
			const fmSynth = new FMSynth();
			fmSynth.oscillator.type = "triangle";
			expect(fmSynth.oscillator.type).to.equal("triangle");
			fmSynth.dispose();
		});

		it("can get and set modulator attributes", () => {
			const fmSynth = new FMSynth();
			fmSynth.modulationEnvelope.attack = 0.24;
			expect(fmSynth.modulationEnvelope.attack).to.equal(0.24);
			fmSynth.dispose();
		});

		it("can get and set harmonicity", () => {
			const fmSynth = new FMSynth();
			fmSynth.harmonicity.value = 2;
			expect(fmSynth.harmonicity.value).to.equal(2);
			fmSynth.dispose();
		});

		it("can be constructed with an options object", () => {
			const fmSynth = new FMSynth({
				envelope: {
					release: 0.3
				}
			});
			expect(fmSynth.envelope.release).to.equal(0.3);
			fmSynth.dispose();
		});

		it("can get/set attributes", () => {
			const fmSynth = new FMSynth();
			fmSynth.set({
				harmonicity: 1.5,
				detune: 1200
			});
			expect(fmSynth.get().harmonicity).to.equal(1.5);
			expect(fmSynth.get().detune).to.be.closeTo(1200, 1);
			fmSynth.dispose();
		});
	});
});
