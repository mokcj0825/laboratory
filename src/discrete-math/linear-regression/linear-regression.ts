type DataPoint = [number, number];

function linearRegression(data: DataPoint[], learningRate: number = 0.01, iterations: number = 1000): {
  m: number; b: number
} {
  let m = 10;
  let b = 10;

  for(let i = 0; i < iterations; i++) {
    let mGradient = 0;
    let bGradient = 0;

    data.forEach(([x, y]) => {
      const prediction = m * x + b;
      mGradient += -2 * x * (y - prediction);
      bGradient += -2 * (y - prediction);
    });

    m -= (mGradient / data.length) * learningRate;
    b -= (bGradient / data.length) * learningRate;
  }

  return { m, b };
}

const data: DataPoint[] = [
  [1, 2], [4, 8], [3, 6]
];
for (let lr = 1; lr <= 1; lr++) {
  const learningRate = lr * 0.01;
  const model = linearRegression(data, learningRate);
  console.log(`In learning Rate: ${learningRate}, Slope: ${model.m}, Intercept: ${model.b}`);
}