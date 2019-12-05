function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

var can, ctx, $can;

var conf = {
	groundHeight: 4,
	waterHeight: 4,
	gravity: 1.5,
	tileSide: 60,
	worldColor: "#D0F4F7",
	cloudDensity: 22, // No of Clouds in 500 px
	cloudTopRange: [0, 90],
	cloudWidth: 128,
	cloudHeight: 71,
	enemySide: 50,
	maxGameSpeed: 17,
	minPlayerLeftIncrement: 3,
	minPlayerRightIncrement: 1,
	tileType: "ground",
}

var tileImages = {
	underGround: "underGroundTile.png",
	ground: "groundTile.png",	
	underWater: "underWaterTile.png",	
	water: "waterTile.png",	
};
var playerImages = {
	1: "p1.png",
	2: "p2.png",
	3: "p3.png",
	4: "p4.png",
	5: "p5.png",
	6: "p6.png",
	7: "p7.png",
	8: "p8.png",
	9: "p9.png",
	10: "p1.png",
	11: "p1.png",
};
var cloudImages = {
	1: "cloud1.png",	
	2: "cloud2.png",	
	3: "cloud3.png",		
};
var enemyImages = {
	1: "enemy1.png",	
	2: "enemy2.png",	
	3: "enemy3.png",		
};

var totalLoadCount = Object.keys(tileImages).length + Object.keys(playerImages).length + Object.keys(enemyImages).length + Object.keys(cloudImages).length, totalLoaded = 0;



function Tile(type, x, side){
	this.type = type || "ground";
	this.side = side || conf.tileSide;
	this.x = x;	
}

Tile.prototype.draw = function() {
	var tile, underTile, height;
	
	if(this.type == "water"){
		tile = tileImages.water;
		underTile = tileImages.underWater;
		height = conf.waterHeight;
	}else{
		tile = tileImages.ground;
		underTile = tileImages.underGround;
		height = conf.groundHeight;
	}

	for(var i = 0; i < height; i++){			
		ctx.drawImage(underTile, this.x, can.height - (i*this.side), this.side, this.side);
	}	

	ctx.drawImage(tile, this.x, can.height - ((height)*this.side), this.side, this.side);
}

Tile.prototype.move = function(){
	if(this.x < -this.side){
		var maxX = 0;
		var l = tiles.length;
		while(l--){
			if(tiles[l].x > maxX){
				maxX = tiles[l].x;
			}
		}
		this.x = maxX + this.side - player.gameSpeed;
	}else{
		this.x -= player.gameSpeed;
	}
}


function Cloud(type, x, y, speed, width, height){

	this.type = type;
	this.x = x;
	this.y = y;
	this.width = width || conf.cloudWidth;
	this.height = height || conf.cloudHeight;
	this.speed = speed;
}

Cloud.prototype.draw = function(){
	ctx.drawImage(this.type, this.x, this.y, this.width, this.height);
}

Cloud.prototype.move = function(){
	if(this.x < -this.width){
		var maxX = 0;
		var l = clouds.length;
		while(l--){
			if(clouds[l].x > maxX){
				maxX = clouds[l].x;
			}
		}
		this.x = maxX + this.width - this.speed;
	}else{
		this.x -= this.speed;
	}

}
var clouds = [];


function Enemy(type, orientation, length, x, y, side){
	this.type = type;
	this.orientation = orientation;
	this.length = length;
	this.x = x;
	this.y = y;
	this.side = side || conf.enemySide;
}

Enemy.prototype.draw = function(){
	if(this.orientation == "horizontal"){
		for(var i = 0; i < this.length; i++){
			ctx.drawImage(this.type, this.x + (this.side * i), this.y, this.side, this.side);			
		}	
	}else{
		for(var i = 0; i < this.length; i++){
			ctx.drawImage(this.type, this.x, this.y - (this.side * i), this.side, this.side);			
		}	
	}
}

Enemy.prototype.move = function(){	
	var i = enemies.indexOf(this);
	if(this.orientation == "horizontal"){
		if(this.x < -this.side * this.length){
			enemies.splice(i, 1);
		}else{
			this.x -= player.gameSpeed;
		}
	}else{
		if(this.x < -this.side){
			enemies.splice(i, 1);
		}else{
			this.x -= player.gameSpeed;
		}		
	}
}

var enemies = [];

var initPlayerSettings = {
	gameSpeed: 6,
	movementSpeed: 5,
	leftIncrement: 8,
	rightIncrement: 8,			
	bounceSpeed: 26,	
}

