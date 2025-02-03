class BTreeNode<K> {
  keys: K[];
  children: BTreeNode<K>[];
  isLeaf: boolean;

  constructor(isLeaf: boolean) {
    this.keys = [];
    this.isLeaf = isLeaf;
    this.children = [];
  }
}

class BTree<K> {
  private root: BTreeNode<K>;
  private readonly t: number;

  constructor(t: number) {
    this.root = new BTreeNode<K>(true);
    this.t = t;
  }

  search(node: BTreeNode<K> | null, key: K): BTreeNode<K> | null {
    if (!node) return null;

    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;

    if (i < node.keys.length && key === node.keys[i]) return node;

    return node.isLeaf ? null : this.search(node.children[i], key);
  }

  insert(key: K): void {
    let root = this.root;
    if(root.keys.length === (2 * this.t - 1)) {
      let newRoot = new BTreeNode<K>(false);
      newRoot.children.push(root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this.insertNonFull(this.root, key);
  }

  private insertNonFull(node: BTreeNode<K>, key: K): void {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;
    } else {
      while (i >= 0 && key < node.keys[i]) i--;
      i++;
      if (node.children[i].keys.length === (2 * this.t - 1)) {
        this.splitChild(node, i);
        if (key > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  private splitChild(parent: BTreeNode<K>, i: number): void {
    let t = this.t;
    let fullNode = parent.children[i];
    let newNode = new BTreeNode<K>(fullNode.isLeaf);

    parent.keys.splice(i, 0, fullNode.keys[t - 1]);
    parent.children.splice(i + 1, 0, newNode);

    newNode.keys = fullNode.keys.splice(t);
    fullNode.keys.pop();

    if (!fullNode.isLeaf) {
      newNode.children = fullNode.children.splice(t);
    }
  }

  print(): void {
    console.log(JSON.stringify(this.root, null, 2));
  }
}

const bTree = new BTree<number>(2);
bTree.insert(10);
bTree.insert(20);
bTree.insert(5);
bTree.insert(6);
bTree.insert(12);
bTree.insert(30);
bTree.insert(7);
bTree.insert(17);
bTree.print();