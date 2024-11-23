import { BinarySearchTree } from "./bst";
import "./index.scss";
import * as d3 from "d3";

// function to convert node input to d3 format recursively
const convertDataToD3 = (node) => {
  if (!node) return null;
  const treeNode = {
    name: node.key,
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
// Binary Search Tree instance
const bst = new BinarySearchTree();
const randomNumber = new Set();
while (randomNumber.size < 100) {
  randomNumber.add(Math.floor(Math.random() * 100) + 1);
}

randomNumber.forEach((number) => bst.insert(number));
/* bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);
bst.insert(10);
bst.insert(25);
bst.insert(35);
bst.insert(45);
bst.insert(55);
bst.insert(65);
bst.insert(75);
bst.insert(90);
bst.insert(5);
bst.insert(15);
bst.insert(27);
bst.insert(38);
bst.insert(42);
bst.insert(48);
bst.insert(52);
bst.insert(57);
bst.insert(62);
bst.insert(68);
bst.insert(72);
bst.insert(78);
bst.insert(85);
bst.insert(95);
bst.insert(3);
bst.insert(8);
bst.insert(12);
bst.insert(18);
bst.insert(22);
bst.insert(28);
bst.insert(32);
bst.insert(37);
bst.insert(41);
bst.insert(43);
bst.insert(47);
bst.insert(51);
bst.insert(53);
bst.insert(56);
bst.insert(61);
bst.insert(64);
bst.insert(67);
bst.insert(71); */
// Convert BST to hierarchy data
const data = convertDataToD3(bst.root);

// Select container and get dimensions
const container = d3.select(".bst__container");

// getting container size
const containerElement = document.querySelector(".bst__container");

const root = d3.hierarchy(data);
const dx = 130;
const dy = 150;

// tree layout
const tree = d3.tree().nodeSize([dx, dy]);
// separation
tree.separation(() => 1); // equal spacing between sibling

tree(root);

let x0 = Infinity;
let x1 = -x0;
let y0 = Infinity;
let y1 = -y0;
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
    const offset = 20; // can be tweaked to adjust position
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
  .attr("viewBox", [-dx + x0, -dy + y0, width, height * 1.2])
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

node.append("circle").attr("fill", "#ccc").attr("r", 30);

node
  .append("text")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .text((d) => d.data.name);
