
/**
* @class Player
*
* @classdesc Create a new `Player` object. http://docs.phaser.io/Sprite.js.html
*
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
*/
Player = function (game, x, y) {
    
    x = x || 0;
    y = y || 0;
    key = 'spritesheetPlayer';
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this._walkSpeed = 150;
    this._jumpSpeed = 350;
    this._gravity = 800;
    
    this._walking = false;
    this._jumping = false;
    this._falling = false;
    this._hurting = false;
    this._dying = false;
    
    // enable physics on the player
    game.physics.arcade.enable(this);
    
    // set offset
    this.body.setSize(16, 28, 7, 2);
    
    // player physics properties
    this.body.gravity.y = this._gravity;
    this.body.collideWorldBounds = true;    
    
    // player animations
    this.animations.add('idle', [0]);
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
    this.animations.add('walk', [1, 0, 2, 0], 10, true);
    
};

Player.ASSETS = [
    {type:'spritesheet',key:'spritesheetPlayer',src:'assets/player.png',sheetWidth:30,sheetHeight:30}
];

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/**
* Internal function called by the World update cycle
*
* @method Player#update
* @memberof Player
*/
Player.prototype.update = function () {
    
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
* @method Player#postUpdate
* @memberof Player
*/
//Player.prototype.postUpdate = function() {
    //Phaser.Sprite.prototype.postUpdate.call(this);
//};

/**
* Check the current status of the Player
*
* @method Player#checkStatus
* @memberof Player
*/
Player.prototype.checkStatus = function () {
    
    this.isJumping();
    this.isMoving();
    this.animate();
    
};

/**
* Check if the Player is jumping
*
* @method Player#isJumping
* @memberof Player
*/
Player.prototype.isJumping = function() {
    
    if (this._hurting || this._dying)
    {
        this._jumping = false;
        this._falling = false;
        return;
    }
    
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
    
};

/**
* Check if the Player is moving
*
* @method Player#isMoving
* @memberof Player
*/
Player.prototype.isMoving = function() {
    
    if (this._hurting || this._dying)
    {
        this._walking = false;
        return;
    }
    
    // if walking left
    if (KEY_LEFT.isDown)
    {
        this.body.velocity.x = -this._walkSpeed;
        this._walking = true;
    }
    // else, if walking right
    else if (KEY_RIGHT.isDown)
    {
        this.body.velocity.x = this._walkSpeed;
        this._walking = true;
    }
    // else, not moving
    else {
        this.body.velocity.x = 0;
        this._walking = false;
    }
    
};

/**
* Update the Player animation
*
* @method Player#animate
* @memberof Player
*/
Player.prototype.animate = function() {

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
* @method Player#collideWith
* @memberof Player
* @param {object} - The object that is colliding with this Sprite.
* @param {Phaser.Game} - The Phaser.Game object calling the method.
*/
Player.prototype.collideWith = function(other, caller) {
    
};
