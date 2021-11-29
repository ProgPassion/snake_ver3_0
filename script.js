const fieldElement = document.querySelector(".field");
const fieldWidth   = 500;
const fieldHeight  = 800;
const cellSize     = 25;

const bodyCoordinates = [{cellX: 4, cellY: 7, cellBackgroundClass: "snakeHead"}];
const topEdge    = 0;
const bottomEdge = fieldHeight / cellSize - 1;
const leftEdge   = 0;
const rightEdge  = fieldWidth / cellSize - 1;


let direction = "right";
let movementCellX = 1;
let movementCellY = 0;

let gameOver = false;

let fruitPos = generateFruitRandomLocation();

////////////////////////////////////////////////////////////////////////////////

const sheet = document.createElement('style');
sheet.innerHTML = `.cellsize {width: ${cellSize}px; height: ${cellSize}px;}`;
document.head.appendChild(sheet);

////////////////////////////////////////////////////////////////////////////////

function iterateAllFieldCells(actionInsideIteration) {

	for (let i = fieldHeight, cellY = 0; i > 0; i -= cellSize, cellY++) {
		for(let j = fieldWidth, cellX = 0; j > 0; j -= cellSize, cellX++) {
			actionInsideIteration(cellX, cellY);
		}
	}
}

function iterateSnakeBody(actionInsideIteration) {

	for(let i = bodyCoordinates.length - 1; i >=1; i--) {
		actionInsideIteration(i);
	}
}



function buildField() {
	iterateAllFieldCells(function(cellX, cellY) {
		fieldElement.innerHTML += `<span id="cell_${cellX}_${cellY}" class="cell cellsize"></span>`;
	}); 	
}

function generateFruitRandomLocation() {

	let fruitPosX;
	let fruitPosY;

	function checkIfLocationIsFree(fruitPosX, fruitPosY) {

		for(let i = 0; i < bodyCoordinates.length; i++) {
			if(bodyCoordinates[i].cellX == fruitPosX && bodyCoordinates[i].cellY == fruitPosY)
				return false;
		}
		return true;
	}

	do {

		fruitPosX = Math.floor(Math.random() * rightEdge);
		fruitPosY = Math.floor(Math.random() * bottomEdge);
		
	} while(!checkIfLocationIsFree(fruitPosX, fruitPosY));

	return {
		posX: fruitPosX,
		posY: fruitPosY,
		cellBackgroundClass: "fruit"
	};
}

function printGameElements() {

	iterateAllFieldCells(function(cellX, cellY) {
		document.getElementById(`cell_${cellX}_${cellY}`).classList = "cell cellsize";

		bodyCoordinates.forEach(function(currentCell) {
			if(currentCell.cellX == cellX && currentCell.cellY == cellY) {
				document.getElementById(`cell_${cellX}_${cellY}`).classList.add(currentCell.cellBackgroundClass);
			}
		});

		if(fruitPos.posX == cellX && fruitPos.posY == cellY)
			document.getElementById(`cell_${cellX}_${cellY}`).classList.add(fruitPos.cellBackgroundClass);
	});	
}

function updateSnakeDirection() {

	switch(direction) {
		case "right" :
			movementCellX = 1;
			movementCellY = 0;
			break;
		case "left" :
			movementCellX = -1;
			movementCellY = 0;
			break;
		case "up" :
			movementCellX = 0;
			movementCellY = -1;
			break;
		case "down" :
			movementCellX = 0;
			movementCellY = 1;
			break;
	}
}

function updateSnakeHeadPos() {

	if(direction == "right") {
		if(bodyCoordinates[0].cellX === rightEdge)
			bodyCoordinates[0].cellX = leftEdge; 
		else 
			bodyCoordinates[0].cellX += movementCellX;	
	}

	else if(direction == "left") {
		if(bodyCoordinates[0].cellX === leftEdge)
			bodyCoordinates[0].cellX = rightEdge; 
		else 
			bodyCoordinates[0].cellX += movementCellX;	
	}

	else if(direction == "up") {
		if(bodyCoordinates[0].cellY === topEdge) 
			bodyCoordinates[0].cellY = bottomEdge;
		else 
			bodyCoordinates[0].cellY += movementCellY;	
	}

	else if(direction == "down") {
		if(bodyCoordinates[0].cellY === bottomEdge) 
			bodyCoordinates[0].cellY = topEdge;
		else 
			bodyCoordinates[0].cellY += movementCellY;	
	}
	
}

function updateSnakeBodyPos(index) {

	if(bodyCoordinates[index].cellBackgroundClass === "snakeHead")
		bodyCoordinates[index].cellBackgroundClass = "snakeBody";

	bodyCoordinates[index].cellX = bodyCoordinates[index-1].cellX;
	bodyCoordinates[index].cellY = bodyCoordinates[index-1].cellY;
}

function checkIfSnakeAteFruit() {
	
	if(bodyCoordinates[0].cellX === fruitPos.posX && bodyCoordinates[0].cellY === fruitPos.posY) {
		bodyCoordinates.push({cellX: fruitPos.posX, cellY: fruitPos.posY, cellBackgroundClass: "snakeHead"});
		fruitPos = generateFruitRandomLocation();	
	}
}

function controllForGameOverEvent(index) {

	if(bodyCoordinates[0].cellX === bodyCoordinates[index].cellX && bodyCoordinates[0].cellY === bodyCoordinates[index].cellY)
		gameOver = true;
}

function keyDownHandle(event) {

	if(event.keyCode == 87 && direction != "down") {
		direction = "up";
		document.removeEventListener('keydown', keyDownHandle);
		updateSnakeDirection();
	}
	else if(event.keyCode == 83 && direction != "up") {
		direction = "down";
		document.removeEventListener('keydown', keyDownHandle);
		updateSnakeDirection();
	}
	else if(event.keyCode == 65 && direction != "right") {
		direction = "left";
		document.removeEventListener('keydown', keyDownHandle);
		updateSnakeDirection();
	}
	else if(event.keyCode == 68 && direction != "left") {
		direction = "right";
		document.removeEventListener('keydown', keyDownHandle);
		updateSnakeDirection();
	}
}

buildField();
let playGameCircle = setInterval(function() {

	if(!gameOver) {
		document.addEventListener('keydown', keyDownHandle, {once: true});
		iterateSnakeBody(updateSnakeBodyPos);
		updateSnakeHeadPos();
		iterateSnakeBody(controllForGameOverEvent);
		checkIfSnakeAteFruit();
		printGameElements();	
	}
	else {
		clearInterval(playGameCircle);
		alert("Game Over!\n\nReload the page to play again...");
	}
}, 150);
