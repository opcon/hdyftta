/* global Bullet */
var WeaponBase = function(game) {
	this.game = game;
	
	//Weapon timing information
	this.FIRING_DELAY = 100;
	this.lastBulletShotAt = -10000;
	this.BULLET_SPEED = 700;
};

WeaponBase.prototype.canFire = function () {
	return (this.game.time.now - this.lastBulletShotAt > this.FIRING_DELAY);	
};

var Laser = function(game, key) {
	WeaponBase.call(this, game);
	Laser.bulletPool = (Laser.bulletPool === undefined) ? game.add.group() : Laser.bulletPool;
	this.key = key;
};

Laser.prototype = Object.create(WeaponBase.prototype);
Laser.prototype.constructor = Laser;


Laser.prototype.fire = function () {
	if (!this.canFire()) {return;}
	
	this.lastBulletShotAt = this.game.time.now;
	
	var bullet = null;
	//Get the first dead bullet matching the key
	Laser.bulletPool.forEachDead(function(b) {
		if (b.key === this.key) {bullet = b;}
	});
	
	//If there aren't any available, create a new one
	if (bullet === null) {
		//create a new bullet
		bullet = new Bullet(this.game, this.key, this.parentShip, this.BULLET_SPEED);
		
		//add bullet to bullet group
		Laser.bulletPool.add(bullet);
	}
	
	//We revive the selected bullet
	bullet.revive();
	
	//Enable checking for bullet outside of world bounds
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
	
	//And move it to it's initial coordinates
	bullet.reset(this.parentShip.x, this.parentShip.y);
	
	//Shoot it
	bullet.fire(this.parentShip.rotation);
};