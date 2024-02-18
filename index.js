import * as d3 from "d3";

class TreeNode {
  constructor(key, parent = null) {
    this.key = key;
    this.leftChild = null;
    this.rightChild = null;
    this.parent = parent;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
    this.length = 0;
  }

  // find new node parent
  findNewNodeParent(currentNode, key) {
    if (currentNode.key === key) return false;
    let parent = currentNode.parent;
    while (currentNode.leftChild != null || currentNode.rightChild !== null) {
      currentNode =
        currentNode.key < key ? currentNode.rightChild : currentNode.leftChild;
      parent = currentNode;
    }
    return [parent, currentNode];
  }

  insert(key) {
    // if length is 0 create new node and assign root to it
    if (this.length === 0) {
      this.length++;
      this.root = new TreeNode(key);
      return true;
    }
    let currentNode = this.root;
    let parent = null;
    // loop through tree and find node parent of new node;
    while (true) {
      if (key === currentNode.key) return false; // does'nt allow double entry
      // if key < node.key move left else move right
      else if (key < currentNode.key) {
        if (currentNode.leftChild == null) {
          break;
        }
        currentNode = currentNode.leftChild;
      } else {
        if (currentNode.rightChild == null) break;
        currentNode = currentNode.rightChild;
      }
      parent = currentNode;
    }

    this.length++;
    const node = new TreeNode(key, parent);
    // check if root
    if (currentNode.key === this.root.key) {
      // find node position and insert new node
      if (this.root.key < key) {
        this.root.rightChild = node;
      } else {
        this.root.leftChild = node;
      }
    } else {
      // compare value and insert new node
      if (currentNode.key < key) {
        currentNode.rightChild = node;
      } else {
        currentNode.leftChild = node;
      }
    }
    return true;
  }

  // min and max return false when tree is empty;
  // move in linear chain until value of left/right child is null;
  getMinValue() {
    if (this.length === 0) return false;
    let minNode = this.root;
    while (minNode.leftChild) {
      minNode = minNode.leftChild;
    }

    return minNode;
  }

  getMaxValue() {
    if (this.length === 0) return false;
    let maxNode = this.root;
    while (maxNode.rightChild) {
      maxNode = maxNode.rightChild;
    }
    return maxNode;
  }
}

const bst = new BinarySearchTree();
bst.insert(20);
bst.insert(25);
bst.insert(10);
bst.insert(9);
bst.insert(11);
bst.insert(30);

console.log("*************");
console.log("**********");
console.log(
  "min value ",
  bst.getMinValue().key,
  " the parent value is ",
  bst.getMinValue().parent.key
);
console.log(
  "max value ",
  bst.getMaxValue().key,
  "the parent is ",
  bst.getMaxValue().parent.key
);
