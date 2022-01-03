class Cell {
	constructor(cellSize) {
		this.cellSize = cellSize;
		this.cellSizeCssStyle = `.cellsize {width: ${cellSize}px; height: ${cellSize}px;}`;
	}
}

class FieldGame extends Cell {
	constructor(fieldWidth, fieldHeight, cellSize) {
		super(cellSize);
		
		this.fieldElement = document.querySelector(".field");
		this.fieldWidth   = fieldWidth;
		this.fieldHeight  = fieldHeight;
		this.topEdge      = 0;
		this.bottomEdge   = fieldHeight / cellSize - 1;
		this.leftEdge     = 0;
		this.rightEdge    = fieldWidth / cellSize - 1;
	}

	iterateAllFieldCells(actionInsideIteration) {
		for(let i = this.fieldHeight, cellY = 0; i > 0; i -= this.cellSize, cellY++) {
			for(let j = this.fieldWidth, cellX = 0; j > 0; j -= this.cellSize, cellX++) {
				actionInsideIteration(cellX, cellY);
			}
		}
	}
}

class Snake {
	constructor() {
		this.bodyCoordinates = [{cellX: 4, cellY: 7, cellBackgroundClass: "snakeHead"}];
		this.direction = "right";
		this.movementCellX;
		this.movementCellY;
		this.updateSnakeDirection();
	}


	updateSnakeDirection() {

		switch(this.direction) {
			case "right" :
				this.movementCellX = 1;
				this.movementCellY = 0;
				break;
			case "left" :
				this.movementCellX = -1;
				this.movementCellY = 0;
				break;
			case "up" :
				this.movementCellX = 0;
				this.movementCellY = -1;
				break;
			case "down" :
				this.movementCellX = 0;
				this.movementCellY = 1;
				break;
		}
	}

	updateSnakePos(field) {

		let tmpCellCoordinate = { ...this.bodyCoordinates[0], cellBackgroundClass: "snakeBody"};

		// Update the first snakeBodyCell which is the snake head
		if(this.direction == "right") {
			if(this.bodyCoordinates[0].cellX === field.rightEdge)
				this.bodyCoordinates[0].cellX = field.leftEdge; 
			else 
				this.bodyCoordinates[0].cellX += this.movementCellX;	
		}

		else if(this.direction == "left") {
			if(this.bodyCoordinates[0].cellX === field.leftEdge)
				this.bodyCoordinates[0].cellX = field.rightEdge; 
			else 
				this.bodyCoordinates[0].cellX += this.movementCellX;	
		}

		else if(this.direction == "up") {
			if(this.bodyCoordinates[0].cellY === field.topEdge) 
				this.bodyCoordinates[0].cellY = field.bottomEdge;
			else 
				this.bodyCoordinates[0].cellY += this.movementCellY;	
		}

		else if(this.direction == "down") {
			if(this.bodyCoordinates[0].cellY === field.bottomEdge) 
				this.bodyCoordinates[0].cellY = field.topEdge;
			else 
				this.bodyCoordinates[0].cellY += this.movementCellY;	
		}
		

		const updateSnakeBodyCells = (tmpCellCoordinate) => {

			for(let index = 1; index < this.bodyCoordinates.length; index++) {
				// swap values
				[tmpCellCoordinate, this.bodyCoordinates[index]] = [this.bodyCoordinates[index], tmpCellCoordinate]; 
			}

		};

		updateSnakeBodyCells(tmpCellCoordinate);

	}


	checkIfSnakeAteFruit(fruitPosX, fruitPosY) {

		if(this.bodyCoordinates[0].cellX === fruitPosX && this.bodyCoordinates[0].cellY === fruitPosY) {
			this.bodyCoordinates.push({cellX: fruitPosX, cellY: fruitPosY, cellBackgroundClass: "snakeBody"});
			return true;	
		}
	}

