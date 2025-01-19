import { BinarySearchTree } from "./bst";
import "./index.scss";
import * as d3 from "d3";

// function to convert regualar bst to d3 tree format recursively
const convertDataToD3 = (node) => {
  if (!node) return null;
  const treeNode = {
    name: node.key,
    id: node.key, // using the node.key as an id to  render only the new node everytime the tree changes
    children: [],
  };

  if (node.left) {
    treeNode.children.push(convertDataToD3(node.left));
  }
  if (node.right) {
    treeNode.children.push(convertDataToD3(node.right));
  }

  return treeNode;
};

// dom selection form object

const formObject = {
  insertField: document.getElementById("insert"),
  insertButton: document.querySelector(".bst__button-insert"),
  deleteField: document.getElementById("delete"),
  deleteButton: document.querySelector(".bst__button-delete"),
  findField: document.getElementById("find"),
  findButton: document.querySelector(".bst__button-find"),
  postOrderButton: document.querySelector(".bst__button-postorder"),
  preOrderButton: document.querySelector(".bst__button-preorder"),
  inOrderButton: document.querySelector(".bst__button-inorder"),
  getMinButton: document.querySelector(".bst__button-getMin"),
  getMaxButton: document.querySelector(".bst__button-getMax"),
  predecessorField: document.getElementById("predecessor"),
  predecessorButton: document.querySelector(".bst__button-predecessor"),
  successorField: document.getElementById("successor"),
  successorButton: document.querySelector(".bst__button-successor"),
  resultArray: document.querySelector(".bst__results-array"),
  resultTitle: document.querySelector(".bst__results-title"),
};
// define tree info
const treeData = {};
treeData.dx = 150; // horizontal spacing for node at same level
treeData.dy = 150; // vertival spacing between nodes
treeData.x0 = Infinity;
treeData.x1 = -treeData.x0;
treeData.y0 = Infinity;
treeData.y1 = -treeData.y0;
treeData.container = document.querySelector(".bst__container"); // will be used to calculate width and height
treeData.d3Container = d3.select(".bst__container");
treeData.width = treeData.container.getBoundingClientRect().width; // initial width of svg before any data
treeData.height = treeData.container.getBoundingClientRect().height; // initial height before any data

const updateTreeLayout = (rootNode) => {
  // iterate through each node and find min and max values for x and y
  rootNode.each((d) => {
    if (d.x > treeData.x1) treeData.x1 = d.x;
    if (d.x < treeData.x0) treeData.x0 = d.x;
    if (d.y > treeData.y1) treeData.y1 = d.y;
    if (d.y < treeData.y0) treeData.y0 = d.y;

    d.y = d.depth * 150; // adjust vertical spacing

    // offset single child node to place accordingly

    if (d.children && d.children.length >= 1) {
      const child = d.children[0];
      const offset = 40; //to adjust position of single child node
      child.x = child.x + (child.data.name < d.data.name ? -offset : offset);
    }
  });
  // adjust width and height
  treeData.width = Math.max(
    treeData.width,
    treeData.x1 - treeData.x0 + treeData.dx * 2
  );
  treeData.height = treeData.y1 - treeData.y0 + treeData.dy * 2;
  treeData.svg.attr("viewBox", [
    -treeData.dx + treeData.x0,
    -treeData.dy + treeData.y0,
    treeData.width,
    treeData.height * 1.4,
  ]);
};

// appending svg container to dom
treeData.svg = treeData.d3Container
  .append("svg")
  .attr("height", "100%")
  .attr("width", "100%")
  .attr("viewBox", [
    -treeData.width / 2,
    -treeData.height / 2,
    treeData.width * 1.5,
    treeData.height * 1.5,
  ]);

// append global group
treeData.itemsGroup = treeData.svg.append("g");
// append g for a link group
treeData.linksGroup = treeData.itemsGroup
  .append("g")
  .attr("class", "links_group");
