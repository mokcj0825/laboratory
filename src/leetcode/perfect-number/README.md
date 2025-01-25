# Perfect number

A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. A divisor of an integer $x$ is an integer that can divide $x$ evenly.

Given an integer $n$, return `true` if $n$ is a perfect number, otherwise return `false`.

## Solution approach.
1. Iterate 1 to $\sqrt{n}$
2. If $n$ divisible by iterated value, add to sum.
3. Check sum equal to $n$ or not.

## This is quite simple, let us start some special lesson? (0v0)
1. Why $\sqrt{n}$?
2. By the way, may I know time complexity and space complexity?