	controllForGameOverEvent() {

		for(let index = 1; index < this.bodyCoordinates.length; index++) {
			if(this.bodyCoordinates[0].cellX === this.bodyCoordinates[index].cellX && 
				this.bodyCoordinates[0].cellY === this.bodyCoordinates[index].cellY)
				return true;
		}
	}

}

class Fruit {
	constructor() {
		this.fruitPosX;
		this.fruitPosY;
	}
	generateFruitRandomLocation(snakeBodyCoordinates, rightEdge, bottomEdge) {

		function checkIfLocationIsFree(fruitPosX, fruitPosY) {

			for(let i = 0; i < snakeBodyCoordinates.length; i++) {
				if(snakeBodyCoordinates[i].cellX == fruitPosX && snakeBodyCoordinates[i].cellY == fruitPosY)
					return false;
			}
			return true;
		}

		do {
			this.fruitPosX = Math.floor(Math.random() * rightEdge);
			this.fruitPosY = Math.floor(Math.random() * bottomEdge);
		} while(!checkIfLocationIsFree(this.fruitPosX, this.fruitPosY));

		return {
			posX: this.fruitPosX,
			posY: this.fruitPosY,
			cellBackgroundClass: "fruit",
		};
	}
}





const field = new FieldGame(500,800,25);
field.iterateAllFieldCells(function(cellX, cellY) {
	field.fieldElement.innerHTML += `<span id="cell_${cellX}_${cellY}" class="cell cellsize"></span>`;
});

////////////////////////////////////////////////////////////////////////////////

const sheet = document.createElement('style');
sheet.innerHTML = field.cellSizeCssStyle;
document.head.appendChild(sheet);

////////////////////////////////////////////////////////////////////////////////

const snake = new Snake();
const fruit = new Fruit();

let fruitPos = fruit.generateFruitRandomLocation(snake.bodyCoordinates, field.rightEdge, field.bottomEdge);

function keyDownHandle(event) {

	if(event.keyCode == 87 && snake.direction != "down") {
		snake.direction = "up";
		document.removeEventListener('keydown', keyDownHandle);
		snake.updateSnakeDirection();
	}
	else if(event.keyCode == 83 && snake.direction != "up") {
		snake.direction = "down";
		document.removeEventListener('keydown', keyDownHandle);
		snake.updateSnakeDirection();
	}
	else if(event.keyCode == 65 && snake.direction != "right") {
		snake.direction = "left";
		document.removeEventListener('keydown', keyDownHandle);
		snake.updateSnakeDirection();
	}
	else if(event.keyCode == 68 && snake.direction != "left") {
		snake.direction = "right";
		document.removeEventListener('keydown', keyDownHandle);
		snake.updateSnakeDirection();
	}
}

let playGameCircle = setInterval(function() {
	

	document.addEventListener('keydown', keyDownHandle, {once: true});
	snake.updateSnakePos(field);

	if(snake.controllForGameOverEvent()){
		clearInterval(playGameCircle);
		alert("Game Over!\n\nReload the page to play again...");			
	}

	field.iterateAllFieldCells(function(cellX, cellY) {
		document.getElementById(`cell_${cellX}_${cellY}`).classList = "cell cellsize";

		snake.bodyCoordinates.forEach(function(currentCell) {
			if(currentCell.cellX == cellX && currentCell.cellY == cellY) {
				document.getElementById(`cell_${cellX}_${cellY}`).classList.add(currentCell.cellBackgroundClass);
			}
		});

		if(fruitPos.posX == cellX && fruitPos.posY == cellY)
			document.getElementById(`cell_${cellX}_${cellY}`).classList.add(fruitPos.cellBackgroundClass);

		if(snake.checkIfSnakeAteFruit(fruitPos.posX, fruitPos.posY))
			fruitPos = fruit.generateFruitRandomLocation(snake.bodyCoordinates, field.rightEdge, field.bottomEdge);
	
	});	

}, 150);
