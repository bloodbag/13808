const canvas           = document.createElement('canvas');
const ctx              = canvas.getContext('2d');
canvas.width           = window.innerHeight;
canvas.height          = canvas.width;
canvas.setAttribute('style', 'border-style:solid;border-width:9px;padding:0px 6px 6px 6px;position:absolute;left:50%;width:25%;margin-left:-12.5%;');
document.body.appendChild(canvas);
const LEVEL_WIDTH      = 25;
const LEVEL_HEIGHT     = 25;
let LEVEL              = 0;
let BLOCK_SIZE         = canvas.width / LEVEL_WIDTH;
let sleepTime          = 700;
let PLAYER_REELS       = 0;
let PLAYER_CAUGHT      = 0;
let PLAYER_SCORE       = 0;
let PLAYER_SCORE_CHECK = 0;
let scores             = [];
let displayScores      = false;
const music            = new Audio('sound/the_fishing_hole_8bit.ogg');
const reel             = new Audio('sound/reel_in.ogg');
music.volume           = 0.25;
reel.volume            = 0.75;
ctx.font               = 'Bold 42px Arial';
ctx.textAlign          = 'center';
ctx.fillStyle          = 'white';

const json = async () => {
	const response = await fetch('levels.json').catch(err => console.log('Fetch Error :-S', err));
  
	if (response.status !== 200) {
		console.log('Looks like there was a problem. Status Code: ' + response.status);
		return;
	}
	
	return await response.json();
}

async function* loadLevel() {
	const response = await fetch('levels.json').catch(err => console.log('Fetch Error :-S', err));
  
	if (response.status !== 200) {
		console.log('Looks like there was a problem. Status Code: ' + response.status);
		return;
	}
  
	const json = await response.json();
	let lvl = 0;
   
	while (lvl < 8) {
		music.currentTime = 0;
		fishes = [];
		rocks = [];
		PLAYER_REELS = 0;
		PLAYER_CAUGHT = 0;
	
		for (let i = 0; i < json.levels[lvl].fish.length; i++) {
			fishes.push(new Fish(json.levels[lvl].fish[i].waypoints));
		}
  
		for (let i = 0; i < json.levels[lvl].rocks.length; i++) {
			rocks.push(new Rock(json.levels[lvl].rocks[i].position.x, json.levels[lvl].rocks[i].position.y, json.levels[lvl].rocks[i].scale.x, json.levels[lvl].rocks[i].scale.y));
		}
  
		if (lvl == 7) {
			lvl = 0;
			PLAYER_SCORE = 0;
			document.getElementById('score').innerText = parseInt(PLAYER_SCORE);
		} else {
			lvl++;
		}
		yield;
	}
	return;
}

function nextLevel() {	
	if (loadLevel().next().done) {
		console.log('game over!');
	}
}

function menu() {
	['← & → TO MOVE',
	'↓ TO SPEED UP',
	'[SPACE] TO REEL OUT & IN',
	'[PRESS ANY KEY TO PLAY]'].forEach((txt, i) => {
		ctx.fillText(txt, canvas.width / 2, canvas.height / 2 + (i * 100) - 150);
	});

	if (Object.values(gameImages).some(image => image.ready != true)) {
		window.addEventListener('keydown', start);
	}
}

function start() {
	window.removeEventListener('keydown', start);
	main();
};

function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

let gameImages = {
	hookImage: 'hook',
	waterImage: 'water',
	lineImage: 'line',
	lineImageLeftDown: 'line_left_down',
	lineImageRightDown: 'line_right_down',
	lineImageLeftUp: 'line_left_up',
	lineImageRightUp: 'line_right_up',
	fishImageLeft: 'fish_left',
	fishImageRight: 'fish_right',
	rockImageSingle: 'rock_single',
	rockImageCornerTopLeft: 'rock_corner_top_left',
	rockImageCornerTopRight: 'rock_corner_top_right',
	rockImageCornerBottomLeft: 'rock_corner_bottom_left',
	rockImageCornerBottomRight: 'rock_corner_bottom_right',
	rockImageLeft: 'rock_left',
	rockImageHorizTop: 'rock_horiz_top',
	rockImageHoriz: 'rock_horiz',
	rockImageHorizBottom: 'rock_horiz_bottom',
	rockImageRight: 'rock_right',
	rockImageCenter: 'rock_center',
	rockImageUp: 'rock_up',
	rockImageVertLeft: 'rock_vert_left',
	rockImageVert: 'rock_vert',
	rockImageVertRight: 'rock_vert_right',
	rockImageDown: 'rock_down'
};

