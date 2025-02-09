function candy(ratings: number[]): number {
  const n = ratings.length;
  if (n === 1) return 1;

  let totalCandies = 0;
  let up = 0, down = 0, peak = 0;

  for (let i = 1; i < n; i++) {
    if (ratings[i] > ratings[i - 1]) {
      up++;
      down = 0;
      peak = up;
      totalCandies += up + 1;
    } else if (ratings[i] < ratings[i - 1]) {
      down++;
      up = 0;
      totalCandies += down + (down > peak ? 1 : 0);
    } else {
      up = down = peak = 0;
      totalCandies += 1;
    }
  }

  return totalCandies + 1;
}

console.log(candy([1, 0, 2]));