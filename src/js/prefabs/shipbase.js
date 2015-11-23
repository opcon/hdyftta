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
	this.invulnerable = false;
	
	//Setup collision information for ship
	this.SHIP_COLLISION_DAMAGE = 50;
	this.SHIP_COLLISION_VELOCITY = 500;
	
	//Setup damage information for this ship
	this.SHIP_DAMAGE_INVULN_TIME = 100;
	
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
		this.onDamage();
	}
};

ShipBase.prototype.onShipCollision = function (ship) {
	this.damage(ship.SHIP_COLLISION_DAMAGE);
	this.game.physics.arcade.velocityFromRotation(
		this.game.math.angleBetweenPoints(this.position, ship.position),
		 -ship.SHIP_COLLISION_VELOCITY, this.body.velocity);
	this.onDamage();
};

ShipBase.prototype.onDamage = function () {
	this.invulnerable = true;
	this.tint = 0xff0000; //DEBUG
	this.game.time.events.add(this.SHIP_DAMAGE_INVULN_TIME, 
		function() {
			this.invulnerable = false;
			this.tint = 0xffffff; //DEBUG 
		}, 
		this);	
};

ShipBase.prototype.onDeath = function () {
	this.game.time.events.add(this.RESPAWN_DELAY, this.respawn, this);
};

ShipBase.prototype.respawn = function () {
	this.preSpawnLogic();
	this.reset(this.startX, this.startY, this.maxHealth);
};