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

const treeLayout = {
  x0: Infinity,
  x1: -Infinity,
  y0: Infinity,
  y1: -Infinity,
  dx: 200, //dx and dy will influence vertical and horizontal distance of nodes
  dy: 200,
  d3containerSelection: d3.select(".bst__container"), // select d3 container
  containerSelection: document.querySelector(".bst__container"), // using it to get container size
};

const renderTree = (data) => {
  const root = d3.hierarchy(data); // setting up the hierarchy
  const tree = d3.tree(root).nodeSize([treeLayout.dx, treeLayout.dy]);

  // node separation
  tree.separation(() => 4); // spacing between sibling;
  // iterate through each node and find min and max values for x and y
  root.each((d) => {
    if (d.x > treeLayout.x1) treeLayout.x1 = d.x;
    if (d.x < treeLayout.x0) treeLayout.x0 = d.x;
    if (d.y > treeLayout.y1) treeLayout.y1 = d.y;
    if (d.y < treeLayout.y0) treeLayout.y0 = d.y;
    console.log(d.x, d.y);

    d.y = d.depth * 150; // adjust vertical spacing

    // offset single child node to place accordingly

    if (d.children && d.children.length === 1) {
      const child = d.children[0];
      const offset = 50; // can be tweaked to adjust position
      child.x = d.x + (child.data.name < d.data.name ? -offset : offset);
    }
  });
  // defining tree layout width and height based of values of x and y
  treeLayout.width = Math.max(
    // width will be defined based of the size of container or size of the tree
    treeLayout.containerSelection.getBoundingClientRect().width,
    treeLayout.x1 - treeLayout.x0 + treeLayout.dx * 2
  );
  treeLayout.height = treeLayout.y1 - treeLayout.y0 + treeLayout.dy * 2; // top point, lower point, y axis * 2
  return root;
};

// will need a switch between red/black and regular
// Binary Search Tree instance
const bst = new BinarySearchTree();

const createSvg = (placeholder) => {
  treeLayout.svg = placeholder
    .append(svg)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [
      -treeLayout.dx + treeLayout.x0,
      -treeLayout.dy + treeLayout.y0,
      treeLayout.width,
      treeLayout.height * 1.4,
    ])
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("border", "2px solid blue");
};

const insertNodeToTree = (key) => {
  bst.insert(key);
  if (bst.length === 1) {
    createSvg(treeLayout.d3containerSelection);
  }
  const data = convertDataToD3(bst.root);
  const root = renderTree(data);
  root.find();
};

// insert listener
formObject.insertButton.addEventListener("click", () => {
  let insertFieldValue = formObject.insertField.value;
  insertFieldValue = parseInt(insertFieldValue);
  if (!insertFieldValue || typeof insertFieldValue !== "number") {
    return null;
  }
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
