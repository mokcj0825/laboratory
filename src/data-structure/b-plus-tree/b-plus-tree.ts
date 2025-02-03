class BPlusTreeNode<K, V> {
  keys: K[];
  children: BPlusTreeNode<K, V>[] | null;
  values: (V | null)[];
  isLeaf: boolean;
  next: BPlusTreeNode<K, V> | null;

  constructor(isLeaf: boolean) {
    this.isLeaf = isLeaf;
    this.keys = [];
    this.children = isLeaf ? null : [];
    this.values = isLeaf ? [] : [];
    this.next = null;
  }
}

class BPlusTree<K, V> {
  private root: BPlusTreeNode<K, V>;
  private readonly t: number;

  constructor(t: number) {
    this.root = new BPlusTreeNode<K, V>(true);
    this.t = t;
  }

  search(key: K): V | null {
    let node = this.root;
    while (!node.isLeaf) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      node = node.children![i];
    }
    let i = node.keys.indexOf(key);
    return i !== -1 ? node.values[i] : null;
  }

  insert(key: K, value: V): void {
    let root = this.root;
    if (root.keys.length === (2 * this.t - 1)) {
      let newRoot = new BPlusTreeNode<K, V>(false);
      newRoot.children!.push(root);
      this.splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this.insertNonFull(this.root, key, value);
  }

  private insertNonFull(node: BPlusTreeNode<K, V>, key: K, value: V): void {
    if (node.isLeaf) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      node.keys.splice(i, 0, key);
      node.values.splice(i, 0, value);
    } else {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i++;
      if (node.children![i].keys.length === (2 * this.t - 1)) {
        this.splitChild(node, i);
        if (key > node.keys[i]) i++;
      }
      this.insertNonFull(node.children![i], key, value);
    }
  }

  private splitChild(parent: BPlusTreeNode<K, V>, i: number): void {
    let t = this.t;
    let fullNode = parent.children![i];
    let newNode = new BPlusTreeNode<K, V>(fullNode.isLeaf);

    parent.keys.splice(i, 0, fullNode.keys[t - 1]);
    parent.children!.splice(i + 1, 0, newNode);

    newNode.keys = fullNode.keys.splice(t - 1);
    if (fullNode.isLeaf) {
      newNode.values = fullNode.values.splice(t - 1);
      newNode.next = fullNode.next;
      fullNode.next = newNode;
    } else {
      newNode.children = fullNode.children!.splice(t);
    }
  }

  print(): void {
    console.log(JSON.stringify(this.root, null, 2));
  }
}

const bPlusTree = new BPlusTree<number, string>(2);
bPlusTree.insert(10, "A");
bPlusTree.insert(20, "B");
bPlusTree.insert(5, "C");
bPlusTree.insert(6, "D");
bPlusTree.insert(12, "E");
bPlusTree.insert(30, "F");
bPlusTree.insert(7, "G");
bPlusTree.insert(17, "H");
bPlusTree.print();