class rbNode {
  constructor(key, parent = null) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.isBlack = false;
    this.parent = parent;
  }
}

class RedBlackTree {
  constructor() {
    this.size = 0;
    this.root = null;
  }
  setRoot(node) {
    this.root = node;
    this.root.isBlack = true;
  }
  getParent(key, current) {
    if (current.key === key) {
      return false;
    }

    if (key > current.key && current.right) {
      return this.getParent(key, current.right);
    } else if (key < current.key && current.left) {
      return this.getParent(key, current.left);
    }
    return current;
  }

  setNode(parent, node) {
    if (parent.key > node.key) {
      parent.left = node;
    } else {
      parent.right = node;
    }
    node.parent = parent;
  }

  isColorFlip(node) {
    // take a node and check is sibling
    if (!node.parent || !node) return false;
    let parent = node.parent;
    if (parent.key > node.key && parent.right) {
      return parent.right.isBlack === false;
    } else if (parent.key < node.key && parent.left) {
      return parent.left.isBlack === false;
    } else {
      return false;
    }
  }
  colorFlip(node) {
    // take a subtree's root and color child;
    node.isBlack = false;
    if (node.left) {
      node.left.isBlack = true;
    }
    if (node.right) {
      node.right.isBlack = true;
    }
  }
  rightRotation(node) {
    // perform a right rotation on a node;
    let nodeParent = node.parent;
    let leftNode = node.left;
    let leftNodeChild = leftNode.right || null;
    if (!nodeParent) {
      this.setRoot(leftNode);
      leftNode.parent = null;
    } else {
      if (nodeParent.left && nodeParent.left.key === node.key) {
        nodeParent.left = leftNode;
      } else {
        nodeParent.right = leftNode;
      }
      leftNode.parent = nodeParent;
    }
    leftNode.right = node;
    node.left = leftNodeChild;
    node.parent = leftNode;
    return leftNode; // return new parent;
  }
  leftRotation(node) {
    // perform left rotation
    let nodeParent = node.parent;
    let rightNode = node.right;
    let rightNodeChild = rightNode.left || null;
    if (!nodeParent) {
      this.setRoot(rightNode);
      rightNode.parent = null;
    } else {
      if (nodeParent.left && nodeParent.left.key === node.key) {
        nodeParent.left = rightNode;
      } else {
        nodeParent.right = rightNode;
      }
      rightNode.parent = nodeParent;
    }
    rightNode.left = node;
    node.right = rightNodeChild;
    node.parent = rightNode;
    return rightNode; // return the new parent
  }
  colorFlipAfterRotation(node) {
    node.isBlack = true;
    if (node.left) {
      node.left.isBlack = false;
    }
    if (node.right) {
      node.right.isBlack = false;
    }
  }

  performRotation(parent, node) {
    if (!parent || !node) return false;
    let grandParent = parent.parent;
    let newSubTreeRoot = null;
    if (grandParent.key > parent.key && parent.key > node.key) {
      newSubTreeRoot = this.rightRotation(grandParent);
    } else if (grandParent.key < parent.key && parent.key < node.key) {
      newSubTreeRoot = this.leftRotation(grandParent);
    } else if (grandParent.key < parent.key && parent.key > node.key) {
      this.rightRotation(parent);
      newSubTreeRoot = this.leftRotation(grandParent); // after a double rotation the subTree root is returned from the last rotation
    } else {
      this.leftRotation(parent);
      newSubTreeRoot = this.rightRotation(grandParent);
    }
    this.colorFlipAfterRotation(newSubTreeRoot);
  }

  rotateOrFlip(node) {
    if (this.isColorFlip(node.parent)) {
      this.colorFlip(node.parent.parent);
    } else {
      this.performRotation(node.parent, node);
    }
  }

  balance(node) {
    // return true when there is no more node to process
    let parent = node.parent;
    if (node.key === this.root.key) {
      this.root.isBlack = true;
      return true; // nothing to balance;
    }
    if (parent.isBlack === false && node.isBlack === false) {
      this.rotateOrFlip(node);
    }
    return this.balance(parent);
  }
  // insert function
  insert(key) {
    // add root
    if (!this.size) {
      const newNode = new rbNode(key);
      this.setRoot(newNode);
      this.size++;
      return true;
    }

    // find Parent if tree is not empty;
    let nodeParent = this.getParent(key, this.root);
    if (!nodeParent) return false;
    const newNode = new rbNode(key);
    this.setNode(nodeParent, newNode);

    if (nodeParent.isBlack) {
      // no violation adding red child
      this.size++;
      return true;
    }

    // parent is not black, so violation
    const isColorFlipViolation = this.isColorFlip(nodeParent);
    if (isColorFlipViolation) {
      this.colorFlip(nodeParent.parent);
    } else {
      this.performRotation(nodeParent, newNode);
    }
    this.size++;
    this.balance(newNode);
    return true;
  }
  setSuccessorParentLeftNode(node, successor) {
    node.leftNode = successor.rightNode ? successor.rightNode : null;
  }

  assignChildToParent(node, value = null) {
    if (node.parent.left?.key === node.key) {
      node.parent.left = value;
    } else {
      node.parent.right = value;
    }
  }
  delete(node, key) {
    // take a starting node and traverse the tree to find the node (key) to delete

    if (!node) return false; // base case of recursion to find the node
    if (node.key > key) {
      return this.delete(node.left, key);
    } else if (node.key < key) {
      return this.delete(node.right, key);
    } else {
      // case node is red no children
      if (node.isBlack === false && !node.left && !node.right) {
        // simply remove it, can't be root.
        this.assignChildToParent(node);
      }

      // node is black and has a red child;
      const hasRedLeftChild =
        node.isBlack && !node.right && node.left?.isBlack === false;
      const hasRedRightChild =
        node.isBlack && !node.left && node.right?.isBlack === false;
      if (hasRedLeftChild || hasRedRightChild) {
        const nodeChild = node.left ? node.left : node.right;

        // remove node and color child black,  so no change in invariant
        this.assignChildToParent(node, nodeChild);
        nodeChild.isBlack = true;
      }
    }
  }
}
//5,6,2,8,9.50.13.58,23,11
const rbt = new RedBlackTree();
rbt.insert(5);
rbt.insert(6);
rbt.insert(2);
rbt.insert(8);
rbt.insert(9);
rbt.insert(50);
rbt.insert(13);
rbt.insert(58);
/* rbt.insert(23);
rbt.insert(11); */

console.log(rbt.delete(8));
console.log(rbt.root);

/*

when deleting a node with no children;

if node is red just delete it

if node is black

*/
