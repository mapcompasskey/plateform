
/**
* @class Enemy
*
* @classdesc Create a new `Enemy` object. http://docs.phaser.io/Sprite.js.html
*
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
*/
Enemy = function (game, x, y) {
    
    x = x || 0;
    y = y || 0;
    key = 'spritesheetEnemy';
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this._walkSpeed = 30;
    this._jumpSpeed = 350;
    this._gravity = 800;
    
    this._walking = false;
    this._jumping = false;
    this._falling = false;
    this._hurting = false;
    this._dying = false;
    
    // enable physics on the sprite
    game.physics.arcade.enable(this);
    
    // set offset
    this.body.setSize(16, 28, 0, 0);
    this.anchor.setTo(0.5, 1);
    
    // sprite physics properties
    this.body.gravity.y = this._gravity;
    this.body.collideWorldBounds = true;
    
    // sprite animations
    this.animations.add('idle', [0]);
    this.animations.add('jump', [4]);
    this.animations.add('fall', [5]);
    this.animations.add('walk', [1, 2, 3, 2], 5, true);
    
    // start sprite walking
    this._walking = true;
};

Enemy.ASSETS = [
    {type:'spritesheet',key:'spritesheetEnemy',src:'assets/enemy.png',sheetWidth:30,sheetHeight:30}
];

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/**
* Internal function called by the World update cycle
*
* @method Enemy#update
* @memberof Enemy
*/
Enemy.prototype.update = function () {
    
    this.checkStatus();
    
    // draw bounding box
    if (SHOW_BOUNDING_BOXES)
    {
        this.game.debug.body(this, 'rgba(255,0,0,0.8)', false);
    }
    
};

/**
* Internal function called by the World postUpdate cycle.
*
* @method Enemy#postUpdate
* @memberof Enemy
*/
//Enemy.prototype.postUpdate = function() {
    //Phaser.Sprite.prototype.postUpdate.call(this);
    //this.checkPosition();
//};

/**
* Check the current status of the Enemy
*
* @method Enemy#checkStatus
* @memberof Enemy
*/
Enemy.prototype.checkStatus = function () {
    
    this.checkPosition();
    
    this.isJumping();
    this.isMoving();
    this.animate();
    
};

/**
* Check if the Enemy is jumping
*
* @method Enemy#isJumping
* @memberof Enemy
*/
Enemy.prototype.isJumping = function() {
    
    if (this._hurting || this._dying)
    {
        this._jumping = false;
        this._falling = false;
        return;
    }
    
    /*
    // if standing and just pressed "UP" button
    if (this.body.onFloor() && KEY_JUMP.justPressed())
    {
        this.body.velocity.y = -this._jumpSpeed;
        this._jumping = true;
        return;
    }
    
    // if falling
    if ( ! this.body.onFloor() && this.body.velocity.y > 0)
    {
        this._falling = true;
    }
    
    // reduce jumping height
    if (this._jumping && ! this._falling && KEY_JUMP.justReleased())
    {
        this.body.velocity.y = (this.body.velocity.y / 4);
    }
    
    // if standing on something while jumping/falling
    if (this.body.onFloor() && (this._jumping || this._falling))
    {
        this._jumping = false;
        this._falling = false;
    }
    */
    
};

/**
* Check if the Enemy is moving
*
* @method Enemy#isMoving
* @memberof Enemy
*/
Enemy.prototype.isMoving = function() {
    
    if (this._hurting || this._dying)
    {
        this._walking = false;
        return;
    }
    
    // if moving
    if (this._walking)
    {
        this.body.velocity.x = (this._walkSpeed * this.scale.x);
    }
    // else, if standing still
    else
    {
        this.body.velocity.x = 0
    }
    
};

/**
* Update the Enemy animation
*
* @method Enemy#animate
* @memberof Enemy
*/
Enemy.prototype.animate = function() {

    if (this._falling)
    {
        this.animations.play('fall');
    }
    else if (this._jumping)
    {
        this.animations.play('jump');
    }
    else if (this._walking)
    {
        this.animations.play('walk');
    }
    else
    {
        this.animations.play('idle');
    }
    
};

/**
* Called during object collision
*
* @method Enemy#collideWith
* @memberof Enemy
* @param {object} - The object that is colliding with this Sprite.
* @param {Phaser.Game} - The Phaser.Game object calling the method.
*/
Enemy.prototype.collideWith = function(other, caller) {
    
};

Enemy.prototype.layerCollision = function(layer, callback) {

    //console.log(layer);
    /*
    if(layerHit.tile.index == 25 || layerHit.tile.index == 35 || layerHit.tile.index == 34 || layerHit.tile.index == 54 || 
    layerHit.tile.index == 28 || layerHit.tile.index == 38 || layerHit.tile.index == 44 || layerHit.tile.index == 10)
    {

    if (enemyHit.body.velocity.x == forward && allowedToTurn == true)
    {
    timeWhenTurned = this.game.time.now;
    allowedToTurn = false;
    enemyHit.body.velocity.x = backwards;

    }

    else if (enemyHit.body.velocity.x == backwards && allowedToTurn == true)
    {
    timeWhenTurned = this.game.time.now;
    allowedToTurn = false;
    enemyHit.body.velocity.x = forward;

    }
    }

    timeSinceTurned = this.game.time.elapsedSecondsSince(timeWhenTurned);

    if(timeSinceTurned > 0.06)
    {
    allowedToTurn = true;
    }
    */
};

/**
* Check if the Enemy is outside the World boundary
*
* @method Enemy#checkPosition
* @memberof Enemy
*/
Enemy.prototype.checkPosition = function() {
    
    // if reached the right side of a plateform, turn around
    if (this.body.onFloor() && ! this._hurting && ! this._jumping && ! this._falling ) {
        xPos = this.body.position.x + (this.body.velocity.x > 0 ? (this.body.width + 1) : -1);
        yPos = this.body.position.y + this.body.height + 1;
        if (GAME_MAP.getTileWorldXY(xPos, yPos, TILESIZE, TILESIZE) === null)
        {
            this.scale.x = -(this.scale.x);
        }
    }
    
    // if walked into a wall
    console.log(this.body.onWall());
    if (this.body.onFloor() && this.body.onWall())
    {
        this.scale.x = -(this.scale.x);
        //this.body.position.x += (2 * this.scale.x);
    }
    
    // if this sprite has moved off the world
    if (this.body.position.x < this.game.world.bounds.x)
    {
        this.body.position.x = this.game.world.bounds.width - (this.body.width * 2);
    }
    else if ((this.body.position.x + this.body.width) > this.game.world.bounds.width)
    {
        this.body.position.x = this.body.width;
    }
    
    // if this sprite has fallen out of the world
    if (this.body.position.y > this.game.world.bounds.height)
    {
        this.body.position.y = 0;
    }
    
};
