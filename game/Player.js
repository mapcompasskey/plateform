
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
    this._crouching = false;
    this._hurting = false;
    this._dying = false;
    
    this._dropTimer = 0;
    this._canDrop = false;
    this._collideDown = true;
    
    this._dropping = false;
    this._droppingFrom = 0;
    
    // enable physics on the sprite
    game.physics.arcade.enable(this);
    
    // set offset
    this.body.setSize(16, 28, 0, 0);
    this.anchor.setTo(0.5, 1);
    
    // sprite physics properties
    this.body.gravity.y = this._gravity;
    //this.body.collideWorldBounds = true;
    //this.body.immovable = true;
    //this.body.blocked.up = false;
    //this.body.checkCollision.up = false;
    
    // sprite animations
    this.animations.add('idle', [0]);
    this.animations.add('jump', [4]);
    this.animations.add('fall', [5]);
    this.animations.add('crouch', [6]);
    this.animations.add('walk', [1, 2, 3, 2], 5, true);
    
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
    
    this.checkPosition();
    this.checkStatus();
    //console.log(this.body.facing);
    //console.log(this.body.blocked.down);
    
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
    
    // update downward collision
    this.body.checkCollision.down = this._collideDown;
    
    this.isCrouching();
    this.isJumping();
    this.isMoving();
    this.animate();
    
};

/**
* Check if the Player is crouching
*
* @method Player#isCrouching
* @memberof Player
*/
Player.prototype.isCrouching = function() {
    
    if (this._hurting || this._dying)
    {
        return;
    }
    
    // if dropping through the platform
    if (this._dropping)
    {
        // if not checking downward collision
        if ( ! this._collideDown)
        {
            if ((this.body.position.y - this._droppingFrom) > (this.body.height + 1))
            {
                this._collideDown = true;
            }
        }
        
        // else, if checking downward collision and just landed on a surface
        else if (this._collideDown && (this.body.onFloor() || this.body.touching.down))
        {
            this._dropping = false;
        }
        
        return;
    }
    
    // if CROUCH key was released
    if (this._canDrop)
    {
        this._dropTimer += this.game.time.elapsed;
        
        // if the player presses CROUCH again within 200th of a second
        if ( ! this._crouching && this.body.onFloor() && KEY_CROUCH.justPressed() && this._dropTimer < 200)
        {
            this._dropTimer = 0;
            this._canDrop = false;
            this._dropping = true;
            this.body.velocity.x = 0;
            this._collideDown = false;
            this._droppingFrom = this.body.position.y;
            return;
        }
    }
    
    // if standing and just pressed the CROUCH button
    if ( ! this._crouching && this.body.onFloor() && KEY_CROUCH.justPressed())
    {
        this._crouching = true;
        this.body.velocity.x = 0;
        this.updateCollisionBox();
        return;
    }
    
    // else, if crouching and released the CROUCH key
    else if (this._crouching && KEY_CROUCH.justReleased())
    {
        this._crouching = false;
        this.updateCollisionBox();
        
        //this._canDrop = true;
        //this._dropTimer = 0;
        
        /*
        // is left most edge of sprite on a cloud tile
        //var tileLeft = GAME_MAP.getTileWorldXY((this.body.position.x - 5), (this.body.position.y + this.body.height), TILESIZE, TILESIZE, GAME_LAYER);
        var tileLeft = GAME_MAP.getTileWorldXY((this.body.position.x), (this.body.position.y + this.body.height), TILESIZE, TILESIZE, GAME_LAYER);
        tileLeft = (tileLeft ? tileLeft.index : 0);
        var leftSide = (tileLeft == 0 || tileLeft == 2 ? true : false);
        
        // is right most edge of sprite on a cloud tile
        //var tileRight = GAME_MAP.getTileWorldXY((this.body.position.x + this.body.width + 5), (this.body.position.y + this.body.height), TILESIZE, TILESIZE, GAME_LAYER);
        var tileRight = GAME_MAP.getTileWorldXY((this.body.position.x + this.body.width), (this.body.position.y + this.body.height), TILESIZE, TILESIZE, GAME_LAYER);
        tileRight = (tileRight ? tileRight.index : 0);
        var rightSide = (tileRight == 0 || tileRight == 2 ? true : false);
        
        //console.log(tileLeft, tileRight);
        //console.log(leftSide, rightSide);
        
        // check if this sprite is on a cloud tile
        if (leftSide && rightSide)
        {
            this._canDrop = true;
            this._dropTimer = 0;
        }
        */
        
    }
    
};

/**
* Check if the Player is jumping
*
* @method Player#isJumping
* @memberof Player
*/
Player.prototype.isJumping = function() {
    
    if (this._hurting || this._dying || this._crouching)
    {
        this._jumping = false;
        this._falling = false;
        return;
    }
    
    // if standing and just pressed "UP" button
    if ((this.body.onFloor() || this.body.touching.down) && KEY_JUMP.justPressed())
    {
        this.body.velocity.y = -this._jumpSpeed;
        this._jumping = true;
        return;
    }
    
    // else, if falling
    else if ( ! this.body.onFloor() && ! this.body.touching.down && this.body.velocity.y > 0)
    {
        this._falling = true;
    }
    
    // else, if JUMP key released while jumping
    else if (this._jumping && KEY_JUMP.justReleased())
    {
        this.body.velocity.y = (this.body.velocity.y / 4);
    }
    
    // else, if standing on something while jumping/falling
    else if ((this.body.onFloor() || this.body.touching.down) && (this._jumping || this._falling))
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
    
    if (this._hurting || this._dying || this._crouching || this._dropping)
    {
        this._walking = false;
        return;
    }
    
    // if LEFT key is down
    if (KEY_LEFT.isDown)
    {
        this.scale.x = -1;
        this._walking = true;
    }
    // else, if RIGHT key is down
    else if (KEY_RIGHT.isDown)
    {
        this.scale.x = 1;
        this._walking = true;
    }
    else {
        this._walking = false;
    }
    
    // if moving
    if (this._walking)
    {
        this.body.velocity.x = (this._walkSpeed * this.scale.x);
    }
    // else, if standing stil
    else
    {
        this.body.velocity.x = 0;
    }
    
};

/**
* Update the Player animation
*
* @method Player#animate
* @memberof Player
*/
Player.prototype.animate = function() {

    if (this._crouching)
    {
        this.animations.play('crouch');
    }
    else if (this._falling)
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

/**
* Check if the Player is outside the World boundary
*
* @method Player#checkPosition
* @memberof Player
*/
Player.prototype.checkPosition = function() {
    
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

/**
* Update the Player's hit box
*
* @method Player#updateCollisionBox
* @memberof Player
*/
Player.prototype.updateCollisionBox = function() {
    
    if (this._crouching)
    {
        this.body.setSize(16, 20, 0, 0);
    }
    else
    {
        this.body.setSize(16, 28, 0, 0);
    }
    
};
