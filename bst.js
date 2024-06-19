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

  findSuccessorRecursive(key, node) {
    let previous = null;
    if (node.key == node) {
      previous = node;
    }
    if (node.leftNode) {
      this.findSuccessorRecursive(key, node.leftNode);
    }
    if (node.rightNode) {
      this.findSuccessorRecursive(key, node.rightNode);
    }
  }

  // predecessor
  // items who come before key in an inOrder traversal
  findPredecessor(key) {
    if (!this.length) return -1;
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
    // move right first
    node = node.rightNode || null;
    while (node.leftNode) {
      node = node.leftNode;
    }
    return node;
  }

  getSubsetMinParent(node) {
    let parent = node;
    node = node.rightNode;
    while (node.leftNode) {
      parent = node;
      node = node.leftNode;
    }
    return parent;
  }

  removeNodeWithTwoChildren(subTree, key) {
    const subMin = this.getSubsetMin(subTree.node);
    const subMinParent = this.getSubsetMinParent(subTree.node);

    if (subMinParent.leftNode.key === subMin.key) {
      subMinParent.leftNode = null;
    }

    // case node is root
    if (key === this.root.key) {
      subMin.leftNode = this.root.leftNode;
      if (subMin.rightNode === null) {
        subMin.rightNode = this.root.rightNode;
      }
      this.root = subMin;
    } else {
      // node is not root
      if (subTree.parent.leftNode.key === key) {
        subTree.parent.leftNode = subMin;
      } else {
        subTree.parent.rightNode = subMin;
      }
      subMin.leftNode = subTree.node.leftNode;
      subMin.rightNode = subTree.node.rightNode || null;
      subTree.node = subMin;
    }
  }

  delete(key) {
    // return false if root is empty
    if (!this.length) return false;

    const subTree = {
      node: this.root,
      parent: null,
    };

    while (subTree.node) {
      subTree.parent = subTree.node;

      if (subTree.node.key > key) {
        subTree.node = subTree.node.leftNode;
      } else if (subTree.node.key < key) {
        subTree.node = subTree.node.rightNode;
      }

      if (key === subTree.node.key) {
        // remove the leaf node
        if (subTree.node.leftNode === null && subTree.node.rightNode === null) {
          this.removeLeaf(subTree.parent);
        } else if (
          (subTree.node.leftNode !== null && subTree.node.rightNode === null) ||
          (subTree.node.rightNode !== null && subTree.node.leftNode == null)
        ) {
          this.removeNodeWithOneChild(subTree.parent, subTree.node, key);
          subTree.node = null;
        } else {
          this.removeNodeWithTwoChildren(subTree, key);
        }

        this.length--;
        return true;
      }
    }
    return false;
  }
}

const bst = new BinarySearchTree();
bst.insert(20);
bst.insert(10);
bst.insert(30);
bst.insert(9);
bst.insert(25);
bst.insert(40);
bst.insert(45);
bst.insert(32);
bst.insert(7);
bst.insert(14);

console.log(bst.findSuccessorRecursive(7, bst.root));
