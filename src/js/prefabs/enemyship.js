/* global ShipBase */
var EnemyShip = function (game, x, y, key, player, weapon) {
	ShipBase.call(this, game, x, y, key, weapon);

	this.playerShip = player;
	
	this.body.maxVelocity.set(250);

	this.TURN_RATE = 5;
	this.ACCELERATION = 400;
	this.BASE_TARGETING_ERROR = Math.PI / 4;
	this.AVOID_DISTANCE = 100;
	
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
	
	this.rotateToPlayer();
	
	this.move();
};

EnemyShip.prototype.rotateToPlayer = function () {
	var targetAngle = this.game.math.angleBetween(
		this.x, this.y,
		this.playerShip.x, this.playerShip.y
	);
	
	//We want to avoid other enemy ships
	var avoidAngle = 0;
    this.parent.forEachAlive(function(s) {
        // Don't calculate anything if the other ship is me
        if (this === s) {return;}

        // Already found an avoidAngle so skip the rest
        if (avoidAngle !== 0) {return;}

        // Calculate the distance between me and the other ship
        var distance = this.game.math.distance(this.x, this.y, s.x, s.y);

        // If the ship is too close...
        if (distance < this.AVOID_DISTANCE) {
            // Chose an avoidance angle of 90 or -90 (in radians)
            avoidAngle = Math.PI/2; // zig
            if (this.game.rnd.between(0,1)) {avoidAngle *= -1;} // zag
        }
    }, this);
	
	targetAngle += avoidAngle;
	
	if (Math.abs(this.rotation - targetAngle) > this.targetingError) {
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
};

EnemyShip.prototype.move = function () {
	this.body.acceleration.x = Math.cos(this.rotation) * this.ACCELERATION;
	this.body.acceleration.y = Math.sin(this.rotation) * this.ACCELERATION;
};

EnemyShip.prototype.onDeath = function () {};
EnemyShip.prototype.respawn = function () {};

EnemyShip.prototype.spawn = function (x, y) {
	this.preSpawnLogic();
	this.reset(x, y, this.maxHealth);
};

EnemyShip.prototype.preSpawnLogic = function () {
	this.targetingError = this.BASE_TARGETING_ERROR * this.game.rnd.realInRange(0.5,1.5);
};