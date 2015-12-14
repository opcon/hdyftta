/* global PlayerControlEnum */

function MessageState () {
	this.left = false;
  	this.right = false;
  	this.up = false;
  	this.down = false;
  	this.cw = false;
  	this.ccw = false;
}

var AirConsoleHelper = function (airConsole, numShips) {
	this.PLAYERS_PER_SHIP = 3;
	
	this.airConsole = airConsole;
	this.numPlayers = numShips * this.PLAYERS_PER_SHIP;
	this.numShips = numShips;
	
	this.shipMessageStates = [this.numShips];
	this.playerIDs = [this.numPlayers];
};

AirConsoleHelper.prototype.setup = function () {
	var _this = this;
	this.airConsole.onMessage = function(from, data) {
		_this.messageRecieved(from, data);
	};
	
	this.airConsole.onConnect = function(id) {
		_this.playerCountChanged();
	};
	
	this.airConsole.onDisconnect = function(id) {
		_this.playerCountChanged();
	};
	
	this.playerCountChanged();
	
	for (var i = 0; i < this.numShips; i++) {
		this.shipMessageStates[i] = new MessageState();
	}
	
	console.log(this.shipMessageStates);
};

AirConsoleHelper.prototype.updateActivePlayers = function () {
	for (var i = 0; i < this.numPlayers; i++) {
		this.playerIDs[i] = this.airConsole.convertPlayerNumberToDeviceId(i);
		if (this.playerIDs[i] !== undefined) {
			this.airConsole.message(this.playerIDs[i], {role:i % this.PLAYERS_PER_SHIP});
		}
	}
};

AirConsoleHelper.prototype.messageRecieved = function (from, data) {
	console.log('message recieved');
	from = this.airConsole.convertDeviceIdToPlayerNumber(from);
	var role = from % this.PLAYERS_PER_SHIP;
	console.log(role);
	var ship = Math.floor(from / this.PLAYERS_PER_SHIP);
	console.log(ship);
	
	if (ship >= this.numShips) {return;}
	
	switch (role) {
		case PlayerControlEnum.ROTATION:
			if (data.hasOwnProperty('left')) {
				this.shipMessageStates[ship].ccw = data.left.pressed;
			}
			if (data.hasOwnProperty('right')) {
				this.shipMessageStates[ship].cw = data.right.pressed;
			}
			break;
		case PlayerControlEnum.VERTICAL:
			if (data.hasOwnProperty('left')) {
				this.shipMessageStates[ship].up = data.left.pressed;
			}
			if (data.hasOwnProperty('right')) {
				this.shipMessageStates[ship].down = data.right.pressed;
			}
			break;
		case PlayerControlEnum.HORIZONTAL:
			if (data.hasOwnProperty('left')) {
				this.shipMessageStates[ship].left = data.left.pressed;
			}
			if (data.hasOwnProperty('right')) {
				this.shipMessageStates[ship].right = data.right.pressed;
			}
			break;
		default:
			break;
	}
};

AirConsoleHelper.prototype.playerCountChanged = function () {
	console.log('player count changed');
	this.airConsole.setActivePlayers();
	this.updateActivePlayers();
	this.log();
};

AirConsoleHelper.prototype.log = function () {
	for (var i = 0; i < this.numPlayers; i++) {
		console.log(this.playerIDs[i]);
	}
};

AirConsoleHelper.prototype.getMessageState = function (shipNumber) {
	if (shipNumber < this.numShips) { 
		return this.shipMessageStates[shipNumber]; 
	}
};