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
    if (key === currentNode.key) return false;
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
    if (this.length === 0) {
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

  findNode(key, startingNode) {
    // return false when tree is empty || starting node is null;
    if (this.length === 0 || !startingNode || !key) return false;
    // move left or right in Tree
    while (startingNode) {
      if (key === startingNode.key) {
        return true;
      } else if (key > startingNode.key) {
        startingNode = startingNode.rightNode;
      } else {
        startingNode = startingNode.leftNode;
      }
      return false;
    }

    /* if (key > startingNode.key && startingNode.rightNode) {
      return this.findNode(key, startingNode.rightNode);
    } else if (key < startingNode.key && startingNode.leftNode) {
      return this.findNode(key, startingNode.leftNode);
    }
    // return true if found else false
    return key === startingNode.key; */
  }

  getMin() {
    if (this.length === 0) return false;
    let currentNode = this.root;
    while (currentNode.leftNode) {
      currentNode = currentNode.leftNode;
    }
    return currentNode;
  }

  getMax() {
    if (this.length === 0) return false;
    let currentNode = this.root;
    while (currentNode.rightNode) {
      currentNode = currentNode.rightNode;
    }
    return currentNode;
  }
  // in order traversal
  // visit left Child and it s subtree, then currentNode, then RightChild;
  // ideal for printing node in ascending order

  inOrderTraversal(node) {
    if (!node || this.length === 0) return false;
    this.inOrderTraversal(node.leftNode);
    // do something with the currentNode;
    console.log(node.key);
    this.inOrderTraversal(node.rightNode);
  }

  // pre order traversal
  // ideal for creating a copy of the tree
  // node are visited from currentNode to left to right

  preOrderTraversal(node) {
    if (!node || this.length === 0) return false;
    console.log(node.key);
    this.preOrderTraversal(node.leftNode);
    this.preOrderTraversal(node.rightNode);
  }

  // postOrderTraversal
  // when you want to delete or when you need to process children before parents
  // left then right then current
  postOrderTraversal(node) {
    if (!node || this.length === 0) return false;
    this.postOrderTraversal(node.leftNode);
    this.postOrderTraversal(node.rightNode);
    console.log(node.key);
  }

  //findSuccessor
  // node that comes right after key in an in order traversal
  // small key value that's greater than current key
  findSuccessor(key) {
    if (this.length === 0) return -1;
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

  // predecessor
  // items who come before key in an inOrder traversal
  findPredecessor(key) {
    if (this.length === 0) return -1;
    const stack = [];
    let currentNode = bst.root;
    let previous = null;
    while (currentNode !== null || stack.length > 0) {
      // go all the way to the left
      while (currentNode !== null) {
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

  // delete

  // remove leaf node
  removeLeaf(parent) {
    // check if root;
    if (parent === null) {
      this.root = null;
    } else {
      if (parent.leftNode.key === key) {
        parent.leftNode = null;
      } else {
        parent.rightNode = null;
      }
    }
  }

  removeNodeWithOneChild(parent, node, key) {
    if (parent.leftNode.key === key) {
      parent.leftNode = node.leftNode || node.rightNode;
    } else if (parent.rightNode.key === key) {
      parent.rightNode = node.rightNode || node.leftNode;
    }

    // element to remove is the root
    if (parent === null) {
      this.root = node.leftNode || node.rightNode;
    }
  }
  getSubsetMin(node) {
    while (node.leftNode) {
      node = node.leftNode;
    }
    return node;
  }

  getSubsetMinParent(node, key) {
    while (node.leftNode) {
      if (node.leftNode.key === key) {
        return node;
      }
      node = node.leftNode;
    }
    return -1;
  }

  removeNodeWithTwoChildren(parent, node, key) {
    const currentMin = this.getSubsetMin(node);
    const currentMinParent = this.getSubsetMinParent(node, key);
    currentMinParent.leftNode = null;
    if (parent === null) {
      // node is root
      this.root.rightNode = currentMin.rightNode;
      this.root.leftNode = currentMin.leftNode;
      this.root = currentMin;
    } else {
      if (key === parent.leftNode.key) {
        parent.leftNode = currentMin;
      } else {
        parent.rightNode = currentMin;
      }
      currentMin.leftNode = node.leftNode || null;
      currentMin.rightNode = node.rightNode || null;
      node = currentMin;
    }
  }

  delete(key) {
    // return false if root is empty
    if (this.length === 0) return false;

    let currentNode = this.root;
    let parent = null;

    while (currentNode) {
      parent = currentNode;

      if (currentNode.key > key) {
        currentNode = currentNode.leftNode;
        continue;
      } else if (currentNode.key < key) {
        currentNode = currentNode.rightNode;
        continue;
      }

      if (key === currentNode.key) {
        // remove the leaf node
        if (currentNode.leftNode === null && currentNode.rightNode === null) {
          this.removeLeaf(parent);
        } else if (
          currentNode.leftNode !== null ||
          currentNode.rightNode !== null
        ) {
          this.removeNodeWithOneChild(parent, currentNode, key);
          currentNode = null;
        } else {
          // remove node with two children;
          this.removeNodeWithTwoChildren(parent, currentNode, key);
        }

        this.length--;
        return true;
      }
    }
    return false;
  }
}

const bst = new BinarySearchTree();

bst.insert(30);
bst.insert(20);
bst.insert(35);
bst.insert(15);
bst.insert(25);
bst.insert(33);
bst.insert(40);
bst.insert(34);
bst.insert(31);
bst.insert(36);
bst.insert(45);

console.log("the min is ", bst.getMin());
console.log("the max is ", bst.getMax());
console.log("***************In Order-Traversal ************");
bst.inOrderTraversal(bst.root);
console.log("************Post order Traversal**********");
bst.postOrderTraversal(bst.root);
console.log("************** Pre order Traversal**********");
bst.preOrderTraversal(bst.root);
