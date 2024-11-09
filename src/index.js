import BinarySearchTree from "./bst";

// defining basic tree features
const bst = new BinarySearchTree();
console.log(bst.length);
const treeSvg = d3.select(".bst__container").append("svg");

treeSvg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 20);

function drawNode() {}
