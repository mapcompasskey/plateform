
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
Enemy2 = function (game, x, y, key) {
    
    x = x || 0;
    y = y || 0;
    key = key || 'spritesheetEnemy2';
    
    Enemy.call(this, game, x, y, key);
    
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
    //this.body.setSize(16, 28, 0, 0);
    this.body.setSize(32, 56, 0, 0);
    this.anchor.setTo(0.5, 1);
    
    // sprite physics properties
    this.body.gravity.y = this._gravity;
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    
    // sprite animations
    this.animations.add('idle', [0]);
    this.animations.add('jump', [4]);
    this.animations.add('fall', [5]);
    this.animations.add('walk', [1, 2, 3, 2], 5, true);
    
    // start sprite walking
    this._walking = true;
    
};

Enemy2.ASSETS = [
    {type:'spritesheet',key:'spritesheetEnemy2',src:'assets/enemy-2.png',sheetWidth:60,sheetHeight:60}
];

Enemy2.prototype = Object.create(Enemy.prototype);
Enemy2.prototype.constructor = Enemy2;

/**
* Internal function called by the World update cycle
*
* @method Enemy#update
* @memberof Enemy
*/
Enemy2.prototype.update = function () {
    
    this.checkStatus();
    
};
