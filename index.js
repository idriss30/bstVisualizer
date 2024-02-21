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
    let parent = currentNode.parent;
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
    return [parent, currentNode];
  }

  insert(key) {
    // error handling not adding
    if (!parseInt(key)) return false;
    // if length is 0 create new node and assign root to it
    if (this.length === 0) {
      this.length++;
      this.root = new TreeNode(key);
      return true;
    }

    // loop through tree and find node parent of new node;

    const [parent, currentNode] = this.findNewNodeParent(this.root, key);
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

  findNode(key) {
    // handle wrong input and empty tree
    if (typeof key !== "number" || this.length === 0) return false;
    // check if key == root
    if (key === this.root.key) return true;
    // loop through tree
    let currentNode = this.root;
    while (currentNode) {
      if (currentNode.key === key) return true;
      currentNode =
        currentNode.key < key ? currentNode.rightChild : currentNode.leftChild;
    }
    return false;
  }

  //traversal
  inOrderTraversal(node) {
    // using recursion
    // return false if length is 0;
    if (this.length === 0 || !node) return false;
    // if node.leftChild call inOrderTraversal(node.leftChild)  until null;
    if (node.leftChild) this.inOrderTraversal(node.leftChild);
    // do something with node
    console.log(node.key);
    // move to the rightChild if any and call inOrderTraversal(node.rightChild)
    if (node.rightChild) this.inOrderTraversal(node.rightChild);
  }

  inOrder(root) {
    // using stack;
    const stack = [];
    let currentNode = root;
    while (currentNode !== null || stack.length > 0) {
      while (currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.leftChild;
      }

      currentNode = stack.pop();
      console.log(currentNode.key);
      currentNode = currentNode.rightChild;
    }
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
bst.insert("hello my name is");
bst.insert(20);
bst.insert(25);
bst.insert(10);
bst.insert(9);
bst.insert(11);
bst.insert(30);
bst.insert(22);
/* 
console.log("*************");
console.log("**********");
console.log(
  "min value ",
  bst.getMinValue().key,
  " the parent value is ",
  bst.getMinValue().parent?.key
);
console.log(
  "max value ",
  bst.getMaxValue().key,
  "the parent is ",
  bst.getMaxValue().parent?.key
);

console.log("########## find ###########");
console.log(bst.findNode(30));
console.log(bst.findNode(1000));
 */

//bst.inOrderTraversal(bst.root);
bst.inOrder(bst.root);
