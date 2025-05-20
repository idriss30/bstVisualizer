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
  if (insertFieldValue >= 1000 || insertFieldValue <= -1000) {
    treeRender.displayMessage("out of range:  -999 to 999");
    return;
  }
  formObject.disableAllButtons();
  const insertResult = treeRender.renderNode(insertFieldValue);
  if (insertResult === null) {
    treeRender.displayMessage(`Node ${insertFieldValue} already exists`);
    formObject.activateAllButtons();
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
  if (treeRender.bst.root === null) {
    treeRender.displayMessage("nothing to look up");
    return;
  }
  const path = treeRender.findNodeAndReturnPath(findFieldValue);
  if (!path) {
    treeRender.displayMessage(`node ${findFieldValue} is not in the tree`);
    return;
  }
  formObject.disableAllButtons();
  // animate traversal when node is found
  treeRender.nodeFindingAnimation(path);
});

formObject.preOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";

  const traversalItems = treeRender.preOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  formObject.disableAllButtons();
  let currentNode;
  formObject.resultTitle.innerText = "Pre-order result";
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, 700, index, () => {
      treeRender.traversalCallBack(node, index, traversalItems.length);
    });
  });
});

formObject.postOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";

  const traversalItems = treeRender.postOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  formObject.disableAllButtons();
  // add result
  formObject.resultTitle.innerText = "Post-order result";
  let currentNode;
  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, 700, index, () => {
      treeRender.traversalCallBack(node, index, traversalItems.length);
    });
  });
});

formObject.inOrderButton.addEventListener("click", () => {
  // clean the input first
  formObject.resultArray.innerHTML = "";

  const traversalItems = treeRender.inOrderTraversal();
  if (!traversalItems || traversalItems.length === 0) return;
  formObject.disableAllButtons();
  formObject.resultTitle.innerText = "In-order result";
  let currentNode;

  traversalItems.forEach((node, index) => {
    // select currentNode
    currentNode = d3.select(`#node-${node.key}`);
    treeRender.nodeAnimation(currentNode, 700, index, () => {
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
  formObject.disableAllButtons();
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
  formObject.disableAllButtons();
  treeRender.getSuccessor(userInputValue, treeRender.bst.root);
});

// delete button listener
formObject.deleteButton.addEventListener("click", () => {
  let deleteKey = formObject.deleteField.value;
  deleteKey = parseInt(deleteKey);
  // clean form
  formObject.deleteField.value = "";
  formObject.resetTraversalForm();
  if (!deleteKey || typeof deleteKey != "number") {
    treeRender.displayMessage("Enter a valid key");
    return;
  }
  formObject.disableAllButtons();
  treeRender.removeNode(deleteKey);
});

/* // function to generate a random array of -
function genenerate30RandomNum() {
  let i = 0;
  const randomNumbersArray = [];
  while (i < 150) {
    randomNumbersArray.push(Math.floor(Math.random() * (150 - 1 + 1) + 1));
    i++;
  }
  return randomNumbersArray;
}

// function to insert an array in the tree ( bulk insert)
function bulkInsert(numbers) {
  numbers.forEach((number) => {
    treeRender.bst.insert(number);
  });

  treeRender.treeData.setData(treeRender.bst.root);
  const root = treeRender.createTree(treeRender.treeData.data);
  treeRender.manageNode(root);
  treeRender.manageLink(root);
  treeRender.updateTreeLayout(root);
}
 */
