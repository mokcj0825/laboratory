function minMaxGame(nums: number[]): number {
  let n = nums.length;
  while (n > 1) {
    for (let i = 0; i < n / 2; i++) {
      nums[i] = i % 2 === 0
        ? Math.min(nums[2 * i], nums[2 * i + 1])
        : Math.max(nums[2 * i], nums[2 * i + 1]);
    }
    n /= 2;  // Reduce the effective size of the array
  }
  return nums[0];
}

const nums: number[] = [1, 3, 5, 2, 4, 8, 2, 2];
console.log(minMaxGame(nums));