var player = {
	gameSpeed: 0,
	movementSpeed: 0,
	leftIncrement: 0,
	rightIncrement: 0,			
	bounceSpeed: 0,
	minX: 0,
	maxX: 0,
	x: 0,
	y: 0,
	groundLevel: 0,
	currentSprite: 1,
	time: 0,
	width: 72,
	height: 97,
	inMotion: false,
	movingTo: 0,
	inBounce: false,
	ySpeed: 0,
	setup: function(){
		this.gameSpeed = initPlayerSettings.gameSpeed;
		this.movementSpeed = initPlayerSettings.movementSpeed;
		this.leftIncrement = initPlayerSettings.leftIncrement;
		this.rightIncrement = initPlayerSettings.rightIncrement;			
		this.bounceSpeed = initPlayerSettings.bounceSpeed;

		this.minX = can.width * 3/10 - (this.width / 2);
		this.maxX = can.width * 7/10 - (this.width / 2);
		this.x = can.width / 2 - (this.width / 2);
		this.y = can.height - ((conf.groundHeight+1) * conf.tileSide) - 30;
		this.groundLevel = can.height - ((conf.groundHeight+1) * conf.tileSide) - 30;
	},
	draw: function(){
		this.time++;
		if(player.time >= 35/player.gameSpeed){
			player.currentSprite++;

			if(player.currentSprite == 11){
				player.currentSprite = 1;
			}
			player.time = 0;
		}

		if(player.inMotion){
			if(player.x < player.movingTo && player.x + player.movementSpeed <= player.movingTo){
				player.x += player.movementSpeed;
			}else if(player.x > player.movingTo && player.x - player.movementSpeed >= player.movingTo){
				player.x -= player.movementSpeed;
			}else{
				player.inMotion = false;
			}
		}

		if(player.inBounce){
			if(player.y - player.ySpeed < player.groundLevel){
				player.ySpeed -= conf.gravity;
				player.y -= player.ySpeed;
			}else if(player.y < player.groundLevel){
				player.y = player.groundLevel;
				player.inBounce = false;
			}else{
				player.y = player.groundLevel;
				player.inBounce = false;
			}
		}

		ctx.drawImage(playerImages[player.currentSprite], player.x, player.y, this.width, this.height);	

	}, 
	move: function(where){
		if(where === "left"){
			if(player.x - player.leftIncrement > player.minX){
				player.x -= player.leftIncrement;
			}
		}else if(where === "right"){
			if(player.x + player.rightIncrement < player.maxX){
				player.x += player.rightIncrement;
			}
		}else if(where == "up" && !player.inBounce){
			player.ySpeed = player.bounceSpeed;
			player.y--;
			player.inBounce = true;
		}else if(where == "down" && player.inBounce){
			if(Math.sign(player.speed) === -1){
				player.ySpeed *= 20;
			}else if(Math.sign(player.speed) === 1){
				player.ySpeed *= -20
			}else{
				player.ySpeed = -20;
			}
		}
	}, 
	checkCollision: function(){
		var l = enemies.length;
		var hasCollided = false;
		while(l--){
			var e = enemies[l];
			if(e.orientation == "horizontal"){
				if(player.x + player.width - 8 >= e.x && player.x <= e.x + (e.side * e.length) && player.y >= e.y - e.side){
					hasCollided = true;
					break;
				}
			}else{
				if(player.x + player.width - 8 >= e.x && player.x <= e.x + e.side  && player.y >= e.y - (e.side * e.length) ){
					hasCollided = true;
					break;
				}
			}
		}
		return hasCollided;
	}

}


var tiles = [];
var lastEnemy = 0;

