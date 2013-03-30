this.tgd = this.tgd || {};

(function()
{
    // Namespace var
    var anim = {};

    var spritesheet = new createjs.SpriteSheet({
        "animations": {
            "idle": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
            "eat": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]},
            "run": {"frames": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]},
            "all": {"frames": [0]}},
        "images": ["img/placeholder_anim.png"],
        "frames": [[0, 0, 256, 256, 0, -3, -19], [256, 0, 256, 256, 0, -3, -19]]});

    var sprite = {};

    anim.init = function()
    {
        sprite = new createjs.BitmapAnimation(spritesheet);
        anim.idle();
        tgd.stage.addChild(sprite);
    }

    anim.idle = function()
    {
        sprite.gotoAndPlay("idle");
    }

    anim.run = function()
    {
        sprite.gotoAndPlay("run");
    }

    anim.eat = function()
    {
        sprite.gotoAndPlay("eat");
    }

    // Copy back
    this.tgd.anim = anim;
})();