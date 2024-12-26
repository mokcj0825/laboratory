type FrequencyComponent = {
  frequency: number;
  magnitude: number;
  phase: number;
  real: number;
  image: number;
}

function DFT(signal: number[], collectionTimeInMilliseconds: number): FrequencyComponent[] {
  const N: number = signal.length;
  const collectionTimeInSeconds = collectionTimeInMilliseconds / 1000;
  const samplingRate = N / collectionTimeInSeconds;
  const result: FrequencyComponent[] = [];

  for(let k = 0; k < N; k++) {
    let real: number = 0;
    let image: number = 0;

    for(let n = 0; n < N; n++) {
      const angle: number = (2 * Math.PI * k * n) / N;
      real += signal[n] * Math.cos(angle);
      image -= signal[n] * Math.sin(angle);
    }

    const magnitude: number = Math.sqrt(real ** 2 + image ** 2);
    const phase: number = Math.atan2(image, real);
    const frequency = (k * samplingRate) / N;

    result.push({ frequency, magnitude, phase, real, image });
  }
  return result;
}

const collectionTimeInMilliseconds = 1000;
const samplingRate = 10;
const N = 10;
const time = Array.from({ length: N }, (_, i) => i / samplingRate);

const signal = time.map(t => Math.sin(2 * Math.PI * 2 * t) + 0.5 * Math.sin(2 * Math.PI * 4 * t));

const dftResult = DFT(signal, collectionTimeInMilliseconds);
console.log("Frequency Components:");
dftResult.forEach(({ frequency, magnitude, phase, real, image }) => {
  console.log(`Frequency: ${frequency.toFixed(2)} Hz, Magnitude: ${magnitude.toFixed(2)}, Phase: ${phase.toFixed(2)} rad, Real (cosine contribution): ${real.toFixed(2)}, Image (sine contribution): ${image.toFixed(2)}`);
});