/* global Phaser, PlayerShip, EnemyShip */

var messageState = {
  left:false,
  right:false,
  up:false,
  down:false,
  cw:false,
  ccw:false
};



(function() {
  'use strict';

  function Game() {
  }

  Game.prototype = {
    create: function () {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      
      var playerShip = new PlayerShip(this.game, this.game.width * 0.5, this.game.height * 0.5, 'player-ship-1');
      this.add.existing(playerShip);
      var enemyShip = new EnemyShip(this.game, 0, 0, 'player-ship-1', playerShip);
      this.add.existing(enemyShip);
      window.airConsole.onMessage = this.messageRecieved;
    },

    update: function () {
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
      console.log(from);
      console.log(data);
    }
  };

  window['airconsole-test'] = window['airconsole-test'] || {};
  window['airconsole-test'].Game = Game;
}());