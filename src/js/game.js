/* global Phaser, PlayerShip, EnemyShip, Laser */

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
      //start the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      
      //create the player ship
      this.playerWeapon = new Laser(this, 'bullet-1');
      this.playerShip = new PlayerShip(this.game, this.game.width * 0.5, this.game.height * 0.5,
       'player-ship-1', this.playerWeapon);
      this.add.existing(this.playerShip);
      
      //create the enemy ship
      this.enemyWeapon = new Laser(this, 'bullet-2');
      this.enemyWeapon.FIRING_DELAY = 400;
      this.enemyWeapon.BULLET_SPEED = 500;
      this.enemyShip = new EnemyShip(this.game, this.game.width*0.5 - 300, this.game.height * 0.5 + 250,
       'enemy-ship-1', this.playerShip, this.enemyWeapon);
      this.add.existing(this.enemyShip);
      
      //hook up airconsole
      window.airConsole.onMessage = this.messageRecieved;
    },

    update: function () {
      //collide enemy ship with bullets
      this.game.physics.arcade.overlap(this.playerShip, 
      Laser.bulletPool, this.onShipBulletCollision);
      
      //collide player ship with bullets
      this.game.physics.arcade.overlap(this.enemyShip, 
      Laser.bulletPool, this.onShipBulletCollision);
      
      //collide enemy ship with player ship
      this.game.physics.arcade.overlap(this.enemyShip, 
      this.playerShip, this.onShipShipCollision);
    },
    
    onShipBulletCollision: function(ship, bullet)
    {
      ship.onHit(bullet);
    },
    
    onShipShipCollision: function(ship1, ship2)
    {
      ship1.onShipCollision(ship2);
      ship2.onShipCollision(ship1);
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