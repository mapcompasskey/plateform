
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
Player = function (game, x, y ) {
    
    x = x || 0;
    y = y || 0;
    key = 'spritesheetPlayer';
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.walkSpeed = 150;
    this.jumpSpeed = 250;
    
    this.walking = false;
    this.jumping = false;
    this.falling = false;
    this.hurting = false;
    this.dying = false;
    
    // enable physics on the player
    game.physics.arcade.enable(this);
    
    // player physics properties
    this.body.gravity.y = 300;
    this.body.collideWorldBounds = true;    
    
    // player animations
    this.animations.add('idle', [0]);
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
    
};

Player.prototype.checkStatus = function () {
    
    this.isJumping();
    this.isMoving();
    this.animate();
    
};

Player.prototype.isJumping = function() {
    
    if ( this.hurting || this.dying ) {
        this.jumping = false;
        this.falling = false;
        return;
    }
    
    // if standing and just pressed "UP" button
    //if (this.body.onFloor() && this.game.cursors.up.isDown)
    if (this.body.onFloor() && this.game.cursors.up.justPressed())
    {
        this.body.velocity.y = -this.jumpSpeed;
        this.jumping = true;
        return;
    }
    
    // reduce jumping height
    //if (this.jumping &&  this.game.cursors.up.isUp)
    if (this.jumping &&  this.game.cursors.up.justReleased())
    {
        this.body.velocity.y = ( this.body.velocity.y / 2 );
    }
    
    // if falling
    if ( ! this.body.onFloor() && this.body.velocity.y > 0)
    {
        this.falling = true;
        return;
    }
    
    // if standing on something while jumping/falling
    if (this.body.onFloor() && (this.jumping || this.falling))
    {
        this.jumping = false;
        this.falling = false;
    }
    
};

Player.prototype.isMoving = function() {
    
    if ( this.hurting || this.dying ) {
        this.walking = false;
        return;
    }
    
    // setting player horizontal velocity to zero
    this.body.velocity.x = 0;
    this.walking = false;
    
    if (this.game.cursors)
    {
        // walking left
        if (this.game.cursors.left.isDown)
        {
            this.body.velocity.x = -this.walkSpeed;
            this.walking = true;
        }
        // walking right
        else if (this.game.cursors.right.isDown)
        {
            this.body.velocity.x = this.walkSpeed;
            this.walking = true;
        }
    }
    
};

Player.prototype.animate = function() {

    if (this.walking)
    {
        this.animations.play('walk');
    }
    else
    {
        this.animations.play('idle');
    }
    
};
