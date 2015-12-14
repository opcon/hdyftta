/* global Phaser, PlayerShip, Laser, QuadLaser, EnemyDirector, OctoLaser */
/* exported PlayerControlEnum */

var PlayerControlEnum = {
  ROTATION: 0,
  VERTICAL: 1,
  HORIZONTAL: 2
};

(function() {
  'use strict';

  function Game() {
  }

  Game.prototype = {
    create: function () {
      //hook up airconsole
      window.airConsoleHelper.setup();
      
      //start the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      
      //create the player ship
      this.playerWeapon = new OctoLaser(this, 'bullet-1');
      this.playerShip = new PlayerShip(this.game, this.game.width * 0.5, this.game.height * 0.5,
       'player-ship-1', this.playerWeapon, window.airConsoleHelper, 0);
      this.add.existing(this.playerShip);
      
      this.enemyDirector = new EnemyDirector(this.game, this.playerShip);
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
      if (ship === undefined || bullet === undefined) {return;}
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
  };

  window['airconsole-test'] = window['airconsole-test'] || {};
  window['airconsole-test'].Game = Game;
}());