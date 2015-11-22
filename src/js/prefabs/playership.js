/* global Phaser, Bullet, messageState */
var cursorKeys;
var keyRotateClockwise;
var keyRotateAntiClockwise;

var PlayerShip = function (game, x, y, key) {
	
	//call base constructor
	Phaser.Sprite.call(this, game, x, y, key);
	
	//create the bullet group
	this.bulletGroup = this.game.add.group();
	
	//set pivot point
	this.anchor.setTo(0.5, 0.5);
	
	//setup physics information
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(1000);
	this.body.angularDrag = 1000;
	this.body.maxVelocity.set(400);
	this.body.maxAngular = 200;
	this.body.collideWorldBounds = true;
	
	//Setup bullet timing information
	this.lastBulletShotAt = -10000;
	this.SHOT_DELAY = 100;
	
	//setup input keys
	cursorKeys = this.game.input.keyboard.createCursorKeys();
	keyRotateClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	keyRotateAntiClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
};

PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
PlayerShip.prototype.constructor = PlayerShip;

PlayerShip.prototype.update = function () {
	//handle bullet firing
	if (this.game.time.now - this.lastBulletShotAt > this.SHOT_DELAY)
	{
		this.lastBulletShotAt = this.game.time.now;
		this.fireBullet();
	}
	
	if (keyRotateClockwise.isDown || messageState.cw) {
		this.body.angularAcceleration = 400;
	} else if (keyRotateAntiClockwise.isDown || messageState.ccw) {
		this.body.angularAcceleration = -400;
	} else {
		this.body.angularAcceleration = 0;
	}
	
	var vertical = true;
	var pv = new Phaser.Point(0, 0);
	if (cursorKeys.up.isDown || messageState.up) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation, 600);
	} else if (cursorKeys.down.isDown || messageState.down) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation, -600);
	} else {
		vertical = false;
	}

	var horizontal = true;
	var ph = new Phaser.Point(0, 0);
	if (cursorKeys.left.isDown || messageState.left) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation + this.game.math.degToRad(90), -600);
	} else if (cursorKeys.right.isDown || messageState.right) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation + this.game.math.degToRad(90), 600);
	} else {
		horizontal = false;
	}

	if (!horizontal && !vertical) {
		this.body.acceleration.set(0);
	} else {
		var pFinal = Phaser.Point.add(ph, pv);
		this.body.acceleration.set(pFinal.x, pFinal.y);
	}
};

PlayerShip.prototype.fireBullet = function () {
	//Get the first dead bullet
	var bullet = this.bulletGroup.getFirstDead();
	
	//If there aren't any available, create a new one
	if (bullet === null) {
		//create a new bullet
		bullet = new Bullet(this.game, 'bullet-1');
		
		//add bullet to bullet group
		this.bulletGroup.add(bullet);
		
		//Enable physics for the bullet
		//this.game.physics.arcade.enableBody(bullet);
	}
	
	//We revive the selected missile
	bullet.revive();
	
	//Enable checking for bullet outside of world bounds
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
	
	//And move it to it's initial coordinates
	bullet.reset(this.x, this.y);
	
	//Shoot it
	bullet.fire(this.rotation);
};