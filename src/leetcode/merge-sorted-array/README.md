## Merge sorted array

You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums` respectively.

Merge `nums` and `nums2` into a single array sorted in non-decreasing order.

The final sorted array should not be returned by the function, but instead be stored inside the array `nums1`. To accommodate this, `nums` has a length of `m+n`, where the first `m` elements denote the elements that should be merged. and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`. 

## Solution approach

1. Let m > n. 
2. Check `nums` from the end, to ensure the largest value will always at end.
3. Iterate until `nums2` exhausted.