var game = {	
	status: false,
	score: 0,
	timeStarted: 0,
	animationId: 0,
	setWorldSize: function(){
		can.height = window.innerHeight;
		can.width = window.innerWidth;						
	},
	loadImagesFromObject: function(obj){
		var loaders = {};
		var url = "";
		for(img in obj){			
			loaders[img] = new Image();
			$(loaders[img]).load(function(){
				var that = this;
				for(item in obj){
					if(obj[item] == that.src.substr(that.src.lastIndexOf("/") + 1)){
						obj[item] = that;
						totalLoaded++;
						$("#load-bar-prog").width((totalLoaded/totalLoadCount*100)+"%")
						if(totalLoaded == totalLoadCount){

							game.init();

							$("#load-bar-base").animate({
								"opacity": "0"
							}, 400);
							setTimeout(function(){
								$("#load-bar-base").css("display","none")
								$("#load-head").text("Runnr");
								$("#start-btn").css("display","block").animate({
									"opacity": "1"
								}, 400);
							}, 400);
						}
						break;
					}
				}
			});
			loaders[img].src = "IMG/"+obj[img];
		}
	},
	loadAssets: function(){
		this.loadImagesFromObject(tileImages);
		this.loadImagesFromObject(playerImages);
		this.loadImagesFromObject(cloudImages);
		this.loadImagesFromObject(enemyImages);
	},
	init: function(){

		player.setup();

		tiles = [];
		clouds = [];
		enemies = [];

		game.score = 0;

		var nos = (can.width / conf.tileSide) + 2;		
		for(var i = 0; i < nos; i++){	
			tiles.push(new Tile(conf.tileType, i*conf.tileSide, conf.tileSide));
		}

		nos = conf.cloudDensity * can.width/500;

		for(var i = 0; i < nos; i++){
			var ch = rand(1, 3);
			var denom = rand(2, 5);
			clouds.push(new Cloud(cloudImages[ch], rand(0, can.width), rand(conf.cloudTopRange[0], conf.cloudTopRange[1]), player.gameSpeed / denom));
		}

		clouds.push(new Cloud(cloudImages[1], can.width + conf.cloudWidth, conf.cloudTopRange[0]));


	},
	animate: function(){
		ctx.fillStyle = conf.worldColor;
		ctx.fillRect(0, 0, can.width, can.height);
		var l = tiles.length;
		var scoreMultiplier = 1;

		while(l--){
			tiles[l].draw();
			tiles[l].move();
		}

		var l = clouds.length;
		while(l--){
			clouds[l].draw();			
			clouds[l].move();						
		}

		var l = enemies.length;
		while(l--){
			enemies[l].draw();			
			enemies[l].move();						
		}

		player.draw();
		
		var timePassed = Date.now() - game.timeStarted;

		if(player.checkCollision()){
			game.over();
		}		
		
		var randomizer;			

		if(timePassed > 12000){
			randomizer = rand(-155, -100);
			scoreMultiplier = 1.2;
		}else if(timePassed > 30000){
			randomizer = rand(-210, -140);	
			scoreMultiplier = 1.6;
		}else if(timePassed > 60000){
			randomizer = rand(-280, -190);
			scoreMultiplier = 1.9;
		}else{
			randomizer = rand(-100, 0);				
		}		

		if(lastEnemy >= (710 + randomizer)/player.gameSpeed){
			var ch = rand(1, 3);
			var change = rand(-10, 10);
			side = conf.enemySide + change;
			var y = can.height - ((conf.groundHeight) * conf.tileSide) - side;			

			var ori = rand(1, 2);
			var len = rand(1, 3);
			
			if(ori == 1){
				ori = "horizontal";
			}else{
				ori = "vertical";				
			}

			enemies.push(new Enemy(enemyImages[ch], ori, len, can.width + side * len, y, side));
			lastEnemy = 0;
		}else{
			lastEnemy++;
		}			

		if(timePassed > 15000 && player.gameSpeed < conf.maxGameSpeed){
			player.gameSpeed += 0.005;
			if(player.rightIncrement >= conf.minPlayerRightIncrement){
				player.rightIncrement -= 0.0035;
			}else{
				player.rightIncrement = conf.minPlayerRightIncrement;
			}
			if(player.rightIncrement >= conf.minPlayerRightIncrement){
				player.rightIncrement -= 0.0035;
			}else{
				player.rightIncrement = conf.minPlayerRightIncrement;
			}				
				
		}


		if(game.status){
			game.score = timePassed/1000;			
			game.score *= scoreMultiplier;
			game.score = Math.round(game.score * 10) / 10;

			$(".game-sidebar-stat-score .game-sidebar-stat-data").text((game.score));
			requestAnimationFrame(game.animate);
		}				
		

	},
	start: function(){
		$("#load-screen, #screen-score").animate({
			"opacity": "0"
		}, 400);
		$(".game-sidebar").css("display", "block").animate({
			"opacity": "1"
		}, 400);
		game.status = true;
		setTimeout(function(){			
			$("#load-screen").css({
				"display": "none",
				"background-color": "rgba(79,166,255, 0.8)",
			});
			$("#screen-score").css("display", "none");
			game.timeStarted = Date.now();
			game.animationId = requestAnimationFrame(game.animate);
		}, 400);

	},
	setup: function(){
		$can = $("<canvas id='game-world'></canvas>");
		$("body").append($can);
		can = $can[0];
		ctx = can.getContext("2d");
		this.setWorldSize();		
		this.loadAssets();				
	},
	over: function(){
		game.status = false;
		$("#game-score-stat").text(game.score);
		$("#screen-score").css("display", "block").animate({
			"opacity": "1"
		}, 400);

		$("#load-head").text("Game Over!");
		$("#start-btn").text("Play again");

		$(".game-sidebar").animate({
			"opacity": "0"
		}, 400);
		setTimeout(function(){			
			$(".game-sidebar").css({
				"display": "none",				
			});
		}, 400);

		$("#load-screen").css("display","block").animate({
			"opacity": "1"
		}, 400);

		game.init();
	}
}

$(document).ready(function(){

	game.setup();

	$("#start-btn").click(function(){
		if(!game.status){
			game.start();
		}
	});

	$(".game-sidebar-act-end").click(function(){
		if(game.status){
			game.start();
		}
	});
	
	var leftIntr = false, rightIntr = false;

	$(document).on("keyup", function(e){
		if(e.keyCode == 37){
			if(leftIntr !== false){
				clearInterval(leftIntr);
				leftIntr = false;
			}
		}
		if(e.keyCode == 39){
			if(rightIntr !== false){
				clearInterval(rightIntr);
				rightIntr = false;
			}
		}
	});

	$(document).on("keydown", function(e){
		if(e.keyCode == 37){
			if(leftIntr === false){
				leftIntr = setInterval(function(){
					player.move("left");					
				}, 17);
			}
		}
		if(e.keyCode == 39){
			if(rightIntr === false){
				rightIntr = setInterval(function(){
					player.move("right");					
				}, 17);
			}
		}

		if(e.keyCode == 38){
			player.move("up");			
		}
		if(e.keyCode == 40){
			player.move("down");			
		}

	});

});