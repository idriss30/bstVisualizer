import { BinarySearchTree } from "../components/bst";
/* this module contains everything related to rendering the tree,
converting the data in D3 formats, rendering nodes and links, updating and deleting  animation, etc...
 
*/
import * as d3 from "d3";
import { d3TreeDom, formObject } from "./DomObJect";
/* This class holds the data used to render the tree */
class TreeData {
  // define tree info
  constructor() {
    this.data = null;
    this.dy = d3TreeDom.ySpace; // vertical spacing
    this.dx = d3TreeDom.xSpace; // horizontal spacing
    this.y0 = Infinity;
    this.y1 = -this.y0;
    this.x0 = Infinity;
    this.x1 = -this.x0;
    this.container = d3TreeDom.container; // will be used to calculate width and height
    this.width = this.getInitialWidth();
    this.height = this.getInintialHeight();
    this.d3Container = d3.select(`${d3TreeDom.d3ContainerName}`);
  }
  getInitialWidth() {
    return this.container.getBoundingClientRect().width;
  }

  getInintialHeight() {
    return this.container.getBoundingClientRect().height;
  }
  // method to convert a bst to d3's tree format recursively
  // takes the root node of a bst
  // return TreeNode the d3 version of the bst info.
  convertDataToD3(node) {
    if (!node) return null;
    const treeNode = {
      name: node.key,
      id: node.key, // using the node.key as an id to  render only the new node everytime the tree changes
      children: [],
    };

    if (node.left) {
      treeNode.children.push(this.convertDataToD3(node.left));
    }
    if (node.right) {
      treeNode.children.push(this.convertDataToD3(node.right));
    }

    return treeNode;
  }
  setData(root) {
    this.data = this.convertDataToD3(root);
  }
}

