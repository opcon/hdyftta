/* global AirConsole */
/* exported airConsole */

var airConsole = new AirConsole();

window.addEventListener('load', function () {
  'use strict';

  var ns = window['airconsole-test'];
  var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'airconsole-test-game');

  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);