Object.entries(gameImages).forEach(image => {
	gameImages[image[0]] = new Image();
	gameImages[image[0]].src = `img/${image[1]}.png`;
	gameImages[image[0]].onload = () => gameImages[image[0]].ready = true;
});

function renderWater() {
	for (let j = 0; j < LEVEL_HEIGHT; j++) {
		for (let i = 0; i < LEVEL_WIDTH; i++) {
			ctx.drawImage(gameImages.waterImage, i * BLOCK_SIZE, j * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
		}
	}
}

function renderLine() {
	for (let i = 0; i < hook.prev.length; i += 2) {
		if (hook.prev[i] > hook.prev[i + 2]) {
			ctx.drawImage(gameImages.lineImageLeftDown, (hook.prev[i] - 1) * BLOCK_SIZE, (hook.prev[i + 1]) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			ctx.drawImage(gameImages.lineImageLeftUp, (hook.prev[i]) * BLOCK_SIZE, (hook.prev[i + 1]) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		} else if (hook.prev[i] < hook.prev[i + 2]) {
			ctx.drawImage(gameImages.lineImageRightDown, (hook.prev[i] + 1) * BLOCK_SIZE, (hook.prev[i + 1]) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			ctx.drawImage(gameImages.lineImageRightUp, (hook.prev[i]) * BLOCK_SIZE, (hook.prev[i + 1]) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		} else {
			ctx.drawImage(gameImages.lineImage, hook.prev[i] * BLOCK_SIZE, hook.prev[i + 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		}
	}
	fixArtifact();
}

function fixArtifact() {
	if (hook.x == hook.prev[hook.prev.length - 2] + 1) {
		ctx.drawImage(gameImages.lineImageRightDown, (hook.prev[hook.prev.length - 2] + 1) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		ctx.drawImage(gameImages.waterImage, (hook.prev[hook.prev.length - 2]) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		ctx.drawImage(gameImages.lineImageRightUp, (hook.prev[hook.prev.length-2]) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	} else if (hook.x == hook.prev[hook.prev.length - 2] - 1) {
		ctx.drawImage(gameImages.lineImageLeftDown, (hook.prev[hook.prev.length - 2] - 1) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		ctx.drawImage(gameImages.waterImage, (hook.prev[hook.prev.length - 2]) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		ctx.drawImage(gameImages.lineImageLeftUp, (hook.prev[hook.prev.length - 2]) * BLOCK_SIZE, hook.prev[hook.prev.length - 1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}
}

class Hook {
    constructor() {
		this._x = 12;
		this._y = 0;
		this._startX = this._x,
		this._startY = this._y,
		this._prev = [],
		this._casting =  false,
		this._reelIn = false
	}

	get x()            { return this._x;        }
	set x(x)           { this._x = x;           }

	get y()            { return this._y;        }
	set y(y)           { this._y = y;           }

	get startX()       { return this._startX;   }
	set startX(startX) { this._startX = startX; }

	get startY()       { return this._startY;   }
	set startY(startY) { this._startY = startY; }

	get casting()      { return this._casting;  }
	set casting(cast)  { this._casting = cast;  }

	get prev()         { return this._prev;     }

	get reelIn()       { return this._reelIn;   }

	update() {
		if (this._reelIn) {
			this.reverseHook();
		} else {
			if (40 in keysDown) { // DOWN_ARROW
				sleepTime = 70;
				keysDown = [];
			} else {
				sleepTime = 700;
			}
	
			if (32 in keysDown) { // SPACEBAR
				if (!this._casting) {
					PLAYER_REELS++;
					this._casting = true;
					music.play();
					keysDown = [];
				} else {
					sleepTime /= 10;
					this._casting = false;
					this._reelIn = true;
					music.pause();
					reel.play();
					keysDown = [];
				}
			}
			this.moveHook();
		}
		this.checkCollision();
	}

	render() {
		ctx.drawImage(gameImages.hookImage, hook.x * BLOCK_SIZE, hook.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	checkCollision() {
		for (let i = 0; i < rocks.length; i++) {
			if (this.scaleX == 1) {
				if (this._x == this._x &&
					this._y > this._y - this._scaleY - 1 &&
					this._y < this._y + this._scaleY + 1) {
					this.reelHook();
				}
			} else if (	this._x > this._x - (this._scaleX + 1) &&
						this._x < this._x + (this._scaleX + 1) &&
						this._y > this._y - (this._scaleY + 1) &&
						this._y < this._y + (this._scaleY + 1)) {
				this.reelHook();
			}
		}
	}

	moveHook() {
		if (this._casting && this._y < LEVEL_HEIGHT - 1) {
			if (37 in keysDown) { // LEFT_ARROW
				this._x -= 1;
				keysDown = [];
			}
			if (39 in keysDown) { // RIGHT_ARROW
				this._x += 1;
				keysDown = [];
			}

			this._prev.push(this._x);
			this._prev.push(this._y);
			this._y += 1;
		}
	}

	reverseHook() {
		if (this._x != this._startX || this._y != this._startY) {
			this._y = this._prev.pop();
			this._x = this._prev.pop();
		} else {
			this._casting = false;
			this._reelIn = false;
			sleepTime *= 10;

			if (this._x == this._startX && this._y == this._startY) {
				reel.pause();
				reel.currentTime = 0;

				if (PLAYER_CAUGHT == fishes.length) {
					PLAYER_SCORE += PLAYER_CAUGHT / PLAYER_REELS; // Calculate score
					document.getElementById('score').innerText = parseInt(PLAYER_SCORE);
					if (LEVEL == 7) {
						LEVEL = -1;
						PLAYER_SCORE = 0;
						document.getElementById('score').innerText = parseInt(PLAYER_SCORE);
						nextLevel();
					} else {
						nextLevel();
					}
				}
			}
		}
	}

	reelHook() {
		sleepTime /= 10;
		this._reelIn = true;
		music.pause();
		reel.play();
	}
}

class Fish {
	constructor(waypoints) {
		this._fishImage = new Image();
		this._x         = waypoints[0].x;
		this._y         = waypoints[0].y;
		this._waypoints = waypoints;
		this._point     = 0;
		this._direction = true;
		this._caught    = false;
		this._onBoat    = false;
		this._counted   = false;
		this._blocks    = null;
	}

	get fishImage()       { return this._fishImage;     }
	set fishImage(image)  { this._fishImage = image;    }

	get fishImageSrc()    { return this._fishImage.src; }
	set fishImageSrc(src) { this._fishImage.src = src;  }

	get x()               { return this._x;             }
	set x(x)              { this._x = x;                }

	get y()               { return this._y;             }
	set y(y)              { this._y = y;                }

	get waypoints()       { return this._waypoints;     }

	get point()           { return this._point;         }
	set point(point)      { this._point = point;        }

	get onBoat()          { return this._onBoat;        }

	update() {
		this.updateCount();
		this.updatePos();
	}

	render() {
		if (!this._onBoat) {
			ctx.drawImage(this._fishImage, this._x * BLOCK_SIZE, this._y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
		}
	}

	updateCount() {
		if (hook.reelIn && hook.x == hook.startX && hook.y == hook.startY) {
			if (this._caught && !this._counted) {
				this._counted = true;
				PLAYER_CAUGHT++;
			}
		}
	}

	updatePos() {
		if (hook.reelIn && this._x == hook.x && (this._y == hook.y || this._y == hook.y - 1 || this._y == hook.y + 1)) {
			this._caught = true;
		}

		if (this._x == 12 && this._y == 0) {
			this._onBoat = true;
		}

		if (this._caught) {
			this._x = hook.x;
			this._y = hook.y;
		} else {
			if (this._x < this._waypoints[this._point].x) {
				this._x++;

				if (this._fishImageSrc != gameImages.fishImageRight.src) {
					this._fishImage = gameImages.fishImageRight;
				}
			}

			if (this._x > this._waypoints[this._point].x) {
				this._x--;

				if (this._fishImageSrc != gameImages.fishImageLeft.src) {
					this._fishImage = gameImages.fishImageLeft;
				}
			}

			if (this._x == this._waypoints[this._point].x && this._y < this._waypoints[this._point].y) {
				this._y++;
			}

			if (this._x == this._waypoints[this._point].x && this._y > this._waypoints[this._point].y) {
				this._y--;
			}

			if (this._x == this._waypoints[this._point].x && this._y == this._waypoints[this._point].y) {
				this._point += (this._point < this._waypoints.length - 1) ? 1 : -(this._waypoints.length - 1);
			}
		}
	}
}

class Rock {
	constructor(x, y, scaleX, scaleY) {
		this._x      = x;
		this._y      = y;
		this._scaleX = scaleX;
		this._scaleY = scaleY;
	}

	get x()      { return this._x;      }
	set x(x)     { this._x = x;         }

	get y()      { return this._y;      }
	set y(y)     { this._y = y;         }

	get scaleX() { return this._scaleX; }
	get scaleY() { return this._scaleY; }

	render() {
		if (this._scaleX == 1 && this._scaleY == 1) {
			this.renderSingle();
		} else if (this._scaleX > 1 && this._scaleY == 1) {
			this.renderHorizontal();
		} else if (this._scaleX == 1 && this._scaleY > 1) {
			this.renderVertical();
		} else if (this._scaleX > 1 && this._scaleY > 1) {
			this.renderBlock();
		}
	}

	renderSingle() {
		ctx.drawImage(gameImages.rockImageSingle, this._x * BLOCK_SIZE, this._y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	renderHorizontal() {
			for (let r = this._x - this._scaleX + 1; r < this._x + this._scaleX; r++)
				ctx.drawImage(gameImages.rockImageHoriz, r * BLOCK_SIZE, this._y * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE);

			ctx.drawImage(gameImages.rockImageLeft, (this._x - this._scaleX) * BLOCK_SIZE, this._y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			ctx.drawImage(gameImages.rockImageRight, (this._x + this._scaleX) * BLOCK_SIZE, this._y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	renderVertical() {
			for (let r = this._y - this._scaleY + 1; r < this._y + this._scaleY; r++)
				ctx.drawImage(gameImages.rockImageVert, this._x * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE + 1);

			ctx.drawImage(gameImages.rockImageUp, this._x * BLOCK_SIZE, (this._y - this._scaleY) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
			ctx.drawImage(gameImages.rockImageDown, this._x * BLOCK_SIZE, (this._y + this._scaleY) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	}

	renderBlock() {
		for (let r = this._x - this._scaleX + 1; r < this._x + this._scaleX; r++)
			ctx.drawImage(gameImages.rockImageHorizTop, r * BLOCK_SIZE, (this._y - this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);

		for (let r = this._y - this._scaleY + 1; r < this._y + this._scaleY; r++)
			ctx.drawImage(gameImages.rockImageVertLeft, (this._x - this._scaleX) * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);

		for (let rX = this._x - this._scaleX + 1; rX < this._x + this._scaleX; rX++) 
			for (let rY = this._y - this._scaleY + 1; rY < this._y + this._scaleY; rY++) 
				ctx.drawImage(gameImages.rockImageCenter, rX * BLOCK_SIZE, rY * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);

		for (let r = this._y - this._scaleY + 1; r < this._y + this._scaleY; r++)
			ctx.drawImage(gameImages.rockImageVertRight, (this._x + this._scaleX) * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE + 1);

		for (let r = this._x - this._scaleX + 1; r < this._x + this._scaleX; r++) 
			ctx.drawImage(gameImages.rockImageHorizBottom, r * BLOCK_SIZE, (this._y + this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE);

		ctx.drawImage(gameImages.rockImageCornerTopRight, (this._x + this._scaleX) * BLOCK_SIZE, (this._y - this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
		ctx.drawImage(gameImages.rockImageCornerTopLeft, (this._x - this._scaleX) * BLOCK_SIZE, (this._y - this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
		ctx.drawImage(gameImages.rockImageCornerBottomLeft, (this._x - this._scaleX) * BLOCK_SIZE, (this._y + this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
		ctx.drawImage(gameImages.rockImageCornerBottomRight, (this._x + this._scaleX) * BLOCK_SIZE, (this._y + this._scaleY) * BLOCK_SIZE, BLOCK_SIZE + 1, BLOCK_SIZE + 1);
	}
}

let hook = new Hook(), fishes = [], rocks = [], keysDown = {};

addEventListener('keydown', function(e) { keysDown[e.keyCode] = true; }, false);