// append a group for node so they could scale collectively
treeData.nodeGroup = treeData.itemsGroup
  .append("g")
  .attr("class", "node__group");

const createTree = (data) => {
  // create the hierarchy
  const root = d3.hierarchy(data);
  // create the tree
  const tree = d3.tree().nodeSize([treeData.dx, treeData.dy]);
  tree(root);
  treeData.root = root; // adding root to the data object to avoid creating it everytime.
  return root;
};

// Binary Search Tree instance
const bst = new BinarySearchTree();
// create node function
const createNode = (root) => {
  treeData.nodeGroup
    .selectAll(".node")
    .data(root.descendants(), (d) => d.data.id) // Using id as unique identifier
    .join(
      (enter) => {
        const nodeEnter = enter
          .append("g")
          .attr("class", "node")
          .attr("id", (d) => `node-${d.data.id}`)
          .attr("transform", (d) => `translate(${d.x},${d.y})`);

        nodeEnter
          .append("circle")
          .attr("r", 40)
          .attr("stroke-width", 3)
          .attr("stroke", "#623cea")
          .attr("fill", "#704eec");

        nodeEnter
          .append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("font-size", "35px")
          .attr("fill", "white")
          .text((d) => d.data.name);
      },
      (update) => update.attr("transform", (d) => `translate(${d.x},${d.y})`), // update position
      (exit) => exit.remove()
    );
};

