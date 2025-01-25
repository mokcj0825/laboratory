class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
  }
}

function printTree(root: TreeNode | null): string[][] {
  if(!root) return [];
  const getHeight = (node: TreeNode | null): number => {
    if (!node) return -1;
    return 1+ Math.max(getHeight(node.left), getHeight(node.right));
  };

  const height = getHeight(root);
  const m = height + 1;
  const n = Math.pow(2, height + 1) - 1;
  const res: string[][] = Array.from({length: m}, () => Array(n).fill(""));

  const fill = (node: TreeNode | null, row: number, col: number): void => {
    if(!node) return;
    res[row][col] = node.val.toString();
    const offset = Math.pow(2, height - row - 1);
    if (node.left) fill(node.left, row + 1, col - offset);
    if (node.right) fill(node.right, row + 1, col + offset);
  };
  fill(root, 0, Math.floor((n - 1) / 2));
  return res;
}

const root = new TreeNode(1, new TreeNode(2, new TreeNode(4), null), new TreeNode(3));
console.log(printTree(root));