/* global ShipBase */
var EnemyShip = function (game, x, y, key, player, weapon) {
	ShipBase.call(this, game, x, y, key, weapon);

	this.playerShip = player;
	
	this.body.maxVelocity.set(250);

	this.TURN_RATE = 5;
	this.ACCELERATION = 400;
	
	//Alter ship collision properties for enemy ships
	//Have smaller impact on other ship's movement
	this.SHIP_COLLISION_VELOCITY = 100;
	//Do less damage to other ship
	this.SHIP_COLLISION_DAMAGE = 20;
};

EnemyShip.prototype = Object.create(ShipBase.prototype);
EnemyShip.prototype.constructor = EnemyShip;

EnemyShip.prototype.update = function () {
	if (!this.alive) {return;}
	
	//handle weapon firing
	this.weapon.fire();
	
	var targetAngle = this.game.math.angleBetween(
		this.x, this.y,
		this.playerShip.x, this.playerShip.y
	);
	
	if (this.rotation !== targetAngle) {
		var delta = targetAngle - this.rotation;
		
		if (delta > Math.PI) { delta -= Math.Pi * 2; }
		if (delta < -Math.PI) { delta += Math.PI * 2; }
		
		if (delta > 0) {
			this.angle += this.TURN_RATE;
		} else {
			this.angle -= this.TURN_RATE;
		}
		
		if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
			this.rotation = targetAngle;
		}
	}
	
	this.body.acceleration.x = Math.cos(this.rotation) * this.ACCELERATION;
	this.body.acceleration.y = Math.sin(this.rotation) * this.ACCELERATION;
};

EnemyShip.prototype.preSpawnLogic = function () {
	this.startX = Math.random() * this.game.width;
	this.startY = Math.random() * this.game.height;
};