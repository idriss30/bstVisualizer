/* implementation of a binary search tree holding numbers 
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

  findNode2(key, startingNode) {
    // return false when tree is empty or startingNode is empty
    if (!key || !startingNode || !this.length) return false;
    // move left if key is less
    if (key < startingNode.key)
      return this.findNode2(key, startingNode.leftNode);
    // move right if key is greater
    if (key > startingNode.key)
      return this.findNode2(key, startingNode.rightNode);

    return true;
  }

  findNode(key, startingNode) {
    // return false when tree is empty || starting node is null;
    if (!this.length || !startingNode || !key) return false;
    // move left or right in Tree
    while (startingNode) {
      if (key === startingNode.key) {
        return true;
      } else if (key > startingNode.key) {
        startingNode = startingNode.rightNode;
      } else {
        startingNode = startingNode.leftNode;
      }
    }
    return false;
  }

  getMinRecursive(node) {
    if (!node || !this.root) return false;
    if (node.leftNode) return this.getMinRecursive(node.leftNode);
    return node;
  }

  getMin() {
    if (!this.length) return false;
    let currentNode = this.root;
    while (currentNode.leftNode) {
      currentNode = currentNode.leftNode;
    }
    return currentNode;
  }

  getMax() {
    if (!this.length) return false;
    let currentNode = this.root;
    while (currentNode.rightNode) {
      currentNode = currentNode.rightNode;
    }
    return currentNode;
  }

  getMaxRecursive(node) {
    if (!node || !this.root) return false;
    if (node.rightNode) return this.getMaxRecursive(node.rightNode);
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
  findSuccessor(key) {
    if (!this.length) return -1;
    const stack = [];
    let currentNode = bst.root;
    while (currentNode !== null || stack.length > 0) {
      // go all the way to the left
      while (currentNode !== null) {
        stack.push(currentNode);
        currentNode = currentNode.leftNode;
      }
      currentNode = stack.pop();
      if (currentNode.key > key) {
        return currentNode;
      }
      currentNode = currentNode.rightNode;
    }
  }

  findSuccessorRecursive(key, startNode, parent = null) {
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
      return this.findSuccessorRecursive(key, startNode.rightNode, startNode);
    } else {
      return this.findSuccessorRecursive(key, startNode.leftNode, startNode);
    }
  }

  // predecessor
  // items who come before key in an inOrder traversal
  findPredecessor(key) {
    if (!this.length) return -1;
    const stack = [];
    let currentNode = bst.root;
    let previous = null;
    while (currentNode || stack.length > 0) {
      // go all the way to the left
      while (currentNode) {
        stack.push(currentNode);
        previous = currentNode;
        currentNode = currentNode.leftNode;
      }
      currentNode = stack.pop();
      if (currentNode.key >= key) {
        break;
      }
      previous = currentNode;
      currentNode = currentNode.rightNode;
    }
    return previous;
  }

  findPredecessorRecursive(key, startingNode) {
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
      return this.findPredecessorRecursive(key, startingNode.leftNode);
    } else {
      return this.findPredecessorRecursive(key, startingNode.leftNode);
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

const bst = new BinarySearchTree();
bst.insert(20);
bst.insert(10);
bst.insert(30);
bst.insert(9);
bst.insert(25);
// new delete test
/* bst.insert(27);
bst.insert(28);
bst.insert(26); */
bst.insert(40);
bst.insert(45);
bst.insert(32);
bst.insert(7);
bst.insert(14);

bst.delete(10);
console.log(bst.root);
