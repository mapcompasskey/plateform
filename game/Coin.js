
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
    
};

Coin.ASSETS = [
    {type:'image',key:'imageCoin',src:'assets/coin.png'}
];

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;

/**
* Internal function called by the World update cycle
*
* @method Coin#update
* @memberof Coin
*/
Coin.prototype.update = function () {
    
};

/**
* Called during object collision
*
* @method Coin#collideWith
* @memberof Coin
* @param {object} - The object that is colliding with this Sprite.
* @param {Phaser.Game} - The Phaser.Game object calling the method.
*/
Coin.prototype.collideWith = function(other, caller) {

    if (other === PLAYER)
    {
        // update the score
        caller.coinCollected();
        
        // remove the coin
        //this.kill();
        this.destroy();
    }
    
};
