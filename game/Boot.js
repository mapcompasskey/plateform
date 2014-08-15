var BasicGame = {};

BasicGame.Boot = function (game) {};

BasicGame.Boot.prototype = {

    preload: function () {
        
        // load the preloader image
        this.load.image('imagePreloaderBar', 'assets/preloader-bar.png');
        
    },
    
    create: function () {
        
        // multi-touch support not required
        this.input.maxPointers = 1;
        
        // pause if the browser loses focus
        this.stage.disableVisibilityChange = true;
        
        // if desktop mode
        if (this.game.device.desktop)
        {
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVeritcally = true;
            this.scale.refresh();
        }
        // else, if mobile mode
        else
        {
            // Same goes for mobile settings.
            // scale the game no lower than 480x260 and no higher than 1024x768
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 480;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 1024;
            this.scale.maxHeight = 768;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }
        
        // start the preloader
        this.state.start('Preloader');
        
    }
    
};