/* This class used the data to render the tree */
class TreeRender {
  /* initial constructor that appends the global structure and sets the required variables.
   */
  constructor(xSpace, ySpace, uIcontainer) {
    this.treeData = new TreeData(xSpace, ySpace, uIcontainer);
    this.bst = new BinarySearchTree();
    this.appendStructure();
  }
  appendStructure() {
    // appending svg container to dom
    this.treeData.svg = this.treeData.d3Container
      .append("svg")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("viewBox", [
        -this.treeData.width / 1.2,
        -this.treeData.height / 1.2,
        this.treeData.width * 1.2,
        this.treeData.height * 1.2,
      ]);

    // append global group
    this.treeData.itemsGroup = this.treeData.svg.append("g");
    // append g for a link group
    this.treeData.linksGroup = this.treeData.itemsGroup
      .append("g")
      .attr("class", d3TreeDom.linksGroupClassName);
    // append a group for nodes so they could scale collectively
    this.treeData.nodeGroup = this.treeData.itemsGroup
      .append("g")
      .attr("class", d3TreeDom.nodeGroupClassName);
  }
  // manage node function
  manageNode(root) {
    // data can be changed and adjust based on dev preference
    this.treeData.nodeGroup
      .selectAll(`.${d3TreeDom.className}`)
      .data(root.descendants(), (d) => d.data.id) // Using id as unique identifier
      .join(
        (enter) => {
          const nodeEnter = enter
            .append("g")
            .attr("class", `${d3TreeDom.className}`)
            .attr("id", (d) => `node-${d.data.id}`)
            .attr("transform", (d) => `translate(${d.x},${d.y})`);

          nodeEnter
            .append("circle")
            .attr("r", d3TreeDom.circleRadius)
            .attr("stroke-width", 3)
            .attr("stroke", d3TreeDom.fillColorOne)
            .attr("fill", d3TreeDom.fillColorOne);

          nodeEnter
            .append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("font-size", "35px")
            .attr("fill", d3TreeDom.text)
            .text((d) => d.data.name);
        },
        (update) => update.attr("transform", (d) => `translate(${d.x},${d.y})`), // update position
        (exit) => exit.remove()
      );
  }
  // manage links
  manageLink(rootNode) {
    const linksSelection = this.treeData.linksGroup
      .selectAll(`.${d3TreeDom.linkClassName}`)
      .data(rootNode.links(), (d) => d.target.id);

    linksSelection.join(
      (enter) =>
        enter
          .append("path")
          .attr("class", d3TreeDom.linkClassName)
          .attr("id", (d) => `link-${d.source.data.id}-to-${d.target.data.id}`)
          .attr(
            "d",
            d3
              .link(d3.curveLinear)
              .x((d) => d.x)
              .y((d) => d.y)
          ),
      (update) =>
        update.attr(
          "d",
          d3
            .link(d3.curveLinear)
            .x((d) => d.x)
            .y((d) => d.y)
        ),
      (exit) => exit.remove()
    );

    linksSelection
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 1)
      .attr("stroke-width", 1);
  }

  createTree(data) {
    // create the hierarchy
    const root = d3.hierarchy(data);
    // create the tree
    const tree = d3.tree().nodeSize([this.treeData.dx, this.treeData.dy]);
    tree(root);
    this.treeData.root = root; // adding root to the data object to avoid creating it everytime.
    return root;
  }

  updateTreeLayout(rootNode) {
    // iterate through each node and find min and max values for x and y
    rootNode.each((d) => {
      if (d.x > this.treeData.x1) this.treeData.x1 = d.x;
      if (d.x < this.treeData.x0) this.treeData.x0 = d.x;
      if (d.y > this.treeData.y1) this.treeData.y1 = d.y;
      if (d.y < this.treeData.y0) this.treeData.y0 = d.y;

      d.y = d.depth * 150; // adjust vertical spacing

      // offset single child node to place accordingly

      if (d.children && d.children.length == 1) {
        const child = d.children[0];
        const offset = 40; //to adjust position of single child node
        if (child.x === d.x) {
          child.x =
            child.x + (child.data.name < d.data.name ? -offset : offset);
        }
      }
    });
    // adjust width and height
    this.treeData.width = Math.max(
      this.treeData.width,
      this.treeData.x1 - this.treeData.x0 + this.treeData.dx * 2
    );
    this.treeData.height =
      this.treeData.y1 - this.treeData.y0 + this.treeData.dy * 2;
    this.treeData.svg.attr("viewBox", [
      -this.treeData.dx + this.treeData.x0,
      -this.treeData.dy + this.treeData.y0,
      this.treeData.width,
      this.treeData.height * 1.4,
    ]);
  }
  // path to get to specific node
  pathToNode(root, key, arr = []) {
    if (key === root.data.name) return arr; // base case because node will always be found
    arr.push(root); // push the currentNode;
    if (key < root.data.name && root.children[0]) {
      return this.pathToNode(root.children[0], key, arr);
    }
    if (key > root.data.name && root.children[1]) {
      return this.pathToNode(root.children[1], key, arr);
    } else {
      return this.pathToNode(root.children[0], key, arr);
    }
  }
  // node Finding function using d3.js
  findNodeAndReturnPath(key) {
    // using path on the root
    const isNode = this.treeData.root.find((node) => node.data.name === key);
    if (isNode) {
      return [...isNode.ancestors()].reverse(); // reverse the elements to start from top to bottom
    }
    return false;
  }

  blinkingNodeAnimation(currentNode) {
    currentNode
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .select("circle")
      .attr("fill", d3TreeDom.animationFill)
      .attr("stroke", d3TreeDom.animationFill)
      .attr("r", 30)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("r", d3TreeDom.circleRadius)
      .attr("fill", d3TreeDom.fillColorOne)
      .attr("stroke", d3TreeDom.fillColorOne)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("fill", d3TreeDom.animationFill)
      .attr("stroke", d3TreeDom.animationFill)
      .attr("r", 35)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("r", d3TreeDom.circleRadius)
      .attr("fill", d3TreeDom.fillColorOne)
      .attr("stroke", d3TreeDom.fillColorOne)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("fill", d3TreeDom.animationFill)
      .attr("stroke", d3TreeDom.animationFill)
      .attr("r", 30)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("r", d3TreeDom.circleRadius)
      .attr("fill", d3TreeDom.fillColorOne)
      .attr("stroke", d3TreeDom.fillColorOne);
  }

  // function to animate a node
  nodeAnimation(currentNode, index, callBack) {
    currentNode
      .transition()
      .ease(d3.easeLinear)
      .delay(index * 500) // Delay based of index to avoid a simultaneous animation
      .select("circle")
      .duration(500)
      .attr("fill", d3TreeDom.animationFill)
      .attr("stroke", d3TreeDom.animationFill)
      .transition()
      .duration(250)
      .attr("fill", d3TreeDom.fillColorOne) // restore color
      .attr("stroke", d3TreeDom.fillColorOne)
      .on("end", callBack);
  }
  // animate the insertion of a node
  animateInsertion = (root, key) => {
    const nodesPath = this.pathToNode(root, key);
    let currentNode;
    const callBack = (index, path) => {
      if (index === path.length - 1) {
        // stopping at element before the last one to prevent animation of the last inserted node
        this.manageLink(root);
        this.manageNode(root);
        return;
      }
    };
    nodesPath.forEach((node, index) => {
      currentNode = d3.select(`#node-${node.data.id}`);
      this.nodeAnimation(currentNode, index, () => {
        callBack(index, nodesPath);
      });
    });
  };
  nodeFindingAnimation(nodesArray) {
    let currentNode;
    // creating callBack to pass after animation
    const callBack = (currentNode, index, path) => {
      if (index === path.length - 1) {
        // creating blinking animation to last found node
        this.blinkingNodeAnimation(currentNode);
        this.displayMessage(`${currentNode.attr("id")} is currently blinking`);
      }
    };

    nodesArray.forEach((node, index) => {
      // select current node
      currentNode = d3.select(`#node-${node.data.id}`);
      this.nodeAnimation(currentNode, index, () => {
        callBack(currentNode, index, nodesArray);
      });
    });
  }
  // shrinking a node
  shrink(id) {
    let domNodeElement = d3.select(`#node-${id}`);
    let domNodeRadius = domNodeElement.select("circle").attr("r");
    // change node color to accent color
    // reduce size from current size to 0 within half a second

    domNodeElement
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .select("circle")
      .attr("fill", d3TreeDom.animationFill)
      .attr("stroke", d3TreeDom.animationFill)
      .attr("r", domNodeRadius)
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .attr("r", 0);

    domNodeElement
      .transition()
      .ease(d3.easeLinear)
      .duration(500)
      .select("text")
      .attr("fill", "black")
      .text("");
  }
  // rendering a node method
  renderNode(key) {
    const isKeyValid = this.bst.insert(key);
    if (!isKeyValid) return null;
    this.treeData.setData(this.bst.root);
    // regenerate layout
    const root = this.createTree(this.treeData.data);
    this.updateTreeLayout(root);
    if (this.bst.length > 1) {
      // animate path
      this.animateInsertion(root, key);
    } else {
      this.manageNode(root);
    }
  }
  // function that displays a message and delete it after two second
  displayMessage(message) {
    const displayContainer = document.querySelector(".bst__results-message");
    displayContainer.innerHTML = message;
    setTimeout(() => {
      displayContainer.innerHTML = "";
    }, 2200);
  }

  // get min feature
  getMinAndBlinkWhenFound() {
    const min = this.bst.getMin(this.bst.root);
    if (!min) {
      this.displayMessage("No minimum was found");
      return;
    }
    const selectMin = d3.select(`#node-${min.key}`);

    this.blinkingNodeAnimation(selectMin);
    this.displayMessage(`Minimum ${min.key} is blinking`);
  }
  //  get predecessor
  getPredecessor(key, startingNode) {
    const predecessor = this.bst.getPredecessor(key, startingNode);

    if (!predecessor) {
      this.displayMessage("predecessor was not found");
      return;
    }
    const selectPredecessor = d3.select(`#node-${predecessor.key}`);
    this.blinkingNodeAnimation(selectPredecessor);
    this.displayMessage(
      `${selectPredecessor.attr("id")} is currently blinking)`
    );
  }

  // get Successor
  getSuccessor(key, startingNode) {
    const successor = this.bst.getSuccessor(key, startingNode);

    if (!successor) {
      this.displayMessage("successor was not found");
      return;
    }

    const selectSuccessor = d3.select(`#node-${successor.key}`);
    this.blinkingNodeAnimation(selectSuccessor);
    this.displayMessage(`${selectSuccessor.attr("id")} is currently blinking)`);
  }

  // get max feature
  getMaxAndBlinkWhenFound() {
    const max = this.bst.getMax(this.bst.root);
    if (!max) {
      this.displayMessage("No maximum was found");
      return;
    }
    const maxSelection = d3.select(`#node-${max.key}`);
    this.blinkingNodeAnimation(maxSelection);
    this.displayMessage(`Maximum ${max.key} is blinking`);
  }
  // inOrder Traversal
  inOrderTraversal() {
    if (!this.bst.root) {
      this.displayMessage("no tree to traverse");
      return;
    }
    const inOrderArr = this.bst.inOrderTraversal(this.bst.root);
    return inOrderArr;
  }

  // preOrder traversal

  preOrderTraversal() {
    if (!this.bst.root) {
      this.displayMessage("no tree to traverse");
      return;
    }
    const preOrderArr = this.bst.preOrderTraversal(this.bst.root);
    return preOrderArr;
  }

  // post order traversal
  postOrderTraversal() {
    if (!this.bst.root) {
      this.displayMessage("no tree to traverse");
      return;
    }
    const postOrderArr = this.bst.postOrderTraversal(this.bst.root);
    return postOrderArr;
  }
  // traversal call back
  traversalCallBack(node, index, length) {
    let span = document.createElement("span");
    span.setAttribute("class", `nodeSpan`);
    let myString;
    if (index === 0) {
      myString = document.createTextNode(`[ ${node.key}, `);
    } else if (index != length - 1) {
      myString = document.createTextNode(`${node.key}, `);
    } else {
      myString = document.createTextNode(`${node.key} ]`);
    }
    span.appendChild(myString);
    formObject.resultArray.appendChild(span);
  }
  animateRemoval(key, node) {
    // find node 
    const d3Node = this.treeData.data.find()
    //single node or node with one children
    if (node.key === key) {
    }
     
  }
  removeNode(key) {
    if (this.bst.length === 0) {
      this.displayMessage("empty tree");
      return;
    }
    const currentLength = this.bst.length; // keeping track of how many nodes in the tree
    // node not found
    const deleteResult = this.bst.delete(key);
    if (!deleteResult) {
      this.displayMessage("node not found!");
      return;
    }
    this.animateRemoval(key, deleteResult);
    // check if node has no children
    
    /* if (currentLength > 1) {
      this.shrink(deleteResult.key);
      //this.treeData.setData(this.bst.root);
      //const root = this.createTree(this.treeData.data);
      //this.manageNode(root);
      //this.manageLink(root);
    } else {
      // remove global group from dom-
      d3.select("svg").remove();
      this.appendStructure();
    } */
  }
}

export { TreeRender };
