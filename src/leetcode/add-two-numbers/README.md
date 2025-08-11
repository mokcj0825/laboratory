## Add two numbers
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reversed order, and each of their nodes containes a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

```
Example 1: 
Input: l1 = [2, 4, 3], l2 = [5, 6, 4]
Output: [7, 0, 8]
Explanation: 342 + 465 = 807.

Example 2: 
Input: l1 = [0], l2=[0]
Output: [0]

Example 3:
Input: l1 = [9, 9, 9, 9, 9, 9, 9], l2 = [9, 9, 9, 9]
Output: [8, 9, 9, 9, 0, 0, 0, 1]
```

Constraints:
- The number of nodes in each linked list is in the range `[1, 100]`
- `0 <= Node.val <= 9`
- It is guaranteed that the list represents a number that does not have leading zeroes.

### Solution Approach
- Add and carry, add and carry
- When smaller finished, zero is it!
- Keep the carry and reset, until nothing to append.

### 0v0
- Beware, beware, input is not infinite.
- Take care, take care, when you know you should stop looping?
- Beware, beware, extra nodes no need to create.
- Take care, take care, millennium is potential. I hope you don't face it.