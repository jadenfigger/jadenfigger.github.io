let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let start, pTimeStep;

let y = 20;
let g = -0.01;
let yVel = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width/2, y, 10, 0, Math.PI*2);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();

	yVel -= g;
	y += yVel;

	if (y > canvas.height - 5) {
		yVel *= -1;
	}
}


function step(timeStep) {
	if (start === undefined) {
		start = timeStep
	}	
	console.log(timeStep);
	let elapsed = timeStep - start;

	
	draw();


	if (elapsed < 10000) {
		previousTimeStep = timeStep;
		window.requestAnimationFrame(step);
	}

}
window.requestAnimationFrame(step);