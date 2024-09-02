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

  insert(key) {
    if (!this.size) {
      const node = new RbtNode(key);
      node.isBlack = true;
      this.root = node;
      return true;
    }
  }
}
