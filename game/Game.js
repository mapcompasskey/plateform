
BasicGame.Game = function (game) {
    
    // When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    
    this.game;		// a reference to the currently running game
    this.add;		// used to add sprites, text, groups, etc
    this.camera;	// a reference to the game camera
    this.cache;		// the game cache
    this.input;		// the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		// for preloading assets
    this.math;		// lots of useful common math operations
    this.sound;		// the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		// the game stage
    this.time;		// the clock
    this.tweens;    // the tween manager
    this.state;	    // the state manager
    this.world;		// the game world
    this.particles;	// the particle manager
    this.physics;	// the physics manager
    this.rnd;		// the repeatable random number generator
    
    // You can use any of these from any function within this State.
    // But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    
};

BasicGame.Game.prototype = {
    
    create: function () {
            
        // reset properties
        this.map;
        this.layer;
        this.player;
        this.coins;
        this.coinScore = 0;
        this.coinScoreText;
        this.cursor;
        
        this.stage.backgroundColor = '#000';
        
        // TILED JSON
        if (1 == 1)
        {
            // load JSON tilemap data
            this.map = this.add.tilemap('tilemapLevel_JSON');
            
            // the first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
            // the second parameter maps this name to the Phaser.Cache key 'imageTiles'
            this.map.addTilesetImage('tileset', 'imageTiles');
            
            this.map.setCollisionBetween(0, 4);
            //this.map.setCollision(0);
            //this.map.setCollision(1);
            
            // Creates a layer from the World1 layer in the map data.
            // A Layer is effectively like a Phaser.Sprite, so is added to the display list.
            
            // create a layer from the Tiled map editor JSON file
            // use the layer's name to call it
            this.layer = this.map.createLayer('Tile Layer 1');
            
            // resize the game world to match the layer dimensions
            this.layer.resizeWorld();
        }
        
        // CSV
        if (1 == 0)
        {
            // load a CSV file and specify the tile size so it can render
            this.map = this.add.tilemap('tilemapLevel_CSV', 32, 32);
            
            // add the tileset
            this.map.addTilesetImage('imageTiles');
            
            //this.map.setCollision(0);
            //this.map.setCollisionBetween(1, 3);
            
            // create the layer
            this.layer = this.map.createLayer(0);
            
            // resize the game world to match the layer dimensions
            this.layer.resizeWorld();
        }
        
        // add the coins
        this.addCoins();
        
        // add the player
        this.addPlayer();
        
        // add the HUD
        this.addHUD();
        
        // Camera: http://docs.phaser.io/Camera.js.html
        // The deadzone is a Rectangle that defines the limits at which the camera will start to scroll
        // It does NOT keep the target sprite within the rectangle, all it does is control the boundary
        // at which the camera will start to move. So when the sprite hits the edge, the camera scrolls
        // (until it reaches an edge of the world)
        this.camera.follow(this.player);
        //this.camera.deadzone = new Phaser.Rectangle(100, 100, 600, 400);
        
    },
    
    update: function () {
        
        // player / level collision
        this.physics.arcade.collide(this.player, this.layer);
        
        // player / coin collision
        this.physics.arcade.overlap(this.player, this.coins, this.resolveCollisions, null, this);
        
    },
    
    quitGame: function (pointer) {
        
        // Then let's go back to the main menu.
        this.state.start('MainMenu');
        
    },
    
    addCoins: function() {
         
        // add a group of coins
        this.coins = this.add.group();
        
        // enable physics on coins
        this.coins.enableBody = true;
        
        // add some coins
        var xPos, yPos = 0;
        for (var i = 0; i < 7; i++)
        {
            xPos = (TILESIZE * (i * 2 + 16));
            yPos = (TILESIZE * 7 - 14);
            this.coins.add(new Coin(this.game, xPos, yPos), true);
        }
        
    },
    
    addPlayer: function () {
        
        // add the player
        //this.player = this.add.sprite((TILESIZE*4), (TILESIZE*3-30), 'spritesheetPlayer');
        var xPos = (TILESIZE * 4);
        var yPos = (TILESIZE * 3 - 30);
        this.player = new Player(this.game, xPos, yPos);
        this.add.existing(this.player);
        PLAYER = this.player;
        
    },
    
    addHUD: function() {
        
        // coin score text
        this.coinScoreText = this.add.text(10, 10, '$0', { fontSize: '12px', fill: '#fff' });
        this.coinScoreText.fixedToCamera = true;
        
    },
    
    resolveCollisions: function (obj1, obj2) {
    
        if (obj1.collideWith)
        {
            obj1.collideWith(obj2, this);
        }
        if (obj2.collideWith)
        {
            obj2.collideWith(obj1, this);
        }
        
    },
    
    coinCollected: function() {
        
        this.coinScore += 10;
        this.coinScoreText.text = '$' + this.coinScore;
        
    },
    
};
