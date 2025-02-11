# N Queens II

The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.

Given an integer `n`, return the number of distinct solutions to the **n-queens puzzle**.

## Solution approach

1. Try to put it one by one. When inserted, it deactivates in `+` and `x` directions.
2. Put the second Queen on the places that allowed.
3. Again, again and again, when you put all your queens, remove the first one. And repeat.
4. If you can put all Queen, it means you get a valid pattern.

## Solution approach v2

1. Do you know, sometimes, boolean array can be equivalent to just a number?