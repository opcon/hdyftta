var AirConsoleHelper = function (airconsole, numPlayers) {
	this.airConsole = airconsole;
	this.numPlayers = numPlayers;
	
	this.playerIDs = [numPlayers];
};

AirConsoleHelper.prototype.updateActivePlayers = function () {
	for (var i = 0; i < this.numPlayers; i++) {
		this.playerIDs[i] = this.airConsole.convertPlayerNumberToDeviceId(i);
	}	
};