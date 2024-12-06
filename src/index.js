import { BinarySearchTree } from "./bst";
import "./index.scss";
import * as d3 from "d3";

// function to convert node input to d3 format recursively
const convertDataToD3 = (node) => {
  if (!node) return null;
  const treeNode = {
    name: node.key,
    id: node.key, // using the node.key as an id to avoid render only the new node everytime the tree changes
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

// Binary Search Tree instance
const bst = new BinarySearchTree();

// define height and width
const treeContainer = document.querySelector(".bst__container");
const containerSvg = d3.select(".bst__container");

const width = treeContainer.getBoundingClientRect().width - 100;
const height = treeContainer.getBoundingClientRect().height - 100;

const svg = containerSvg
  .append("svg")
  .attr("height", "95%")
  .attr("width", "95%")
  .attr("viewBox", [-width / 2, -height / 2, width * 1.5, height * 1.5])
  .style("border", "2px solid blue");

//append group for node and links so they scale collectively
const nodeGroup = svg.append("g");
const appendNode = (nodeInfo) => {
  const node = nodeGroup
    .selectAll(".node")
    .data(nodeInfo)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("id", nodeInfo.data.id);

  // add circle
  node.append("circle").attr("r", 30).attr("fill", "#623cea");
  // add text
  node
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "white")
    .text((node) => node.data.name);
};

// create link and append it before drawing node
const appendLink = (source, target) => {};
// insert function
const insertNode = (key) => {
  const isKeyValid = bst.insert(key);
  if (!isKeyValid) return null;

  const treeNode = convertDataToD3(bst.root);
  const root = d3.hierarchy(treeNode);
  const tree = d3.tree(root).nodeSize([150, 100]);
  tree.separation(() => 4);
  if (bst.length == 1) {
    appendNode(root);
  } else {
    // find node parent
    const currentNode = root.find((node) => node.data.name === key);
    const parentNode = currentNode.parent;

    // create links here
    appendLink(parentNode, currentNode);
    // then append node with link using source and target
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

/* bst.insert(10);
bst.insert(20);
bst.insert(7);
bst.insert(6);
bst.insert(23);
bst.insert(74);
const data = convertDataToD3(bst.root);

let dx = null;
let dy = null;
if (data) {
  dx = 200;
  dy = 40;
}
const root = d3.hierarchy(data);

// tree layout
const tree = d3.tree().nodeSize([dx, dy]);
// separation
tree.separation(() => 4); // equal spacing between sibling

tree(root);

let x0 = Infinity; // number greater than any positive number
let x1 = -x0; //- infinity
let y0 = Infinity;
let y1 = -y0; // -infinity

// iterate through each node and find min and max values for x and y
root.each((d) => {
  if (d.x > x1) x1 = d.x;
  if (d.x < x0) x0 = d.x;
  if (d.y > y1) y1 = d.y;
  if (d.y < y0) y0 = d.y;

  d.y = d.depth * 150; // adjust vertical spacing

  // offset single child node to place accordingly

  if (d.children && d.children.length === 1) {
    const child = d.children[0];
    const offset = 50; // can be tweaked to adjust position
    child.x = d.x + (child.data.name < d.data.name ? -offset : offset);
  }
});
const width = Math.max(containerElement.clientWidth, x1 - x0 + dx * 2);
const height = y1 - y0 + dy * 2;

// Create the SVG container
const svg = container
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", [-dx + x0, -dy + y0, width, height * 1.4])
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("style", "max-width: 100%; height: auto;");
// Ensure horizontal scrolling is possible
container.style("overflow-x", "auto");

svg
  .append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 1)
  .attr("stroke-width", 2)
  .selectAll()
  .data(root.links())
  .join("path")
  .attr(
    "d",
    d3
      .link(d3.curveLinear)
      .x((d) => d.x)
      .y((d) => d.y)
  );

const node = svg
  .append("g")
  .attr("stroke-linejoin", "round")
  .attr("stroke-width", 2)
  .selectAll()
  .data(root.descendants())
  .join("g")
  .attr("transform", (d) => `translate(${d.x},${d.y})`);

node.append("circle").attr("fill", "#ccc").attr("r", 50);

node
  .append("text")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .style("font-size", "40px")
  .text((d) => d.data.name);

console.log(data);
 */
