/* global Phaser, PlayerShip, Laser, QuadLaser, EnemyDirector, OctoLaser */

var messageState = {
  left:false,
  right:false,
  up:false,
  down:false,
  cw:false,
  ccw:false
};

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
      //start the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      
      //create the player ship
      this.playerWeapon = new OctoLaser(this, 'bullet-1');
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
      window.airConsole.onConnect = this.playerCountChanged;
      window.airConsole.onDisconnect = this.playerCountChanged;
      
      this.playerCountChanged();
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

    messageRecieved: function(from, data) {
      //window.airConsoleHelper.updateActivePlayers();
      console.log('player to device id :' + window.airConsole.convertPlayerNumberToDeviceId(PlayerControlEnum.ROTATION));
      console.log('from device id :' + from);
      
      if (from === window.airConsole.convertPlayerNumberToDeviceId(PlayerControlEnum.HORIZONTAL)) {
        if (data.hasOwnProperty('left')) {
          messageState.left = data.left.pressed;
        }
        if (data.hasOwnProperty('right')) {
          messageState.right = data.right.pressed;
        }
      }
      if (from === window.airConsole.convertPlayerNumberToDeviceId(PlayerControlEnum.VERTICAL)) {
        if (data.hasOwnProperty('left')) {
          messageState.up = data.left.pressed;
        }
        if (data.hasOwnProperty('right')) {
          messageState.down = data.right.pressed;
        }
      }
      if (from === window.airConsole.convertPlayerNumberToDeviceId(PlayerControlEnum.ROTATION)) {
        if (data.hasOwnProperty('left')) {
          messageState.ccw = data.left.pressed;
        }
        if (data.hasOwnProperty('right')) {
          messageState.cw = data.right.pressed;
        }
      }
    },
    
    playerCountChanged: function() {
      console.log('player count changed');
      window.airConsole.setActivePlayers();
      window.airConsoleHelper.updateActivePlayers();
    }
  };

  window['airconsole-test'] = window['airconsole-test'] || {};
  window['airconsole-test'].Game = Game;
}());