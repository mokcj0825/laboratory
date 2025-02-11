# Trapping Rain Water

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

## Solution approach
1. Water is trapped when there are taller bars on both sides, and restricted by it shorter boundary. 
2. However, we need to know actually how much water trapped. it should depend on its actual height.
3. Beware of scenarios that "containers" with no depth.
4. Beware of scenarios that "containers" only have one side.