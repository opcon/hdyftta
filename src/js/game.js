/* global Phaser, PlayerShip, Laser, QuadLaser, EnemyDirector */

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
      this.playerWeapon = new OctoLaser(this, 'bullet-1');
      // this.playerWeapon.DIRECTIONS = 32;
      this.playerShip = new PlayerShip(this.game, this.game.width * 0.5, this.game.height * 0.5,
       'player-ship-1', this.playerWeapon);
      this.add.existing(this.playerShip);
      
      // //create the enemy ship
      // this.enemyWeapon = new QuadLaser(this, 'bullet-2');
      // this.enemyWeapon.FIRING_DELAY = 700;
      // this.enemyWeapon.BULLET_SPEED = 500;
      // this.enemyShip = new EnemyShip(this.game, this.game.width*0.5 - 300, this.game.height * 0.5 + 250,
      //  'enemy-ship-1', this.playerShip, this.enemyWeapon);
      // this.add.existing(this.enemyShip);
      
      this.enemyDirector = new EnemyDirector(this.game, this.playerShip);
      
      //hook up airconsole
      window.airConsole.onMessage = this.messageRecieved;
    },

    update: function () {
      this.world.wrap(this.playerShip, 0);
      // this.world.wrap(this.enemyShip, 0, true);
      
      //collide player ship with bullets
      this.game.physics.arcade.overlap(this.playerShip, 
      Laser.bulletPool, this.onShipBulletCollision);
      
      //collide enemy ships with bullets
      if (Laser.bulletPool !== undefined) {
        this.game.physics.arcade.overlap(this.enemyDirector.enemyPool, 
        Laser.bulletPool, this.onShipBulletCollision);
      }
      
      //collide enemy ship with player ship
      this.game.physics.arcade.overlap(this.enemyDirector.enemyPool, 
      this.playerShip, this.onShipShipCollision);
      
      this.enemyDirector.update();
    },
    
    onShipBulletCollision: function(ship, bullet)
    {
      if (ship === undefined || bullet === undefined) return;
      if (!ship.invulnerable) {ship.onHit(bullet);}
      bullet.onHit(ship);
    },
    
    onShipShipCollision: function(ship1, ship2)
    {
      if (!ship1.invulnerable) {ship1.onShipCollision(ship2);}
      if (!ship2.invulnerable) {ship2.onShipCollision(ship1);}
    },
    
    render: function() {
      //this.game.debug.body(this.playerShip);
      //this.game.debug.body(this.enemyShip);
    },

    // onInputDown: function () {
    //   this.game.state.start('menu');
    // },

    messageRecieved: function(from, data) {
      if (from === 3) {
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
      if (from === 1) {
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