/* global EnemyShip, QuadLaser */

var EnemyDirector = function (game, playerShip) {
	this.game = game;
	this.playerShip = playerShip;
	this.enemyPool = game.add.group();
	
	this.ENEMY_SPAWN_DELAY = 2000;
	
	this.lastSpawnTime = -10000;
	
	this.enemyKey = 'enemy-ship-1';
	
	this.SPAWN_PADDING = 50;
};

EnemyDirector.prototype.update = function () {
	if (this.game.time.now - this.lastSpawnTime > this.ENEMY_SPAWN_DELAY) {
		this.spawnEnemy();
		this.lastSpawnTime = this.game.time.now - this.game.rnd.frac() * this.ENEMY_SPAWN_DELAY;
	}
	
	this.enemyPool.forEachAlive(function (e) {
		this.game.world.wrap(e);
	}, this);
};

EnemyDirector.prototype.spawnEnemy = function () {
	var enemy = null;
	
	console.log(this.enemyPool.countDead() + this.enemyPool.countLiving());
	//Get the first dead enemy matching the key
	this.enemyPool.forEachDead(function (e) {
		if (e.key == this.enemyKey) {enemy = e;}
	}, this);
	
	//If there aren't any available, create a new one
	if (enemy === null) {
		var enemyWeapon = new QuadLaser(this.game, 'bullet-2');
		enemyWeapon.FIRING_DELAY = 600;
		enemyWeapon.BULLET_SPEED = 500;
		enemy = this.createEnemy(enemyWeapon);
	}
	
	var hor = this.game.rnd.integerInRange(0, 3);
	switch (hor) {
		case 0:
			//top
			enemy.spawn(this.game.rnd.frac()*(this.game.width - this.SPAWN_PADDING) + this.SPAWN_PADDING,
				this.SPAWN_PADDING);
			break;
		case 1:
			//right
			enemy.spawn(this.game.width - this.SPAWN_PADDING,
				this.game.rnd.frac()*(this.game.height - this.SPAWN_PADDING) + this.SPAWN_PADDING);
			break;
		case 2:
			//bottom
			enemy.spawn(this.game.rnd.frac()*(this.game.width - this.SPAWN_PADDING) + this.SPAWN_PADDING,
				this.game.height - this.SPAWN_PADDING);
			break;
		case 3:
			//left
			enemy.spawn(this.SPAWN_PADDING,
				this.game.rnd.frac()*(this.game.height - this.SPAWN_PADDING) + this.SPAWN_PADDING);
			break;
		default:
			break;
	}

};

EnemyDirector.prototype.createEnemy = function (weapon) {
	var ret = new EnemyShip(this.game, 
		this.game.width*this.game.rnd.frac(),
	 	this.game.height*this.game.rnd.frac(),
		this.enemyKey,
		this.playerShip,
		weapon);
	
	this.enemyPool.add(ret);
	return ret;	
};

EnemyDirector.prototype.cleanUp = function () {
	
};