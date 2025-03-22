/* implementation of a binary tree holding numbers, 
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
    const inOrderArr = [];
    const traverseTree = (node) => {
      if (!node || !this.length) return false;
      traverseTree(node.left);
      // push node to array
      inOrderArr.push(node);
      traverseTree(node.right);
    };
    traverseTree(node);
    return inOrderArr;
  }

  // pre order traversal
  // ideal for creating a copy of the tree
  // node are visited from currentNode to left to right

  preOrderTraversal(beginningNode) {
    const itemsArr = [];
    const traverse = (node) => {
      if (!node || !this.length) return false;
      itemsArr.push(node);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(beginningNode);
    return itemsArr;
  }

  // postOrderTraversal
  // when you want to delete or when you need to process children before parents
  // left then right then current
  postOrderTraversal(node) {
    const itemsArr = [];
    const traverseTree = (node) => {
      if (!node || !this.length) return false;
      traverseTree(node.left);
      traverseTree(node.right);
      itemsArr.push(node);
    };
    traverseTree(node);
    return itemsArr;
  }

  //findSuccessor
  // node that comes right after key in an in order traversal
  // smaller key value that's greater than current key
  getSuccessor(key, startingNode, successor = null) {
    if (!startingNode) return null;
    if (key < startingNode.key) {
      // The current node could be the successor; explore the left subtree
      return this.getSuccessor(key, startingNode.left, startingNode);
    } else if (key > startingNode.key) {
      // The successor must be in the right subtree
      return this.getSuccessor(key, startingNode.right, successor);
    } else if (key === startingNode.key) {
      // If the key matches, check the right subtree for an immediate successor
      if (startingNode.right) {
        let temp = startingNode.right;
        while (temp.left) {
          temp = temp.left; // Find the smallest key in the right subtree
        }
        return temp;
      }
      // If no right subtree, the successor is already stored in `successor`
      return successor;
    }
  }

  // predecessor
  // items who come before key in an inOrder traversal

  getPredecessor(key, startingNode, predecessor) {
    if (!startingNode) return null;
    if (key < startingNode.key) {
      // predecessor might be in left subtree
      return this.getPredecessor(key, startingNode.left, predecessor);
    } else if (key > startingNode.key) {
      // the predecessor might be currentNode
      let predecessor = startingNode;
      return this.getPredecessor(key, startingNode.right, predecessor);
    } else if (key === startingNode.key) {
      // traverse left subtree when node key is equal to key
      if (startingNode.left) {
        return this.getMax(startingNode.left);
      }
      // return predecessor if it stored
      return predecessor;
    }
  }
  nodeToDeleteParent = (currentNode, key) => {
    if (key === this.root.key) {
      // node is root no parent;
      return null;
    }
    let parent = null;
    while (currentNode) {
      // update parent if it's found
      if (currentNode.right && currentNode.right.key === key) {
        parent = currentNode;
        break;
      }
      if (currentNode.left && currentNode.left.key === key) {
        parent = currentNode;
        break;
      }
      // traverse tree
      if (currentNode.key < key) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }

    return parent;
  };

  removeLeafNode(parent, key) {
    let tempNode = null;
    if (!parent) {
      // node is root
      tempNode = JSON.parse(JSON.stringify(this.root)); // deep copy of object
      this.root = null;
    } else {
      // node to delete is leftNode
      if (parent.left && parent.left.key === key) {
        tempNode = JSON.parse(JSON.stringify(parent.left));
        parent.left = null;
      } else {
        // node to delete is the right node
        tempNode = JSON.parse(JSON.stringify(parent.right));
        parent.right = null;
      }
    }
    this.length--;
    return tempNode;
  }
  // remove a single child node;
  removeNodeWithOneChild = (parent, nodeToDelete) => {
    let tempNode = null;
    if (!parent) {
      tempNode = JSON.parse(JSON.stringify(this.root));
      if (this.root.left) {
        this.root = this.root.left;
      } else {
        this.root = this.root.right;
      }
    } else {
      if (parent.left && parent.left.key === nodeToDelete.key) {
        // node to delete is a left child and has one child;
        parent.left = nodeToDelete.left || nodeToDelete.right;
      } else {
        // node to delete is a right child and has one child;
        parent.right = nodeToDelete.left || nodeToDelete.right;
      }
      tempNode = JSON.parse(JSON.stringify(nodeToDelete));
    }
    this.length--;
    return tempNode;
  };

  removeNodeWithTwoChildren(parent, nodeToDelete) {
    // find successor
    let successor = this.getSuccessor(nodeToDelete.key, this.root);

    // find successor parent
    let successorParent = this.nodeToDeleteParent(this.root, successor.key);

    // if successor is not one level down
    if (successorParent.key !== nodeToDelete.key) {
      successorParent.left = successor.right || null;
      successor.right = nodeToDelete.right;
    }
    if (!parent) {
      this.root = successor;
    }
    if (parent && parent.left.key == nodeToDelete.key) {
      parent.left = successor;
    } else if (parent && parent.right.key == nodeToDelete.key) {
      parent.right = successor;
    }
    successor.left = nodeToDelete.left;
    nodeToDelete = successor;
    return successor;
  }

  // delete
  delete(key) {
    // return null if there is no tree
    if (!key || !this.root) return null;
    const nodeParent = this.nodeToDeleteParent(this.root, key);
    let nodeToDelete;
    if (this.root.key === key) {
      nodeToDelete = this.root;
    }
    if (nodeParent && nodeParent.left.key === key) {
      nodeToDelete = nodeParent.left;
    } else if (nodeParent && nodeParent.right.key === key) {
      nodeToDelete = nodeParent.right;
    }

    // return null if there is no node to delete
    if (!nodeToDelete) return null;

    if (!nodeToDelete.left && !nodeToDelete.right) {
      return this.removeLeafNode(nodeParent, key);
    } else if (nodeToDelete.left && nodeToDelete.right) {
      // delete node with two children
      return this.removeNodeWithTwoChildren(nodeParent, nodeToDelete);
    } else {
      // remove node with one child
      return this.removeNodeWithOneChild(nodeParent, nodeToDelete);
    }
  }
}

export { BinarySearchTree };
