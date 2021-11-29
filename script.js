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

function updateSnakeBodyPos() {

	if(bodyCoordinates.length > 1) {

		for(let i = bodyCoordinates.length - 1; i >=1; i--) {
			bodyCoordinates[i].cellX = bodyCoordinates[i-1].cellX;
			bodyCoordinates[i].cellY = bodyCoordinates[i-1].cellY;
		}
	}
}

function checkIfSnakeAteFruit() {
	
	if(bodyCoordinates[0].cellX === fruitPos.posX && bodyCoordinates[0].cellY === fruitPos.posY) {
		
		if(direction == "right") {
			if(fruitPos.posX == rightEdge) {
				bodyCoordinates.unshift({cellX: leftEdge, cellY: fruitPosY, cellBackgroundClass: "snakeHead"});
			}
			else {
				bodyCoordinates.unshift({cellX: fruitPos.posX + 1, cellY: fruitPos.posY, cellBackgroundClass: "snakeHead"});	
			}
		}
		else if(direction == "left") {
			if(fruitPos.posX == leftEdge) {
				bodyCoordinates.unshift({cellX: rightEdge, cellY: fruitPos.posY, cellBackgroundClass: "snakeHead"});	
			}
			else {
				bodyCoordinates.unshift({cellX: fruitPos.posX - 1, cellY: fruitPos.posY, cellBackgroundClass: "snakeHead"});
			}
		}	
		else if(direction == "up") {
			if(fruitPos.posY == topEdge) {
				bodyCoordinates.unshift({cellX: fruitPos.posX, cellY: bottomEdge, cellBackgroundClass: "snakeHead"});	
			}
			else {
				bodyCoordinates.unshift({cellX: fruitPos.posX, cellY: fruitPos.posY - 1, cellBackgroundClass: "snakeHead"});
			}
		}
		else if(direction == "down") {
			if(fruitPos.posY == bottomEdge) {
				bodyCoordinates.unshift({cellX: fruitPos.posX, cellY: topEdge, cellBackgroundClass: "snakeHead"});	
			}
			else {
				bodyCoordinates.unshift({cellX: fruitPos.posX, cellY: fruitPos.posY + 1, cellBackgroundClass: "snakeHead"});
			}
		}

		bodyCoordinates[1].cellBackgroundClass = "snakeBody";
		fruitPos = generateFruitRandomLocation();	
		
	}
}

function keyDownHandle(event) {

	if(event.keyCode == 87 && direction != "down") {
		direction = "up";
		updateSnakeDirection();
	}
	else if(event.keyCode == 83 && direction != "up") {
		direction = "down";
		updateSnakeDirection();
	}
	else if(event.keyCode == 65 && direction != "right") {
		direction = "left";
		updateSnakeDirection();
	}
	else if(event.keyCode == 68 && direction != "left") {
		direction = "right";
		updateSnakeDirection();
	}
}

document.addEventListener('keydown', keyDownHandle, false);

buildField();
setInterval(function() {
	updateSnakeBodyPos();
	updateSnakeHeadPos();
	checkIfSnakeAteFruit();
	printGameElements();
}, 250);