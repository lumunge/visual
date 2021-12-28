import { setWall } from "../Grid/createWalls.js";
import {
	rowSize,
	colSize,
	manualStart,
	clearPath,
	notification,
	stepsContainer,
} from "../Grid/index.js";

let gridContainer = document.querySelector("#gridContainer");
let speedSlider = document.querySelector(".speedSlider");
let startBtn = document.querySelector(".start");
let clearPathBtn = document.querySelector(".clearPath");
let time = speedSlider.value;
let bool = false;
let count = 1;
let dfsSteps = [];

const checker = (row, col) => {
	if (row >= 0 && col >= 0 && row < rowSize && col < colSize) return true;
	return false;
};

// visualize algorithm
const changeColor = (node, cost) => {
	setTimeout(() => {
		node.setAttribute("class", "chosenPath");
		node.innerHTML = cost;
	}, cost * time);
	// draw path blue
	setTimeout(() => {
		node.setAttribute("class", "pathColor");
	}, cost * time + 100);
	//draw path green
	setTimeout(() => {
		node.setAttribute("class", "chosenPath");
	}, cost * time + 1000);
};

//traverse grid
const traverse = (node, visited, cost, endNode) => {
	let row = parseInt(node.getAttribute("row"));
	let col = parseInt(node.getAttribute("col"));
	if (bool || node == endNode) {
		bool = true;
		return;
	}

	let wall = parseInt(node.getAttribute("wall"));
	if (wall == 1) return;

	visited.push(node);
	dfsSteps.push([row, col, cost, row, col]);
	changeColor(node, cost);

	// Check all sides of a node
	let cr = row,
		cc = col;

	if (checker(cr + 1, cc)) {
		let child = document.querySelector(`div[row="${cr + 1}"][col="${cc}"]`);
		if (!visited.includes(child)) {
			traverse(child, visited, cost + 1, endNode);
			count++;
		} else {
			dfsSteps.push([row, col, cost, cr + 1, cc]);
		}
	}
	if (checker(cr, cc + 1)) {
		let child = document.querySelector(`div[row="${cr}"][col="${cc + 1}"]`);
		if (!visited.includes(child)) {
			traverse(child, visited, cost + 1, endNode);
			count++;
		} else {
			dfsSteps.push([row, col, cost, cr, cc + 1]);
		}
	}
	if (checker(cr - 1, cc)) {
		let child = document.querySelector(`div[row="${cr - 1}"][col="${cc}"]`);
		if (!visited.includes(child)) {
			traverse(child, visited, cost + 1, endNode);
			count++;
		} else {
			dfsSteps.push([row, col, cost, cr - 1, cc]);
		}
	}
	if (checker(cr, cc - 1)) {
		let child = document.querySelector(`div[row="${cr}"][col="${cc - 1}"]`);
		if (!visited.includes(child)) {
			traverse(child, visited, cost + 1, endNode);
			count++;
		} else {
			dfsSteps.push([row, col, cost, cr, cc - 1]);
		}
	}
};

export const dfs = (x1 = 0, y1 = 0, x2 = rowSize - 1, y2 = colSize - 1) => {
	time = speedSlider.value;
	time = 40 + (time - 1) * -2;
	gridContainer.removeEventListener("mousedown", setWall);
	gridContainer.removeEventListener("mouseover", setWall);
	let startNode = document.querySelector(`div[row='${x1}'][col='${y1}']`);
	let endNode = document.querySelector(`div[row='${x2}'][col='${y2}']`);

	//disable start and clear path buttons
	startBtn.setAttribute("disabled", "true");
	clearPathBtn.setAttribute("disabled", "true");

	let visited = [];
	let cost = 1;
	bool = false;

	traverse(startNode, visited, cost, endNode);

	setTimeout(() => {
		startBtn.removeAttribute("disabled");
		clearPathBtn.removeAttribute("disabled");
		manualStart.removeAttribute("disabled");
	}, count * time + 100);
};

let isPath = true;
export const dfsStepper = () => {
	// console.log(dfsSteps);
	if (isPath) {
		clearPath();
		startBtn.setAttribute("disabled", "true");
		clearPathBtn.setAttribute("disabled", "true");
		stepsContainer.classList.remove("notification");
		stepsContainer.classList.add("show");
		isPath = false;
	}
	if (dfsSteps.length == 0) {
		alert("Stack is empty!");
	} else {
		var cr = dfsSteps[0][0];
		var cc = dfsSteps[0][1];
		var cost = dfsSteps[0][2];
		var er = dfsSteps[0][3];
		var ec = dfsSteps[0][4];
		let node = document.querySelector(`div[row='${cr}'][col='${cc}']`);
		setTimeout(() => {
			node.setAttribute("class", "pathColor");
		}, 1000);
		node.setAttribute("class", "chosenPath");
		node.innerHTML = cost;
		notification(cr, cc, er, ec);
		dfsSteps.shift();
	}
};
