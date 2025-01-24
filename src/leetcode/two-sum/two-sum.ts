function twoSum(nums: number[], target: number): number[] {
  const map: Map<number, number> = new Map();
  for(let i = 0; i < nums.length; i++) {
    const c = target - nums[i];
    if(map.has(c)) {
      return [map.get(c)!, i];
    }

    map.set(nums[i], i);
  }

  throw new Error("Error");
}

const output = twoSum([2, 7, 11, 15], 9);
console.log(output);