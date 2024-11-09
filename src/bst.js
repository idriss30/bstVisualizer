/* implementation of a binary tree holding numbers 
traversal, insertion, deletion, searching, predecessor, successor */

class TreeNode {
  constructor(key) {
    this.key = key;
    this.leftNode = null;
    this.rightNode = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.length = 0;
  }

  findNewNodeParent(currentNode, key) {
    if (key === currentNode.key) return false; // node exists
    if (key > currentNode.key && currentNode.rightNode) {
      return this.findNewNodeParent(currentNode.rightNode, key);
    } else if (key < currentNode.key && currentNode.leftNode) {
      return this.findNewNodeParent(currentNode.leftNode, key);
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
      if (nodeParent == null) return false;
      // place node based on key value
      const newNode = new TreeNode(key);
      if (key > nodeParent.key) {
        nodeParent.rightNode = newNode;
      } else {
        nodeParent.leftNode = newNode;
      }
    }

    this.length++;
    return true;
  }

  getNode(key, startingNode) {
    // return false when tree is empty or startingNode is empty
    if (!key || !startingNode || !this.length) return false;
    // move left if key is less
    if (key < startingNode.key) return this.getNode(key, startingNode.leftNode);
    // move right if key is greater
    if (key > startingNode.key)
      return this.getNode(key, startingNode.rightNode);

    return true;
  }

  getMin(node) {
    if (!node || !this.root) return false;
    if (node.leftNode) return this.getMin(node.leftNode);
    return node;
  }

  getMax(node) {
    if (!node || !this.root) return false;
    if (node.rightNode) return this.getMax(node.rightNode);
    return node;
  }
  // in order traversal
  // visit left Child and it s subtree, then currentNode, then RightChild;
  // ideal for printing node in ascending order

  inOrderTraversal(node) {
    if (!node || !this.length) return false;
    this.inOrderTraversal(node.leftNode);
    // do something with the currentNode;
    console.log(node.key);
    this.inOrderTraversal(node.rightNode);
  }

  // pre order traversal
  // ideal for creating a copy of the tree
  // node are visited from currentNode to left to right

  preOrderTraversal(node) {
    if (!node || !this.length) return false;
    console.log(node.key);
    this.preOrderTraversal(node.leftNode);
    this.preOrderTraversal(node.rightNode);
  }

  // postOrderTraversal
  // when you want to delete or when you need to process children before parents
  // left then right then current
  postOrderTraversal(node) {
    if (!node || !this.length) return false;
    this.postOrderTraversal(node.leftNode);
    this.postOrderTraversal(node.rightNode);
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
      (key == this.root.key && !this.root.rightNode)
    ) {
      return parent.key;
    }

    if (startNode.key == key && startNode.rightNode) {
      // if node has a rightNode successor is the rightNode;

      return startNode.rightNode.key;
    }
    if (startNode.key == key && !startNode.rightNode) {
      // if righNode is not present return the parent's key

      return parent.key;
    }

    if (key > startNode.key) {
      return this.getSuccessor(key, startNode.rightNode, startNode);
    } else {
      return this.getSuccessor(key, startNode.leftNode, startNode);
    }
  }

  // predecessor
  // items who come before key in an inOrder traversal

  getPredecessor(key, startingNode) {
    if (
      !startingNode ||
      !key ||
      !this.length ||
      (key == this.root.key && !this.root.leftNode)
    ) {
      return null;
    }
    if (key == startingNode.key && startingNode.leftNode) {
      return startingNode.leftNode.key;
    }
    if (key < startingNode.key) {
      return this.getPredecessor(key, startingNode.leftNode);
    } else {
      return this.getPredecessor(key, startingNode.leftNode);
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
        // if leftNode of parent is key to remove,  assign left Node to null
        if (parent.leftNode.key === key) {
          parent.leftNode = null;
        } else {
          // the node is the right child of parent;
          parent.rightNode = null;
        }
      }
    };

    // remove a single child node;
    const removeNodeWithOneChild = (parent, node) => {
      if (parent.leftNode.key === key) {
        parent.leftNode = node.leftNode || node.rightNode; // assign the parent node to the left or right node of the child.
      } else if (parent.rightNode.key === key) {
        parent.rightNode = node.leftNode || node.rightNode;
      }

      // element to remove is the root
      if (parent === null) {
        this.root = node.leftNode || node.rightNode;
      }
    };

    const setSuccessorParentLeftNode = (node, successor) => {
      node.leftNode = successor.rightNode ? successor.rightNode : null;
    };
    // remove a node with two children
    const removeNodeWithTwoChildren = (parent, currentNode) => {
      // find the successor for the subtree and keep track of his parent node
      const subTreeCurrentNode = currentNode.rightNode;
      let successor = subTreeCurrentNode.leftNode;
      while (successor?.leftNode) {
        subTreeCurrentNode = successor;
        successor = successor.leftNode;
      }

      // case node is the root

      if (!parent && successor) {
        // node is root and successor is not the root of the subTree
        // assign left child of his parent
        setSuccessorParentLeftNode(subTreeCurrentNode, successor);
        successor.leftNode = currentNode.leftNode;
        successor.rightNode = currentNode.rightNode;
        this.root = successor;
      } else if (!parent && !successor) {
        // successor is subTree root
        successor = subTreeCurrentNode;
        successor.leftNode = currentNode.leftNode;
        this.root = successor;
      }

      // node is not the root;
      if (parent && successor) {
        setSuccessorParentLeftNode(subTreeCurrentNode, successor);
        successor.leftNode = currentNode.leftNode;
        successor.rightNode = currentNode.rightNode;
      } else if (parent && !successor) {
        successor = subTreeCurrentNode;
        successor.leftNode = currentNode.leftNode;
      }

      // assign parent edges
      if (parent && parent.leftNode.key == currentNode.key) {
        parent.leftNode = successor;
      } else if (parent && parent.rightNode == currentNode.key) {
        parent.rightNode = successor;
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
        currentNode = currentNode.leftNode;
      } else {
        currentNode = currentNode.rightNode;
      }
    }

    if (!currentNode) return false;

    // node is found;
    if (!currentNode.leftNode && !currentNode.rightNode) {
      // node with no child;
      removeLeaf(parent);
    } else if (
      (currentNode.leftNode && !currentNode.rightNode) ||
      (currentNode.rightNode && !currentNode.leftNode)
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
