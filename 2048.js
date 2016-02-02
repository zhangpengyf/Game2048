$(function() {
	// console.log($(document).height());
	// $(".container").height($(document).height());
	function Game2048() {
		this.gameGrid = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		this.startX = 0;
		this.endX = 0;
		this.startY = 0;
		this.endY = 0;
		this.score = 0;
		this.scoreAdd = 0;
		this.bestScore = 0;
		this.bestScoreAdd = 0;
		this.slide = false;
		this.flag = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		]; //flag the grid is Blink or Appear;
	}

	Game2048.prototype.flagInit = function() {
		var flagg = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		return flagg;
	}

	Game2048.prototype.restartInit = function() {
		this.gameGrid = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		this.flag = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		this.score = 0;
		var indexNum = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				indexNum = i * 4 + j;
				$(".game_container div").eq(indexNum).removeClass().html("");
			}
		}
		$(".score_container .scores").html(this.score);
	}

	Game2048.prototype.init = function() {
		console.log('Start init...');
		// var _self = this;
		this.randomNum();
		this.randomNum();
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (this.gameGrid[i][j] != 0) {
					var indexNum = i * 4 + j;
					$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Appear').html(this.gameGrid[i][j]);
				}
			}
		}
	}

	Game2048.prototype.randomNum = function() {
		// console.log('random number...');
		var rand = Math.ceil(Math.random() * 4);
		// console.log(rand);
		if (rand != 4) {
			rand = 2
		};
		var x = Math.floor(Math.random() * 4);
		var y = Math.floor(Math.random() * 4);
		if (this.gameGrid[x][y] == 0) {
			console.log("random num is： " + rand);
			console.log("the random number's position is: " + "gameGrid[" + x + "][" + y + "].");
			this.gameGrid[x][y] = rand;
			this.flag[x][y] = 2;
			// this.slide = false;
		} else {
			this.randomNum();
		}
	}

	Game2048.prototype.touchOrKeypress = function() {
		console.log('is touch or not ...');
		var _self = this;
		// var key_code = 0;
		var gameContainer = document.getElementsByClassName("game_container")[0];
		// console.log(gameContainer);

		gameContainer.addEventListener("touchstart", function(event) {
			event.preventDefault();
			this.startX = event.touches[0].clientX;
			this.startY = event.touches[0].clientY;
			// console.log(this.startX+"----");
			// console.log(this.startY+"----------");
		})

		gameContainer.addEventListener("touchmove", function(event) {
			event.preventDefault();
		})

		gameContainer.addEventListener("touchend", function(event) {
			event.preventDefault();
			this.endX = event.changedTouches[0].clientX;
			this.endY = event.changedTouches[0].clientY;
			// console.log(this.endX+"*****");
			// console.log(this.endY+"**************");
			var x = this.endX - this.startX;
			var y = this.endY - this.startY;
			// console.log(x);
			// console.log(y);
			if ((Math.abs(x) > 3) || (Math.abs(y) > 3)) {
				if (Math.abs(x) < Math.abs(y)) {
					if (y > 0) {
						_self.moveDowm();
					} else {
						_self.moveUp();
					}
				} else{
					if (x > 0) {
						_self.moveRight();
					} else {
						_self.moveLeft();
					}
				}
			}
		})

		document.addEventListener("keydown", function(event) {
			switch (event.which) {
				case 65:
					_self.moveLeft();
					break;
				case 87:
					_self.moveUp();
					break;
				case 68:
					_self.moveRight();
					break;
				case 83:
					_self.moveDowm();
					break;
				default:
					console.log("not right");
			}
		})
	}

	Game2048.prototype.showNum = function() {
		var indexNum = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				indexNum = i * 4 + j;
				if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 0) {
					$(".game_container div").eq(indexNum).removeClass();
					$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j]).html(this.gameGrid[i][j]);
				} else if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 1) {
					$(".game_container div").eq(indexNum).removeClass();
					$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Blink').html(this.gameGrid[i][j]);
				} else if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 2) {
					$(".game_container div").eq(indexNum).removeClass();
					$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Appear').html(this.gameGrid[i][j]);
				} else {
					$(".game_container div").eq(indexNum).removeClass().html("");
				}
			}
		}

		$(".score_container .scores").html(this.score);
		if (this.scoreAdd != 0) {
			$(".score_container .scores").append('<div class="score-addition">+' + this.scoreAdd + '</div>');
			this.bestScoreAdd = this.scoreAdd;
			this.scoreAdd = 0;
			setTimeout(function() {
				$(".scores .score-addition").remove()
			}, 600);
		}
		if (this.bestScore <= this.score && this.bestScoreAdd != 0) {
			this.bestScore = this.score;
			$(".score_container .bestScore").html(this.bestScore);
			$(".score_container .bestScore").append('<div class="score-addition">+' + this.bestScoreAdd + '</div>');
			this.bestScoreAdd = 0;
			setTimeout(function() {
				$(".bestScore .score-addition").remove()
			}, 600);
		}

		this.flag = this.flagInit();
	}

	Game2048.prototype.moveUp = function() {
		console.log("start to move up...");
		var m = 3; // promise to move the max instance;
		while (m > 0) {
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 4; j++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i + 1][j] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i + 1][j];
						this.gameGrid[i + 1][j] = 0;
						this.slide = true;
					}
				}
			}
			m--;
		}

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 4; j++) {
				if (this.gameGrid[i][j] != 0 && this.gameGrid[i][j] == this.gameGrid[i + 1][j]) {
					this.gameGrid[i][j] *= 2;
					this.scoreAdd = this.gameGrid[i][j];
					this.gameGrid[i + 1][j] = 0;
					this.score += this.scoreAdd;
					this.slide = true;
					this.flag[i][j] = 1;
					console.log("The score is " + this.score + " now!");
				}
			}
		}

		for (var j = 0; j < 4; j++) {
			for (var n = 0; n < 2; n++) {
				for (var i = 0; i < 3; i++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i + 1][j] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i + 1][j];
						this.gameGrid[i + 1][j] = 0;
						if (this.flag[i + 1][j] == 1) {
							this.flag[i][j] = 1;
							this.flag[i + 1][j] = 0;
						}
					}
				}
			}
		}

		if (this.slide) {
			this.randomNum();
			this.slide = false;
		}
		// console.log(this.gameGrid[0]);
		// console.log(this.gameGrid[1]);
		// console.log(this.gameGrid[2]);
		// console.log(this.gameGrid[3]);
		// console.log("---------------");
		// console.log(this.flag[0]);
		// console.log(this.flag[1]);
		// console.log(this.flag[2]);
		// console.log(this.flag[3]);
		this.showNum();
		this.gameOver();
	}

	Game2048.prototype.moveLeft = function() {
		console.log("Start to move left...");
		var m = 3;
		while (m > 0) {
			for (var j = 0; j < 3; j++) {
				for (var i = 0; i < 4; i++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i][j + 1] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i][j + 1];
						this.gameGrid[i][j + 1] = 0;
						this.slide = true;
					}
				}
			}
			m--;
		}

		for (var j = 0; j < 3; j++) {
			for (var i = 0; i < 4; i++) {
				if (this.gameGrid[i][j] != 0 && this.gameGrid[i][j] == this.gameGrid[i][j + 1]) {
					this.gameGrid[i][j] *= 2;
					this.scoreAdd = this.gameGrid[i][j];
					this.gameGrid[i][j + 1] = 0;
					this.slide = true;
					this.flag[i][j] = 1;
					this.score += this.scoreAdd;
					console.log("The score is " + this.score + " now!");
				}
			}
		}

		for (var i = 0; i < 4; i++) {
			for (var n = 0; n < 2; n++) {
				for (var j = 0; j < 3; j++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i][j + 1] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i][j + 1];
						this.gameGrid[i][j + 1] = 0;
						if (this.flag[i][j + 1] == 1) {
							this.flag[i][j] = 1;
							this.flag[i][j + 1] = 0;
						}
					}
				}
			}
		}

		if (this.slide) {
			this.randomNum();
			this.slide = false;
		}
		// console.log(this.gameGrid[0]);
		// console.log(this.gameGrid[1]);
		// console.log(this.gameGrid[2]);
		// console.log(this.gameGrid[3]);
		// console.log("---------------");
		// console.log(this.flag[0]);
		// console.log(this.flag[1]);
		// console.log(this.flag[2]);
		// console.log(this.flag[3]);
		this.showNum();
		this.gameOver();
	}

	Game2048.prototype.moveRight = function() {
		console.log("Start to move right...");
		var m = 3;
		while (m > 0) {
			for (var j = 3; j > 0; j--) {
				for (var i = 0; i < 4; i++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i][j - 1] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i][j - 1];
						this.gameGrid[i][j - 1] = 0;
						this.slide = true;
					}
				}
			}
			m--;
		}

		for (var j = 3; j > 0; j--) {
			for (var i = 0; i < 4; i++) {
				if (this.gameGrid[i][j] != 0 && this.gameGrid[i][j] == this.gameGrid[i][j - 1]) {
					this.gameGrid[i][j] *= 2;
					this.scoreAdd = this.gameGrid[i][j];
					this.gameGrid[i][j - 1] = 0;
					this.slide = true;
					this.flag[i][j] = 1;
					this.score += this.scoreAdd;
					console.log("The score is " + this.score + " now!");
				}
			}
		}

		for (var i = 0; i < 4; i++) {
			for (var n = 0; n < 2; n++) {
				for (var j = 3; j > 0; j--) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i][j - 1] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i][j - 1];
						this.gameGrid[i][j - 1] = 0;
						if (this.flag[i][j - 1] == 1) {
							this.flag[i][j] = 1;
							this.flag[i][j - 1] = 0;
						}
					}
				}
			}
		}

		if (this.slide) {
			this.randomNum();
			this.slide = false;
		}
		// console.log(this.gameGrid[0]);
		// console.log(this.gameGrid[1]);
		// console.log(this.gameGrid[2]);
		// console.log(this.gameGrid[3]);
		// console.log("---------------");
		// console.log(this.flag[0]);
		// console.log(this.flag[1]);
		// console.log(this.flag[2]);
		// console.log(this.flag[3]);
		this.showNum();
		this.gameOver();
	}

	Game2048.prototype.moveDowm = function() {
		console.log("Start to move down...");
		var m = 3;
		while (m > 0) {
			for (var i = 3; i > 0; i--) {
				for (var j = 0; j < 4; j++) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i - 1][j] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i - 1][j];
						this.gameGrid[i - 1][j] = 0;
						this.slide = true;
					}
				}
			}
			m--;
		}

		for (var i = 3; i > 0; i--) {
			for (var j = 0; j < 4; j++) {
				if (this.gameGrid[i][j] != 0 && this.gameGrid[i][j] == this.gameGrid[i - 1][j]) {
					this.gameGrid[i][j] *= 2;
					this.scoreAdd = this.gameGrid[i][j];
					this.gameGrid[i - 1][j] = 0;
					this.slide = true;
					this.flag[i][j] = 1;
					this.score += this.scoreAdd;
					console.log("The score is " + this.score + " now!");
				}
			}
		}

		for (var j = 0; j < 4; j++) {
			for (var n = 0; n < 2; n++) {
				for (var i = 3; i > 0; i--) {
					if (this.gameGrid[i][j] == 0 && this.gameGrid[i - 1][j] != 0) {
						this.gameGrid[i][j] = this.gameGrid[i - 1][j];
						this.gameGrid[i - 1][j] = 0;
						if (this.flag[i - 1][j] == 1) {
							this.flag[i][j] = 1;
							this.flag[i - 1][j] = 0;
						}
					}
				}
			}
		}

		if (this.slide) {
			this.randomNum();
			this.slide = false;
		}
		// console.log(this.gameGrid[0]);
		// console.log(this.gameGrid[1]);
		// console.log(this.gameGrid[2]);
		// console.log(this.gameGrid[3]);
		// console.log("---------------");
		// console.log(this.flag[0]);
		// console.log(this.flag[1]);
		// console.log(this.flag[2]);
		// console.log(this.flag[3]);
		this.showNum();
		this.gameOver();
	}

	Game2048.prototype.gameOver = function() {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (this.gameGrid[i][j] == 2048) {
					alert("You win the Game2048!");
					break;
				}
			}
		}

		var xCount = 0;
		var yCount = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 3; j++) {
				if ((this.gameGrid[i][j] != 0) && (this.gameGrid[i][j + 1] != 0) && (this.gameGrid[i][j] != this.gameGrid[i][j + 1])) {
					xCount++;
				}
			}
		}

		for (var j = 0; j < 4; j++) {
			for (var i = 0; i < 3; i++) {
				if ((this.gameGrid[i][j] != 0) && (this.gameGrid[i + 1][j] != 0) && (this.gameGrid[i][j] != this.gameGrid[i + 1][j])) {
					yCount++;
				}
			}
		}

		if (xCount == 12 && yCount == 12) {
			alert("Game Over! Please click the \"Restart\" button to restart the Game2048!")
		}
	}

	var game = new Game2048();
	game.init();
	game.touchOrKeypress();
	$('#game_restart').click(function() {
		game.restartInit();
		game.init();
	})

})