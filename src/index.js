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
treeData.dx = 250; // horizontal spacing for node at same level
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

    if (d.children && d.children.length === 1) {
      const child = d.children[0];
      const offset = 90; // can be tweaked to adjust position
      child.x = d.x + (child.data.name < d.data.name ? -offset : offset);
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
  ])
  .attr("style", "max-width: 100%; height: auto;");
// append a group for node so they could scale collectively
treeData.nodeGroup = treeData.svg.append("g");

const createNode = (node) => {
  const myNode = treeData.nodeGroup
    .append("g")
    .selectAll(".node")
    .data(node)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("id", `node${node.data.id}`)
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  // draw circle
  myNode.append("circle").attr("r", 40);
  // write text
  myNode
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .text((node) => node.data.name);
};

// Binary Search Tree instance
const bst = new BinarySearchTree();

// create link and append it before drawing node
const createLink = (nodeParent, nodeChild) => {
  const link = treeData.nodeGroup
    .append("g")
    .selectAll(".link")
    .data(nodeParent.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 1)
    .attr("stroke-width", 2)
    .attr("id", `node${nodeParent.data.id}`)
    .attr(
      "d",
      d3
        .link(d3.curveLinear)
        .x((d) => d.x)
        .y((d) => d.y)
    );
};
// insert function
const insertNode = (key) => {
  const isKeyValid = bst.insert(key);
  if (!isKeyValid) return null;

  const treeNode = convertDataToD3(bst.root);
  const root = d3.hierarchy(treeNode);
  const tree = d3.tree().nodeSize([treeData.dx, treeData.dy]);
  tree(root);
  tree.separation(() => 4);
  updateTreeLayout(root);
  if (bst.length === 1) {
    createNode(root);
  } else {
    // get parent
    const addedNode = root.find((node) => node.data.name === key);
    const addedNodeParent = addedNode?.parent;
    // create links
    createLink(addedNodeParent, addedNode);
    // append node
    createNode(addedNode);
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
