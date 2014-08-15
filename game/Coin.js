
/**
* @class Coin
*
* @classdesc Create a new `Coin` object. http://docs.phaser.io/Sprite.js.html
*
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
*/
Coin = function (game, x, y) {
    
    x = x || 0;
    y = y || 0;
    key = 'imageCoin';
    
    Phaser.Sprite.call(this, game, x, y, key);
    
    //this._walkSpeed = 150;
    //this._jumpSpeed = 350;
    //this._gravity = 800;
    
    //this._walking = false;
    //this._jumping = false;
    //this._falling = false;
    //this._hurting = false;
    //this._dying = false;
    
    // enable physics on the player
    //game.physics.arcade.enable(this);
    
    // set offset
    //this.body.setSize(16, 28, 7, 2);
    
    // player physics properties
    //this.body.gravity.y = this._gravity;
    //this.body.collideWorldBounds = true;    
    
    // player animations
    //this.animations.add('idle', [0]);
    //this.animations.add('jump', [3]);
    //this.animations.add('fall', [4]);
    //this.animations.add('walk', [1, 0, 2, 0], 10, true);
    
};

Coin.ASSETS = [
    {type:'image',key:'imageCoin',src:'assets/coin.png'}
];

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;
//Player.prototype.extending = Phaser.Sprite.prototype;

/**
* Internal function called by the World update cycle
*
* @method Coin#update
* @memberof Coin
*/
Coin.prototype.update = function () {
    
    //this.checkStatus();
    
    // draw bounding box
    //this.game.debug.body(this, 'rgba(255,0,0,0.8)', false);
    
};