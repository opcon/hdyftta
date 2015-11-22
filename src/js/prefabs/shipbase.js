var ShipBase = function (game, x, y, key) {
	//call base constructor
	Phaser.Sprite.call(this, game, x, y, key);
	
	//setup physics information
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(1000);
	this.body.angularDrag = 1000;
	this.body.maxVelocity.set(400);
	this.body.maxAngular = 200;
	this.body.collideWorldBounds = true;
};

ShipBase.prototype = Object.create(Phaser.Sprite.prototype);
ShipBase.prototype.constructor = ShipBase;

ShipBase.prototype.update = function () {
	
};