function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) {
      nums1[k] = nums1[i];
      i--;
    } else {
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }
}

let nums1 = [1, 3, 5, 0, 0, 0];
let nums2 = [2, 4, 6];
let m = 3;
let n = 3;

console.log("Before merge:");
console.log("nums1:", nums1);
console.log("nums2:", nums2);

merge(nums1, m, nums2, n);

console.log("\nAfter merge:");
console.log("nums1:", nums1);