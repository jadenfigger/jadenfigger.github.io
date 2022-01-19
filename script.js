let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

window.addEventListener("keydown", keyPressed, false);

let sButton = document.querySelector("#sButton");
let scoreLabel = document.querySelector("#score");

let start, pTimeStep;
let gameRunning = false;
let gameScore = 0;

let gridState = [[0, 0, 0, 0],
				 [0, 0, 2, 0],
				 [0, 2, 0, 0],
				 [0, 0, 0, 0]];


let gridColorStates = {0: "#cdc0b4", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcf72", 512: "#edcf72", 1024: "#edc53f", 2048: "#edc22e"};
let cellSpacing = 20;
let cellWidth = 700/4;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawGrid();	
}

function drawGrid() {
	for (let y = 0; y < 4; y++) {
		for (let x = 0; x < 4; x++) {
			ctx.fillStyle = gridColorStates[gridState[y][x]];
			let xPos = cellSpacing + (cellWidth * x);
			let yPos = cellSpacing + (cellWidth * y);
			ctx.fillRect(xPos, yPos, cellWidth-cellSpacing, cellWidth-cellSpacing);	


			if (gridState[y][x] != 0) {
				ctx.fillStyle = "#786e65";
				ctx.font = "100px myFont";
				ctx.textAlign = 'center';
				ctx.fillText(gridState[y][x], xPos+((cellWidth-cellSpacing)/2), yPos+(3*(cellWidth-cellSpacing)/4));
			}
		}
	}
}

function isBoardFull() {
	let con = true;
	gridState.forEach((outerArray) => {outerArray.forEach((element) => {if (element==0) con=false})});
	
	return con;
}

function addTwoOrFour() {
	if (isBoardFull()) {
		return;
	}
	
	gridState.forEach((outerArray) => {outerArray.forEach((element) => {if (element==0) con=true})});
	if (!con) {
		return;
	}

	let x = Math.floor(Math.random() * 4);
	let y = Math.floor(Math.random() * 4);

	while (gridState[y][x] != 0) {
		x = Math.floor(Math.random() * 4);
		y = Math.floor(Math.random() * 4);
	}
	if (Math.random() < 0.5) {
		gridState[y][x] = 2;
	} else {
		gridState[y][x] = 4;
	}
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function keyPressed(e) {
	let keyCode = e.keyCode;

	if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

	// up 38
	// right 39
	// down 40
	// left 37
	let newGameState = undefined;
	if (!gameRunning) {
		return;
	} else {
		if (keyCode == 38) {
			newGameState = up(gridState);
		} else if (keyCode == 40) {
			newGameState = down(gridState);
		} else if (keyCode ==  39) {
			newGameState = right(gridState);
		} else if (keyCode == 37) {
			newGameState = left(gridState);
		}
	}
	if (arraysEqual(newGameState, gridState)) {
		return;
	}
	if (newGameState != undefined) {
		gridState = newGameState;
		addTwoOrFour();

		scoreLabel.innerHTML = "Score: " + gameScore;


		if (isBoardFull()) {
			gameRunning = !checkIfGameOver();
		}
	}
}

function enterGameOverState() {
	ctx.fillStyle = "rgba(100, 100, 100, 0.6)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "100px myFont";
	ctx.textAlign = 'center';
	ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
}

function checkIfGameOver() {
	if (arraysEqual(up(gridState), gridState) && arraysEqual(down(gridState), gridState) && 
	    arraysEqual(right(gridState), gridState) && arraysEqual(left(gridState), gridState)) {
			return true;
		}
	return false;
}
 

function cover_up(mat) {
    let newGrid = [];
    for (let j = 0; j < 4; j++) {
        partial_new = [];
        for (let i = 0; i < 4; i++) {
            partial_new.push(0);
		}
        newGrid.push(partial_new);
	}
	done = false;
    for (let i = 0; i < 4; i++) {
        count = 0;
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] != 0) {
                newGrid[i][count] = mat[i][j];
                if (j != count) {
                    done = true;
				}
                count += 1;
			}
		}
	}
    return [newGrid, done];
}

function merge(mat, done) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mat[i][j] == mat[i][j+1] && mat[i][j] != 0) {
				gameScore += mat[i][j] * 2;
                mat[i][j] *= 2;
                mat[i][j+1] = 0;
                done = true;
			}
		}
	}
    return [mat, done];
}

function up(game) {
    game = transpose(game);
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = transpose(game);
    return game;
}

function down(game) {
	game = reverse(transpose(game));
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = transpose(reverse(game));
    return game;
}

function left(game) {
    let gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    return game;
}

function right(game) {
    game = reverse(game);
    gameInfo = cover_up(game);
    gameInfo = merge(gameInfo[0], gameInfo[1]);
    game = cover_up(gameInfo[0])[0];
    game = reverse(game);
    return game;
}




function transpose(mat) {
    let newList = [];
    for (let i = 0; i < 4; i++) {
        newList.push([]);
        for (let j = 0; j < 4; j++) {
            newList[i].push(mat[j][i]);
		}
	}
    return newList;
}


function reverse(mat) {
    let newList = [];
    for (let i = 0; i < 4; i++) {
        newList.push([]);
        for (let j = 0; j < 4; j++) {
			newList[i].push(mat[i][4-j-1]);
		}
	}
    return newList;
}


function step(timeStep) {
	draw();

	if (gameRunning) {
		window.requestAnimationFrame(step);
	} else {
		enterGameOverState();
	}

}

sButton.addEventListener("click", function() {
	gameRunning = true;
	window.requestAnimationFrame(step);

	gameScore = 0;
	gridState = [[0, 0, 0, 0],
				 [0, 0, 2, 0],
				 [0, 2, 0, 0],
				 [0, 0, 0, 0]];

})