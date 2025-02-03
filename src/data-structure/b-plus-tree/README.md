# B+ Tree

Another self-balancing structure that store data.

## Insert
1. For first input `n`: it will enter directly.

   Outcome: [n]
2. For second input, `n+a`:
   If a > 0, it will put after `n`. Else, it will put before `n`:

   Outcome: [n, n+a]
3. Since `n` and `n+a` are interchangeable by substitution ([m-a, m], m = n+a). We can assume `a` always greater than 0.
4. For new input `p`, it will be compared with `n`, `n+a` until `p` found its position: [p, n, m].
5. If the key length is greater than key's length, or how many nodes per level. The middle value will pop to upper level. The popped outcome: [n][p, m].
6. For imbalance case: For example: 10, 12, 13, 14, 15, 16:
7. The node structure (t=2) will be:

    - [10, 12]
    - [10, 12, 13]
    - [12][10] [12, 13] <- On the right node, it has another node "copied" from parent.
    - [12][10] [12, 13, 14]
    - [12, 13][10] [12] [13, 14] <- 13 is the middle data, it moved up when 14 added. 
    - [12, 13, 14][10] [12] [13] [14, 15] <- When 15 added, 13-15 will overflow. So the middle value 14 will be moved to root.
    - [12, 13, 14, 15][10] [12] [13] [14] [15, 16] <- Same as previous value.

## Search
1. We know there have 2 layers, root and leaf.
2. For the search, we just need to know which root node should be find downwards. The time complexity relies on number of root, instead of the whole dataset.
3. Because B+ have all values in leaves, so the search no need to search back.
    
    For example: In our example, when we search `13` in B Tree, we should know the node is between [12, 14]. And in B+ Tree, we traverse to 13 (root node), and move down directly under it.