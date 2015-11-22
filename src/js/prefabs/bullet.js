var Bullet = function (game, key, parentShip, speed, damage) {
	Phaser.Sprite.call(this, game, 0, 0, key);
	this.parentShip = parentShip;
	
	this.BULLET_SPEED = (speed === undefined) ? 700 : speed;
	this.BULLET_DAMAGE = (damage === undefined) ? 34 : damage;
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(0);
	
	//set the anchor point
	this.anchor.setTo(0, 0.5);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (rotation, speed) {
	if (speed === undefined) {speed = this.BULLET_SPEED;}
	
	this.rotation = rotation;
	
	this.body.velocity.x = Math.cos(this.rotation) * speed;
	this.body.velocity.y = Math.sin(this.rotation) * speed;
};