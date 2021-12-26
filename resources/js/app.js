const container = document.getElementById("container");
const remainingMines = document.getElementById("mines-remaining");
const newGame = document.getElementById("new-game");
const playTime = document.getElementById("play-time");
const playArea = document.getElementById("game-area");

const playAreaWidth = 505;
const playAreaHeight = 505;

const gridSize = 9;
const length = playAreaWidth / gridSize - 7;

const totalMines = 10;
var numMines = totalMines;
var mineLocations = [];

var time = 0;
var isTimerPaused = true;

tileColors = [
	"blue",
	"green",
	"red",
	"purple",
	"black",
	"grey",
	"maroon",
	"turquoise",
];

var grid = [];

newGame.addEventListener("click", createGame);

function createGame() {
	newGame.innerHTML = "New Game";
	numMines = totalMines;
	mineLocations = [];
	time = 0;
	updatePlayTime();

	isTimerPaused = true;

	grid = [];

	tiles = document.querySelectorAll(".area");

	tiles.forEach((tile) => {
		playArea.removeChild(tile);
	});

	generateGame();
}

function generateGame() {
	updateMineCount();
	let loop = true;

	for (let i = 0; i < numMines; i++) {
		loop = true;
		while (loop) {
			mine = [
				Math.floor(Math.random() * gridSize),
				Math.floor(Math.random() * gridSize),
			];
			if (
				!mineLocations.find(
					(element) => element[0] == mine[0] && element[1] == mine[1]
				)
			) {
				loop = false;
			}
		}
		mineLocations.push(mine);
	}

	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			gridLocation = [row, col];
			var child = document.createElement("div");
			child.classList.add("area");
			child.style.width = length + "px";
			child.style.height = length + "px";
			let locationCol = document.createAttribute("column");
			locationCol.value = col;
			let locationRow = document.createAttribute("row");
			locationRow.value = row;
			child.setAttributeNode(locationCol);
			child.setAttributeNode(locationRow);
			child.addEventListener("click", tileClicked);
			mineLocations.forEach((element) => {
				if (element[0] == gridLocation[0]) {
					if (element[1] == gridLocation[1]) {
						child.classList.add("mine");
					}
				}
			});

			playArea.appendChild(child);
		}
	}
	grid = document.querySelectorAll(".area");

	mineLocations.forEach((m) => {
		y = m[0];
		x = m[1];

		neighbors = getNeighborNodes(x, y);

		neighbors.forEach((e) => {
			if (e != null) {
				if (!grid[e].classList.contains("mine")) {
					if (grid[e].innerHTML == "") {
						grid[e].innerHTML = 1;
					} else {
						text = grid[e].innerHTML;
						grid[e].innerHTML = parseInt(grid[e].innerHTML) + 1;
					}
				}
			}
		});
	});
}

function updateMineCount() {
	let numMinesArray = Array.from(String(numMines), (num) => Number(num));
	let newString = [];

	for (let i = numMinesArray.length - 1; i >= 0; i--) {
		newString.unshift(String(numMinesArray[i]));
	}

	while (newString.length != 3) {
		newString.unshift("0");
	}

	remainingMines.innerHTML = newString.join("");
}

function updatePlayTime() {
	if (!isTimerPaused) {
		time += 1;
	}
	let timerArray = Array.from(String(time), (num) => Number(num));
	let newString = [];

	for (let i = timerArray.length - 1; i >= 0; i--) {
		newString.unshift(String(timerArray[i]));
	}

	while (newString.length != 3) {
		newString.unshift("0");
	}

	playTime.innerHTML = newString.join("");
}

function checkGameStatus() {
	activatedTiles = document.querySelectorAll(".clicked");
	mines = document.querySelectorAll(".area.mine.flagged");
	if (
		activatedTiles.length == gridSize ** 2 - totalMines &&
		mines.length == totalMines
	) {
		isTimerPaused = true;
		alert("You Win!");
	}
}

const getLinearIndex = (x, y) => {
	return gridSize * y + x;
};

const getCoordinates = (i) => {
	let y = Math.floor(i / gridSize);
	let x = (i / gridSize - y) * gridSize;
	return [x, y];
};