// create link and append it before drawing node
const createLink = (rootNode) => {
  const linksSelection = treeData.linksGroup
    .selectAll(".link")
    .data(rootNode.links(), (d) => d.target.id);

  linksSelection.join(
    (enter) =>
      enter
        .append("path")
        .attr("class", "link")
        .attr("id", (d) => `link-${d.source.id}-to-${d.target.id}`)
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
};

// traverse to node
const traverseToNode = (root, key, arr = []) => {
  if (key === root.data.name) return arr; // base case because node will always be found
  arr.push(root); // push the currentNode;
  if (key < root.data.name && root.children[0]) {
    return traverseToNode(root.children[0], key, arr);
  }
  if (key > root.data.name && root.children[1]) {
    return traverseToNode(root.children[1], key, arr);
  } else {
    return traverseToNode(root.children[0], key, arr);
  }
};

const nodeAnimation = (currentNode, index, callBack) => {
  currentNode
    .transition()
    .delay(index * 1000) // Delay based of index to avoid a simultaneous animation
    .select("circle")
    .duration(1000)
    .attr("fill", "#fa8334")
    .attr("stroke", "#fa8334")
    .transition()
    .duration(500)
    .attr("fill", "#704eec") // restore color
    .attr("stroke", "#623cea")
    .on("end", callBack);
};

const animateInsertion = (root, key) => {
  const nodesPath = traverseToNode(root, key);
  let currentNode;
  const callBack = (index, path) => {
    if (index === path.length - 1) {
      // stopping at element before the last one to prevent animation of the last inserted node
      createLink(root);
      createNode(root);
      return;
    }
  };
  nodesPath.forEach((node, index) => {
    currentNode = d3.select(`#node-${node.data.id}`);
    nodeAnimation(currentNode, index, () => {
      callBack(index, nodesPath);
    });
  });
};

// function that displays a message and delete it after two second
const displayMessage = (message) => {
  const displayContainer = document.querySelector(".bst__results-message");
  displayContainer.innerHTML = message;
  setTimeout(() => {
    displayContainer.innerHTML = "";
  }, 2000);
};

// insert function
const insertNode = (key) => {
  const isKeyValid = bst.insert(key);
  if (!isKeyValid) return null;
  treeData.data = convertDataToD3(bst.root);
  // regenerate layout
  const root = createTree(treeData.data);
  updateTreeLayout(root);
  if (bst.length > 1) {
    // animate path
    animateInsertion(root, key);
  } else {
    createNode(root, key);
  }
};

// insert listener
formObject.insertButton.addEventListener("click", () => {
  let insertFieldValue = formObject.insertField.value;
  insertFieldValue = parseInt(insertFieldValue);
  // clear the input field
  formObject.insertField.value = "";
  // clear any previous array from traversal
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "";
  if (!insertFieldValue || typeof insertFieldValue !== "number") {
    displayMessage("Please enter a valid number");
    return null;
  }
  // avoid number greater or equal to 1000
  if (insertFieldValue >= 1000) {
    displayMessage("no number greater or equal to 1000 for interface feature ");
    return;
  }
  const insertResult = insertNode(insertFieldValue);
  if (insertResult === null) {
    displayMessage(`Node ${insertFieldValue} already exists`);
  }
});
// node Finding function using d3.js
const findNodeAndReturnPath = (key) => {
  // using path on the root
  const isNode = treeData.root.find((node) => node.data.name === key);
  if (isNode) {
    return [...isNode.ancestors()].reverse(); // reverse the elements to start from top to bottom
  }
  return false;
};
const blinkingNodeAnimation = (currentNode) => {
  currentNode
    .transition()
    .duration(500)
    .select("circle")
    .attr("fill", "#fa8334")
    .attr("stroke", "#fa8334")
    .attr("r", 30)
    .transition()
    .duration(500)
    .attr("r", 40)
    .attr("fill", "#704eec")
    .attr("stroke", "#623cea")
    .transition()
    .duration(500)
    .attr("fill", "#fa8334")
    .attr("stroke", "#fa8334")
    .attr("r", 35)
    .transition()
    .duration(500)
    .attr("r", 40)
    .attr("fill", "#704eec")
    .attr("stroke", "#623cea")
    .transition()
    .duration(500)
    .attr("fill", "#fa8334")
    .attr("stroke", "#fa8334")
    .attr("r", 30)
    .transition()
    .duration(500)
    .attr("r", 40)
    .attr("fill", "#704eec")
    .attr("stroke", "#623cea");
};

const nodeFindingAnimation = (nodesArray) => {
  let currentNode;
  // creating callBack to pass after animation
  const callBack = (currentNode, index, path) => {
    if (index === path.length - 1) {
      // creating blinking animation to last found node
      blinkingNodeAnimation(currentNode);
      displayMessage(`${currentNode.attr("id")} is currently blinking`);
    }
  };

  nodesArray.forEach((node, index) => {
    // select current node
    currentNode = d3.select(`#node-${node.data.id}`);
    nodeAnimation(currentNode, index, () => {
      callBack(currentNode, index, nodesArray);
    });
  });
};
// add event listener to find button
formObject.findButton.addEventListener("click", () => {
  let findFieldValue = formObject.findField.value;
  findFieldValue = parseInt(findFieldValue);
  formObject.findField.value = ""; // clean up form
  if (!findFieldValue || typeof findFieldValue !== "number") return null;
  if (!bst.root) {
    displayMessage("nothing to look up");
  }
  const path = findNodeAndReturnPath(findFieldValue);
  if (!path) {
    displayMessage(`node ${findFieldValue} is not in the tree`);
    return;
  }
  // animate traversal when node is found
  nodeFindingAnimation(path);
});

const drawLine = (container, x1, y1, x2, y2) => {
  const line = container
    .append("line")
    .attr("id", "tempLine")
    .attr("x1", x1)
    .attr("x2", x2)
    .attr("y1", y1)
    .attr("y2", y2)
    .attr("stroke-width", 5)
    .attr("stroke", "#fa8334")
    .attr("marker-end", "url(#arrow)");

  return line;
};

const createMarkerAndArrow = (container) => {
  const defs = container.append("defs").attr("id", "tempArrowContainer");
  const marker = defs
    .append("marker")
    .attr("id", "arrow")
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("orient", "auto");

  marker
    .append("path")
    .attr("d", "M0 0 L20 0  L0 10 z")
    .attr("fill", "#fa8334 ");

  return defs;
};
// traversal call back
const traversalCallBack = (node, index, length) => {
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
};
// preOrder traversal

const preOrderTraversal = () => {
  if (!bst.root) {
    displayMessage("no tree to traverse");
  }
  const preOrderArr = bst.preOrderTraversal(bst.root);
  return preOrderArr;
};

formObject.preOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "Pre-order result";
  const traversalItems = preOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    nodeAnimation(currentNode, index, () => {
      traversalCallBack(node, index, traversalItems.length);
    });
  });
});

