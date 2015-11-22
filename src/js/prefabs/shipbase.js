var ShipBase = function (game, x, y, key, weapon) {
	//call base constructor
	Phaser.Sprite.call(this, game, x, y, key);
	
	this.startX = x;
	this.startY = y;
	
	//setup physics information
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(1000);
	this.body.angularDrag = 1000;
	this.body.maxVelocity.set(400);
	this.body.maxAngular = 200;
	this.body.collideWorldBounds = true;
	this.ACCELERATION = 600;
	this.ANGULAR_ACCELERATION = 400;
	
	//set pivot point
	this.anchor.setTo(0.5, 0.5);
	
	//Setup bullet timing information
	this.lastBulletShotAt = -10000;
	this.SHOT_DELAY = 100;
	
	//Add weapon
	this.weapon = weapon;
	weapon.parentShip = this;
};

ShipBase.prototype = Object.create(Phaser.Sprite.prototype);
ShipBase.prototype.constructor = ShipBase;

ShipBase.prototype.onHit = function (bullet) {
	if (bullet.parentShip !== this) {this.reset(this.startX, this.startY);}
};

ShipBase.prototype.onShipCollision = function () {
	this.reset(this.startX, this.startY);
};