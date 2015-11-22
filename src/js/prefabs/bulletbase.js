var BulletBase = function (game, key) {
	//call base constructor
	Phaser.Sprite.call(this, game, 0, 0, key);
	
	this.BULLET_SPEED = 700;
	this.BULLET_DAMAGE = 34;
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(0);
	
	//set the anchor point
	this.anchor.setTo(0, 0.5);
};

BulletBase.prototype = Object.create(Phaser.Sprite.prototype);
BulletBase.prototype.constructor = BulletBase;

BulletBase._fireBullet = function (x, y, rotation, bullet, speed)
{
	if (speed === undefined) {speed = bullet.BULLET_SPEED;}

	bullet.rotation = rotation;
	
	this.body.velocity.x = Math.cos(this.rotation) * speed;
	this.body.velocity.y = Math.sin(this.rotation) * speed;
};

var LaserBullet = function (game, key) {
	//Call base constructor
	BulletBase.call(this, game, key);
	LaserBullet.bulletPool = LaserBullet.bulletPool || game.add.group();
};

LaserBullet.prototype = Object.create(BulletBase.prototype);
LaserBullet.prototype.constructor = LaserBullet;

LaserBullet.prototype.fire = function () {
	
};