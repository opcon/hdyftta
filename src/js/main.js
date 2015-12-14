/* global AirConsole, AirConsoleHelper */
/* exported airConsole, airConsoleHelper */

var airConsole = new AirConsole();

var airConsoleHelper = new AirConsoleHelper(airConsole, 1);

window.addEventListener('load', function () {
  'use strict';

  var ns = window['airconsole-test'];
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'airconsole-test-game');

  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */
  game.state.start('boot');
}, false);