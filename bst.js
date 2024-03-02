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
    if (key > currentNode.key && currentNode.rightNode)
      return this.findNewNodeParent(currentNode.rightNode, key);
    else if (key < currentNode.key && currentNode.leftNode)
      return this.findNewNodeParent(currentNode.leftNode, key);

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
      if (!nodeParent) return false;
      // place node based on key value
      const newNode = new TreeNode(key);
      if (key > nodeParent.key) {
        nodeParent.rightNode = newNode;
      } else if (key < nodeParent.key) {
        nodeParent.leftNode = newNode;
      }
    }

    this.length++;
    return true;
  }

  findNode(key, startingNode) {
    // return false when tree is empty || starting node is null;
    if (this.length === 0 || !startingNode) return false;
    // move left or right in Tree
    if (key > startingNode.key && startingNode.rightNode) {
      return this.findNode(key, startingNode.rightNode);
    } else if (key < startingNode.key && startingNode.leftNode) {
      return this.findNode(key, startingNode.leftNode);
    }
    // return true if found else false
    return key === startingNode.key;
  }

  getMin() {
    let currentNode = this.root;
    while (currentNode.leftNode) {
      currentNode = currentNode.leftNode;
    }
    return currentNode;
  }

  getMax() {
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

  delete(key) {
    // return false if root is empty
    if (this.length === 0) return false;

    let currentNode = this.root;
    let parent = null;
    while (currentNode) {
      if (currentNode.key > key) {
        parent = currentNode;
        currentNode = currentNode.leftNode;
        continue;
      } else if (currentNode.key < key) {
        parent = currentNode;
        currentNode = currentNode.rightNode;
        continue;
      }
      break; // Will break if key is found;
    }

    if (!currentNode) return false; // return false is key is not found;

    // remove leaf node;
    if (currentNode.rightNode === null && currentNode.leftNode === null) {
      // check if root;
      if (parent === null) {
        this.root == null;
      } else {
        if (parent.leftNode.key === key) {
          parent.leftNode = null;
        } else {
          parent.rightNode = null;
        }
      }
    }

    // remove node with one child;

    this.length--;
    return true;
  }
}

const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(12);
//console.log(bst.findNode(10, bst.root));
//console.log(bst.findNode(30, bst.root));
/* console.log("............In Order ..................");
bst.inOrderTraversal(bst.root);
console.log("...........Pre order..........");
bst.preOrderTraversal(bst.root);
console.log("............ Post Order........");
bst.postOrderTraversal(bst.root);
console.log("//////////// predecessor - successor /////////////");
console.log(bst.findSuccessor(5).key);
console.log(bst.findPredecessor(15).key);
 */
console.log(bst.delete(12));
console.log(bst.delete(100));
