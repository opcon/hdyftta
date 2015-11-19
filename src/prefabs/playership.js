var cursorKeys;
var keyRotateClockwise;
var keyRotateAntiClockwise;

var PlayerShip = function (game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enableBody(this);
	this.body.drag.set(1000);
	this.body.angularDrag = 1000;
	this.body.maxVelocity.set(400);
	this.body.maxAngular = 200;
	this.body.collideWorldBounds = true;
	
	cursorKeys = this.game.input.keyboard.createCursorKeys();
	keyRotateClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	keyRotateAntiClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
};

PlayerShip.prototype = Object.create(Phaser.Sprite.prototype);
PlayerShip.prototype.constructor = PlayerShip;

PlayerShip.prototype.update = function () {
	if (keyRotateClockwise.isDown || messageState.cw) {
		this.body.angularAcceleration = 400;
	} else if (keyRotateAntiClockwise.isDown || messageState.ccw) {
		this.body.angularAcceleration = -400;
	} else {
		this.body.angularAcceleration = 0;
	}
	
	var vertical = true;
	var pv = new Phaser.Point(0, 0);
	if (cursorKeys.up.isDown || messageState.up) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation - this.game.math.degToRad(90), 600);
	} else if (cursorKeys.down.isDown || messageState.down) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation - this.game.math.degToRad(90), -600);
	} else {
		vertical = false;
	}

	var horizontal = true;
	var ph = new Phaser.Point(0, 0);
	if (cursorKeys.left.isDown || messageState.left) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation, -600);
	} else if (cursorKeys.right.isDown || messageState.right) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation, 600);
	} else {
		horizontal = false;
	}

	if (!horizontal && !vertical) {
		this.body.acceleration.set(0);
	} else {
		var pFinal = Phaser.Point.add(ph, pv);
		this.body.acceleration.set(pFinal.x, pFinal.y);
	}
};