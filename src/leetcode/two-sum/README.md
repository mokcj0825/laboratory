# Two Sum

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`/

Assumption:
- Each input have exactly one solution.
- No element twice.
- `nums` can be any order.

Constraints:
- 2 $\le$ `nums.length` $\le$ $10^4$
- $-10^9$ $\le$ `nums[i]` $\le$ $10^9$
- $-10^9$ $\le$ `target` $\le$ $10^9$
- Only one valid answer exists.

## Solution approach

### Brute force
Just iterate each element $x$, and find which value equals to $`target - x`$
Time complexity: $O(n^2)$
$Total \space iterations = (n - 1) + (n - 2) + (n - 3)+...+(1) = \frac{n(n-1)}{2}$

$n^2$ is the highest order in this total iterations. Therefore, this approach has $O(n^2)$ time complexity.

But, we are no need using any stateful spaces to hold our data, Therefore we have $O(1)$ space complexity.

### This code (Suggested by ChatGPT)
For each elements in `input`, we calculate the complement, I mean, we deduct the target with each element. For example, now we have two arrays:
```
target = 9
input = [2,11,7,15]
complementMap = [7, -2, 2, -6] (Updates when iteration goes)
```
When the iteration runs to input, it will try to look up the existence of complement, any complement array equal to current input.

Explain in math: 
With constraint and assumptions, we can confirm that, sum of element in $n-a$ and $n-b$ equal to $target$. 

Assume $a \gt b$, when we scan on $n-b$ element, we will definitely have an element at position $n-a$ in complementMap, that $input_{n-b} = complement_{n-a}$.