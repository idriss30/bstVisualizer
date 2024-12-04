/* implementation of a binary tree holding numbers 
traversal, insertion, deletion, searching, predecessor, successor */

class TreeNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.length = 0;
  }

  findNewNodeParent(currentNode, key) {
    if (key === currentNode.key) return false; // node exists
    if (key > currentNode.key && currentNode.right) {
      return this.findNewNodeParent(currentNode.right, key);
    } else if (key < currentNode.key && currentNode.left) {
      return this.findNewNodeParent(currentNode.left, key);
    }

    return currentNode;
  }

  // insert
  insert(key) {
    if (!key || typeof key !== "number") return false;
    // add root
    if (!this.length) {
      let node = new TreeNode(key);
      this.root = node;
    } else {
      // find where to place node;
      const nodeParent = this.findNewNodeParent(this.root, key);
      // return false when duplicate value
      if (!nodeParent) return false;
      // place node based on key value
      const newNode = new TreeNode(key);
      if (key > nodeParent.key) {
        nodeParent.right = newNode;
      } else {
        nodeParent.left = newNode;
      }
    }

    this.length++;
    return true;
  }

  getNode(key, startingNode) {
    // return false when tree is empty or startingNode is empty
    if (!key || !startingNode || !this.length) return false;
    // move left if key is less
    if (key < startingNode.key) return this.getNode(key, startingNode.left);
    // move right if key is greater
    if (key > startingNode.key) return this.getNode(key, startingNode.right);

    return true;
  }

  getMin(node) {
    if (!node || !this.root) return false;
    if (node.left) return this.getMin(node.left);
    return node;
  }

  getMax(node) {
    if (!node || !this.root) return false;
    if (node.right) return this.getMax(node.right);
    return node;
  }
  // in order traversal
  // visit left Child and it s subtree, then currentNode, then RightChild;
  // ideal for printing node in ascending order

  inOrderTraversal(node) {
    if (!node || !this.length) return false;
    this.inOrderTraversal(node.left);
    // do something with the currentNode;
    console.log(node.key);
    this.inOrderTraversal(node.right);
  }

  // pre order traversal
  // ideal for creating a copy of the tree
  // node are visited from currentNode to left to right

  preOrderTraversal(node) {
    if (!node || !this.length) return false;
    console.log(node.key);
    this.preOrderTraversal(node.left);
    this.preOrderTraversal(node.right);
  }

  // postOrderTraversal
  // when you want to delete or when you need to process children before parents
  // left then right then current
  postOrderTraversal(node) {
    if (!node || !this.length) return false;
    this.postOrderTraversal(node.left);
    this.postOrderTraversal(node.right);
    console.log(node.key);
  }

  //findSuccessor
  // node that comes right after key in an in order traversal
  // smaller key value that's greater than current key

  getSuccessor(key, startNode, parent = null) {
    if (
      !startNode ||
      !key ||
      !this.length ||
      (key == this.root.key && !this.root.right)
    ) {
      return parent.key;
    }

    if (startNode.key == key && startNode.right) {
      // if node has a right successor is the right;

      return startNode.right.key;
    }
    if (startNode.key == key && !startNode.right) {
      // if righNode is not present return the parent's key

      return parent.key;
    }

    if (key > startNode.key) {
      return this.getSuccessor(key, startNode.right, startNode);
    } else {
      return this.getSuccessor(key, startNode.left, startNode);
    }
  }

  // predecessor
  // items who come before key in an inOrder traversal

  getPredecessor(key, startingNode) {
    if (
      !startingNode ||
      !key ||
      !this.length ||
      (key == this.root.key && !this.root.left)
    ) {
      return null;
    }
    if (key == startingNode.key && startingNode.left) {
      return startingNode.left.key;
    }
    if (key < startingNode.key) {
      return this.getPredecessor(key, startingNode.left);
    } else {
      return this.getPredecessor(key, startingNode.left);
    }
  }

  // delete
  delete(key) {
    // return false if root is empty
    if (!this.length) return false;

    // remove leaf node
    const removeLeaf = (parent) => {
      //  root;
      if (!parent) {
        this.root = null;
      } else {
        // if left of parent is key to remove,  assign left Node to null
        if (parent.left.key === key) {
          parent.left = null;
        } else {
          // the node is the right child of parent;
          parent.right = null;
        }
      }
    };

    // remove a single child node;
    const removeNodeWithOneChild = (parent, node) => {
      if (parent.left.key === key) {
        parent.left = node.left || node.right; // assign the parent node to the left or right node of the child.
      } else if (parent.right.key === key) {
        parent.right = node.left || node.right;
      }

      // element to remove is the root
      if (parent === null) {
        this.root = node.left || node.right;
      }
    };

    const setSuccessorParentLeftNode = (node, successor) => {
      node.left = successor.right ? successor.right : null;
    };
    // remove a node with two children
    const removeNodeWithTwoChildren = (parent, currentNode) => {
      // find the successor for the subtree and keep track of his parent node
      const subTreeCurrentNode = currentNode.right;
      let successor = subTreeCurrentNode.left;
      while (successor?.left) {
        subTreeCurrentNode = successor;
        successor = successor.left;
      }

      // case node is the root

      if (!parent && successor) {
        // node is root and successor is not the root of the subTree
        // assign left child of his parent
        setSuccessorParentLeftNode(subTreeCurrentNode, successor);
        successor.left = currentNode.left;
        successor.right = currentNode.right;
        this.root = successor;
      } else if (!parent && !successor) {
        // successor is subTree root
        successor = subTreeCurrentNode;
        successor.left = currentNode.left;
        this.root = successor;
      }

      // node is not the root;
      if (parent && successor) {
        setSuccessorParentLeftNode(subTreeCurrentNode, successor);
        successor.left = currentNode.left;
        successor.right = currentNode.right;
      } else if (parent && !successor) {
        successor = subTreeCurrentNode;
        successor.left = currentNode.left;
      }

      // assign parent edges
      if (parent && parent.left.key == currentNode.key) {
        parent.left = successor;
      } else if (parent && parent.right == currentNode.key) {
        parent.right = successor;
      }
    };

    let parent = null;
    let currentNode = this.root;

    while (currentNode) {
      if (!parent) {
        parent = currentNode;
      }
      if (key === currentNode.key) {
        break;
      } else if (key < currentNode.key) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (!currentNode) return false;

    // node is found;
    if (!currentNode.left && !currentNode.right) {
      // node with no child;
      removeLeaf(parent);
    } else if (
      (currentNode.left && !currentNode.right) ||
      (currentNode.right && !currentNode.left)
    ) {
      // node with one child
      removeNodeWithOneChild(parent, currentNode);
    } else {
      // node has two children;
      removeNodeWithTwoChildren(parent, currentNode);
    }
    this.length--;
    return true;
  }
}

export { BinarySearchTree };
