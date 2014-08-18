
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
        
        // get a referrence to this state
        CURRENT_STATE = this;
        
        // reset properties
        this.map;
        this.layer;
        this.player;
        this.coins;
        this.coinScore = 0;
        this.coinScoreText;
        this.cursor;
            
        // add the level
        this.addLevel();
        
        // add the coins
        this.addCoins();
        
        // add the Enemies
        this.addEnemies();
        
        // add the player
        this.addPlayer();
        
        // add the HUD
        this.addHUD();
        
        // follow the player
        this.camera.follow(this.player);
        
    },
    
    update: function () {
        
        // player / level collision
        this.physics.arcade.collide(this.player, this.layer);
        
        // player / coin collision
        this.physics.arcade.overlap(this.player, this.coins, this.resolveObjectCollisions, null, this);
        
        // enemy / level collision
        this.physics.arcade.collide(this.enemies, this.layer);
        
        // player / enemy collision
        //this.physics.arcade.collide(this.player, this.enemies);
        
    },
    
    render: function() {
        
        Phaser.State.prototype.render.call(this);
        
        // draw bounding box
        if (SHOW_BOUNDING_BOXES)
        {
            // player
            this.game.debug.body(this.player, 'rgba(0,255,255,1.0)', false);
            
            // enemies
            this.enemies.forEach(function(item) {
                this.game.debug.body(item, 'rgba(255,255,0,1.0)', false);
            }, this);
            
            // coins
            this.coins.forEach(function(item) {
                this.game.debug.body(item, 'rgba(0,255,255,1.0)', false);
            }, this);
        }
        
    },
    
    quitGame: function (pointer) {
        
        // Then let's go back to the main menu.
        this.state.start('MainMenu');
        
    },
    
    addLevel: function() {
            
        // background color
        this.stage.backgroundColor = '#000';
        
        // TILED JSON
        // load JSON tilemap data
        this.map = this.add.tilemap('tilemapLevel_JSON');
        GAME_MAP = this.map;
        
        // the first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        // the second parameter maps this name to the Phaser.Cache key 'imageTiles'
        this.map.addTilesetImage('tileset', 'imageTiles');
        
        // set tile collision
        this.map.setCollision([1,2]);
        this.map.forEach(function (t) {
            if (t)
            {
                if (t.index == 2)
                {
                    // cloud tile (can jump up through)
                    t.setCollision(false, false, true, false); // (left, right, up, down)
                }
            }
        });
        
        // create a layer from the Tiled map editor JSON file
        // use the layer's name from json file to call it
        this.layer = this.map.createLayer('Tile Layer 1');
        GAME_LAYER = this.layer;
        
        // resize the game world to match the layer dimensions
        this.layer.resizeWorld();
        
    },
    
    addCoins: function() {
         
        // add a group of coins
        this.coins = this.add.group();
        
        // enable physics on group
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
    
    addEnemies: function() {
    
        // add a group of enemies
        this.enemies = this.add.group();
        
        // enabled physics on group
        this.enemies.enableBody = true;
        
        // add some enemies
        var xPos, yPos = 0;
        
        xPos = (TILESIZE * 10);
        yPos = (TILESIZE * 8);
        this.enemies.add(new Enemy(this.game, xPos, yPos));
        
        xPos = (TILESIZE * 5);
        yPos = (TILESIZE * 18);
        this.enemies.add(new Enemy(this.game, xPos, yPos));
        
        xPos = (TILESIZE * 21);
        yPos = (TILESIZE * 12);
        this.enemies.add(new Enemy(this.game, xPos, yPos));
        
    },
    
    addPlayer: function () {
        
        // add the player
        var xPos = (TILESIZE * 5);
        var yPos = (TILESIZE * 8);
        this.player = new Player(this.game, xPos, yPos);
        this.add.existing(this.player);
        PLAYER = this.player;
        
    },
    
    addHUD: function() {
        
        // coin score text
        this.coinScoreText = this.add.text(10, 10, '$0', { fontSize: '12px', fill: '#fff' });
        this.coinScoreText.fixedToCamera = true;
        
    },
    
    resolveObjectCollisions: function (obj1, obj2) {
    
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
