# Number of different integers in a string

Given a string `word` that consists of digits and lowercase English letters. You will replace every non-digit character with a space. For example, `"a123bc34d8ef34"` will become `" 123  34 8  34"`. Notice that you are left with some integers that are separated by at least one space: "123", "34", "8", and "34". 

Return the number of different integers after performing the replacement operations on `word`.

Two integers are considered different, if their decimal representations without any leading zeroes are different. Means: `"a1b01c001` should return 1, because 1, 01, and 001 are same in their decimal representations.

## Solution approach
1. Replace non-digit characters
2. Splitting by space
3. Remove leading zeroes
4. Add to Set

## Tricks that may trap you at Step 3
1. If we have a super long string, with all zeroes. Should this long zeroes counted?

## Tricks that may trap you at Step 4
1. Why we use set?
2. How we control input, and how your programming language handles numbers.