function getNeighborNodes(x, y) {
	neighbors = [];

	if (x == 0) {
		if (y == 0) {
			neighbors.push(getLinearIndex(x + 1, y)); // east
			neighbors.push(getLinearIndex(x + 1, y + 1)); // south east
			neighbors.push(getLinearIndex(x, y + 1)); // south
		} else if (y == gridSize - 1) {
			neighbors.push(getLinearIndex(x, y - 1)); // north
			neighbors.push(getLinearIndex(x + 1, y - 1)); // north east
			neighbors.push(getLinearIndex(x + 1, y)); // east
		} else {
			neighbors.push(getLinearIndex(x, y - 1)); // north
			neighbors.push(getLinearIndex(x + 1, y - 1)); // north east
			neighbors.push(getLinearIndex(x + 1, y)); // east
			neighbors.push(getLinearIndex(x + 1, y + 1)); // south east
			neighbors.push(getLinearIndex(x, y + 1)); // south
		}
	} else if (x == gridSize - 1) {
		if (y == 0) {
			neighbors.push(getLinearIndex(x - 1, y)); // west
			neighbors.push(getLinearIndex(x - 1, y + 1)); // south west
			neighbors.push(getLinearIndex(x, y + 1)); // south
		} else if (y == gridSize - 1) {
			neighbors.push(getLinearIndex(x, y - 1)); // north
			neighbors.push(getLinearIndex(x - 1, y - 1)); // north west
			neighbors.push(getLinearIndex(x - 1, y)); // west
		} else {
			neighbors.push(getLinearIndex(x, y - 1)); // north
			neighbors.push(getLinearIndex(x - 1, y - 1)); // north west
			neighbors.push(getLinearIndex(x - 1, y)); // west
			neighbors.push(getLinearIndex(x - 1, y + 1)); // south west
			neighbors.push(getLinearIndex(x, y + 1)); // south
		}
	} else if (y == 0) {
		neighbors.push(getLinearIndex(x + 1, y)); // east
		neighbors.push(getLinearIndex(x + 1, y + 1)); // south east
		neighbors.push(getLinearIndex(x, y + 1)); // south
		neighbors.push(getLinearIndex(x - 1, y + 1)); // south west
		neighbors.push(getLinearIndex(x - 1, y)); // west
	} else if (y == gridSize - 1) {
		neighbors.push(getLinearIndex(x, y - 1)); // north
		neighbors.push(getLinearIndex(x + 1, y - 1)); // north east
		neighbors.push(getLinearIndex(x + 1, y)); // east
		neighbors.push(getLinearIndex(x - 1, y)); // west
		neighbors.push(getLinearIndex(x - 1, y - 1)); // north west
	} else {
		neighbors.push(getLinearIndex(x, y - 1)); // north
		neighbors.push(getLinearIndex(x, y + 1)); // south
		neighbors.push(getLinearIndex(x + 1, y)); // east
		neighbors.push(getLinearIndex(x - 1, y)); // west
		neighbors.push(getLinearIndex(x + 1, y - 1)); // north east
		neighbors.push(getLinearIndex(x + 1, y + 1)); // south east
		neighbors.push(getLinearIndex(x - 1, y + 1)); // south west
		neighbors.push(getLinearIndex(x - 1, y - 1)); // north west
	}
	return neighbors;
}

function gameOver() {
	isTimerPaused = true;
	mineLocations.forEach((mine) => {
		if (!grid[getLinearIndex(mine[1], mine[0])].classList.contains("flagged")) {
			grid[getLinearIndex(mine[1], mine[0])].style.backgroundImage =
				"url('resources/images/bomb.png')";
			grid[getLinearIndex(mine[1], mine[0])].style.backgroundPostition =
				"center";
			grid[getLinearIndex(mine[1], mine[0])].style.backgroundSize = "cover";
		}
	});

	let flaggedTiles = document.querySelectorAll(".flagged");
	console.log(flaggedTiles);
	flaggedTiles.forEach((tile) => {
		if (!tile.classList.contains("mine")) {
			let col = Number(tile.getAttribute("column"));
			let row = Number(tile.getAttribute("row"));

			grid[getLinearIndex(col, row)].style.backgroundImage =
				"url('resources/images/no-bomb.png')";
			grid[getLinearIndex(mine[1], mine[0])].style.backgroundPostition =
				"center";
			grid[getLinearIndex(mine[1], mine[0])].style.backgroundSize = "cover";
		}
	});

	grid.forEach((tile) => {
		tile.removeEventListener("click", tileClicked);
	});
}

function tileClicked(event) {
	if (isTimerPaused) {
		isTimerPaused = false;
		newGame.innerHTML = "Reset";
	}
	if (event.ctrlKey) {
		if (event.target.classList.contains("possibleMine")) {
			event.target.classList.remove("possibleMine");
			event.target.style.backgroundImage = "none";
		} else if (event.target.classList.contains("flagged")) {
			event.target.classList.remove("flagged");
			event.target.classList.add("possibleMine");
			event.target.style.backgroundImage =
				"url('resources/images/possibleMine.png')";
			event.target.style.backgroundPostition = "center";
			event.target.style.backgroundSize = "cover";
			if (numMines) {
				numMines += 1;
			}
		} else {
			event.target.classList.add("flagged");
			event.target.style.backgroundImage =
				"url('resources/images/flagged.png')";
			event.target.style.backgroundPostition = "center";
			event.target.style.backgroundSize = "cover";
			if (numMines) {
				numMines -= 1;
			}
		}

		updateMineCount();
	} else {
		if (
			!event.target.classList.contains("flagged") &&
			!event.target.classList.contains("clicked")
		) {
			if (event.target.classList.contains("mine")) {
				event.target.style.backgroundColor = "red";
				gameOver();
			} else {
				event.target.classList.add("clicked");
				event.target.style.border = "2px solid hsl(0, 0%, 80%)";
				event.target.style.fontSize = "0.75rem";

				if (event.target.innerHTML == "") {
					neighbors = getNeighborNodes(
						parseInt(event.target.getAttribute("column")),
						parseInt(event.target.getAttribute("row"))
					);
					neighbors.forEach((node) => {
						grid[node].click();
					});
				} else if (!event.target.classList.contains("mine")) {
					event.target.style.color =
						tileColors[Number(event.target.innerHTML) - 1];
				}
			}
		}
	}
	checkGameStatus();
}

generateGame();
const timer = setInterval(updatePlayTime, 1000);
