import "./styles/index.scss";
import * as d3 from "d3";
import { formObject } from "./visuals/DomObJect";
import { TreeRender } from "./visuals/TreeRender";

let treeRender;
window.onload = () => {
  treeRender = new TreeRender();
};
// insert listener
formObject.insertButton.addEventListener("click", () => {
  let insertFieldValue = formObject.insertField.value;
  insertFieldValue = parseInt(insertFieldValue);
  // clear the input field
  formObject.insertField.value = "";
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  if (!insertFieldValue || typeof insertFieldValue !== "number") {
    treeRender.displayMessage("Please enter a valid number");
    return null;
  }
  // avoid number greater or equal to 1000
  if (insertFieldValue >= 1000) {
    treeRender.displayMessage("no number greater or equal to 1000");
    return;
  }
  const insertResult = treeRender.renderNode(insertFieldValue);
  if (insertResult === null) {
    treeRender.displayMessage(`Node ${insertFieldValue} already exists`);
  }
});

// add event listener to find button
formObject.findButton.addEventListener("click", () => {
  let findFieldValue = formObject.findField.value;
  findFieldValue = parseInt(findFieldValue);
  formObject.findField.value = ""; // clean up form
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  if (!findFieldValue || typeof findFieldValue !== "number") return null;
  if (!treeRender.bst.root) {
    treeRender.displayMessage("nothing to look up");
  }
  const path = treeRender.findNodeAndReturnPath(findFieldValue);
  if (!path) {
    treeRender.displayMessage(`node ${findFieldValue} is not in the tree`);
    return;
  }
  // animate traversal when node is found
  treeRender.nodeFindingAnimation(path);
});

/* const drawLine = (container, x1, y1, x2, y2) => {
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
}; */

formObject.preOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "Pre-order result";
  const traversalItems = treeRender.preOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, index, () => {
      treeRender.traversalCallBack(node, index, traversalItems.length);
    });
  });
});

formObject.postOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "Post-order result";
  const traversalItems = treeRender.postOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, index, () => {
      treeRender.traversalCallBack(node, index, traversalItems.length);
    });
  });
});

formObject.inOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";
  formObject.resultTitle.innerText = "In-order result";

  const traversalItems = treeRender.inOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, index, () => {
      treeRender.traversalCallBack(node, index, traversalItems.length);
    });
  });
});

formObject.getMinButton.addEventListener("click", () => {
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  treeRender.getMinAndBlinkWhenFound();
});

formObject.getMaxButton.addEventListener("click", () => {
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  treeRender.getMaxAndBlinkWhenFound();
});

formObject.predecessorButton.addEventListener("click", () => {
  let userInputValue = formObject.predecessorField.value;
  userInputValue = parseInt(userInputValue);
  // clean form
  formObject.predecessorField.value = "";
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  if (!userInputValue || typeof userInputValue != "number") {
    treeRender.displayMessage("Please enter a valid number");
    return null;
  }
  treeRender.getPredecessor(userInputValue, treeRender.bst.root);
});

formObject.successorButton.addEventListener("click", () => {
  let userInputValue = formObject.successorField.value;
  userInputValue = parseInt(userInputValue);
  formObject.successorField.value = "";
  // clear any previous array from traversal
  formObject.resetTraversalForm();
  if (!userInputValue || typeof userInputValue != "number") {
    treeRender.displayMessage("Please enter a valid number");
    return null;
  }
  treeRender.getSuccessor(userInputValue, treeRender.bst.root);
});

// delete button listener
formObject.deleteButton.addEventListener("click", () => {
  let deleteKey = formObject.deleteField.value;
  deleteKey = parseInt(deleteKey);
  // clean form
  formObject.deleteField.value = "";
  if (!deleteKey || typeof deleteKey != "number") {
    treeRender.displayMessage("Enter a valid key");
    return;
  }
});
