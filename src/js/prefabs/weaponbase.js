/* global Bullet */
var WeaponBase = function(game, key) {
	this.game = game;
	this.key = key;
	
	//Weapon timing information
	this.FIRING_DELAY = 100;
	this.lastBulletShotAt = -10000;
	this.BULLET_SPEED = 700;
};

WeaponBase.prototype.canFire = function () {
	return (this.game.time.now - this.lastBulletShotAt > this.FIRING_DELAY);	
};

WeaponBase.prototype.fire = function () {
	if (!this.canFire()) {return;}
	this.lastBulletShotAt = this.game.time.now;
	this._fireWeapon();
};

WeaponBase.prototype._fireBullet = function (bulletPool, bulletX, bulletY, bulletRotation) {
	var bullet = null;
	//Get the first dead bullet matching the key
	console.log(bulletPool.countDead() + bulletPool.countLiving());
	bulletPool.forEachDead(function(b) {
		if (b.key == this.key) {bullet = b;}
	}, this);
	
	//If there aren't any available, create a new one
	if (bullet === null) {
		//create a new bullet
		bullet = new Bullet(this.game, this.key, this.parentShip, this.BULLET_SPEED);
		
		//add bullet to bullet group
		bulletPool.add(bullet);
	}
	
	//We revive the selected bullet
	bullet.revive();
	
	//Enable checking for bullet outside of world bounds
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
	
	//And move it to it's initial coordinates
	bullet.reset(bulletX, bulletY);
	
	//Shoot it
	bullet.fire(bulletRotation);
};

WeaponBase.prototype._fireWeapon = function () {};

var Laser = function(game, key) {
	WeaponBase.call(this, game, key);
	Laser.bulletPool = (Laser.bulletPool === undefined) ? game.add.group() : Laser.bulletPool;
};

Laser.prototype = Object.create(WeaponBase.prototype);
Laser.prototype.constructor = Laser;

Laser.prototype._fireWeapon = function () {
	this._fireBullet(Laser.bulletPool, this.parentShip.x, this.parentShip.y, this.parentShip.rotation);
};

var QuadLaser = function(game, key) {
	Laser.call(this, game, key);
	this.DIRECTIONS = 4;
};

QuadLaser.prototype = Object.create(Laser.prototype);
QuadLaser.prototype.constructor = QuadLaser;

QuadLaser.prototype._fireWeapon = function () {
	for (var i = 0; i < this.DIRECTIONS; i++) {
		this._fireBullet(Laser.bulletPool, this.parentShip.x, this.parentShip.y, 
		this.parentShip.rotation + i * ((this.game.math.PI2) / this.DIRECTIONS));
	}
};

var OctoLaser = function(game, key) {
	QuadLaser.call(this, game, key);
	this.DIRECTIONS = 8;
};

OctoLaser.prototype = Object.create(QuadLaser.prototype);
OctoLaser.prototype.constructor = OctoLaser;