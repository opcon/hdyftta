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
      // this.input.onDown.add(this.onInputDown, this);

      this.shipSprite = this.add.sprite(this.game.width * 0.5, this.game.height * 0.5, 'player-ship-1');
      this.shipSprite.anchor.setTo(0.5, 0.5);

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);

      this.shipSprite.body.drag.set(1000);
      this.shipSprite.body.maxVelocity.set(400);

      this.key_left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.key_down = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      this.key_clockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
      this.key_anticlockwise = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);

      window.airConsole.onMessage = this.messageRecieved;
    },

    update: function () {
      if (this.key_clockwise.isDown || messageState.cw) {
        this.shipSprite.body.angularVelocity = 200;
      } else if (this.key_anticlockwise.isDown || messageState.ccw) {
        this.shipSprite.body.angularVelocity = -200;
      } else {
        this.shipSprite.body.angularVelocity = 0;
      }

      var vertical = true;
      var pv = new Phaser.Point(0,0);
      if (this.key_up.isDown || messageState.up) {
        pv = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation-this.game.math.degToRad(90), 600);
      } else if (this.key_down.isDown || messageState.down) {
        pv = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation-this.game.math.degToRad(90), -600);
      } else {
        vertical = false;
      }

      var horizontal = true;
      var ph = new Phaser.Point(0,0);
      if (this.key_left.isDown || messageState.left) {
        ph = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, -600);
      } else if (this.key_right.isDown || messageState.right) {
        ph = this.game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, 600);
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

    // onInputDown: function () {
    //   this.game.state.start('menu');
    // },

    messageRecieved: function(from, data) {
      if (from === 1) {
        if (data.key === 'left') {
          messageState.left = data.pressed;
        }
        if (data.key === 'right') {
          messageState.right = data.pressed;
        }
      }
      if (from === 2) {
        if (data.key === 'left') {
          messageState.up = data.pressed;
        }
        if (data.key === 'right') {
          messageState.down = data.pressed;
        }
      }
      if (from === 3) {
        if (data.key === 'left') {
          messageState.ccw = data.pressed;
        }
        if (data.key === 'right') {
          messageState.cw = data.pressed;
        }
      }
      console.log(phaserLeft);
      console.log(from);
      console.log(data);
    }
  };

  window['airconsole-test'] = window['airconsole-test'] || {};
  window['airconsole-test'].Game = Game;
}());

var phaserLeft = false;
var messageState = {
  left:false,
  right:false,
  up:false,
  down:false,
  cw:false,
  ccw:false
}