
BasicGame.Preloader = function (game) {
    
	this.preloadBar = null;
    
};

BasicGame.Preloader.prototype = {
    
	preload: function () {
        
        // add loading progress bar
		this.preloadBar = this.add.sprite(this.world.centerX-(202/2), this.world.centerY-(22/2), 'imagePreloaderBar');
        
        // set the preloadBar sprite as a loader sprite
		this.load.setPreloadSprite(this.preloadBar);
        
        // load MainMenu.js assets
        this.load.image('imageLogo', 'assets/game-logo.png');
        this.load.spritesheet('buttonStart', 'assets/button-start.png', 150, 55);
        
        // load Game.js assets
        this.load.image('imageTiles', 'assets/tiles.png');
        this.load.tilemap('tilemapLevel_JSON', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('tilemapLevel_CSV', 'assets/level.csv', null, Phaser.Tilemap.CSV);
        this.loadAssets(Player.ASSETS);
        this.loadAssets(Coin.ASSETS);
	},
    
    // load assets used by custom game objects
    loadAssets: function ( assets ) {
    
        if (assets !== undefined)
        {
            if (assets.constructor === Array)
            {
                for (key in assets)
                {
                    asset = assets[key];
                    
                    // load Spritesheet
                    // {type:'spritesheet', key:'player', src:'assets/player.png', sheetWidth:30, sheetHeight:30}
                    if (asset.type == 'spritesheet')
                    {
                        this.load.spritesheet(asset.key, asset.src, asset.sheetWidth, asset.sheetHeight);
                    }
                    
                    // load Image
                    // {type:'image', key:'coin', src:'assets/coin.png'}
                    else if (asset.type == 'image')
                    {
                        this.load.image(asset.key, asset.src);
                    }
                    
                }
            }
        }
        
    },
    
	create: function () {
        
		// goto the first game state
        //this.state.start('MainMenu');
        this.state.start('Game');
        
	},
    
};