// post order traversal
const postOrderTraversal = () => {
  if (!bst.root) {
    displayMessage("no tree to traverse");
  }
  const postOrderArr = bst.postOrderTraversal(bst.root);
  return postOrderArr;
};

formObject.postOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "Post-order result";
  const traversalItems = postOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    nodeAnimation(currentNode, index, () => {
      traversalCallBack(node, index, traversalItems.length);
    });
  });
});

// inOrder Traversal
const inOrderTraversal = () => {
  if (!bst.root) {
    displayMessage("no tree to traverse");
  }
  const inOrderArr = bst.inOrderTraversal(bst.root);
  return inOrderArr;
};
formObject.inOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "In-order result";

  const traversalItems = inOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    nodeAnimation(currentNode, index, () => {
      traversalCallBack(node, index, traversalItems.length);
    });
  });
});

// get min feature
const getMinAndBlinkWhenFound = () => {
  const min = bst.getMin(bst.root);
  if (!min) {
    displayMessage("No minimum was found");
    return;
  }
  const selectMin = d3.select(`#node-${min.key}`);
  blinkingNodeAnimation(selectMin);
  displayMessage(`Minimum ${min.key} is blinking`);
};
formObject.getMinButton.addEventListener("click", () => {
  getMinAndBlinkWhenFound();
});

// get max feature
const getMaxAndBlinkWhenFound = () => {
  const max = bst.getMax(bst.root);
  if (!max) {
    displayMessage("No maximum was found");
    return;
  }
  const maxSelection = d3.select(`#node-${max.key}`);
  blinkingNodeAnimation(maxSelection);
  displayMessage(`Maximum ${max.key} is blinking`);
};

formObject.getMaxButton.addEventListener("click", () => {
  getMaxAndBlinkWhenFound();
});

//  get predecessor
const getPredecessor = (key, startingNode) => {
  const predecessor = bst.getPredecessor(key, startingNode);
  console.log(predecessor);
  if (!predecessor) {
    displayMessage("predecessor was not found");
    return;
  }
  const selectPredecessor = d3.select(`#node-${predecessor}`);
  blinkingNodeAnimation(selectPredecessor);
  displayMessage(`${selectPredecessor.attr("id")} is currently blinking)`);
};

formObject.predecessorButton.addEventListener("click", () => {
  let userInputValue = formObject.predecessorField.value;
  userInputValue = parseInt(userInputValue);
  // clean form
  formObject.predecessorField.value = "";
  if (!userInputValue || typeof userInputValue != "number") {
    displayMessage("Please enter a valid number");
    return null;
  }
  getPredecessor(userInputValue, bst.root);
  displayMessage("predecessor is blinking");
});

// get Successor
const getSuccessor = (key, startingNode) => {
  const successor = bst.getSuccessor(key, startingNode);
  console.log(successor);
  if (!successor) {
    displayMessage("successor was not found");
    return;
  }
  const selectSuccessor = d3.select(`#node-${successor}`);
  blinkingNodeAnimation(selectSuccessor);
  displayMessage(`${selectSuccessor.attr("id")} is currently blinking)`);
};

formObject.successorButton.addEventListener("click", () => {
  let userInputValue = formObject.successorField.value;
  userInputValue = parseInt(userInputValue);
  formObject.successorField.value = "";
  if (!userInputValue || typeof userInputValue != "number") {
    displayMessage("Please enter a valid number");
    return null;
  }
  getSuccessor(userInputValue, bst.root);
  displayMessage("successor is blinking");
});
