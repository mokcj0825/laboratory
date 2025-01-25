# Print Binary Tree

Given the `root` of a binary tree, construct a 0-indexed `m x n` string matrix `res` that represents a formatted layout of the tree. The formatted layout matrix should be constructed using the following rules:

- The height of the tree is `height` and the number of rows `m` should be equal to `height + 1`. 
- The number of columns `n` should be equal to $2^{height+1} - 1$. 
- Place the root node in the middle of the top row (more formally, at location `res[0][(n-1)/2]`). 
- For each node that has been placed in the matrix at position `res[r][c]`, place its left child at `res[r+1][`$c-2^{height-r}-1$`]` and its right child at `res[r+1][`$c+2^{height-r}-1$`]`. 
- Continue this process until all the nodes in the tree have been placed. 
- Any empty cells should contain the empty string `""`. 
- Return the constructed matrix `res`.

## Solution approach
1. Calculate tree height. This step is somewhat recursive. 
2. Once we get the tree height, we can get the "width", or columns, from the description.
3. Next, we need to calculate the position of each element. From human perspective, we can simply put the node from top to bottom. However, in codes, we should pad the binary tree to "fully binary tree". For example in tree: (1, (2, null, 4), (3, null, null)). It should become (1, (2, "", 4), (3, "", ""). Then, we recurse the tree to fill "", 4, "", and "". Which is the most bottom level nodes. Then, we put it into output matrix at position 0, 2, 4, 6. For upper nodes (2, 3). their position should be 1, 5. And finally, the position for upmost node, root will be 3. 

## Something what I don't want to say, for now. For me in the future.
1. Looks like we found the pattern. Are there any rooms for optimization?
2. Why the position for most bottom level would be 0, 2, 4, 6, 8, 10,..., and no overlaps with their higher nodes?