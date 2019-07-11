window.onload = () => {
	const canvas    = document.getElementById('canvas'),
	      context   = canvas.getContext('2d'),
	      winWidth  = canvas.width = window.innerWidth,
	      winHeight = canvas.height = window.innerHeight,
	      centerX   = winWidth / 2, centerY = winHeight / 2,
	      colours   = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black', 'white'],
	      fontSize  = centerY / 8;

	['click', 'keydown', 'mousemove', 'scroll'].forEach(event => document.addEventListener(event, genCanvas));

	function init() {
		context.font = `${fontSize}px arial`;
		context.textAlign = 'center';
		context.fillStyle = 'white';

		document.body.style.backgroundColor = 'black';

		['PRESS', 'PRESSE', 'DRÜCKEN SIE', 'LEHDISTÖ', 'TRYKKE',
		'TRYCK', 'НАЖМИТЕ', 'صحافة', '按', '押す', '프레스', 'ΤΎΠΟΣ', 'ללחוץ', 'दबाएँ'].forEach((text, i) => {
			context.fillText(text, centerX, 70 + (fontSize * i));
		});
	}

	function genCanvas() {
		let numOfShapes = getRand(100);

		clearScreen();
		context.fillStyle = document.body.style.backgroundColor = colours[getRand(colours.length)];
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < numOfShapes; i++) {
			let width     = getRand(winWidth),
			    height    = getRand(winHeight),
			    bezStartX = getRand(winWidth),
			    bezStartY = getRand(winHeight),
			    bezEndX   = getRand(winWidth),
			    bezEndY   = getRand(winHeight),
			    conX      = getRand(winWidth),
			    conY      = getRand(winHeight),
			    fill      = getRand(2);

			context.lineWidth = getRand(25);
			context.strokeStyle = colours[getRand(colours.length)];
			context.fillStyle = colours[getRand(colours.length)];

			switch (getRand(4)) {
				case 0:
					drawCircle(width, height, getRand(winHeight * 0.3), fill);
					break;
				case 1:
					drawRectangle(width, height, getRand(winHeight * 0.3), getRand(winHeight * 0.3), fill);
					break;
				case 2:
					drawTriangle(width, height, getRand(winHeight * 0.3), getRand(winHeight * 0.3), fill);
					break;
				case 3:
					drawBezierCurve(bezStartX, bezStartY, conX, conY, bezEndX, bezEndX, 'white');
					break;
			}
			if (fill) context.fill();
		}

		let w = getRand(winWidth), h = getRand(winHeight),
			imageData = context.createImageData(w, h);

		for (let i = 0; i < imageData.data.length; i += 4) {
			imageData.data[i + 0] = getRand(255);
			imageData.data[i + 1] = getRand(255);
			imageData.data[i + 2] = getRand(255);
			imageData.data[i + 3] = 255;
		}
		context.putImageData(imageData, w, h);
	}

	function getRand(range) {
		return Math.floor(Math.random() * range);
	}

	function clearScreen() {
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	function drawLine(x1, y1, x2, y2) {
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.closePath();
		context.stroke();
	}

	function drawCircle(x, y, radius, colour) {
		context.beginPath();
		context.arc(x, y, radius, 0, 2 * Math.PI);
		context.closePath();
		context.stroke();
	}

	function drawRectangle(x, y, width, height) {
		context.strokeRect(x, y, width, height);
	}

	function drawTriangle(x, y, width, height) {
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x - width / 2, y);
		context.lineTo(x , y - height);
		context.lineTo(x + width / 2, y);
		context.closePath();
		context.stroke();
	}

	function drawBezierCurve(cp1x, cp1y, cp2x, cp2y, x, y) {
		context.beginPath();
		context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
		context.closePath();
		context.stroke();
	}
	init();
}
