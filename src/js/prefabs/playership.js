/* global Phaser, messageState, ShipBase */
var cursorKeys;
var keyRotateClockwise;
var keyRotateAntiClockwise;

var PlayerShip = function (game, x, y, key, weapon) {	
	//call base constructor
	ShipBase.call(this, game, x, y, key, weapon);
	
	//setup input keys
	cursorKeys = this.game.input.keyboard.createCursorKeys();
	keyRotateClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	keyRotateAntiClockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
};

PlayerShip.prototype = Object.create(ShipBase.prototype);
PlayerShip.prototype.constructor = PlayerShip;

PlayerShip.prototype.update = function () {
	//handle bullet firing
	this.weapon.fire();
	
	if (keyRotateClockwise.isDown || messageState.cw) {
		this.body.angularAcceleration = this.ANGULAR_ACCELERATION;
	} else if (keyRotateAntiClockwise.isDown || messageState.ccw) {
		this.body.angularAcceleration = -this.ANGULAR_ACCELERATION;
	} else {
		this.body.angularAcceleration = 0;
	}
	
	var vertical = true;
	var pv = new Phaser.Point(0, 0);
	if (cursorKeys.up.isDown || messageState.up) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation, this.ACCELERATION);
	} else if (cursorKeys.down.isDown || messageState.down) {
		pv = this.game.physics.arcade.accelerationFromRotation(this.rotation, -this.ACCELERATION);
	} else {
		vertical = false;
	}

	var horizontal = true;
	var ph = new Phaser.Point(0, 0);
	if (cursorKeys.left.isDown || messageState.left) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation + this.game.math.degToRad(90), -this.ACCELERATION);
	} else if (cursorKeys.right.isDown || messageState.right) {
		ph = this.game.physics.arcade.accelerationFromRotation(this.rotation + this.game.math.degToRad(90), this.ACCELERATION);
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