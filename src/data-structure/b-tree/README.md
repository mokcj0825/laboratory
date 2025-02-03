# B Tree

A self-balancing structure that store data.

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

    - [12][10] [13, 14]
    - [12][10] [13, 14, 15]
    - [12][10] [14][13][15]
    - [12, 14][10] [13][15]
    - [12, 14][10] [13][15, 16]

## Search
1. We know there have 2 layers, root and leaf. 
2. For the search, we just need to know which root node should be find downwards. The time complexity relies on number of root, instead of the whole dataset.