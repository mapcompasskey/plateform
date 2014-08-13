
BasicGame.MainMenu = function (game) {
    
};

BasicGame.MainMenu.prototype = {
    
	create: function () {
        
		// add logo image
		this.add.sprite(this.world.centerX-(400/2), this.world.centerY-87, 'imageLogo');
        
        // add start button
        // new Button(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame)
        this.add.button(this.world.centerX-(150/2), this.world.centerY+55, 'buttonStart', this.startGame, this, 1, 0, 2);
        
	},
    
	update: function () {
        
	},
    
	startGame: function (pointer) {
        
		// switch to game state
		this.state.start('Game');
        
	}
    
};
