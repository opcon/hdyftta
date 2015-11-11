(function() {
  'use strict';



  function Game() {
    this.shipSprite;

    this.key_left;
    this.key_right;
    this.key_up;
    this.key_down;
    this.key_clockwise;
    this.key_anticlockwise;
  }

  Game.prototype = {
    create: function () {
      this.input.onDown.add(this.onInputDown, this);

      this.shipSprite = this.add.sprite(this.game.width * 0.5, this.game.height * 0.5, 'player-ship-1');
      this.shipSprite.anchor.setTo(0.5, 0.5);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);

      this.shipSprite.body.drag.set(500);
      this.shipSprite.body.maxVelocity.set(300);

      this.key_left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.key_clockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
      this.key_anticlockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    },

    update: function () {
      if (this.key_clockwise.isDown) {
        this.shipSprite.body.angularVelocity = 200;
      } else if (this.key_anticlockwise.isDown) {
        this.shipSprite.body.angularVelocity = -200;
      } else {
        this.shipSprite.body.angularVelocity = 0;
      }

      var vertical = true;
      var pv = new Phaser.Point(0,0);
      if (this.key_up.isDown) {
        pv = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation-this.game.math.degToRad(90), 300);
      } else if (this.key_down.isDown) {
        pv = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation-this.game.math.degToRad(90), -300);
      } else {
        vertical = false;
      }

      var horizontal = true;
      var ph = new Phaser.Point(0,0);
      if (this.key_left.isDown) {
        ph = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, -300);
      } else if (this.key_right.isDown) {
        ph = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, 300);
      } else {
        horizontal = false;
      }

      if (!horizontal && !vertical) {
        this.shipSprite.body.acceleration.set(0);
      } else {
        var pFinal = Phaser.Point.add(ph, pv);
        this.shipSprite.body.acceleration.set(pFinal.x, pFinal.y);
      }

    },

    onInputDown: function () {
      this.game.state.start('menu');
    }
  };

  window['airconsole-test'] = window['airconsole-test'] || {};
  window['airconsole-test'].Game = Game;
}());

