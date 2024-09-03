/*
implementation of a Red black Tree with different methods for searching, inserting, 
deleting, Depth-first search.

*/

// single node class
class RbtNode {
  constructor(key) {
    this.key = key;
    this.parent = null;
    this.leftNode = null;
    this.rightNode = null;
    this.isBlack = false;
  }
}

class RbtTree {
  constructor() {
    this.size = 0;
    this.root = null;
  }

  // insert

  findParent(key, node) {
    // return false if key is already present;
    if (key === node.key) {
      return false;
    }
    if (key > node.key && node.rightNode) {
      return this.findParent(key, node.rightNode);
    } else if (key < node.key && node.leftNode) {
      return this.findParent(key, node.leftNode);
    }
    return node;
  }

  // define which operation to perform
  isColorFlip(node) {
    if (!node.parent) {
      return false;
    }

    return node.parent.leftNode.key === node.key
      ? node.parent.rightNode.isBlack === false
      : node.parent.leftNode.isBlack === false;
  }

  colorFlip(node) {
    // get the root and change children
    node.isBlack = false;
    node.leftNode.isBlack = true;
    node.rightNode.isBlack = true;
  }
  colorFlipAfterRotation(node) {
    node.isBlack = true;
    node.leftNode.isBlack = false;
    node.rightNode.isBlack = false;
  }

  setRoot(node) {
    this.root = node;
    this.root.isBlack = true;
  }
  leftRotation(node) {
    if (!node || !this.size) return false;
    let nodeParent = node.parent;
    let nodeGrandParent = node.parent.parent;

    // assign root if grandParent is null;
    if (!nodeGrandParent && nodeParent.key === this.root.key) {
      this.setRoot(node);
    }
    nodeParent.rightNode = node.leftNode || null;
    nodeParent.parent = node;
    nodeGrandParent.rightNode = node;
    node.leftNode = nodeParent;
    node.parent = nodeGrandParent;

    // change colors
    this.colorFlipAfterRotation(nodeGrandParent);
    return true;
  }

  rightRotation(node) {
    if (!node || !this.size) return false;

    let nodeParent = node.parent;
    let nodeGrandParent = node.parent.parent;

    if (!nodeGrandParent && nodeParent.key === this.root.key) {
      this.setRoot(node);
    }

    nodeParent.leftNode = node.rightNode || null;
    nodeParent.parent = node;
    nodeGrandParent.leftNode = node;
    node.rightNode = nodeParent;
    node.parent = nodeGrandParent;

    // change colors
    this.colorFlipAfterRotation(nodeGrandParent);
  }

  performRotation(nodeParent, node) {
    const grandParent = nodeParent.parent;
    // left rotation
    if (grandParent.key < nodeParent.key && nodeParent.key < node.key) {
      this.leftRotation(node);
    } else if (grandParent.key > nodeParent.key && nodeParent.key > node.key) {
      // right Rotation
      this.rightRotation(node);
    } else if (grandParent.key > nodeParent.key && nodeParent.key < node.key) {
      // left right rotation
      this.leftRotation(node);
      this.rightRotation(node);
    } else {
      // right left rotation
      this.rightRotation(node);
      this.leftRotation(node);
    }
  }

  balance(node) {
    // return true when there is no more node to process

    if (!this.size || !node) return true; //
    // adjust node black property
    if (node.key === this.root.key && this.root.isBlack === false) {
      this.root.isBlack = true;
    }
    // look for red violation
    const isNodeRed = node.isBlack === false;
    const isLeftChildRed = node.leftNode?.isBlack === false;
    const isRightChildRed = node.rightNode?.isBlack === false;
    if (isNodeRed && isLeftChildRed) {
      if (this.isColorFlip(node.parent)) {
        this.colorFlip(node.parent.parent);
      } else {
        this.performRotation(node, node.leftNode);
      }
    } else if (isNodeRed && isRightChildRed) {
      if (this.isColorFlip(node.parent)) {
        this.colorFlip(node.parent.parent);
      } else {
        this.performRotation(node, node.rightNode);
      }
    }
    // continue the tree process
    this.balance(node.leftNode);
    this.balance(node.rightNode);
  }

  insert(key) {
    if (!this.size) {
      const node = new RbtNode(key);
      node.isBlack = true;
      this.root = node;
      this.size++;

      return true;
    } else {
      const parent = this.findParent(key, this.root);
      if (!parent) return false; // node exists already;
      const newNode = new RbtNode(key);
      newNode.parent = parent; // assign new node's parent
      // insert when parent is black.  no violation new node is red by default;
      if (parent.isBlack && key > parent.key) {
        parent.rightNode = newNode;
      } else if (parent.isBlack && key < parent.key) {
        parent.leftNode = newNode;
      }

      // possible violation for consecutibe red nodes on the same path
      if (!parent.isBlack) {
        let isColorFlip = this.isColorFlip(parent);

        // handle color flip
        if (isColorFlip) {
          this.colorFlip(parent.parent); // pass the grand parent
          // attach node;
          if (parent.key > key) {
            parent.leftNode = newNode;
          } else {
            parent.rightNode = newNode;
          }
        } else {
          // figure out which rotation to perform for balancing
          this.performRotation(parent, newNode);
          this.colorFlipAfterRotation(parent.parent);
        }
      }
      this.size++;
      this.balance(this.root);
      return true;
    }
  }
}

const redBlackTree = new RbtTree();

redBlackTree.insert(20);
redBlackTree.insert(10);
redBlackTree.insert(30);
redBlackTree.insert(9);
redBlackTree.insert(14);
/* redBlackTree.insert(25);
redBlackTree.insert(40) */
console.log(redBlackTree.root);
