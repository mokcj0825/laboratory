## Candy

There are `n` children standing in a line. Each child is assigned a rating value given in the integer array `ratings`.

You are giving candies to these children subjected to the following requirements:

- Each child must have at least one candy.
- Children with a higher rating get more candies than their neighbors.

Return the minimum number of candies you need to have to distribute the candies to the children.

### Solution Approach
1. Scan from left and scan from right. Then sums up everything.
2. Beware of peak, valley, peak, valley.

### Solution Approach v2
1. Is the sequence of who get how many candies really important?
2. Did the question asked for how many candies get by children?
3. How about that? If we include a little concepts of dy/dx, maybe we will have a more straightforward picture on the solution?

### Why I wrote Solution Approach v2?
Guess.