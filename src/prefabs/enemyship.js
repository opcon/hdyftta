var EnemyShip = function (game, x, y, key, player) {
	Phaser.Sprite.call(this, game, x, y, key);
	
	this.playerShip = player;
	
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(1000);
	this.body.angularDrag = 1000;
	this.body.maxVelocity.set(400);
	this.body.maxAngular = 200;
	this.body.collideWorldBounds = false;
	
	this.SPEED = 250;
	this.TURN_RATE = 5;
};

EnemyShip.prototype = Object.create(Phaser.Sprite.prototype);
EnemyShip.prototype.constructor = EnemyShip;

EnemyShip.prototype.update = function () {
	var targetAngle = this.game.math.angleBetween(
		this.x, this.y,
		this.playerShip.x, this.playerShip.y
	) + Math.PI / 2;
	
	if (this.rotation !== targetAngle) {
		var delta = targetAngle - this.rotation;
		
		if (delta > Math.PI) delta -= Math.Pi * 2;
		if (delta < -Math.PI) delta += Math.PI * 2;
		
		if (delta > 0) {
			this.angle += this.TURN_RATE;
		} else {
			this.angle -= this.TURN_RATE;
		}
		
		if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
			this.rotation = targetAngle;
		}
	}
	
	this.body.velocity.x = Math.cos(this.rotation - Math.PI / 2) * this.SPEED;
	this.body.velocity.y = Math.sin(this.rotation - Math.PI / 2) * this.SPEED;
};