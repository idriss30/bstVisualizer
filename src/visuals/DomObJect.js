/* This module has a reference to all the dom elements
that could be used for styling, dom manipulation (crud, animation...) */

import * as d3 from "d3";

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
  buttons: document.querySelectorAll(`input[type="button"]`),
  resetTraversalForm() {
    if (this.resultTitle && this.resultTitle.innerText != "") {
      this.resultArray.innerHTML = "";
      this.resultTitle.innerText = "";
    }
  },
  disableAllButtons() {
    this.buttons.forEach((button) => {
      button.style.backgroundColor = "gray";
      button.disabled = true;
    });
  },
  activateAllButtons() {
    this.buttons.forEach((button) => {
      button.style.backgroundColor = "#157a6e";
      button.disabled = false;
    });
  },
};

// Tree's dom elements
const d3TreeDom = {
  container: document.querySelector(".bst__container"),
  xSpace: 150, // can be changed based on liking or visualization needs
  ySpace: 150, // vertical spacing between node
  d3ContainerName: ".bst__container",
  className: "node",
  circleRadius: 50,
  fillColorOne: "#2a2b2a",
  animationFill: "#f5cb5c",
  nodeGroupClassName: "node__group",
  linksGroupClassName: "links_group",
  text: "white",
  linkClassName: "link",
};

export { formObject, d3TreeDom };
