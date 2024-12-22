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
  getMaxButton: document.querySelector(".bst"),
  predecessorField: document.getElementById("predecessor"),
  predecessorButton: document.querySelector(".bst__button-predecessor"),
  successorField: document.getElementById("successor"),
  successorButton: document.querySelector(".bst__button-successor"),
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
  return root;
};

// Binary Search Tree instance
const bst = new BinarySearchTree();
// create node function
const createNode = (root, key) => {
  const nodeSelection = treeData.nodeGroup
    .selectAll(".node")
    .data(root.descendants(), (d) => d.data.id) // Using id as unique identifier
    .join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "node")
          .attr("id", `node-${key}`)
          .attr("transform", (d) => `translate(${d.x},${d.y})`),

      (update) => update.attr("transform", (d) => `translate(${d.x},${d.y})`), // update translate position
      (exit) => exit.remove()
    );
  nodeSelection
    .append("circle")
    .attr("r", 40)
    .attr("stroke-width", 3)
    .attr("stroke", "#623cea")
    .attr("fill", "#704eec");

  nodeSelection
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font-size", "25px")
    .attr("fill", "white")
    .text((d) => d.data.name);
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
const traverseToNode = (root, key) => {
  // get the last inserted node in the hierarchy
  const currentNode = root.find((node) => node.data.name === key);
  // create a path from root to node
  const path = [];

  // append each node up until root backward to allow traversal
  for (let i = currentNode.ancestors().length - 1; i >= 0; i--) {
    path.push(currentNode.ancestors()[i]);
  }
  return path;
};
const animateInsertion = (path, process, root, key) => {
  // take a path and move to the new inserted node
  const tempNode = treeData.nodeGroup
    .append("circle")
    .attr("r", 40)
    .attr("fill", "#fa8334")
    .attr("stroke", "black")
    .attr("cx", path[0].x)
    .attr("cy", path[0].y);
  let currentIndex = 0;
  path.forEach((node) => {
    tempNode
      .transition()
      .duration(800)
      .ease(d3.easeLinear)
      .attr("cx", node.x)
      .attr("cy", node.y);

    currentIndex++;
    if (currentIndex === path.length - 1) {
      setTimeout(() => {
        tempNode.remove();
        if (process == "insert") {
          // create the link
          createLink(root);
          createNode(root, key);
        }
      }, 1000);
    }
  });
};

// insert function
const insertNode = (key) => {
  const isKeyValid = bst.insert(key);
  if (!isKeyValid) return null;
  treeData.data = convertDataToD3(bst.root);
  // regenerate layout
  const root = createTree(treeData.data);
  updateTreeLayout(root);
  const path = traverseToNode(root, key);

  if (bst.length > 1) {
    // animate path
    animateInsertion(path, "insert", root, key);
  } else {
    createNode(root, key);
  }
};

// insert listener
formObject.insertButton.addEventListener("click", () => {
  let insertFieldValue = formObject.insertField.value;
  insertFieldValue = parseInt(insertFieldValue);
  if (!insertFieldValue || typeof insertFieldValue !== "number") {
    return null;
  }
  insertNode(insertFieldValue);
  // clean form
  formObject.insertField.value = "";
});
