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
	
	//Setup health information
	this.maxHealth = 100;
	this.health = 100;
	
	//Setup damage information
	this.SHIP_COLLISION_DAMAGE = 50;
	
	//Respawn delay in seconds
	this.RESPAWN_DELAY = 1000;
	
	//Setup death callbacks
	this.events.onKilled.add(this.onDeath, this);
};

ShipBase.prototype = Object.create(Phaser.Sprite.prototype);
ShipBase.prototype.constructor = ShipBase;

ShipBase.prototype.preSpawnLogic = function () {};

ShipBase.prototype.onHit = function (bullet) {
	if (bullet.parentShip !== this) {
		this.damage(bullet.BULLET_DAMAGE);
	}
};

ShipBase.prototype.onShipCollision = function () {
	this.damage(this.SHIP_COLLISION_DAMAGE);
};

ShipBase.prototype.onDeath = function () {
	this.game.time.events.add(this.RESPAWN_DELAY, this.respawn, this);
};

ShipBase.prototype.respawn = function () {
	this.preSpawnLogic();
	this.reset(this.startX, this.startY, this.maxHealth);
};